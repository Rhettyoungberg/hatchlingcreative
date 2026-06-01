import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "../../api";
import type { Analytics, AppStoreMetric } from "../../types";
import { Spinner, StatCard, EmptyState } from "../../ui";

type Range = "7d" | "30d" | "90d";

export default function AnalyticsTab({ appId }: { appId: string }) {
  const [range, setRange] = useState<Range>("30d");
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    setData(null);
    api.analytics(appId, range).then(setData);
  }, [appId, range]);

  if (!data) return <Spinner />;

  const hasData = data.totals.events > 0 || data.active_users.mau > 0;
  const fmtDay = (d: string) => d.slice(5); // MM-DD

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-1">
        {(["7d", "30d", "90d"] as Range[]).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`label-chip cursor-pointer ${
              range === r ? "bg-accent-indigo/20 text-accent-indigo" : "bg-white/5 text-white/50"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="DAU (today)" value={data.active_users.dau} />
        <StatCard label="WAU (7d)" value={data.active_users.wau} />
        <StatCard label="MAU (30d)" value={data.active_users.mau} />
        <StatCard label={`Events (${range})`} value={data.totals.events.toLocaleString()} />
      </div>

      <AppStoreRow appstore={data.appstore} range={range} />

      {!hasData ? (
        <EmptyState
          title="No usage analytics yet"
          sub="Once your app starts sending events, daily active users, sessions, and top events will appear here."
        />
      ) : (
        <>
          <div className="card p-5">
            <div className="mb-4 text-sm font-medium text-white/70">Daily active users</div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={data.series} margin={{ left: -20, right: 8 }}>
                <defs>
                  <linearGradient id="dau" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="day" tickFormatter={fmtDay} stroke="rgba(255,255,255,0.3)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} allowDecimals={false} />
                <Tooltip content={<ChartTip />} />
                <Area type="monotone" dataKey="dau" stroke="#818cf8" strokeWidth={2} fill="url(#dau)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="card p-5">
              <div className="mb-4 text-sm font-medium text-white/70">Sessions</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.series} margin={{ left: -20, right: 8 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="day" tickFormatter={fmtDay} stroke="rgba(255,255,255,0.3)" fontSize={11} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} allowDecimals={false} />
                  <Tooltip content={<ChartTip />} />
                  <Bar dataKey="sessions" fill="#c084fc" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card p-5">
              <div className="mb-4 text-sm font-medium text-white/70">Top events ({range})</div>
              {data.top_events.length === 0 ? (
                <div className="py-10 text-center text-sm text-white/30">No events yet</div>
              ) : (
                <div className="space-y-2">
                  {data.top_events.map((e) => {
                    const max = data.top_events[0].count || 1;
                    return (
                      <div key={e.name} className="flex items-center gap-3">
                        <div className="w-40 truncate text-sm text-white/70">{e.name}</div>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-accent-indigo to-accent-violet"
                            style={{ width: `${(e.count / max) * 100}%` }}
                          />
                        </div>
                        <div className="w-12 text-right text-sm tabular-nums text-white/50">
                          {e.count}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AppStoreRow({ appstore, range }: { appstore: AppStoreMetric[] | undefined; range: Range }) {
  const rows = appstore ?? [];
  const downloads = rows.reduce((a, r) => a + (r.downloads ?? 0), 0);
  const revenue = rows.reduce((a, r) => a + (r.revenue ?? 0), 0);
  const latestRating = [...rows].reverse().find((r) => r.rating_avg != null);

  return (
    <div className="card p-5">
      <div className="mb-3 text-sm font-medium text-white/70"> App Store</div>
      {rows.length === 0 ? (
        <p className="text-sm text-white/40">
          No App Store data yet. Add this app's SKU + Apple ID under{" "}
          <span className="text-white/60">Settings → App Store Connect</span> and configure
          credentials; metrics appear here once the app is live and the daily sync runs.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label={`Downloads (${range})`} value={downloads.toLocaleString()} />
          <StatCard label={`Revenue (${range})`} value={`$${revenue.toFixed(2)}`} tone="good" />
          <StatCard
            label="Rating"
            value={latestRating?.rating_avg ? `★ ${latestRating.rating_avg.toFixed(2)}` : "—"}
            hint={latestRating?.rating_count ? `${latestRating.rating_count} ratings` : undefined}
          />
        </div>
      )}
    </div>
  );
}

function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-line bg-void/95 px-3 py-2 text-xs shadow-xl">
      <div className="mb-1 text-white/40">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="text-white/80">
          {p.dataKey}: <span className="font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  );
}
