import React, { useEffect, useState } from "react";
import api from "../lib/api";
import Toast from "../components/Toast";
import PageHeader from "../components/PageHeader";

const Account: React.FC = () => {
  const [profile, setProfile] = useState({ name: "", phone: "", location: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users/me");
      setProfile({
        name: data.name || "",
        phone: data.phone || "",
        location: data.location || "",
        email: data.email || ""
      });
    } catch (error: any) {
      setToast({ message: error?.response?.data?.message || "Não foi possível carregar o perfil.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const saveProfile = async () => {
    try {
      await api.put("/users/me", {
        name: profile.name,
        phone: profile.phone,
        location: profile.location
      });
      setToast({ message: "Perfil atualizado." });
    } catch (error: any) {
      setToast({ message: error?.response?.data?.message || "Não foi possível atualizar o perfil.", type: "error" });
    }
  };

  return (
    <div className="w-full max-w-7xl lg:max-w-[94%] xl:max-w-[92%] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <PageHeader
        title="Minha conta"
        description="Atualiza os teus dados para manter a tua conta em dia."
      />

      <section className="glass-panel rounded-3xl p-5 space-y-4">
        <p className="text-sm text-brand-700">Perfil</p>
        <div className="grid gap-3">
          <input
            className="w-full rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm"
            placeholder="Nome"
            value={profile.name}
            onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
          />
          <input
            className="w-full rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm"
            placeholder="Email"
            value={profile.email}
            disabled
          />
          <input
            className="w-full rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm"
            placeholder="Telefone"
            value={profile.phone}
            onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
          />
          <input
            className="w-full rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm"
            placeholder="Localização"
            value={profile.location}
            onChange={(e) => setProfile((prev) => ({ ...prev, location: e.target.value }))}
          />
          <button
            className="brand-outline-btn w-full rounded-full px-5 py-2 text-xs uppercase tracking-[0.4em] disabled:opacity-60"
            onClick={saveProfile}
            disabled={loading}
          >
            Guardar alterações
          </button>
        </div>
      </section>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default Account;
