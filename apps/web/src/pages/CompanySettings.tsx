import React, { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import Toast from "../components/Toast";
import PageHeader from "../components/PageHeader";
import { useCompanySettings } from "../contexts/CompanySettingsContext";
import { resolveMediaUrl } from "../lib/media";

const emptyForm = {
  companyName: "",
  nif: "",
  address: "",
  socialArea: "",
  phone: "",
  email: ""
};

const CompanySettings: React.FC = () => {
  const { settings, refresh, updateLocal } = useCompanySettings();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!settings) return;
    setForm({
      companyName: settings.companyName || "",
      nif: settings.nif || "",
      address: settings.address || "",
      socialArea: settings.socialArea || "",
      phone: settings.phone || "",
      email: settings.email || ""
    });
    setLogoUrl(settings.logoUrl || null);
  }, [settings]);

  const previewUrl = useMemo(() => (logoUrl ? resolveMediaUrl(logoUrl) : ""), [logoUrl]);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put("/settings/company", {
        companyName: form.companyName,
        nif: form.nif,
        address: form.address,
        socialArea: form.socialArea,
        phone: form.phone,
        email: form.email
      });
      updateLocal({
        companyName: data.company_name || "",
        nif: data.nif || "",
        address: data.address || "",
        socialArea: data.social_area || "",
        phone: data.phone || "",
        email: data.email || "",
        logoUrl: data.logo_url || null
      });
      setToast({ message: "Dados guardados com sucesso." });
    } catch (error: any) {
      setToast({ message: error?.response?.data?.message || "Não foi possível guardar.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setToast({ message: "O logótipo não pode ultrapassar 2MB.", type: "error" });
      event.target.value = "";
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("logo", file);

    try {
      const { data } = await api.post("/settings/company/logo", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const nextLogo = data.logo_url || null;
      setLogoUrl(nextLogo);
      updateLocal({
        companyName: form.companyName,
        nif: form.nif,
        address: form.address,
        socialArea: form.socialArea,
        phone: form.phone,
        email: form.email,
        logoUrl: nextLogo
      });
      setToast({ message: "Logótipo atualizado." });
    } catch (error: any) {
      setToast({ message: error?.response?.data?.message || "Falha no upload do logótipo.", type: "error" });
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleResetLogo = async () => {
    setUploading(true);
    try {
      const { data } = await api.delete("/settings/company/logo");
      const nextLogo = data.logo_url || null;
      setLogoUrl(nextLogo);
      await refresh();
      setToast({ message: "Logótipo reposto para o padrão." });
    } catch (error: any) {
      setToast({ message: error?.response?.data?.message || "Não foi possível repor o logótipo.", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl lg:max-w-[94%] xl:max-w-[92%] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      <PageHeader
        title="Dados da empresa"
        description="Atualiza os dados usados no backoffice e no branding público."
      />

      <section className="glass-panel rounded-3xl p-6 space-y-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-2xl border border-brand-200 bg-white">
              {previewUrl ? (
                <img src={previewUrl} alt="Logotipo" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-brand-100" />
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-brand-600">Pré-visualização do logótipo</p>
              <label className="mt-2 inline-flex cursor-pointer rounded-full border border-brand-200 bg-white px-4 py-2 text-xs uppercase tracking-[0.3em] text-brand-700 hover:border-brand-400 hover:text-brand-900 transition">
                {uploading ? "A enviar..." : "Enviar logótipo"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={handleLogoUpload}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          <div className="flex-1 grid gap-4 md:grid-cols-2">
            <input
              value={form.companyName}
              onChange={(event) => updateField("companyName", event.target.value)}
              placeholder="Nome da empresa"
              className="rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm"
            />
            <input
              value={form.nif}
              onChange={(event) => updateField("nif", event.target.value)}
              placeholder="NIF"
              className="rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm"
            />
            <input
              value={form.socialArea}
              onChange={(event) => updateField("socialArea", event.target.value)}
              placeholder="Área social"
              className="rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm"
            />
            <input
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder="Contacto telefónico"
              className="rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm"
            />
            <input
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="Email"
              className="rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm"
            />
            <textarea
              value={form.address}
              onChange={(event) => updateField("address", event.target.value)}
              placeholder="Morada"
              className="rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm min-h-[110px] md:col-span-2"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="brand-outline-btn rounded-full px-6 py-3 text-xs uppercase tracking-[0.4em] disabled:opacity-60"
          >
            {saving ? "A guardar..." : "Guardar dados"}
          </button>
          <button
            type="button"
            onClick={handleResetLogo}
            disabled={uploading}
            className="rounded-full border border-brand-200 bg-white px-6 py-3 text-xs uppercase tracking-[0.4em] text-brand-700 hover:border-brand-400 hover:text-brand-900 transition disabled:opacity-60"
          >
            Repor logótipo padrão
          </button>
        </div>
      </section>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default CompanySettings;
