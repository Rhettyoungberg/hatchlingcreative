-- Fledgeling pipeline tracking on the existing Hatchling dashboard (D1 / SQLite).
-- Adds: app lifecycle/run mirror + a run queue the local `fledged` daemon drains.
-- Apply with:  wrangler d1 migrations apply <DB>  (after copying into api/migrations/).

-- The apps table already exists (id, name, slug, platform, …). Add the pipeline mirror columns.
ALTER TABLE apps ADD COLUMN lifecycle           TEXT;     -- incubating | live | sunset | shelved | killed
ALTER TABLE apps ADD COLUMN active_run_id        TEXT;
ALTER TABLE apps ADD COLUMN pipeline_updated_at  INTEGER;  -- ms; from state.updatedAt

-- One row per pipeline run (the app run + each feature run). Mirror of state.json runs[].
CREATE TABLE IF NOT EXISTS pipeline_runs (
  app_id        TEXT NOT NULL,
  run_id        TEXT NOT NULL,
  kind          TEXT NOT NULL,            -- app | feature
  title         TEXT,
  stage         TEXT NOT NULL,            -- ideation … beta … monitor
  stage_status  TEXT NOT NULL,            -- not_started | in_progress | blocked | done
  blocked_on    TEXT,
  merged_at     INTEGER,
  updated_at    INTEGER NOT NULL,
  PRIMARY KEY (app_id, run_id),
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_app ON pipeline_runs(app_id);

-- The run queue. The dashboard enqueues; `fledged` claims (lease), executes, reports back.
CREATE TABLE IF NOT EXISTS pipeline_jobs (
  id           TEXT PRIMARY KEY,
  app_slug     TEXT NOT NULL,
  command      TEXT NOT NULL,             -- run | advance
  run_id       TEXT,                      -- target run (NULL = active run)
  stage        TEXT,                      -- informational snapshot at enqueue time
  status       TEXT NOT NULL DEFAULT 'queued', -- queued | running | done | error
  host         TEXT,                      -- which machine claimed it
  lease_at     INTEGER,                   -- ms; running claims expire after the lease window
  result       TEXT,                      -- ok | error
  log          TEXT,                      -- tail of the run output
  created_at   INTEGER NOT NULL,
  finished_at  INTEGER
);
CREATE INDEX IF NOT EXISTS idx_pipeline_jobs_status ON pipeline_jobs(status, created_at);
CREATE INDEX IF NOT EXISTS idx_pipeline_jobs_slug ON pipeline_jobs(app_slug, created_at);
