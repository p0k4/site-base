DO $$
BEGIN
  IF to_regclass('public.car_listings') IS NOT NULL
     AND to_regclass('public.listings') IS NULL THEN
    ALTER TABLE car_listings RENAME TO listings;
  END IF;
END $$;
