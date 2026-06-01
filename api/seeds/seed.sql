-- Dev/seed data. Safe to re-run (INSERT OR IGNORE).
-- Timestamps in ms.

-- Owner (dashboard login allowlist is also driven by the ALLOWED_EMAILS var).
INSERT OR IGNORE INTO users (id, email, name, role, created_at)
VALUES ('usr_owner', 'rhett@hatchlingcreative.com', 'Rhett Youngberg', 'owner',
        CAST(strftime('%s','now') AS INTEGER) * 1000);

-- Two starter apps.
INSERT OR IGNORE INTO apps (id, name, slug, platform, icon_url, created_at) VALUES
  ('app_echocast', 'EchoCast', 'echocast', 'ios', '/echocast-icon.svg',
   CAST(strftime('%s','now') AS INTEGER) * 1000),
  ('app_movebreak', 'MoveBreak', 'movebreak', 'ios', NULL,
   CAST(strftime('%s','now') AS INTEGER) * 1000);

-- Dev API keys (plaintext shown here is for LOCAL testing only):
--   EchoCast  : hk_dev_echocast_0000000000000000
--   MoveBreak : hk_dev_movebreak_0000000000000000
-- Stored as SHA-256 hashes. Revoke/replace these from the dashboard for production.
INSERT OR IGNORE INTO api_keys (id, app_id, key_hash, key_prefix, label, revoked, created_at) VALUES
  ('key_echocast_dev', 'app_echocast',
   'ebbdb88c3263f25004542e24c0b35956b6837b9d11ca9705f0930ef634cdcb6f',
   'hk_dev_echocast', 'Local dev key', 0,
   CAST(strftime('%s','now') AS INTEGER) * 1000),
  ('key_movebreak_dev', 'app_movebreak',
   '597d403b70a659229cb25715225a6a3a4428f7547adaf40d9a9fbe6ad8c6ddd5',
   'hk_dev_movebreak', 'Local dev key', 0,
   CAST(strftime('%s','now') AS INTEGER) * 1000);
