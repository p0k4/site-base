import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Toast from "../components/Toast";
import PageHeader from "../components/PageHeader";

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const payload = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      location: (form.elements.namedItem("location") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value
    };

    try {
      await register(payload);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Não foi possível criar conta.");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="glass-panel rounded-3xl p-8 space-y-6">
        <PageHeader title="Criar conta" description="Tudo pronto para comecar a publicar e gerir anuncios." />
        <form className="space-y-4" onSubmit={submit}>
          <input name="name" placeholder="Nome" className="w-full rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm" required />
          <input name="email" type="email" placeholder="Email" className="w-full rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm" required />
          <input name="phone" placeholder="Telefone" className="w-full rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm" />
          <input name="location" placeholder="Localização" className="w-full rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm" />
          <input name="password" type="password" placeholder="Password" className="w-full rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm" required />
          <button className="brand-outline-btn w-full rounded-full px-6 py-3 text-xs uppercase tracking-[0.4em]">Criar conta</button>
        </form>
        {error && <Toast message={error} type="error" />}
        <p className="text-sm text-brand-700">
          Ja tens conta? <Link className="text-brand-900" to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
