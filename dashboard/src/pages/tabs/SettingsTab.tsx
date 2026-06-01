import { useEffect, useState } from "react";
import { api } from "../../api";
import type { ApiKey, App } from "../../types";
import { relativeTime } from "../../ui";

export default function SettingsTab({
  app,
  onUpdated,
}: {
  app: App;
  onUpdated: (a: App) => void;
}) {
  const [name, setName] = useState(app.name);
  const [platform, setPlatform] = useState(app.platform || "");
  const [iconUrl, setIconUrl] = useState(app.icon_url || "");
  const [savedMsg, setSavedMsg] = useState("");

  const [keys, setKeys] = useState<ApiKey[] | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [revealed, setRevealed] = useState<{ key: string; label: string } | null>(null);
  const apiBase = import.meta.env.VITE_API_BASE || "https://api.hatchlingcreative.com";

  // App Store Connect
  const [sku, setSku] = useState(app.appstore_sku || "");
  const [appleId, setAppleId] = useState(app.appstore_app_id || "");
  const [ascConfigured, setAscConfigured] = useState<boolean | null>(null);
  const [ascSavedMsg, setAscSavedMsg] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string>("");

  useEffect(() => {
    api.ascStatus().then((s) => setAscConfigured(s.configured)).catch(() => setAscConfigured(false));
  }, []);

  async function saveAppStore(e: React.FormEvent) {
    e.preventDefault();
    const { app: updated } = await api.updateApp(app.id, {
      appstore_sku: sku,
      appstore_app_id: appleId,
    });
    onUpdated(updated);
    setAscSavedMsg("Saved");
    setTimeout(() => setAscSavedMsg(""), 1500);
  }

  async function syncNow() {
    setSyncing(true);
    setSyncResult("");
    try {
      const r = await api.ascSync();
      setSyncResult(
        r.ok
          ? `Synced ${r.day}: ${r.updated} app(s) updated.${r.notes?.length ? " " + r.notes.join(" ") : ""}`
          : `Couldn't sync: ${r.error}`
      );
    } catch (e) {
      setSyncResult(`Sync failed: ${(e as Error).message}`);
    } finally {
      setSyncing(false);
    }
  }

  async function loadKeys() {
    const { keys } = await api.keys(app.id);
    setKeys(keys);
  }
  useEffect(() => {
    loadKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.id]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const { app: updated } = await api.updateApp(app.id, {
      name,
      platform,
      icon_url: iconUrl,
    });
    onUpdated(updated);
    setSavedMsg("Saved");
    setTimeout(() => setSavedMsg(""), 1500);
  }

  async function createKey() {
    const res = await api.createKey(app.id, newLabel || undefined);
    setRevealed({ key: res.key, label: newLabel || "New key" });
    setNewLabel("");
    loadKeys();
  }

  async function revoke(id: string) {
    await api.revokeKey(id);
    loadKeys();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* App details */}
      <form onSubmit={save} className="card space-y-4 p-5">
        <h3 className="text-sm font-medium text-white/70">App details</h3>
        <Field label="Name">
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Platform">
          <select className="input" value={platform} onChange={(e) => setPlatform(e.target.value)}>
            <option value="">—</option>
            <option value="ios">iOS</option>
            <option value="android">Android</option>
            <option value="web">Web</option>
            <option value="macos">macOS</option>
          </select>
        </Field>
        <Field label="Icon URL">
          <input
            className="input"
            value={iconUrl}
            onChange={(e) => setIconUrl(e.target.value)}
            placeholder="https://…"
          />
        </Field>
        <div className="flex items-center gap-3">
          <button className="btn-primary">Save changes</button>
          {savedMsg && <span className="text-sm text-emerald-400">{savedMsg}</span>}
        </div>
      </form>

      {/* API keys */}
      <div className="card space-y-4 p-5">
        <h3 className="text-sm font-medium text-white/70">API keys</h3>
        <p className="text-xs text-white/40">
          Use a key to authenticate ingest requests from this app. Send it as{" "}
          <code className="text-white/60">Authorization: Bearer &lt;key&gt;</code> to{" "}
          <code className="text-white/60">{apiBase}/v1/…</code>
        </p>

        <div className="flex gap-2">
          <input
            className="input"
            placeholder="Key label (e.g. iOS production)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
          />
          <button className="btn-primary shrink-0" onClick={createKey} type="button">
            Generate
          </button>
        </div>

        {revealed && (
          <div className="rounded-lg border border-accent-dim/40 bg-accent-indigo/10 p-3">
            <div className="text-xs text-white/60">
              Copy this key now — it won't be shown again.
            </div>
            <code className="mt-1 block break-all rounded bg-black/40 p-2 text-sm text-accent-indigo">
              {revealed.key}
            </code>
            <button
              className="btn-ghost mt-2"
              onClick={() => navigator.clipboard?.writeText(revealed.key)}
            >
              Copy
            </button>
          </div>
        )}

        <div className="divide-y divide-line">
          {keys?.map((k) => (
            <div key={k.id} className="flex items-center gap-3 py-2.5">
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm">
                  {k.label || "Untitled key"}{" "}
                  {k.revoked ? (
                    <span className="text-xs text-red-400">(revoked)</span>
                  ) : null}
                </div>
                <div className="font-mono text-xs text-white/40">
                  {k.key_prefix}…{" "}
                  {k.last_used_at ? `· used ${relativeTime(k.last_used_at)}` : "· never used"}
                </div>
              </div>
              {!k.revoked && (
                <button onClick={() => revoke(k.id)} className="text-xs text-red-400 hover:underline">
                  Revoke
                </button>
              )}
            </div>
          ))}
          {keys?.length === 0 && (
            <div className="py-6 text-center text-sm text-white/30">No keys yet</div>
          )}
        </div>
      </div>

      {/* App Store Connect */}
      <form onSubmit={saveAppStore} className="card space-y-4 p-5 lg:col-span-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white/70">App Store Connect</h3>
          <span
            className={`label-chip ${
              ascConfigured === null
                ? "bg-white/5 text-white/40"
                : ascConfigured
                ? "bg-emerald-400/15 text-emerald-300"
                : "bg-amber-400/15 text-amber-300"
            }`}
          >
            {ascConfigured === null
              ? "…"
              : ascConfigured
              ? "Credentials configured"
              : "Credentials not set"}
          </span>
        </div>
        <p className="text-xs text-white/40">
          Map this app to its App Store identity to pull downloads, revenue, and ratings. The
          API key (.p8) is configured server-side — see <code className="text-white/60">docs/APPSTORE_CONNECT.md</code>.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="SKU (from Sales & Trends)">
            <input
              className="input"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="MILEMARKER"
            />
          </Field>
          <Field label="Apple ID (numeric)">
            <input
              className="input"
              value={appleId}
              onChange={(e) => setAppleId(e.target.value)}
              placeholder="6480000001"
            />
          </Field>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="btn-primary">Save mapping</button>
          {ascSavedMsg && <span className="text-sm text-emerald-400">{ascSavedMsg}</span>}
          <button
            type="button"
            className="btn-ghost"
            disabled={!ascConfigured || syncing}
            onClick={syncNow}
            title={ascConfigured ? "Pull yesterday's metrics now" : "Set credentials first"}
          >
            {syncing ? "Syncing…" : "Sync now"}
          </button>
          {syncResult && <span className="text-xs text-white/50">{syncResult}</span>}
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs text-white/50">{label}</label>
      {children}
    </div>
  );
}
