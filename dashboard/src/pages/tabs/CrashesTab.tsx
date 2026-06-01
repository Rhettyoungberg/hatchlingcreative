import { useEffect, useState } from "react";
import { api } from "../../api";
import type { CrashEvent, CrashGroup } from "../../types";
import { Spinner, EmptyState, relativeTime } from "../../ui";

export default function CrashesTab({ appId }: { appId: string }) {
  const [groups, setGroups] = useState<CrashGroup[] | null>(null);
  const [open, setOpen] = useState<CrashGroup | null>(null);
  const [events, setEvents] = useState<CrashEvent[] | null>(null);

  useEffect(() => {
    setGroups(null);
    api.crashes(appId).then(({ groups }) => setGroups(groups));
  }, [appId]);

  async function openGroup(g: CrashGroup) {
    setOpen(g);
    setEvents(null);
    const { events } = await api.crashEvents(appId, g.fingerprint);
    setEvents(events);
  }

  if (!groups) return <Spinner />;
  if (groups.length === 0)
    return (
      <EmptyState
        title="No crashes reported 🎉"
        sub="Crash and error reports sent from the app are grouped here by signature."
      />
    );

  return (
    <div className="space-y-3">
      <div className="card divide-y divide-line">
        {groups.map((g) => (
          <button
            key={g.fingerprint}
            onClick={() => openGroup(g)}
            className="flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-white/5"
          >
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-red-500/10 text-red-400">
              ⚠
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-mono text-sm text-white/80">{g.message}</div>
              <div className="text-xs text-white/40">
                {g.app_version ? `v${g.app_version} · ` : ""}last seen {relativeTime(g.last_seen)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-red-400">{g.count}</div>
              <div className="text-[11px] text-white/30">{g.affected_users} users</div>
            </div>
          </button>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-30 flex justify-end bg-black/50" onClick={() => setOpen(null)}>
          <div
            className="h-full w-full max-w-2xl overflow-y-auto border-l border-line bg-panel p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <h2 className="font-mono text-lg text-red-300">{open.message}</h2>
              <button onClick={() => setOpen(null)} className="text-white/40 hover:text-white">
                ✕
              </button>
            </div>
            <div className="mb-4 flex gap-6 text-sm">
              <span>
                <span className="text-white/40">Occurrences: </span>
                {open.count}
              </span>
              <span>
                <span className="text-white/40">Users: </span>
                {open.affected_users}
              </span>
              <span>
                <span className="text-white/40">First seen: </span>
                {relativeTime(open.first_seen)}
              </span>
            </div>
            {!events ? (
              <Spinner />
            ) : (
              <div className="space-y-4">
                {events.map((e) => (
                  <div key={e.id} className="card p-4">
                    <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/40">
                      <span>{new Date(e.ts).toLocaleString()}</span>
                      {e.app_version && <span>v{e.app_version}</span>}
                      {e.os && <span>{e.os}</span>}
                      {e.device && <span>{e.device}</span>}
                    </div>
                    {e.stack && (
                      <pre className="overflow-x-auto rounded-lg bg-black/40 p-3 text-xs text-white/70">
                        {e.stack}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
