import { Hono } from "hono";
import type { Bindings, Variables, AppContext } from "./types";
import { sha256Hex, id, nowMs, dayString } from "./util";

// ---- Accepted-input contract (kept in sync with docs/CONVENTIONS.md) ----
/** Event names: snake_case, start with a letter, ≤ 40 chars. e.g. `drive_recorded`. */
const EVENT_NAME_RE = /^[a-z][a-z0-9_]{0,39}$/;
const SUBMISSION_TYPES = new Set(["bug", "feature"]);
const SEVERITIES = new Set(["low", "medium", "high", "critical"]);

/** Authenticate an ingest request with a per-app API key (Bearer or X-Api-Key). */
async function withApiKey(c: AppContext, next: () => Promise<void>) {
  const auth = c.req.header("authorization") || "";
  const headerKey = c.req.header("x-api-key") || "";
  const raw = auth.toLowerCase().startsWith("bearer ")
    ? auth.slice(7).trim()
    : headerKey.trim();
  if (!raw) return c.json({ error: "missing_api_key" }, 401);

  const keyHash = await sha256Hex(raw);
  const row = await c.env.DB.prepare(
    `SELECT id, app_id, revoked FROM api_keys WHERE key_hash = ?`
  )
    .bind(keyHash)
    .first<{ id: string; app_id: string; revoked: number }>();

  if (!row || row.revoked) return c.json({ error: "invalid_api_key" }, 401);

  c.set("apiKeyId", row.id);
  c.set("appId", row.app_id);
  // Best-effort last-used stamp (don't block on it).
  c.executionCtx.waitUntil(
    c.env.DB.prepare(`UPDATE api_keys SET last_used_at = ? WHERE id = ?`)
      .bind(nowMs(), row.id)
      .run()
  );
  await next();
}

export const ingest = new Hono<{ Bindings: Bindings; Variables: Variables }>();
ingest.use("*", withApiKey);

// ---- Usage events --------------------------------------------------------
// Accepts a single event or { events: [...] } / a raw array (batched).
ingest.post("/events", async (c) => {
  const appId = c.get("appId");
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: "invalid_body" }, 400);

  const list: any[] = Array.isArray(body)
    ? body
    : Array.isArray(body.events)
    ? body.events
    : [body];
  if (list.length === 0) return c.json({ error: "no_events" }, 400);
  if (list.length > 100) return c.json({ error: "too_many_events" }, 413);

  const now = nowMs();
  const stmt = c.env.DB.prepare(
    `INSERT INTO events (id, app_id, name, distinct_id, session_id, props_json, ts, day, ingested_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const batch = [];
  for (const e of list) {
    if (!e || typeof e.name !== "string") continue;
    if (!EVENT_NAME_RE.test(e.name)) {
      return c.json(
        {
          error: "invalid_event_name",
          detail: `"${String(e.name).slice(0, 60)}" must be snake_case, start with a letter, ≤40 chars (e.g. drive_recorded)`,
        },
        400
      );
    }
    const ts = typeof e.ts === "number" ? e.ts : now;
    batch.push(
      stmt.bind(
        id("evt"),
        appId,
        e.name,
        e.distinct_id ? String(e.distinct_id).slice(0, 200) : null,
        e.session_id ? String(e.session_id).slice(0, 200) : null,
        e.props ? JSON.stringify(e.props).slice(0, 4000) : null,
        ts,
        dayString(ts),
        now
      )
    );
  }
  if (batch.length === 0) return c.json({ error: "no_valid_events" }, 400);
  await c.env.DB.batch(batch);
  return c.json({ ok: true, accepted: batch.length });
});

// ---- Bugs & feature requests --------------------------------------------
ingest.post("/bugs", async (c) => {
  const appId = c.get("appId");
  const b = await c.req.json().catch(() => null);
  if (!b || typeof b.title !== "string" || !b.title.trim()) {
    return c.json({ error: "title_required" }, 400);
  }
  // type defaults to "bug"; if provided it must be a known value.
  if (b.type !== undefined && !SUBMISSION_TYPES.has(b.type)) {
    return c.json({ error: "invalid_type", detail: "type must be 'bug' or 'feature'" }, 400);
  }
  if (b.severity !== undefined && b.severity !== null && !SEVERITIES.has(b.severity)) {
    return c.json(
      { error: "invalid_severity", detail: "severity must be low | medium | high | critical" },
      400
    );
  }
  const type = b.type === "feature" ? "feature" : "bug";
  const now = nowMs();
  const subId = id("sub");
  await c.env.DB.prepare(
    `INSERT INTO submissions
       (id, app_id, type, title, body, severity, status, app_version, platform, device, reporter_contact, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 'new', ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      subId,
      appId,
      type,
      String(b.title).slice(0, 200),
      b.body ? String(b.body).slice(0, 8000) : null,
      b.severity ? String(b.severity).slice(0, 20) : null,
      b.app_version ? String(b.app_version).slice(0, 40) : null,
      b.platform ? String(b.platform).slice(0, 40) : null,
      b.device ? String(b.device).slice(0, 120) : null,
      b.reporter_contact ? String(b.reporter_contact).slice(0, 200) : null,
      now,
      now
    )
    .run();
  return c.json({ ok: true, id: subId });
});

// ---- Crashes / errors ----------------------------------------------------
ingest.post("/crashes", async (c) => {
  const appId = c.get("appId");
  const b = await c.req.json().catch(() => null);
  if (!b || typeof b.message !== "string" || !b.message.trim()) {
    return c.json({ error: "message_required" }, 400);
  }
  const now = nowMs();
  const ts = typeof b.ts === "number" ? b.ts : now;
  const stack = b.stack ? String(b.stack).slice(0, 12000) : null;
  // Group crashes: fingerprint = hash(app + message + first stack line).
  const firstLine = stack ? stack.split("\n")[0] : "";
  const fingerprint = await sha256Hex(`${appId}|${b.message}|${firstLine}`);
  const crashId = id("crash");
  await c.env.DB.prepare(
    `INSERT INTO crashes
       (id, app_id, fingerprint, message, stack, app_version, os, device, distinct_id, ts, day, ingested_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      crashId,
      appId,
      fingerprint,
      String(b.message).slice(0, 500),
      stack,
      b.app_version ? String(b.app_version).slice(0, 40) : null,
      b.os ? String(b.os).slice(0, 60) : null,
      b.device ? String(b.device).slice(0, 120) : null,
      b.distinct_id ? String(b.distinct_id).slice(0, 200) : null,
      ts,
      dayString(ts),
      now
    )
    .run();
  return c.json({ ok: true, id: crashId, fingerprint });
});
