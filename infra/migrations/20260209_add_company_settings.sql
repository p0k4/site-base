CREATE TABLE IF NOT EXISTS app_company_settings (
  id INT PRIMARY KEY DEFAULT 1,
  company_name TEXT,
  nif TEXT,
  address TEXT,
  social_area TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO app_company_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;
