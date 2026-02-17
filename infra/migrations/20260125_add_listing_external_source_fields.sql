DO $$
BEGIN
  IF to_regclass('public.listings') IS NOT NULL THEN
    ALTER TABLE listings
      ADD COLUMN IF NOT EXISTS source_type TEXT NOT NULL DEFAULT 'internal',
      ADD COLUMN IF NOT EXISTS source_name TEXT,
      ADD COLUMN IF NOT EXISTS external_url TEXT,
      ADD COLUMN IF NOT EXISTS external_ref TEXT;

    CREATE INDEX IF NOT EXISTS idx_listings_external_url ON listings(external_url);
  ELSIF to_regclass('public.car_listings') IS NOT NULL THEN
    ALTER TABLE car_listings
      ADD COLUMN IF NOT EXISTS source_type TEXT NOT NULL DEFAULT 'internal',
      ADD COLUMN IF NOT EXISTS source_name TEXT,
      ADD COLUMN IF NOT EXISTS external_url TEXT,
      ADD COLUMN IF NOT EXISTS external_ref TEXT;

    CREATE INDEX IF NOT EXISTS idx_listings_external_url ON car_listings(external_url);
  ELSE
    RAISE EXCEPTION 'Neither listings nor car_listings table exists.';
  END IF;
END $$;
