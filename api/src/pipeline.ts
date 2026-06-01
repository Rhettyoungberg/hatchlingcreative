import { Hono } from "hono";
import type { Bindings, Variables, AppContext } from "./types";
import { id, nowMs, safeEqual } from "./util";
import { withSession } from "./auth";
import { ascToken, ascConfigured } from "./asc";

// Drop this file in api/src/pipeline.ts and mount it in api/src/index.ts:
//     import { pipeline } from "./pipeline";
//     app.route("/api/pipeline", pipeline);
// Add a binding FLEDGED_TOKEN (a secret) — the shared token the local `fledged` daemon and
// `fledge sync` present. Put the same value in ~/.fledge/config.json as `apiKey`.

const LEASE_MS = 30 * 60 * 1000; // a claimed job older than this is reclaimable (matches STATE_SCHEMA claim lease T)

type Projection = {
  slug: string; name: string; platform: string; lifecycle: string; updatedAt: string;
  activeRunId: string;
  runs: { id: string; kind: string; title: string; stage: string; stageStatus: string; mergedAt: string | null; blockedOn: string | null }[];
};

/** Daemon/CLI auth: a single shared bearer token (env.FLEDGED_TOKEN). */
async function withDaemon(c: AppContext, next: () => Promise<void>) {
  const hdr = c.req.header("authorization") || "";
  const raw = hdr.toLowerCase().startsWith("bearer ") ? hdr.slice(7).trim() : "";
  const expected = (c.env as any).FLEDGED_TOKEN || "";
  if (!raw || !expected || !safeEqual(raw, expected)) return c.json({ error: "unauthorized" }, 401);
  await next();
}

/** Upsert an app + its runs from a state projection. Shared by /sync and /jobs/:id/result. */
async function applyProjection(c: AppContext, p: Projection): Promise<void> {
  const db = c.env.DB;
  const now = nowMs();
  const updatedMs = Date.parse(p.updatedAt) || now;

  // Find or create the app by slug.
  let app = await db.prepare(`SELECT id FROM apps WHERE slug = ?`).bind(p.slug).first<{ id: string }>();
  if (!app) {
    const appId = id("app");
    await db.prepare(`INSERT INTO apps (id, name, slug, platform, created_at) VALUES (?, ?, ?, ?, ?)`)
      .bind(appId, p.name, p.slug, p.platform, now).run();
    app = { id: appId };
  }
  await db.prepare(`UPDATE apps SET name = ?, platform = ?, lifecycle = ?, active_run_id = ?, pipeline_updated_at = ? WHERE id = ?`)
    .bind(p.name, p.platform, p.lifecycle, p.activeRunId, updatedMs, app.id).run();

  // Replace this app's runs with the projection (small set; simplest correct approach).
  await db.prepare(`DELETE FROM pipeline_runs WHERE app_id = ?`).bind(app.id).run();
  for (const r of p.runs) {
    await db.prepare(
      `INSERT INTO pipeline_runs (app_id, run_id, kind, title, stage, stage_status, blocked_on, merged_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(app.id, r.id, r.kind, r.title || null, r.stage, r.stageStatus,
           r.blockedOn || null, r.mergedAt ? Date.parse(r.mergedAt) : null, updatedMs).run();
  }
}

export const pipeline = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// ---- daemon/CLI endpoints (bearer FLEDGED_TOKEN) ----------------------------

// `fledge sync` / daemon: push a state projection up.
pipeline.post("/sync", withDaemon, async (c) => {
  const p = await c.req.json<Projection>().catch(() => null);
  if (!p || !p.slug) return c.json({ error: "bad_projection" }, 400);
  await applyProjection(c, p);
  return c.json({ ok: true });
});

// daemon: claim the next runnable job (oldest queued, or a running one whose lease expired).
pipeline.post("/claim", withDaemon, async (c) => {
  const { host } = await c.req.json<{ host?: string }>().catch(() => ({ host: undefined }));
  const now = nowMs();
  const row = await c.env.DB.prepare(
    `UPDATE pipeline_jobs SET status = 'running', host = ?, lease_at = ?
       WHERE id = (
         SELECT id FROM pipeline_jobs
          WHERE status = 'queued' OR (status = 'running' AND lease_at < ?)
          ORDER BY created_at LIMIT 1
       )
     RETURNING id, app_slug AS slug, command, run_id AS runId, stage`
  ).bind(host || "unknown", now, now - LEASE_MS).first<any>();
  if (!row) return c.body(null, 204);
  return c.json({ job: row });
});

// daemon: report a job result (+ optionally the fresh state projection).
pipeline.post("/jobs/:id/result", withDaemon, async (c) => {
  const jobId = c.req.param("id");
  const body = await c.req.json<{ result: string; log?: string; state?: Projection }>().catch(() => null);
  if (!body) return c.json({ error: "bad_body" }, 400);
  await c.env.DB.prepare(
    `UPDATE pipeline_jobs SET status = ?, result = ?, log = ?, finished_at = ? WHERE id = ?`
  ).bind(body.result === "ok" ? "done" : "error", body.result, (body.log || "").slice(-8000), nowMs(), jobId).run();
  if (body.state && body.state.slug) await applyProjection(c, body.state);
  return c.json({ ok: true });
});

// ---- dashboard endpoints (session cookie) -----------------------------------

// The board: apps + their runs + recent jobs.
pipeline.get("/board", withSession, async (c) => {
  const apps = await c.env.DB.prepare(
    `SELECT id, name, slug, platform, lifecycle, active_run_id FROM apps ORDER BY name`
  ).all<any>();
  const runs = await c.env.DB.prepare(
    `SELECT app_id, run_id, kind, title, stage, stage_status, blocked_on, merged_at FROM pipeline_runs`
  ).all<any>();
  const jobs = await c.env.DB.prepare(
    `SELECT id, app_slug, command, status, host, result, created_at, finished_at
       FROM pipeline_jobs ORDER BY created_at DESC LIMIT 50`
  ).all<any>();
  const runsByApp: Record<string, any[]> = {};
  for (const r of runs.results ?? []) (runsByApp[r.app_id] ||= []).push(r);
  const board = (apps.results ?? []).map((a) => ({ ...a, runs: runsByApp[a.id] ?? [] }));
  return c.json({ apps: board, jobs: jobs.results ?? [] });
});

// Enqueue a job ("Run stage" / "Advance" button on the board).
pipeline.post("/jobs", withSession, async (c) => {
  const b = await c.req.json<{ slug: string; command?: string; runId?: string; stage?: string }>().catch(() => null);
  if (!b || !b.slug) return c.json({ error: "slug_required" }, 400);
  const command = b.command === "advance" ? "advance" : "run";
  const jobId = id("job");
  await c.env.DB.prepare(
    `INSERT INTO pipeline_jobs (id, app_slug, command, run_id, stage, status, created_at)
     VALUES (?, ?, ?, ?, ?, 'queued', ?)`
  ).bind(jobId, b.slug, command, b.runId || null, b.stage || null, nowMs()).run();
  return c.json({ ok: true, jobId });
});

// autoAssist for the stage-4.5 `testflight-build` review gate: is a build actually on
// TestFlight? Reuses the existing App Store Connect integration (ascToken). It INFORMS the
// reviewer — a human still confirms the gate. Returns `configured:false` if ASC creds are unset.
pipeline.get("/asc/:slug/testflight", withSession, async (c) => {
  if (!ascConfigured(c.env)) return c.json({ configured: false });
  const slug = c.req.param("slug");
  const app = await c.env.DB.prepare(`SELECT appstore_app_id FROM apps WHERE slug = ?`)
    .bind(slug).first<{ appstore_app_id: string | null }>();
  if (!app?.appstore_app_id) return c.json({ configured: true, onTestFlight: false, reason: "no appstore_app_id set" });
  try {
    const token = await ascToken(c.env);
    const url = `https://api.appstoreconnect.apple.com/v1/builds?filter[app]=${app.appstore_app_id}` +
      `&limit=1&sort=-version&fields[builds]=version,uploadedDate,expired`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });
    if (!res.ok) return c.json({ configured: true, onTestFlight: false, reason: `ASC ${res.status}` });
    const body = await res.json<{ data?: { attributes?: { version?: string; expired?: boolean; uploadedDate?: string } }[] }>();
    const b = body.data?.[0];
    const onTestFlight = !!b && !b.attributes?.expired;
    return c.json({
      configured: true, onTestFlight,
      version: b?.attributes?.version ?? null,
      uploadedDate: b?.attributes?.uploadedDate ?? null,
    });
  } catch (e) {
    return c.json({ configured: true, onTestFlight: false, reason: (e as Error).message });
  }
});
