import type { Context } from "hono";

export type Bindings = {
  DB: D1Database;
  SESSION_SECRET: string;
  RESEND_API_KEY?: string;
  RESEND_FROM: string;
  DASHBOARD_URL: string;
  ALLOWED_EMAILS: string;
  COOKIE_DOMAIN: string;
  ENVIRONMENT: string;
  // App Store Connect (all optional — integration is skipped if unset).
  ASC_KEY_ID?: string; // vars
  ASC_ISSUER_ID?: string; // vars
  ASC_VENDOR_NUMBER?: string; // vars
  ASC_PRIVATE_KEY?: string; // secret — the .p8 PEM contents
};

export type Variables = {
  // Set by withApiKey middleware on ingest routes.
  appId: string;
  apiKeyId: string;
  // Set by withSession middleware on dashboard routes.
  userId: string;
  userEmail: string;
};

export type AppContext = Context<{ Bindings: Bindings; Variables: Variables }>;
