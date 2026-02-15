ALTER TABLE car_listings
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_listings_featured
  ON car_listings (is_featured)
  WHERE is_featured = true;
