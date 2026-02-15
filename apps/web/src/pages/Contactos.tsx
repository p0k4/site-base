import React, { useState } from "react";
import api from "../lib/api";
import Toast from "../components/Toast";
import PageHeader from "../components/PageHeader";
import { useCompanyPublic } from "../hooks/useCompanyPublic";
import { appConfig } from "../config/appConfig";
import { brandText } from "../config/branding";

type ContactForm = {
  name: string;
  email: string;
  contact: string;
  message: string;
};

const initialForm: ContactForm = {
  name: "",
  email: "",
  contact: "",
  message: ""
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Contactos: React.FC = () => {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: companyInfo } = useCompanyPublic();

  const updateField = (field: keyof ContactForm) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const validate = () => {
    const nextErrors: Partial<Record<keyof ContactForm, string>> = {};
    if (!form.name.trim()) {
      nextErrors.name = "Nome obrigatório.";
    }
    if (!emailRegex.test(form.email.trim())) {
      nextErrors.email = "Email inválido.";
    }
    if (!form.contact.trim()) {
      nextErrors.contact = "Contacto obrigatório.";
    }
    if (form.message.trim().length < 10) {
      nextErrors.message = "Mensagem curta demais.";
    }
    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setToast(null);

    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/contactos", {
        name: form.name.trim(),
        email: form.email.trim(),
        contact: form.contact.trim(),
        message: form.message.trim()
      });
      setToast({ message: "Contacto enviado com sucesso." });
      setForm(initialForm);
    } catch (error) {
      setToast({ message: "Não foi possível enviar o contacto.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass = (field: keyof ContactForm) =>
    `w-full rounded-2xl bg-white border ${errors[field] ? "border-red-300" : "border-brand-200"} px-4 py-3 text-sm placeholder:text-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-300 transition`;

  const locationLabel = companyInfo?.address?.trim() || appConfig.COMPANY.LOCATION;
  const phone = companyInfo?.phone || appConfig.COMPANY.PHONE;
  const email = companyInfo?.email || appConfig.COMPANY.EMAIL;

  return (
    <div className="w-full max-w-7xl lg:max-w-[90%] xl:max-w-[88%] mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-12">
      <div className="space-y-10">
        <PageHeader
          title="Quem somos"
          description="O formulario abaixo ajuda-nos a perceber o que precisas e a responder com rapidez."
          centered
          className="max-w-7xl mx-auto"
        />

        <div className="grid gap-10 lg:grid-cols-[2fr_1fr] items-start">
          <div className="glass-panel w-full rounded-3xl p-6 sm:p-10 md:p-14 space-y-6 shadow-sm">
            <div className="text-sm text-brand-700/70">
              <p>Todos os campos são obrigatórios.</p>
            </div>

            <form className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 sm:gap-y-8" onSubmit={handleSubmit} noValidate>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-brand-700" htmlFor="contact-name">
                    Nome
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={form.name}
                    onChange={updateField("name")}
                    className={fieldClass("name")}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-brand-700" htmlFor="contact-email">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={updateField("email")}
                    className={fieldClass("email")}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-brand-700" htmlFor="contact-phone">
                    Contacto
                  </label>
                  <input
                    id="contact-phone"
                    name="contact"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={form.contact}
                    onChange={updateField("contact")}
                    className={fieldClass("contact")}
                    aria-invalid={!!errors.contact}
                  />
                  {errors.contact && <p className="text-xs text-red-500">{errors.contact}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.2em] text-brand-700" htmlFor="contact-message">
                  Descrição do contacto
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={10}
                  required
                  minLength={10}
                  placeholder="Descreve o teu pedido."
                  value={form.message}
                  onChange={updateField("message")}
                  className={`${fieldClass("message")} min-h-[220px] sm:min-h-[320px] resize-none`}
                  aria-invalid={!!errors.message}
                />
                {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
              </div>

              <div className="md:col-span-2 space-y-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="brand-outline-btn w-full rounded-full px-6 py-3 text-xs uppercase tracking-[0.4em] disabled:opacity-60"
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? "A enviar..." : "Enviar"}
                </button>

                {toast && <Toast message={toast.message} type={toast.type} />}
              </div>
            </form>
          </div>

          <aside className="glass-panel rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-700">informações</p>
            <div className="space-y-3 text-sm text-brand-700">
              {locationLabel ? (
                <div className="space-y-1">
                  <p className="text-[0.7rem] uppercase tracking-[0.25em] text-brand-600">Localização</p>
                  <p>
                    {locationLabel.split(/\r?\n/).filter(Boolean).map((line, index) => (
                      <span key={`${line}-${index}`} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
              ) : null}
              {phone ? (
                <div className="space-y-1">
                  <p className="text-[0.7rem] uppercase tracking-[0.25em] text-brand-600">Contacto</p>
                  <p>{phone}</p>
                </div>
              ) : null}
              {email ? (
                <div className="space-y-1">
                  <p className="text-[0.7rem] uppercase tracking-[0.25em] text-brand-600">Email</p>
                  <p>{email}</p>
                </div>
              ) : null}
              <div className="space-y-1">
                  <p className="text-[0.7rem] uppercase tracking-[0.25em] text-brand-600">Horário</p>
                <p>{brandText.contactResponseTime}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Contactos;
