import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../lib/api";

export type CompanySettings = {
  companyName: string;
  nif: string;
  address: string;
  socialArea: string;
  phone: string;
  email: string;
  logoUrl: string | null;
};

type CompanySettingsContextValue = {
  settings: CompanySettings | null;
  loading: boolean;
  refresh: () => Promise<void>;
  updateLocal: (next: CompanySettings) => void;
};

const CompanySettingsContext = createContext<CompanySettingsContextValue | undefined>(undefined);

const toSettings = (data: any): CompanySettings => ({
  companyName: data?.company_name || data?.companyName || "",
  nif: data?.nif || "",
  address: data?.address || "",
  socialArea: data?.social_area || data?.socialArea || "",
  phone: data?.phone || "",
  email: data?.email || "",
  logoUrl: data?.logo_url || data?.logoUrl || null
});

export const CompanySettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get("/settings/company");
      setSettings(toSettings(data));
    } catch {
      setSettings(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateLocal = useCallback((next: CompanySettings) => {
    setSettings(next);
  }, []);

  const value = useMemo(
    () => ({ settings, loading, refresh: load, updateLocal }),
    [settings, loading, load, updateLocal]
  );

  return <CompanySettingsContext.Provider value={value}>{children}</CompanySettingsContext.Provider>;
};

export const useCompanySettings = () => {
  const ctx = useContext(CompanySettingsContext);
  if (!ctx) {
    throw new Error("useCompanySettings must be used inside CompanySettingsProvider");
  }
  return ctx;
};
