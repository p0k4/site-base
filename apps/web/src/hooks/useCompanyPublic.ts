import { useEffect, useState } from "react";
import api from "../lib/api";

export type CompanyPublic = {
  company_name?: string;
  email?: string;
  phone?: string;
  address?: string;
};

let cachedCompany: CompanyPublic | null = null;
let inFlight: Promise<CompanyPublic | null> | null = null;

const fetchCompany = async () => {
  if (cachedCompany) return cachedCompany;
  if (inFlight) return inFlight;
  inFlight = api.get("/company")
    .then((res) => {
      cachedCompany = res.data || null;
      return cachedCompany;
    })
    .catch(() => null)
    .finally(() => {
      inFlight = null;
    });
  return inFlight;
};

export const clearCompanyPublicCache = () => {
  cachedCompany = null;
  inFlight = null;
};

export const useCompanyPublic = () => {
  const [data, setData] = useState<CompanyPublic | null>(cachedCompany);
  const [loading, setLoading] = useState(!cachedCompany);

  useEffect(() => {
    let active = true;
    fetchCompany().then((info) => {
      if (!active) return;
      setData(info);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const refresh = async () => {
    clearCompanyPublicCache();
    const info = await fetchCompany();
    setData(info);
    setLoading(false);
  };

  return { data, loading, refresh };
};
