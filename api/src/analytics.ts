import type { Bindings } from "./types";
import { dayString, nowMs } from "./util";

const DAY_MS = 24 * 60 * 60 * 1000;

/** List of UTC YYYY-MM-DD strings ending today, inclusive, length `days`. */
export function recentDays(days: number, end = nowMs()): string[] {
  const out: string[] = [];
  for (let i = days - 1; i >= 0; i--) out.push(dayString(end - i * DAY_MS));
  return out;
}

type DayRow = { day: string; n: number };

function toMap(rows: DayRow[]): Record<string, number> {
  const m: Record<string, number> = {};
  for (const r of rows) m[r.day] = r.n;
  return m;
}

export type AppAnalytics = {
  range_days: number;
  series: {
    day: string;
    dau: number;
    sessions: number;
    events: number;
    crashes: number;
    new_submissions: number;
  }[];
  totals: { events: number; crashes: number; new_submissions: number };
  active_users: { dau: number; wau: number; mau: number };
  top_events: { name: string; count: number }[];
};

/** Compute analytics for an app over the last `days` (live, grouped queries). */
export async function getAnalytics(
  env: Bindings,
  appId: string,
  days: number
): Promise<AppAnalytics> {
  const list = recentDays(days);
  const start = list[0];
  const now = nowMs();

  const [dauRows, sessRows, evtRows, crashRows, subRows, topEvents, wau, mau] =
    await Promise.all([
      env.DB.prepare(
        `SELECT day, COUNT(DISTINCT distinct_id) AS n FROM events
          WHERE app_id = ? AND day >= ? AND distinct_id IS NOT NULL GROUP BY day`
      )
        .bind(appId, start)
        .all<DayRow>(),
      env.DB.prepare(
        `SELECT day, COUNT(DISTINCT session_id) AS n FROM events
          WHERE app_id = ? AND day >= ? AND session_id IS NOT NULL GROUP BY day`
      )
        .bind(appId, start)
        .all<DayRow>(),
      env.DB.prepare(
        `SELECT day, COUNT(*) AS n FROM events WHERE app_id = ? AND day >= ? GROUP BY day`
      )
        .bind(appId, start)
        .all<DayRow>(),
      env.DB.prepare(
        `SELECT day, COUNT(*) AS n FROM crashes WHERE app_id = ? AND day >= ? GROUP BY day`
      )
        .bind(appId, start)
        .all<DayRow>(),
      env.DB.prepare(
        `SELECT date(created_at / 1000, 'unixepoch') AS day, COUNT(*) AS n
           FROM submissions WHERE app_id = ? AND created_at >= ? GROUP BY day`
      )
        .bind(appId, new Date(`${start}T00:00:00Z`).getTime())
        .all<DayRow>(),
      env.DB.prepare(
        `SELECT name, COUNT(*) AS count FROM events
          WHERE app_id = ? AND day >= ? GROUP BY name ORDER BY count DESC LIMIT 10`
      )
        .bind(appId, start)
        .all<{ name: string; count: number }>(),
      env.DB.prepare(
        `SELECT COUNT(DISTINCT distinct_id) AS n FROM events
          WHERE app_id = ? AND ts >= ? AND distinct_id IS NOT NULL`
      )
        .bind(appId, now - 7 * DAY_MS)
        .first<{ n: number }>(),
      env.DB.prepare(
        `SELECT COUNT(DISTINCT distinct_id) AS n FROM events
          WHERE app_id = ? AND ts >= ? AND distinct_id IS NOT NULL`
      )
        .bind(appId, now - 30 * DAY_MS)
        .first<{ n: number }>(),
    ]);

  const dau = toMap(dauRows.results ?? []);
  const sess = toMap(sessRows.results ?? []);
  const evt = toMap(evtRows.results ?? []);
  const crash = toMap(crashRows.results ?? []);
  const sub = toMap(subRows.results ?? []);

  const series = list.map((day) => ({
    day,
    dau: dau[day] ?? 0,
    sessions: sess[day] ?? 0,
    events: evt[day] ?? 0,
    crashes: crash[day] ?? 0,
    new_submissions: sub[day] ?? 0,
  }));

  const totals = series.reduce(
    (acc, d) => ({
      events: acc.events + d.events,
      crashes: acc.crashes + d.crashes,
      new_submissions: acc.new_submissions + d.new_submissions,
    }),
    { events: 0, crashes: 0, new_submissions: 0 }
  );

  const today = dayString(now);
  return {
    range_days: days,
    series,
    totals,
    active_users: {
      dau: dau[today] ?? 0,
      wau: wau?.n ?? 0,
      mau: mau?.n ?? 0,
    },
    top_events: topEvents.results ?? [],
  };
}

/** Nightly Cron: snapshot completed days into daily_rollups for every app. */
export async function runRollup(env: Bindings): Promise<{ days: string[]; apps: number }> {
  // Roll up yesterday and today (today may still grow; it is overwritten next run).
  const days = recentDays(2);
  const apps = await env.DB.prepare(`SELECT id FROM apps`).all<{ id: string }>();
  const appIds = (apps.results ?? []).map((a) => a.id);

  for (const day of days) {
    const startMs = new Date(`${day}T00:00:00Z`).getTime();
    const endMs = startMs + DAY_MS;
    for (const appId of appIds) {
      const [dau, sessions, events, crashes, subs] = await Promise.all([
        env.DB.prepare(
          `SELECT COUNT(DISTINCT distinct_id) AS n FROM events WHERE app_id = ? AND day = ? AND distinct_id IS NOT NULL`
        )
          .bind(appId, day)
          .first<{ n: number }>(),
        env.DB.prepare(
          `SELECT COUNT(DISTINCT session_id) AS n FROM events WHERE app_id = ? AND day = ? AND session_id IS NOT NULL`
        )
          .bind(appId, day)
          .first<{ n: number }>(),
        env.DB.prepare(`SELECT COUNT(*) AS n FROM events WHERE app_id = ? AND day = ?`)
          .bind(appId, day)
          .first<{ n: number }>(),
        env.DB.prepare(`SELECT COUNT(*) AS n FROM crashes WHERE app_id = ? AND day = ?`)
          .bind(appId, day)
          .first<{ n: number }>(),
        env.DB.prepare(
          `SELECT COUNT(*) AS n FROM submissions WHERE app_id = ? AND created_at >= ? AND created_at < ?`
        )
          .bind(appId, startMs, endMs)
          .first<{ n: number }>(),
      ]);
      await env.DB.prepare(
        `INSERT INTO daily_rollups (app_id, day, dau, sessions, events_count, new_submissions, crashes)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(app_id, day) DO UPDATE SET
           dau = excluded.dau, sessions = excluded.sessions,
           events_count = excluded.events_count,
           new_submissions = excluded.new_submissions, crashes = excluded.crashes`
      )
        .bind(
          appId,
          day,
          dau?.n ?? 0,
          sessions?.n ?? 0,
          events?.n ?? 0,
          subs?.n ?? 0,
          crashes?.n ?? 0
        )
        .run();
    }
  }
  return { days, apps: appIds.length };
}
