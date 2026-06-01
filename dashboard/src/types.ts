export type User = { id: string; email: string; name: string | null; role: string };

export type App = {
  id: string;
  name: string;
  slug: string;
  platform: string | null;
  icon_url: string | null;
  appstore_sku: string | null;
  appstore_app_id: string | null;
  created_at: number;
};

export type AppStoreMetric = {
  day: string;
  downloads: number | null;
  revenue: number | null;
  rating_avg: number | null;
  rating_count: number | null;
  impressions: number | null;
  product_page_views: number | null;
};

export type AppWithStats = App & {
  stats: {
    dau_today: number;
    new_submissions_24h: number;
    crashes_24h: number;
    open_submissions: number;
  };
};

export type SubmissionStatus = "new" | "triaged" | "in_progress" | "done" | "wont_fix";

export type Submission = {
  id: string;
  app_id: string;
  type: "bug" | "feature";
  title: string;
  body: string | null;
  severity: string | null;
  status: SubmissionStatus;
  app_version: string | null;
  platform: string | null;
  device: string | null;
  reporter_contact: string | null;
  notes: string | null;
  created_at: number;
  updated_at: number;
};

export type CrashGroup = {
  fingerprint: string;
  count: number;
  last_seen: number;
  first_seen: number;
  affected_users: number;
  message: string;
  app_version: string | null;
};

export type CrashEvent = {
  id: string;
  fingerprint: string;
  message: string;
  stack: string | null;
  app_version: string | null;
  os: string | null;
  device: string | null;
  distinct_id: string | null;
  ts: number;
};

export type ApiKey = {
  id: string;
  app_id: string;
  key_prefix: string;
  label: string | null;
  last_used_at: number | null;
  revoked: number;
  created_at: number;
};

export type Analytics = {
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
  appstore?: AppStoreMetric[];
};
