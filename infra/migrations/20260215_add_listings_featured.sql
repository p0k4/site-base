ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_listings_featured
  ON listings (is_featured)
  WHERE is_featured = true;
