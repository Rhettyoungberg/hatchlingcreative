import type {
  Analytics,
  ApiKey,
  App,
  AppWithStats,
  CrashEvent,
  CrashGroup,
  Submission,
  SubmissionStatus,
  User,
} from "./types";

const BASE = import.meta.env.VITE_API_BASE || "";

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (res.status === 401) throw new ApiError("unauthenticated", 401);
  if (!res.ok) {
    let msg = `request_failed_${res.status}`;
    try {
      const j = (await res.json()) as { error?: string };
      if (j.error) msg = j.error;
    } catch {
      /* ignore */
    }
    throw new ApiError(msg, res.status);
  }
  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const api = {
  // Auth
  me: () => req<{ user: User | null }>("/auth/me"),
  login: (email: string) =>
    req<{ ok: boolean }>("/auth/login", { method: "POST", body: JSON.stringify({ email }) }),
  logout: () => req<{ ok: boolean }>("/auth/logout", { method: "POST" }),

  // Apps
  overview: () => req<{ apps: AppWithStats[] }>("/dashboard/overview"),
  apps: () => req<{ apps: App[] }>("/dashboard/apps"),
  app: (id: string) => req<{ app: App }>(`/dashboard/apps/${id}`),
  createApp: (body: { name: string; platform?: string; icon_url?: string }) =>
    req<{ app: App }>("/dashboard/apps", { method: "POST", body: JSON.stringify(body) }),
  updateApp: (
    id: string,
    body: Partial<Pick<App, "name" | "platform" | "icon_url" | "appstore_sku" | "appstore_app_id">>
  ) => req<{ app: App }>(`/dashboard/apps/${id}`, { method: "PATCH", body: JSON.stringify(body) }),

  // App Store Connect
  ascStatus: () => req<{ configured: boolean }>("/dashboard/asc/status"),
  ascSync: () =>
    req<{ ok: boolean; updated: number; day: string; notes: string[]; error?: string }>(
      "/dashboard/asc/sync",
      { method: "POST", body: "{}" }
    ),

  // Keys
  keys: (appId: string) => req<{ keys: ApiKey[] }>(`/dashboard/apps/${appId}/keys`),
  createKey: (appId: string, label?: string) =>
    req<{ id: string; key: string; key_prefix: string }>(`/dashboard/apps/${appId}/keys`, {
      method: "POST",
      body: JSON.stringify({ label }),
    }),
  revokeKey: (keyId: string) =>
    req<{ ok: boolean }>(`/dashboard/keys/${keyId}`, { method: "DELETE" }),

  // Submissions
  submissions: (appId: string, q: { status?: string; type?: string } = {}) => {
    const params = new URLSearchParams();
    if (q.status) params.set("status", q.status);
    if (q.type) params.set("type", q.type);
    const qs = params.toString();
    return req<{ submissions: Submission[] }>(
      `/dashboard/apps/${appId}/submissions${qs ? `?${qs}` : ""}`
    );
  },
  updateSubmission: (id: string, body: { status?: SubmissionStatus; notes?: string }) =>
    req<{ submission: Submission }>(`/dashboard/submissions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  // Crashes
  crashes: (appId: string) => req<{ groups: CrashGroup[] }>(`/dashboard/apps/${appId}/crashes`),
  crashEvents: (appId: string, fingerprint: string) =>
    req<{ events: CrashEvent[] }>(`/dashboard/apps/${appId}/crashes/${fingerprint}`),

  // Analytics
  analytics: (appId: string, range: "7d" | "30d" | "90d") =>
    req<Analytics>(`/dashboard/apps/${appId}/analytics?range=${range}`),
};
