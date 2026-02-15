import { db } from "../config/db";

export type CompanySettingsRecord = {
  company_name: string | null;
  nif: string | null;
  address: string | null;
  social_area: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  logo_path: string | null;
  updated_at: string;
};

export class MissingCompanySettingsTableError extends Error {
  code = "42P01";

  constructor() {
    super("Missing table app_company_settings. Run migrations/init scripts.");
    this.name = "MissingCompanySettingsTableError";
  }
}

const ensureRow = async () => {
  try {
    await db.query(
      `
      CREATE TABLE IF NOT EXISTS app_company_settings (
        id INT PRIMARY KEY DEFAULT 1,
        company_name TEXT,
        nif TEXT,
        address TEXT,
        social_area TEXT,
        phone TEXT,
        email TEXT,
        logo_url TEXT,
        logo_path TEXT,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
      `
    );
    await db.query("INSERT INTO app_company_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING");
  } catch (error: any) {
    if (error?.code === "42P01") {
      throw new MissingCompanySettingsTableError();
    }
    throw error;
  }
};

export const getCompanySettings = async () => {
  await ensureRow();
  const result = await db.query<CompanySettingsRecord>(
    "SELECT company_name, nif, address, social_area, phone, email, logo_url, logo_path, updated_at FROM app_company_settings WHERE id = 1"
  );
  return result.rows[0];
};

export const updateCompanySettings = async (payload: {
  companyName?: string | null;
  nif?: string | null;
  address?: string | null;
  socialArea?: string | null;
  phone?: string | null;
  email?: string | null;
  logoUrl?: string | null;
}) => {
  const current = await getCompanySettings();
  const next = {
    companyName: payload.companyName ?? current.company_name,
    nif: payload.nif ?? current.nif,
    address: payload.address ?? current.address,
    socialArea: payload.socialArea ?? current.social_area,
    phone: payload.phone ?? current.phone,
    email: payload.email ?? current.email,
    logoUrl: payload.logoUrl ?? current.logo_url
  };

  const result = await db.query<CompanySettingsRecord>(
    `
    INSERT INTO app_company_settings (id, company_name, nif, address, social_area, phone, email, logo_url)
    VALUES (1, $1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (id)
    DO UPDATE SET
      company_name = EXCLUDED.company_name,
      nif = EXCLUDED.nif,
      address = EXCLUDED.address,
      social_area = EXCLUDED.social_area,
      phone = EXCLUDED.phone,
      email = EXCLUDED.email,
      logo_url = EXCLUDED.logo_url,
      updated_at = NOW()
    RETURNING company_name, nif, address, social_area, phone, email, logo_url, logo_path, updated_at
    `,
    [
      next.companyName,
      next.nif,
      next.address,
      next.socialArea,
      next.phone,
      next.email,
      next.logoUrl
    ]
  );

  return result.rows[0];
};

export const updateCompanyLogo = async (logoUrl: string | null) => {
  await ensureRow();
  const result = await db.query<CompanySettingsRecord>(
    "UPDATE app_company_settings SET logo_url = $1, logo_path = $2, updated_at = NOW() WHERE id = 1 RETURNING company_name, nif, address, social_area, phone, email, logo_url, logo_path, updated_at",
    [logoUrl, logoUrl]
  );
  return result.rows[0];
};
