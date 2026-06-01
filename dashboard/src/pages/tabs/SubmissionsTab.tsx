import { useEffect, useState } from "react";
import { api } from "../../api";
import type { Submission, SubmissionStatus } from "../../types";
import {
  Spinner,
  EmptyState,
  StatusBadge,
  TypeBadge,
  STATUS_OPTIONS,
  statusLabel,
  relativeTime,
} from "../../ui";

export default function SubmissionsTab({ appId }: { appId: string }) {
  const [subs, setSubs] = useState<Submission[] | null>(null);
  const [typeFilter, setTypeFilter] = useState<"" | "bug" | "feature">("");
  const [statusFilter, setStatusFilter] = useState<"" | SubmissionStatus>("");
  const [selected, setSelected] = useState<Submission | null>(null);

  async function load() {
    const { submissions } = await api.submissions(appId, {
      type: typeFilter || undefined,
      status: statusFilter || undefined,
    });
    setSubs(submissions);
  }
  useEffect(() => {
    setSubs(null);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId, typeFilter, statusFilter]);

  async function setStatus(s: Submission, status: SubmissionStatus) {
    const { submission } = await api.updateSubmission(s.id, { status });
    setSubs((cur) => cur?.map((x) => (x.id === s.id ? submission : x)) ?? null);
    setSelected((cur) => (cur?.id === s.id ? submission : cur));
  }

  async function saveNotes(s: Submission, notes: string) {
    const { submission } = await api.updateSubmission(s.id, { notes });
    setSubs((cur) => cur?.map((x) => (x.id === s.id ? submission : x)) ?? null);
    setSelected(submission);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <FilterChip active={typeFilter === ""} onClick={() => setTypeFilter("")}>
          All types
        </FilterChip>
        <FilterChip active={typeFilter === "bug"} onClick={() => setTypeFilter("bug")}>
          🐞 Bugs
        </FilterChip>
        <FilterChip active={typeFilter === "feature"} onClick={() => setTypeFilter("feature")}>
          ✨ Features
        </FilterChip>
        <span className="mx-1 h-4 w-px bg-line" />
        <select
          className="input max-w-[160px]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
        >
          <option value="">Any status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {statusLabel(s)}
            </option>
          ))}
        </select>
      </div>

      {!subs ? (
        <Spinner />
      ) : subs.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          sub="Bug reports and feature requests submitted from the app land in this inbox."
        />
      ) : (
        <div className="card divide-y divide-line">
          {subs.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelected(s)}
              className="flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-white/5"
            >
              <TypeBadge type={s.type} />
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{s.title}</div>
                <div className="truncate text-xs text-white/40">
                  {s.app_version ? `v${s.app_version} · ` : ""}
                  {s.platform || ""} {s.device ? `· ${s.device}` : ""} · {relativeTime(s.created_at)}
                </div>
              </div>
              {s.severity && (
                <span className="hidden text-xs text-white/40 sm:inline">{s.severity}</span>
              )}
              <StatusBadge status={s.status} />
            </button>
          ))}
        </div>
      )}

      {selected && (
        <Drawer
          submission={selected}
          onClose={() => setSelected(null)}
          onStatus={(st) => setStatus(selected, st)}
          onSaveNotes={(n) => saveNotes(selected, n)}
        />
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`label-chip cursor-pointer ${
        active ? "bg-accent-indigo/20 text-accent-indigo" : "bg-white/5 text-white/50"
      }`}
    >
      {children}
    </button>
  );
}

function Drawer({
  submission,
  onClose,
  onStatus,
  onSaveNotes,
}: {
  submission: Submission;
  onClose: () => void;
  onStatus: (s: SubmissionStatus) => void;
  onSaveNotes: (notes: string) => void;
}) {
  const [notes, setNotes] = useState(submission.notes || "");
  useEffect(() => setNotes(submission.notes || ""), [submission.id, submission.notes]);

  return (
    <div className="fixed inset-0 z-30 flex justify-end bg-black/50" onClick={onClose}>
      <div
        className="h-full w-full max-w-md overflow-y-auto border-l border-line bg-panel p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <TypeBadge type={submission.type} />
            <StatusBadge status={submission.status} />
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            ✕
          </button>
        </div>
        <h2 className="text-xl font-medium">{submission.title}</h2>
        <div className="mt-1 text-xs text-white/40">
          {new Date(submission.created_at).toLocaleString()}
        </div>

        {submission.body && (
          <p className="mt-4 whitespace-pre-wrap text-sm text-white/70">{submission.body}</p>
        )}

        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <Meta label="Severity" value={submission.severity} />
          <Meta label="Version" value={submission.app_version} />
          <Meta label="Platform" value={submission.platform} />
          <Meta label="Device" value={submission.device} />
          <Meta label="Reporter" value={submission.reporter_contact} full />
        </dl>

        <div className="mt-6">
          <div className="mb-2 text-xs uppercase tracking-wide text-white/40">Status</div>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => onStatus(s)}
                className={`label-chip cursor-pointer ${
                  submission.status === s
                    ? "bg-accent-indigo/25 text-accent-indigo"
                    : "bg-white/5 text-white/50 hover:bg-white/10"
                }`}
              >
                {statusLabel(s)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 text-xs uppercase tracking-wide text-white/40">Internal notes</div>
          <textarea
            className="input min-h-[100px]"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add private notes for your team…"
          />
          <button
            className="btn-primary mt-2"
            disabled={notes === (submission.notes || "")}
            onClick={() => onSaveNotes(notes)}
          >
            Save notes
          </button>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value, full }: { label: string; value: string | null; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <dt className="text-[11px] uppercase tracking-wide text-white/30">{label}</dt>
      <dd className="text-white/70">{value || "—"}</dd>
    </div>
  );
}
