import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import type { App } from "../types";
import { Spinner } from "../ui";
import AnalyticsTab from "./tabs/AnalyticsTab";
import SubmissionsTab from "./tabs/SubmissionsTab";
import CrashesTab from "./tabs/CrashesTab";
import SettingsTab from "./tabs/SettingsTab";

type TabKey = "analytics" | "submissions" | "crashes" | "settings";

const TABS: { key: TabKey; label: string }[] = [
  { key: "analytics", label: "Analytics" },
  { key: "submissions", label: "Bugs & Features" },
  { key: "crashes", label: "Crashes" },
  { key: "settings", label: "Settings" },
];

export default function AppDetail() {
  const { appId = "" } = useParams();
  const [app, setApp] = useState<App | null>(null);
  const [tab, setTab] = useState<TabKey>("analytics");

  useEffect(() => {
    api.app(appId).then(({ app }) => setApp(app));
  }, [appId]);

  if (!app) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/5 text-2xl">
          {app.icon_url ? <img src={app.icon_url} alt="" className="h-7 w-7" /> : app.name.charAt(0)}
        </div>
        <div>
          <h1 className="font-serif text-3xl">{app.name}</h1>
          <div className="text-xs uppercase tracking-wide text-white/30">
            {app.platform || "app"} · {app.slug}
          </div>
        </div>
      </div>

      <div className="flex gap-1 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative px-4 py-2.5 text-sm transition-colors ${
              tab === t.key ? "text-white" : "text-white/40 hover:text-white/70"
            }`}
          >
            {t.label}
            {tab === t.key && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-accent-indigo to-accent-violet" />
            )}
          </button>
        ))}
      </div>

      {tab === "analytics" && <AnalyticsTab appId={appId} />}
      {tab === "submissions" && <SubmissionsTab appId={appId} />}
      {tab === "crashes" && <CrashesTab appId={appId} />}
      {tab === "settings" && <SettingsTab app={app} onUpdated={setApp} />}
    </div>
  );
}
