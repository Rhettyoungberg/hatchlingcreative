import type { ReactNode } from "react";
import type { SubmissionStatus } from "./types";

export function relativeTime(ms: number): string {
  const diff = Date.now() - ms;
  const s = Math.floor(diff / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(ms).toLocaleDateString();
}

export function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "default" | "warn" | "danger" | "good";
}) {
  const toneClass =
    tone === "danger"
      ? "text-red-400"
      : tone === "warn"
      ? "text-amber-400"
      : tone === "good"
      ? "text-emerald-400"
      : "text-white";
  return (
    <div className="card p-5">
      <div className="text-xs uppercase tracking-wide text-white/40">{label}</div>
      <div className={`mt-2 text-3xl font-semibold ${toneClass}`}>{value}</div>
      {hint && <div className="mt-1 text-xs text-white/40">{hint}</div>}
    </div>
  );
}

const STATUS_STYLE: Record<SubmissionStatus, string> = {
  new: "bg-accent-indigo/15 text-accent-indigo",
  triaged: "bg-accent-violet/15 text-accent-violet",
  in_progress: "bg-amber-400/15 text-amber-300",
  done: "bg-emerald-400/15 text-emerald-300",
  wont_fix: "bg-white/10 text-white/50",
};

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  new: "New",
  triaged: "Triaged",
  in_progress: "In progress",
  done: "Done",
  wont_fix: "Won't fix",
};

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  return (
    <span className={`label-chip ${STATUS_STYLE[status]}`}>{STATUS_LABEL[status]}</span>
  );
}

export const STATUS_OPTIONS: SubmissionStatus[] = [
  "new",
  "triaged",
  "in_progress",
  "done",
  "wont_fix",
];

export function statusLabel(s: SubmissionStatus) {
  return STATUS_LABEL[s];
}

export function TypeBadge({ type }: { type: "bug" | "feature" }) {
  return (
    <span
      className={`label-chip ${
        type === "bug" ? "bg-red-400/15 text-red-300" : "bg-sky-400/15 text-sky-300"
      }`}
    >
      {type === "bug" ? "🐞 Bug" : "✨ Feature"}
    </span>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-20 text-white/40">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-accent-indigo" />
    </div>
  );
}

export function EmptyState({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="card flex flex-col items-center gap-2 px-6 py-16 text-center">
      <div className="text-lg font-medium text-white/70">{title}</div>
      {sub && <div className="max-w-sm text-sm text-white/40">{sub}</div>}
    </div>
  );
}
