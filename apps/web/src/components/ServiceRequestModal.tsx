import React, { useEffect, useState } from "react";
import { Service } from "./ServiceCard";

type ServiceRequestModalProps = {
  open: boolean;
  service: Service | null;
  onClose: () => void;
  onSubmit: (payload: { name: string; email: string; phone: string; message: string }) => Promise<void>;
};

const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({ open, service, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setIsSubmitting(false);
    }
  }, [open, service?.id]);

  if (!open || !service) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    await onSubmit({ name, email, phone, message });
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-label="Fechar"
      />
      <div className="relative w-full max-w-2xl rounded-3xl border border-black/5 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-brand-700">Pedir proposta</p>
          <p className="text-base text-brand-700">{service.name}</p>
        </div>
        <p className="mt-2 text-sm text-brand-700">Preenche os teus dados e vamos tratar do resto.</p>

        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="md:col-span-2">
            <label className="text-xs uppercase tracking-[0.3em] text-brand-600">Serviço</label>
            <div className="mt-2 rounded-2xl border border-brand-200 bg-brand-50 px-3 py-2 text-sm text-brand-900">
              {service.name}
            </div>
          </div>
          <input
            name="name"
            placeholder="Nome"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm"
          />
          <input
            name="email"
            placeholder="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm"
          />
          <input
            name="phone"
            placeholder="Telefone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm"
          />
          <textarea
            name="message"
            placeholder="Mensagem"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="md:col-span-2 rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm min-h-[140px]"
          />
          <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-brand-200 px-6 py-3 text-xs uppercase tracking-[0.4em] text-brand-700 hover:text-brand-900 hover:border-brand-400 transition"
            >
              Cancelar
            </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="brand-outline-btn rounded-full px-6 py-3 text-xs uppercase tracking-[0.4em] disabled:opacity-60"
              >
              {isSubmitting ? "A enviar..." : "Enviar pedido"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceRequestModal;
