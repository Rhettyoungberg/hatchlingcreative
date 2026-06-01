-- Hatchling app platform — initial schema (Cloudflare D1 / SQLite)

-- People who can log into the dashboard (allowlist).
CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY,
  email       TEXT NOT NULL UNIQUE,
  name        TEXT,
  role        TEXT NOT NULL DEFAULT 'owner',
  created_at  INTEGER NOT NULL
);

-- Magic-link login tokens (single use, short lived). We store only a hash.
CREATE TABLE IF NOT EXISTS login_tokens (
  id          TEXT PRIMARY KEY,
  email       TEXT NOT NULL,
  token_hash  TEXT NOT NULL,
  expires_at  INTEGER NOT NULL,
  used_at     INTEGER,
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_login_tokens_hash ON login_tokens(token_hash);

-- Active dashboard sessions. The session id lives in an HttpOnly cookie.
CREATE TABLE IF NOT EXISTS sessions (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL,
  expires_at  INTEGER NOT NULL,
  created_at  INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

-- The apps Hatchling is building / monitoring.
CREATE TABLE IF NOT EXISTS apps (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  platform    TEXT,                       -- ios | android | web | macos | ...
  icon_url    TEXT,
  created_at  INTEGER NOT NULL
);

-- Per-app API keys. Apps authenticate ingest calls with a bearer key.
-- Only a hash is stored; the plaintext key is shown once at creation.
CREATE TABLE IF NOT EXISTS api_keys (
  id            TEXT PRIMARY KEY,
  app_id        TEXT NOT NULL,
  key_hash      TEXT NOT NULL UNIQUE,
  key_prefix    TEXT NOT NULL,            -- first chars, for display (e.g. hk_live_ab12…)
  label         TEXT,
  last_used_at  INTEGER,
  revoked       INTEGER NOT NULL DEFAULT 0,
  created_at    INTEGER NOT NULL,
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_app ON api_keys(app_id);

-- Usage analytics events.
CREATE TABLE IF NOT EXISTS events (
  id           TEXT PRIMARY KEY,
  app_id       TEXT NOT NULL,
  name         TEXT NOT NULL,
  distinct_id  TEXT,                      -- pseudonymous user/device id
  session_id   TEXT,
  props_json   TEXT,
  ts           INTEGER NOT NULL,          -- event time (ms)
  day          TEXT NOT NULL,             -- YYYY-MM-DD (UTC) for cheap rollups
  ingested_at  INTEGER NOT NULL,
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_events_app_day ON events(app_id, day);
CREATE INDEX IF NOT EXISTS idx_events_app_ts ON events(app_id, ts);

-- Bug reports & feature requests submitted from apps.
CREATE TABLE IF NOT EXISTS submissions (
  id               TEXT PRIMARY KEY,
  app_id           TEXT NOT NULL,
  type             TEXT NOT NULL,         -- bug | feature
  title            TEXT NOT NULL,
  body             TEXT,
  severity         TEXT,                  -- low | medium | high | critical
  status           TEXT NOT NULL DEFAULT 'new', -- new|triaged|in_progress|done|wont_fix
  app_version      TEXT,
  platform         TEXT,
  device           TEXT,
  reporter_contact TEXT,
  notes            TEXT,                  -- internal notes from the dashboard
  created_at       INTEGER NOT NULL,
  updated_at       INTEGER NOT NULL,
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_submissions_app ON submissions(app_id, status);
CREATE INDEX IF NOT EXISTS idx_submissions_created ON submissions(app_id, created_at);

-- Crash / error reports. Grouped by fingerprint.
CREATE TABLE IF NOT EXISTS crashes (
  id           TEXT PRIMARY KEY,
  app_id       TEXT NOT NULL,
  fingerprint  TEXT NOT NULL,             -- hash of message + top of stack
  message      TEXT NOT NULL,
  stack        TEXT,
  app_version  TEXT,
  os           TEXT,
  device       TEXT,
  distinct_id  TEXT,
  ts           INTEGER NOT NULL,
  day          TEXT NOT NULL,
  ingested_at  INTEGER NOT NULL,
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_crashes_app_fp ON crashes(app_id, fingerprint);
CREATE INDEX IF NOT EXISTS idx_crashes_app_day ON crashes(app_id, day);

-- Precomputed daily metrics (written by the nightly Cron worker) so the
-- dashboard reads a tiny table instead of scanning raw events every load.
CREATE TABLE IF NOT EXISTS daily_rollups (
  app_id           TEXT NOT NULL,
  day              TEXT NOT NULL,         -- YYYY-MM-DD
  dau              INTEGER NOT NULL DEFAULT 0,
  sessions         INTEGER NOT NULL DEFAULT 0,
  events_count     INTEGER NOT NULL DEFAULT 0,
  new_submissions  INTEGER NOT NULL DEFAULT 0,
  crashes          INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (app_id, day),
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE
);

-- App Store Connect metrics (Phase 4 — populated by a scheduled puller).
CREATE TABLE IF NOT EXISTS appstore_metrics (
  app_id        TEXT NOT NULL,
  day           TEXT NOT NULL,
  downloads     INTEGER,
  rating_avg    REAL,
  rating_count  INTEGER,
  revenue       REAL,
  PRIMARY KEY (app_id, day),
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE
);
