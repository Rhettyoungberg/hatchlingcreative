import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Bindings, Variables } from "./types";
import { auth } from "./auth";
import { ingest } from "./ingest";
import { dashboard } from "./dashboard";
import { runRollup } from "./analytics";
import { syncAppStore, ascConfigured } from "./asc";

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// CORS: allow the dashboard origin with credentials (cookies).
app.use("*", async (c, next) => {
  const handler = cors({
    origin: (origin) => {
      const allowed = c.env.DASHBOARD_URL;
      if (!origin) return allowed; // non-browser clients (apps) — value unused
      return origin === allowed ? origin : allowed;
    },
    credentials: true,
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-Api-Key"],
  });
  return handler(c, next);
});

app.get("/", (c) => c.json({ service: "hatchling-api", ok: true }));
app.get("/health", (c) => c.json({ ok: true }));

app.route("/auth", auth);
app.route("/v1", ingest); // app-authenticated ingest (events, bugs, crashes)
app.route("/dashboard", dashboard); // session-authenticated dashboard data

app.notFound((c) => c.json({ error: "not_found" }, 404));
app.onError((err, c) => {
  console.error("Unhandled error:", err);
  return c.json({ error: "internal_error" }, 500);
});

export default {
  fetch: app.fetch,
  // Nightly daily-rollup (configured via wrangler crons).
  async scheduled(_event: ScheduledController, env: Bindings, ctx: ExecutionContext) {
    ctx.waitUntil(
      runRollup(env)
        .then((r) => console.log(`rollup complete: ${r.apps} apps, days ${r.days.join(", ")}`))
        .catch((e) => console.error("rollup failed:", e))
    );
    // Pull App Store Connect metrics (no-op unless credentials are configured).
    if (ascConfigured(env)) {
      ctx.waitUntil(
        syncAppStore(env)
          .then((r) => console.log(`asc sync: updated ${r.updated} apps for ${r.day}`, r.notes))
          .catch((e) => console.error("asc sync failed:", e))
      );
    }
  },
};
