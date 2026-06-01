import { Hono } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import type { Bindings, Variables, AppContext } from "./types";
import { sha256Hex, randomToken, id, nowMs, safeEqual } from "./util";
import { sendMagicLink } from "./email";

const SESSION_COOKIE = "hatch_session";
const LOGIN_TTL_MS = 15 * 60 * 1000; // 15 min
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function allowlist(env: Bindings): string[] {
  return (env.ALLOWED_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function cookieOpts(c: AppContext) {
  const url = new URL(c.req.url);
  const secure = url.protocol === "https:";
  const domain = c.env.COOKIE_DOMAIN?.trim();
  return {
    httpOnly: true,
    secure,
    sameSite: "Lax" as const,
    path: "/",
    ...(domain ? { domain } : {}),
  };
}

export const auth = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Request a magic link.
auth.post("/login", async (c) => {
  let email = "";
  try {
    const body = await c.req.json<{ email?: string }>();
    email = (body.email || "").trim().toLowerCase();
  } catch {
    return c.json({ error: "invalid_body" }, 400);
  }
  if (!email || !email.includes("@")) {
    return c.json({ error: "invalid_email" }, 400);
  }

  // Only send to allowlisted addresses, but always return ok (no enumeration).
  if (allowlist(c.env).includes(email)) {
    const raw = randomToken();
    const tokenHash = await sha256Hex(raw + c.env.SESSION_SECRET);
    const now = nowMs();
    await c.env.DB.prepare(
      `INSERT INTO login_tokens (id, email, token_hash, expires_at, created_at)
       VALUES (?, ?, ?, ?, ?)`
    )
      .bind(id("lt"), email, tokenHash, now + LOGIN_TTL_MS, now)
      .run();

    const origin = new URL(c.req.url).origin;
    const link = `${origin}/auth/verify?token=${encodeURIComponent(raw)}`;
    await sendMagicLink(c.env, email, link);
  }

  return c.json({ ok: true });
});

// Click target from the email: validate token, start a session, redirect.
auth.get("/verify", async (c) => {
  const raw = c.req.query("token") || "";
  const dest = c.env.DASHBOARD_URL || "/";
  if (!raw) return c.redirect(`${dest}/login?error=missing_token`);

  const tokenHash = await sha256Hex(raw + c.env.SESSION_SECRET);
  const now = nowMs();
  const row = await c.env.DB.prepare(
    `SELECT id, email, token_hash, expires_at, used_at
       FROM login_tokens WHERE token_hash = ?`
  )
    .bind(tokenHash)
    .first<{
      id: string;
      email: string;
      token_hash: string;
      expires_at: number;
      used_at: number | null;
    }>();

  if (!row || !safeEqual(row.token_hash, tokenHash) || row.used_at || row.expires_at < now) {
    return c.redirect(`${dest}/login?error=invalid_or_expired`);
  }
  if (!allowlist(c.env).includes(row.email)) {
    return c.redirect(`${dest}/login?error=not_allowed`);
  }

  await c.env.DB.prepare(`UPDATE login_tokens SET used_at = ? WHERE id = ?`)
    .bind(now, row.id)
    .run();

  // Find or create the user.
  let user = await c.env.DB.prepare(`SELECT id FROM users WHERE email = ?`)
    .bind(row.email)
    .first<{ id: string }>();
  if (!user) {
    const userId = id("usr");
    await c.env.DB.prepare(
      `INSERT INTO users (id, email, role, created_at) VALUES (?, ?, 'owner', ?)`
    )
      .bind(userId, row.email, now)
      .run();
    user = { id: userId };
  }

  const sessionId = randomToken(32);
  await c.env.DB.prepare(
    `INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)`
  )
    .bind(sessionId, user.id, now + SESSION_TTL_MS, now)
    .run();

  setCookie(c, SESSION_COOKIE, sessionId, {
    ...cookieOpts(c),
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });

  return c.redirect(dest);
});

auth.post("/logout", async (c) => {
  const sid = getCookie(c, SESSION_COOKIE);
  if (sid) {
    await c.env.DB.prepare(`DELETE FROM sessions WHERE id = ?`).bind(sid).run();
  }
  deleteCookie(c, SESSION_COOKIE, cookieOpts(c));
  return c.json({ ok: true });
});

auth.get("/me", async (c) => {
  const sid = getCookie(c, SESSION_COOKIE);
  if (!sid) return c.json({ user: null }, 200);
  const row = await c.env.DB.prepare(
    `SELECT u.id, u.email, u.name, u.role, s.expires_at
       FROM sessions s JOIN users u ON u.id = s.user_id
      WHERE s.id = ?`
  )
    .bind(sid)
    .first<{ id: string; email: string; name: string | null; role: string; expires_at: number }>();
  if (!row || row.expires_at < nowMs()) return c.json({ user: null }, 200);
  return c.json({ user: { id: row.id, email: row.email, name: row.name, role: row.role } });
});

/** Middleware that gates dashboard routes behind a valid session cookie. */
export async function withSession(c: AppContext, next: () => Promise<void>) {
  const sid = getCookie(c, SESSION_COOKIE);
  if (!sid) return c.json({ error: "unauthenticated" }, 401);
  const row = await c.env.DB.prepare(
    `SELECT u.id AS user_id, u.email, s.expires_at
       FROM sessions s JOIN users u ON u.id = s.user_id
      WHERE s.id = ?`
  )
    .bind(sid)
    .first<{ user_id: string; email: string; expires_at: number }>();
  if (!row || row.expires_at < nowMs()) {
    return c.json({ error: "unauthenticated" }, 401);
  }
  c.set("userId", row.user_id);
  c.set("userEmail", row.email);
  await next();
}
