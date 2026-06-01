// App Store Connect integration: pulls downloads, revenue, ratings, and (best-effort)
// app analytics into the appstore_metrics table.
//
// Auth is an ES256-signed JWT (App Store Connect API key). Cloudflare's Web Crypto
// signs ECDSA P-256 natively and returns the raw r||s signature that JWS ES256 wants,
// so no extra crypto libraries are needed.
//
// All functions degrade gracefully: if credentials are missing the whole sync is a
// no-op, and a failure for one app/report never aborts the others.

import type { Bindings } from "./types";
import { dayString, nowMs } from "./util";

const ASC_BASE = "https://api.appstoreconnect.apple.com";
const DAY_MS = 24 * 60 * 60 * 1000;

// ---- credentials --------------------------------------------------------
export function ascConfigured(env: Bindings): boolean {
  return Boolean(env.ASC_KEY_ID && env.ASC_ISSUER_ID && env.ASC_PRIVATE_KEY);
}

// ---- JWT (ES256) --------------------------------------------------------
const enc = new TextEncoder();

function b64url(input: ArrayBuffer | Uint8Array | string): string {
  let bytes: Uint8Array;
  if (typeof input === "string") bytes = enc.encode(input);
  else if (input instanceof Uint8Array) bytes = input;
  else bytes = new Uint8Array(input);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const body = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");
  const der = Uint8Array.from(atob(body), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    "pkcs8",
    der.buffer as ArrayBuffer,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"]
  );
}

// Cache the token within the isolate (valid ≤ 20 min; we use 18).
let tokenCache: { token: string; exp: number } | null = null;

export async function ascToken(env: Bindings): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (tokenCache && tokenCache.exp - 60 > now) return tokenCache.token;

  const header = { alg: "ES256", kid: env.ASC_KEY_ID, typ: "JWT" };
  const exp = now + 18 * 60;
  const payload = { iss: env.ASC_ISSUER_ID, iat: now, exp, aud: "appstoreconnect-v1" };
  const signingInput = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
  const key = await importPrivateKey(env.ASC_PRIVATE_KEY!);
  const sig = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    enc.encode(signingInput)
  );
  const token = `${signingInput}.${b64url(sig)}`;
  tokenCache = { token, exp };
  return token;
}

async function ascGet(env: Bindings, path: string, accept = "application/json"): Promise<Response> {
  const token = await ascToken(env);
  return fetch(`${ASC_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: accept },
  });
}

// ---- TSV / gzip helpers -------------------------------------------------
async function gunzipText(res: Response): Promise<string> {
  const ds = new DecompressionStream("gzip");
  const stream = res.body!.pipeThrough(ds);
  return new Response(stream).text();
}

/** Parse a tab-separated report into row objects keyed by header. */
export function parseTSV(text: string): Record<string, string>[] {
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = lines[0].split("\t");
  return lines.slice(1).map((line) => {
    const cells = line.split("\t");
    const row: Record<string, string> = {};
    headers.forEach((h, i) => (row[h.trim()] = (cells[i] ?? "").trim()));
    return row;
  });
}

// ---- List apps (auth check + mapping discovery) -------------------------
export type AscApp = { id: string; name: string; sku: string; bundleId: string };

export async function listApps(env: Bindings): Promise<AscApp[]> {
  const res = await ascGet(
    env,
    "/v1/apps?limit=200&fields[apps]=name,sku,bundleId&sort=name"
  );
  if (!res.ok) {
    throw new Error(`apps ${res.status}: ${await res.text().catch(() => "")}`);
  }
  const json = (await res.json()) as {
    data?: { id: string; attributes?: { name?: string; sku?: string; bundleId?: string } }[];
  };
  return (json.data ?? []).map((a) => ({
    id: a.id,
    name: a.attributes?.name ?? "",
    sku: a.attributes?.sku ?? "",
    bundleId: a.attributes?.bundleId ?? "",
  }));
}

// ---- Sales reports (downloads + revenue) --------------------------------
export type SalesBySku = Record<string, { units: number; proceeds: number }>;

/**
 * Download the DAILY SALES SUMMARY report for `day` and aggregate units and
 * developer proceeds by SKU. Apple returns 404 when there's no report for a
 * date (e.g. no sales / not yet generated) — treated as "no data".
 *
 * Note: proceeds are summed as units × per-unit "Developer Proceeds"; the report
 * mixes territories/currencies, so revenue is a best-effort figure. Units
 * (downloads) are exact.
 */
export async function fetchSalesByDay(env: Bindings, day: string): Promise<SalesBySku | null> {
  const params = new URLSearchParams({
    "filter[frequency]": "DAILY",
    "filter[reportType]": "SALES",
    "filter[reportSubType]": "SUMMARY",
    "filter[vendorNumber]": env.ASC_VENDOR_NUMBER || "",
    "filter[reportDate]": day,
    "filter[version]": "1_1",
  });
  const res = await ascGet(env, `/v1/salesReports?${params}`, "application/a-gzip");
  if (res.status === 404) return null; // no report for that day
  if (!res.ok) {
    throw new Error(`salesReports ${res.status}: ${await res.text().catch(() => "")}`);
  }
  const tsv = await gunzipText(res);
  const rows = parseTSV(tsv);
  const out: SalesBySku = {};
  for (const r of rows) {
    const sku = r["SKU"];
    if (!sku) continue;
    const units = parseInt(r["Units"] || "0", 10) || 0;
    const perUnit = parseFloat(r["Developer Proceeds"] || "0") || 0;
    if (!out[sku]) out[sku] = { units: 0, proceeds: 0 };
    out[sku].units += units;
    out[sku].proceeds += units * perUnit;
  }
  return out;
}

// ---- Customer reviews (rating avg + count) ------------------------------
export async function fetchReviewSummary(
  env: Bindings,
  appleId: string
): Promise<{ avg: number | null; count: number } | null> {
  // Up to 200 most-recent reviews. The official aggregate star rating isn't
  // exposed by the API, so the average is computed from this sample; the total
  // count comes from the response's paging meta when present.
  const res = await ascGet(
    env,
    `/v1/apps/${appleId}/customerReviews?limit=200&sort=-createdDate&fields[customerReviews]=rating`
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`customerReviews ${res.status}: ${await res.text().catch(() => "")}`);
  const json = (await res.json()) as {
    data?: { attributes?: { rating?: number } }[];
    meta?: { paging?: { total?: number } };
  };
  const ratings = (json.data ?? [])
    .map((d) => d.attributes?.rating)
    .filter((r): r is number => typeof r === "number");
  const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;
  const count = json.meta?.paging?.total ?? ratings.length;
  return { avg, count };
}

// ---- App analytics (impressions, page views) — EXPERIMENTAL -------------
// The Analytics Reports API is asynchronous: you create an ONGOING
// analyticsReportRequest per app (one-time), then poll for generated report
// instances and download gzipped CSV segments. This scaffolds the request
// creation; wiring instance download is a follow-up once a live app produces
// data to validate against. Returns null until then.
export async function ensureAnalyticsReportRequest(
  env: Bindings,
  appleId: string
): Promise<string | null> {
  // Look for an existing ONGOING request first.
  const existing = await ascGet(
    env,
    `/v1/apps/${appleId}/analyticsReportRequests?filter[accessType]=ONGOING`
  );
  if (existing.ok) {
    const j = (await existing.json()) as { data?: { id: string }[] };
    if (j.data && j.data.length) return j.data[0].id;
  }
  const create = await fetch(`${ASC_BASE}/v1/analyticsReportRequests`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${await ascToken(env)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        type: "analyticsReportRequests",
        attributes: { accessType: "ONGOING" },
        relationships: { app: { data: { type: "apps", id: appleId } } },
      },
    }),
  });
  if (!create.ok) return null;
  const j = (await create.json()) as { data?: { id: string } };
  return j.data?.id ?? null;
}

// ---- Orchestrator -------------------------------------------------------
type AppRow = { id: string; appstore_sku: string | null; appstore_app_id: string | null };

export async function syncAppStore(
  env: Bindings,
  opts: { day?: string } = {}
): Promise<{ ok: boolean; reason?: string; updated: number; day: string; notes: string[] }> {
  const day = opts.day ?? dayString(Date.now() - DAY_MS); // yesterday (today rarely ready)
  const notes: string[] = [];
  if (!ascConfigured(env)) {
    return { ok: false, reason: "not_configured", updated: 0, day, notes };
  }

  const apps = await env.DB.prepare(
    `SELECT id, appstore_sku, appstore_app_id FROM apps
      WHERE appstore_sku IS NOT NULL OR appstore_app_id IS NOT NULL`
  ).all<AppRow>();
  const list = apps.results ?? [];
  if (!list.length) {
    notes.push("No apps have appstore_sku / appstore_app_id set.");
    return { ok: true, updated: 0, day, notes };
  }

  // 1) Sales (downloads + revenue) — one report covers all apps for the day.
  let sales: SalesBySku | null = null;
  try {
    sales = await fetchSalesByDay(env, day);
    if (!sales) notes.push(`No sales report for ${day}.`);
  } catch (e) {
    notes.push(`Sales fetch failed: ${(e as Error).message}`);
  }

  let updated = 0;
  for (const app of list) {
    let downloads: number | null = null;
    let revenue: number | null = null;
    if (sales && app.appstore_sku && sales[app.appstore_sku]) {
      downloads = sales[app.appstore_sku].units;
      revenue = Math.round(sales[app.appstore_sku].proceeds * 100) / 100;
    }

    // 2) Ratings — per app Apple ID.
    let ratingAvg: number | null = null;
    let ratingCount: number | null = null;
    if (app.appstore_app_id) {
      try {
        const r = await fetchReviewSummary(env, app.appstore_app_id);
        if (r) {
          ratingAvg = r.avg;
          ratingCount = r.count;
        }
      } catch (e) {
        notes.push(`Reviews failed for ${app.id}: ${(e as Error).message}`);
      }
    }

    if (downloads === null && revenue === null && ratingAvg === null && ratingCount === null) {
      continue; // nothing to record for this app today
    }

    await env.DB.prepare(
      `INSERT INTO appstore_metrics (app_id, day, downloads, revenue, rating_avg, rating_count, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(app_id, day) DO UPDATE SET
         downloads = COALESCE(excluded.downloads, appstore_metrics.downloads),
         revenue = COALESCE(excluded.revenue, appstore_metrics.revenue),
         rating_avg = COALESCE(excluded.rating_avg, appstore_metrics.rating_avg),
         rating_count = COALESCE(excluded.rating_count, appstore_metrics.rating_count),
         updated_at = excluded.updated_at`
    )
      .bind(app.id, day, downloads, revenue, ratingAvg, ratingCount, nowMs())
      .run();
    updated++;
  }

  return { ok: true, updated, day, notes };
}
