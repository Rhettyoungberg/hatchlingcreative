import { Hono } from "hono";
import type { Bindings, Variables } from "./types";
import { id, nowMs, slugify, sha256Hex, randomToken } from "./util";
import { getAnalytics } from "./analytics";
import { withSession } from "./auth";
import { syncAppStore, ascConfigured, listApps } from "./asc";

const DAY_MS = 24 * 60 * 60 * 1000;

export const dashboard = new Hono<{ Bindings: Bindings; Variables: Variables }>();
dashboard.use("*", withSession);

// ---- Overview: one summary card per app ----------------------------------
dashboard.get("/overview", async (c) => {
  const since = nowMs() - DAY_MS;
  const today = new Date().toISOString().slice(0, 10);
  const apps = await c.env.DB.prepare(`SELECT * FROM apps ORDER BY created_at DESC`).all<any>();
  const out = [];
  for (const app of apps.results ?? []) {
    const [bugs, crashes, dau, openBugs] = await Promise.all([
      c.env.DB.prepare(
        `SELECT COUNT(*) AS n FROM submissions WHERE app_id = ? AND created_at >= ?`
      )
        .bind(app.id, since)
        .first<{ n: number }>(),
      c.env.DB.prepare(`SELECT COUNT(*) AS n FROM crashes WHERE app_id = ? AND ts >= ?`)
        .bind(app.id, since)
        .first<{ n: number }>(),
      c.env.DB.prepare(
        `SELECT COUNT(DISTINCT distinct_id) AS n FROM events WHERE app_id = ? AND day = ? AND distinct_id IS NOT NULL`
      )
        .bind(app.id, today)
        .first<{ n: number }>(),
      c.env.DB.prepare(
        `SELECT COUNT(*) AS n FROM submissions WHERE app_id = ? AND status NOT IN ('done','wont_fix')`
      )
        .bind(app.id)
        .first<{ n: number }>(),
    ]);
    out.push({
      ...app,
      stats: {
        dau_today: dau?.n ?? 0,
        new_submissions_24h: bugs?.n ?? 0,
        crashes_24h: crashes?.n ?? 0,
        open_submissions: openBugs?.n ?? 0,
      },
    });
  }
  return c.json({ apps: out });
});

// ---- Apps ----------------------------------------------------------------
dashboard.get("/apps", async (c) => {
  const apps = await c.env.DB.prepare(`SELECT * FROM apps ORDER BY created_at DESC`).all<any>();
  return c.json({ apps: apps.results ?? [] });
});

dashboard.post("/apps", async (c) => {
  const b = await c.req.json().catch(() => null);
  if (!b || typeof b.name !== "string" || !b.name.trim()) {
    return c.json({ error: "name_required" }, 400);
  }
  const appId = id("app");
  let slug = slugify(b.slug || b.name);
  // Ensure unique slug.
  const exists = await c.env.DB.prepare(`SELECT 1 FROM apps WHERE slug = ?`).bind(slug).first();
  if (exists) slug = `${slug}-${appId.slice(-4)}`;
  await c.env.DB.prepare(
    `INSERT INTO apps (id, name, slug, platform, icon_url, created_at) VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(
      appId,
      String(b.name).slice(0, 120),
      slug,
      b.platform ? String(b.platform).slice(0, 40) : null,
      b.icon_url ? String(b.icon_url).slice(0, 400) : null,
      nowMs()
    )
    .run();
  const app = await c.env.DB.prepare(`SELECT * FROM apps WHERE id = ?`).bind(appId).first();
  return c.json({ app }, 201);
});

dashboard.get("/apps/:id", async (c) => {
  const app = await c.env.DB.prepare(`SELECT * FROM apps WHERE id = ?`)
    .bind(c.req.param("id"))
    .first();
  if (!app) return c.json({ error: "not_found" }, 404);
  return c.json({ app });
});

dashboard.patch("/apps/:id", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const fields: string[] = [];
  const vals: any[] = [];
  for (const f of ["name", "platform", "icon_url", "appstore_sku", "appstore_app_id"]) {
    if (typeof b[f] === "string") {
      fields.push(`${f} = ?`);
      vals.push(b[f].trim() || null);
    }
  }
  if (!fields.length) return c.json({ error: "no_fields" }, 400);
  vals.push(c.req.param("id"));
  await c.env.DB.prepare(`UPDATE apps SET ${fields.join(", ")} WHERE id = ?`)
    .bind(...vals)
    .run();
  const app = await c.env.DB.prepare(`SELECT * FROM apps WHERE id = ?`)
    .bind(c.req.param("id"))
    .first();
  return c.json({ app });
});

// ---- API keys ------------------------------------------------------------
dashboard.get("/apps/:id/keys", async (c) => {
  const keys = await c.env.DB.prepare(
    `SELECT id, app_id, key_prefix, label, last_used_at, revoked, created_at
       FROM api_keys WHERE app_id = ? ORDER BY created_at DESC`
  )
    .bind(c.req.param("id"))
    .all();
  return c.json({ keys: keys.results ?? [] });
});

dashboard.post("/apps/:id/keys", async (c) => {
  const appId = c.req.param("id");
  const b = await c.req.json().catch(() => ({}));
  const app = await c.env.DB.prepare(`SELECT slug FROM apps WHERE id = ?`).bind(appId).first<{ slug: string }>();
  if (!app) return c.json({ error: "not_found" }, 404);

  const env = c.env.ENVIRONMENT === "production" ? "live" : "test";
  const raw = `hk_${env}_${randomToken(24)}`;
  const keyHash = await sha256Hex(raw);
  const keyId = id("key");
  await c.env.DB.prepare(
    `INSERT INTO api_keys (id, app_id, key_hash, key_prefix, label, revoked, created_at)
     VALUES (?, ?, ?, ?, ?, 0, ?)`
  )
    .bind(keyId, appId, keyHash, raw.slice(0, 16), b.label ? String(b.label).slice(0, 80) : null, nowMs())
    .run();
  // Return the plaintext exactly once.
  return c.json({ id: keyId, key: raw, key_prefix: raw.slice(0, 16) }, 201);
});

dashboard.delete("/keys/:id", async (c) => {
  await c.env.DB.prepare(`UPDATE api_keys SET revoked = 1 WHERE id = ?`)
    .bind(c.req.param("id"))
    .run();
  return c.json({ ok: true });
});

// ---- Submissions (bugs & features) ---------------------------------------
dashboard.get("/apps/:id/submissions", async (c) => {
  const status = c.req.query("status");
  const type = c.req.query("type");
  const clauses = ["app_id = ?"];
  const vals: any[] = [c.req.param("id")];
  if (status) {
    clauses.push("status = ?");
    vals.push(status);
  }
  if (type) {
    clauses.push("type = ?");
    vals.push(type);
  }
  const rows = await c.env.DB.prepare(
    `SELECT * FROM submissions WHERE ${clauses.join(" AND ")} ORDER BY created_at DESC LIMIT 500`
  )
    .bind(...vals)
    .all();
  return c.json({ submissions: rows.results ?? [] });
});

dashboard.patch("/submissions/:id", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const allowed = ["new", "triaged", "in_progress", "done", "wont_fix"];
  const fields: string[] = [];
  const vals: any[] = [];
  if (typeof b.status === "string" && allowed.includes(b.status)) {
    fields.push("status = ?");
    vals.push(b.status);
  }
  if (typeof b.notes === "string") {
    fields.push("notes = ?");
    vals.push(b.notes.slice(0, 8000));
  }
  if (!fields.length) return c.json({ error: "no_fields" }, 400);
  fields.push("updated_at = ?");
  vals.push(nowMs(), c.req.param("id"));
  await c.env.DB.prepare(`UPDATE submissions SET ${fields.join(", ")} WHERE id = ?`)
    .bind(...vals)
    .run();
  const sub = await c.env.DB.prepare(`SELECT * FROM submissions WHERE id = ?`)
    .bind(c.req.param("id"))
    .first();
  return c.json({ submission: sub });
});

// ---- Crashes (grouped by fingerprint) ------------------------------------
dashboard.get("/apps/:id/crashes", async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT fingerprint,
            COUNT(*) AS count,
            MAX(ts) AS last_seen,
            MIN(ts) AS first_seen,
            COUNT(DISTINCT distinct_id) AS affected_users,
            MAX(message) AS message,
            MAX(app_version) AS app_version
       FROM crashes WHERE app_id = ?
      GROUP BY fingerprint ORDER BY last_seen DESC LIMIT 200`
  )
    .bind(c.req.param("id"))
    .all();
  return c.json({ groups: rows.results ?? [] });
});

dashboard.get("/apps/:id/crashes/:fingerprint", async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT * FROM crashes WHERE app_id = ? AND fingerprint = ? ORDER BY ts DESC LIMIT 50`
  )
    .bind(c.req.param("id"), c.req.param("fingerprint"))
    .all();
  return c.json({ events: rows.results ?? [] });
});

// ---- Analytics -----------------------------------------------------------
dashboard.get("/apps/:id/analytics", async (c) => {
  const range = c.req.query("range") || "30d";
  const days = range === "7d" ? 7 : range === "90d" ? 90 : 30;
  const data = await getAnalytics(c.env, c.req.param("id"), days);
  // App Store metrics over the same window (empty until ASC is configured + app is live).
  const start = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
  const appstore = await c.env.DB.prepare(
    `SELECT day, downloads, revenue, rating_avg, rating_count, impressions, product_page_views
       FROM appstore_metrics WHERE app_id = ? AND day >= ? ORDER BY day`
  )
    .bind(c.req.param("id"), start)
    .all();
  return c.json({ ...data, appstore: appstore.results ?? [] });
});

// ---- App Store Connect ---------------------------------------------------
dashboard.get("/asc/status", (c) => {
  return c.json({ configured: ascConfigured(c.env) });
});

// List the account's App Store apps (also a live auth check). Returns each app's
// Apple ID + SKU + bundle id so you can map Hatchling apps in Settings.
dashboard.get("/asc/apps", async (c) => {
  if (!ascConfigured(c.env)) return c.json({ error: "not_configured" }, 400);
  try {
    const apps = await listApps(c.env);
    return c.json({ apps });
  } catch (e) {
    return c.json({ error: "asc_request_failed", detail: (e as Error).message }, 502);
  }
});

// Manually trigger an App Store Connect pull (for testing / on-demand refresh).
dashboard.post("/asc/sync", async (c) => {
  if (!ascConfigured(c.env)) {
    return c.json({ ok: false, error: "not_configured" }, 400);
  }
  const body = await c.req.json().catch(() => ({}));
  const result = await syncAppStore(c.env, { day: body.day });
  return c.json(result);
});
