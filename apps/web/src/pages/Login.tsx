import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Toast from "../components/Toast";
import { Eye, EyeOff } from "lucide-react";
import PageHeader from "../components/PageHeader";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const user = await login(email, password);
      const isAdmin = String(user.role || "").toLowerCase() === "admin";
      navigate(isAdmin ? "/admin/anuncios" : "/dashboard", { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Não foi possível entrar.");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="glass-panel rounded-3xl p-12 space-y-8">
        <PageHeader title="Bem-vindo" description="Entra para gerir os teus anúncios." centered />
        <form className="space-y-6" onSubmit={submit}>
          <input name="email" type="email" placeholder="Email" className="w-full rounded-2xl bg-white border border-brand-200 px-4 py-3.5 text-sm" required />
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full rounded-2xl bg-white border border-brand-200 px-4 py-3.5 pr-10 text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Esconder palavra-passe" : "Mostrar palavra-passe"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-700 hover:text-brand-900 transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button className="brand-outline-btn w-full rounded-full px-6 py-4 text-xs uppercase tracking-[0.45em]">Entrar</button>
        </form>
        {error && <Toast message={error} type="error" />}
        <p className="text-sm text-brand-700">
          Ainda não tens conta? <Link className="text-brand-900" to="/registar">Criar conta</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
