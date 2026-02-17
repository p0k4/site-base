ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS source_type TEXT NOT NULL DEFAULT 'internal',
  ADD COLUMN IF NOT EXISTS source_name TEXT,
  ADD COLUMN IF NOT EXISTS external_url TEXT,
  ADD COLUMN IF NOT EXISTS external_ref TEXT;

CREATE INDEX IF NOT EXISTS idx_listings_external_url ON listings(external_url);
