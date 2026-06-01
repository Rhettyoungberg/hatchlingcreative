import { useEffect, useState, useCallback } from "react";

// Drop in dashboard/src/pages/PipelineBoard.tsx and add a route in main.tsx:
//     <Route path="/pipeline" element={<PipelineBoard />} />
// plus a nav link in Layout.tsx. Self-contained (its own fetch) so no edits to api.ts are needed.

const BASE = (import.meta as any).env?.VITE_API_BASE || "";
async function pget<T>(path: string): Promise<T> {
  const r = await fetch(`${BASE}${path}`, { credentials: "include" });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}
async function ppost<T>(path: string, body: unknown): Promise<T> {
  const r = await fetch(`${BASE}${path}`, {
    method: "POST", credentials: "include",
    headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

// Pipeline stages in order (mirrors docs/STATE_SCHEMA.md stage ids). `beta` is 4.5.
const STAGES = ["ideation", "product_scope", "design", "build", "audit", "beta", "release", "monitor"] as const;
const STAGE_LABEL: Record<string, string> = {
  ideation: "Ideation", product_scope: "Product/Scope", design: "Design", build: "Build",
  audit: "Audit", beta: "Beta", release: "Release", monitor: "Monitor",
};

type Run = { app_id: string; run_id: string; kind: string; title: string | null; stage: string; stage_status: string; blocked_on: string | null; merged_at: number | null };
type AppRow = { id: string; name: string; slug: string; platform: string | null; lifecycle: string | null; active_run_id: string | null; runs: Run[] };
type Job = { id: string; app_slug: string; command: string; status: string; host: string | null; result: string | null; created_at: number; finished_at: number | null };

// autoAssist badge for beta cards: queries the ASC `testflight-build` check.
function TestFlightBadge({ slug }: { slug: string }) {
  const [s, setS] = useState<{ configured?: boolean; onTestFlight?: boolean; version?: string | null; reason?: string } | null>(null);
  useEffect(() => {
    let live = true;
    pget<typeof s>(`/api/pipeline/asc/${slug}/testflight`).then((d) => live && setS(d)).catch(() => {});
    return () => { live = false; };
  }, [slug]);
  if (!s || s.configured === false) return null;
  const ok = s.onTestFlight;
  return (
    <span className={`text-[10px] px-1 rounded ${ok ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}
      title={s.reason || (ok ? `build ${s.version} on TestFlight` : "no TestFlight build")}>
      {ok ? `TF ✓${s.version ? " " + s.version : ""}` : "TF –"}
    </span>
  );
}

const STATUS_DOT: Record<string, string> = {
  done: "bg-green-500", in_progress: "bg-sky-500", blocked: "bg-red-500", not_started: "bg-slate-300",
};
const LIFECYCLE_BADGE: Record<string, string> = {
  live: "bg-green-100 text-green-800", incubating: "bg-sky-100 text-sky-800",
  killed: "bg-slate-200 text-slate-600", sunset: "bg-amber-100 text-amber-800", shelved: "bg-slate-200 text-slate-600",
};

export default function PipelineBoard() {
  const [apps, setApps] = useState<AppRow[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const d = await pget<{ apps: AppRow[]; jobs: Job[] }>("/api/pipeline/board");
      setApps(d.apps); setJobs(d.jobs); setErr(null);
    } catch (e) { setErr(`Could not load board (${(e as Error).message}). Is the pipeline API deployed?`); }
  }, []);

  useEffect(() => { load(); const t = setInterval(load, 8000); return () => clearInterval(t); }, [load]);

  const enqueue = async (slug: string, command: "run" | "advance", runId?: string) => {
    setBusy(`${slug}:${command}`);
    try { await ppost("/api/pipeline/jobs", { slug, command, runId }); await load(); }
    catch (e) { setErr(`Enqueue failed (${(e as Error).message})`); }
    finally { setBusy(null); }
  };

  const isTerminal = (l: string | null) => l === "killed" || l === "sunset" || l === "shelved";
  const active = apps.filter((a) => !isTerminal(a.lifecycle));
  const archived = apps.filter((a) => isTerminal(a.lifecycle));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Pipeline</h1>
        <button onClick={load} className="text-sm text-slate-500 hover:text-slate-800">↻ Refresh</button>
      </div>
      {err && <div className="rounded bg-amber-50 text-amber-800 text-sm px-3 py-2">{err}</div>}

      {/* Kanban: one column per stage */}
      <div className="grid grid-flow-col auto-cols-[minmax(150px,1fr)] gap-3 overflow-x-auto pb-2">
        {STAGES.map((stage) => {
          const cards = active.flatMap((a) => a.runs.filter((r) => r.stage === stage && !r.merged_at).map((r) => ({ a, r })));
          return (
            <div key={stage} className="bg-slate-50 rounded-lg p-2 min-w-[150px]">
              <div className="text-xs font-medium text-slate-500 mb-2 flex justify-between">
                <span>{STAGE_LABEL[stage]}{stage === "beta" && <span className="text-slate-400"> 4.5</span>}</span>
                <span>{cards.length || ""}</span>
              </div>
              <div className="space-y-2">
                {cards.map(({ a, r }) => (
                  <div key={a.id + r.run_id} className={`bg-white rounded-md border p-2 shadow-sm ${r.stage_status === "blocked" ? "border-red-300" : "border-slate-200"}`}>
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-block w-2 h-2 rounded-full ${STATUS_DOT[r.stage_status] || "bg-slate-300"}`} />
                      <span className="text-sm font-medium truncate">{a.name}</span>
                      {r.kind === "feature" && <span className="text-[10px] px-1 rounded bg-fuchsia-100 text-fuchsia-700">feat</span>}
                    </div>
                    {r.kind === "feature" && <div className="text-[11px] text-slate-500 truncate">{r.title}</div>}
                    {stage === "beta" && <div className="mt-0.5"><TestFlightBadge slug={a.slug} /></div>}
                    {r.stage_status === "blocked" && <div className="text-[11px] text-red-600">blocked: {r.blocked_on}</div>}
                    <div className="flex gap-1 mt-1.5">
                      <button disabled={!!busy} onClick={() => enqueue(a.slug, "run", r.run_id)}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-white disabled:opacity-50">Run</button>
                      <button disabled={!!busy} onClick={() => enqueue(a.slug, "advance", r.run_id)}
                        className="text-[11px] px-2 py-0.5 rounded border border-slate-300 disabled:opacity-50">Advance</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Archived lane */}
      {archived.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-slate-500 mb-2">Killed / Sunset / Shelved</h2>
          <div className="flex flex-wrap gap-2">
            {archived.map((a) => (
              <span key={a.id} className={`text-xs px-2 py-1 rounded ${LIFECYCLE_BADGE[a.lifecycle || ""] || "bg-slate-200"}`}>
                {a.name} · {a.lifecycle}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent queue activity */}
      <div>
        <h2 className="text-sm font-medium text-slate-500 mb-2">Run queue</h2>
        <div className="text-xs text-slate-600 space-y-1">
          {jobs.length === 0 && <div className="text-slate-400">No jobs yet. Click Run/Advance on a card — the local fledged daemon drains the queue.</div>}
          {jobs.map((j) => (
            <div key={j.id} className="flex gap-3">
              <span className="font-mono text-slate-400">{new Date(j.created_at).toLocaleTimeString()}</span>
              <span className="w-16">{j.command}</span>
              <span className="w-32 truncate">{j.app_slug}</span>
              <span className={j.status === "error" ? "text-red-600" : j.status === "done" ? "text-green-600" : "text-sky-600"}>{j.status}</span>
              {j.host && <span className="text-slate-400">@{j.host}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
