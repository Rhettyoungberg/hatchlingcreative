-- App Store Connect integration: per-app mapping + extra metric columns.

-- Map a Hatchling app to its App Store identity.
--   appstore_sku    : the SKU used in Sales & Trends reports (matches report rows)
--   appstore_app_id : the numeric Apple ID (for customerReviews / analytics endpoints)
ALTER TABLE apps ADD COLUMN appstore_sku TEXT;
ALTER TABLE apps ADD COLUMN appstore_app_id TEXT;

-- appstore_metrics already exists (app_id, day, downloads, rating_avg, rating_count,
-- revenue). Add columns for the Analytics Reports API + a write timestamp.
ALTER TABLE appstore_metrics ADD COLUMN impressions INTEGER;
ALTER TABLE appstore_metrics ADD COLUMN product_page_views INTEGER;
ALTER TABLE appstore_metrics ADD COLUMN updated_at INTEGER;
