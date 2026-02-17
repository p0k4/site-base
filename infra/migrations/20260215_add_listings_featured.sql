DO $$
BEGIN
  IF to_regclass('public.listings') IS NOT NULL THEN
    ALTER TABLE listings
      ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;

    CREATE INDEX IF NOT EXISTS idx_listings_featured
      ON listings (is_featured)
      WHERE is_featured = true;
  ELSIF to_regclass('public.car_listings') IS NOT NULL THEN
    ALTER TABLE car_listings
      ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;

    CREATE INDEX IF NOT EXISTS idx_listings_featured
      ON car_listings (is_featured)
      WHERE is_featured = true;
  ELSE
    RAISE EXCEPTION 'Neither listings nor car_listings table exists.';
  END IF;
END $$;
