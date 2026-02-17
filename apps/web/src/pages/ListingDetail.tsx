import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";
import Toast from "../components/Toast";
import ListingGallery from "../components/ListingGallery";

const ListingDetail: React.FC = () => {
  const { id } = useParams();
  const [listing, setListing] = useState<any>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!id) return;
    api.get(`/listings/${id}`)
      .then((res) => setListing(res.data))
      .catch(() => setListing(null));
  }, [id]);

  useEffect(() => {
    if (!isContactOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsContactOpen(false);
      }
    };

    const focusTimeout = window.setTimeout(() => {
      nameInputRef.current?.focus();
    }, 0);

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimeout);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isContactOpen]);

  const updateContactField = (field: "name" | "email" | "phone" | "message", value: string) => {
    setContactForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitLead = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const payload = {
      listingId: id,
      name: contactForm.name,
      email: contactForm.email,
      phone: contactForm.phone,
      message: contactForm.message
    };

    try {
      await api.post("/leads", payload);
      setToast({ message: "Pedido enviado. Vamos contactar-te em breve." });
      setContactForm({ name: "", email: "", phone: "", message: "" });
      setIsContactOpen(false);
    } catch (error) {
      setToast({ message: "Não foi possível enviar o pedido.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!listing) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="glass-panel rounded-3xl p-6 text-brand-700">A carregar anúncio...</div>
      </div>
    );
  }

  const externalUrl = [
    listing.external_url,
    listing.externalUrl,
    listing.source_url,
    listing.sourceUrl
  ].find((value) => typeof value === "string" && value.trim().length > 0)?.trim() || "";

  const hasValidExternalUrl = /^https?:\/\/\S+$/i.test(externalUrl);

  const handleOpenExternalSource = () => {
    if (!hasValidExternalUrl) {
      setToast({ message: "Este anuncio nao tem ligacao externa.", type: "error" });
      return;
    }
    window.open(externalUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-10">
      <div className="grid gap-10">
        <div className="space-y-6">
          <ListingGallery
            images={(listing.images?.length ? listing.images : [{ url: "/placeholder.svg" }]).map((img: any) => img.url)}
            title={listing.title}
            overlayAction={
              <button
                type="button"
                onClick={() => setIsContactOpen(true)}
                className="group pointer-events-auto absolute bottom-3 right-3 md:bottom-auto md:top-4 md:right-4 rounded-full border border-black/5 bg-white/70 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-brand-900 shadow-lg backdrop-blur-md whitespace-nowrap transition-all duration-200 ease-out hover:-translate-y-[1px] hover:bg-white/85 hover:shadow-xl active:translate-y-0 active:shadow-md md:px-5 md:py-2 md:text-[11px]"
              >
                <span className="pointer-events-none absolute inset-0 rounded-full bg-accent-200/35 blur-sm animate-pulse transition-opacity duration-200 group-hover:opacity-0" />
                <span className="relative z-10">Pedir contacto</span>
              </button>
            }
          />
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <h1 className="page-title">{listing.title}</h1>
            <div>
              <button
                type="button"
                onClick={handleOpenExternalSource}
                className="brand-outline-btn rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.3em]"
              >
                Ver fonte externa
              </button>
            </div>
            <p className="text-brand-700 leading-relaxed">{listing.description}</p>
            <div className="grid gap-3 sm:grid-cols-2 text-sm text-brand-700">
              <div>Categoria: <span className="text-brand-900">{listing.category}</span></div>
              <div>Condição: <span className="text-brand-900">{listing.item_condition}</span></div>
              <div>Preço: <span className="text-brand-900">{Number(listing.price).toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}</span></div>
              <div>Localização: <span className="text-brand-900">{listing.location}</span></div>
            </div>
          </div>
        </div>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </div>

      {isContactOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6"
          onClick={() => setIsContactOpen(false)}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
          <div
            className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-black/5 bg-white/90 p-6 shadow-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 id="contact-modal-title" className="text-base text-brand-700">
                Pedir contacto
              </h2>
              <button
                type="button"
                onClick={() => setIsContactOpen(false)}
                className="rounded-full p-2 text-brand-700 transition hover:bg-brand-100/60 hover:text-brand-900"
                aria-label="Fechar modal"
              >
                X
              </button>
            </div>
            <p className="mt-2 text-sm text-brand-700">
              Conta-nos o que procuras e tratamos da conversa com o vendedor.
            </p>

            <form className="mt-4 space-y-3" onSubmit={submitLead}>
              <input
                ref={nameInputRef}
                name="name"
                placeholder="Nome"
                required
                value={contactForm.name}
                onChange={(event) => updateContactField("name", event.target.value)}
                className="w-full rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm"
              />
              <input
                name="email"
                placeholder="Email"
                type="email"
                required
                value={contactForm.email}
                onChange={(event) => updateContactField("email", event.target.value)}
                className="w-full rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm"
              />
              <input
                name="phone"
                placeholder="Telefone"
                value={contactForm.phone}
                onChange={(event) => updateContactField("phone", event.target.value)}
                className="w-full rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm"
              />
              <textarea
                name="message"
                placeholder="Mensagem"
                value={contactForm.message}
                onChange={(event) => updateContactField("message", event.target.value)}
                required
                className="w-full rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm min-h-[120px]"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="brand-outline-btn w-full rounded-full px-6 py-3 text-xs uppercase tracking-[0.24em] disabled:opacity-60"
              >
                {isSubmitting ? "A enviar..." : "Enviar pedido"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingDetail;
