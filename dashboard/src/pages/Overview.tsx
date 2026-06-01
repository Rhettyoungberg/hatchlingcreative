import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import type { AppWithStats } from "../types";
import { Spinner, EmptyState } from "../ui";

export default function Overview() {
  const [apps, setApps] = useState<AppWithStats[] | null>(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPlatform, setNewPlatform] = useState("ios");

  async function load() {
    const { apps } = await api.overview();
    setApps(apps);
  }
  useEffect(() => {
    load();
  }, []);

  async function createApp(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    await api.createApp({ name: newName.trim(), platform: newPlatform });
    setNewName("");
    setCreating(false);
    load();
  }

  if (!apps) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-3xl">Your apps</h1>
          <p className="mt-1 text-sm text-white/40">
            Live health across everything Hatchling is building.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setCreating((v) => !v)}>
          + New app
        </button>
      </div>

      {creating && (
        <form onSubmit={createApp} className="card flex flex-wrap items-end gap-3 p-4">
          <div className="flex-1 min-w-[200px]">
            <label className="mb-1 block text-xs text-white/50">App name</label>
            <input
              className="input"
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="EchoCast"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-white/50">Platform</label>
            <select
              className="input"
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value)}
            >
              <option value="ios">iOS</option>
              <option value="android">Android</option>
              <option value="web">Web</option>
              <option value="macos">macOS</option>
            </select>
          </div>
          <button className="btn-primary">Create</button>
        </form>
      )}

      {apps.length === 0 ? (
        <EmptyState
          title="No apps yet"
          sub="Create your first app, then drop its API key into the app to start receiving bugs, events, and crashes."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <Link
              key={app.id}
              to={`/apps/${app.id}`}
              className="card group p-5 transition-colors hover:border-accent-dim"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-lg">
                  {app.icon_url ? (
                    <img src={app.icon_url} alt="" className="h-6 w-6" />
                  ) : (
                    app.name.charAt(0)
                  )}
                </div>
                <div>
                  <div className="font-medium">{app.name}</div>
                  <div className="text-xs uppercase tracking-wide text-white/30">
                    {app.platform || "app"}
                  </div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <Metric label="DAU today" value={app.stats.dau_today} />
                <Metric
                  label="Open items"
                  value={app.stats.open_submissions}
                  tone={app.stats.open_submissions > 0 ? "warn" : "default"}
                />
                <Metric label="New 24h" value={app.stats.new_submissions_24h} />
                <Metric
                  label="Crashes 24h"
                  value={app.stats.crashes_24h}
                  tone={app.stats.crashes_24h > 0 ? "danger" : "good"}
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "warn" | "danger" | "good";
}) {
  const cls =
    tone === "danger"
      ? "text-red-400"
      : tone === "warn"
      ? "text-amber-400"
      : tone === "good"
      ? "text-emerald-400/90"
      : "text-white";
  return (
    <div className="rounded-lg bg-black/20 px-3 py-2">
      <div className="text-[11px] uppercase tracking-wide text-white/30">{label}</div>
      <div className={`text-xl font-semibold ${cls}`}>{value}</div>
    </div>
  );
}
