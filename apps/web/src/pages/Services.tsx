import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../lib/api";
import ServiceCard, { Service } from "../components/ServiceCard";
import ServiceRequestModal from "../components/ServiceRequestModal";
import { useToast } from "../context/ToastContext";
import PageHeader from "../components/PageHeader";

const Services: React.FC = () => {
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const listRef = useRef<HTMLDivElement | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoOpened, setAutoOpened] = useState(false);

  useEffect(() => {
    api.get<Service[]>("/services")
      .then((res) => setServices(res.data))
      .catch(() => setServices([]));
  }, []);

  useEffect(() => {
    if (autoOpened) return;
    const openParam = searchParams.get("open");
    if (services.length === 0) return;
    if (openParam) {
      const service = services.find((item) => item.id === openParam) || null;
      if (service) {
        setSelectedService(service);
        setIsModalOpen(true);
      } else {
        listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setAutoOpened(true);
      return;
    }

    if (window.location.hash === "#servicos-lista") {
      listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      setAutoOpened(true);
    }
  }, [autoOpened, searchParams, services]);

  const submit = async (formData: { name: string; email: string; phone: string; message: string }) => {
    if (!selectedService) return;
    const payload = {
      serviceId: selectedService.id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message
    };

    try {
      await api.post("/leads", payload);
      toast.success("Pedido enviado com sucesso.");
      setIsModalOpen(false);
      setSelectedService(null);
    } catch (error) {
      toast.error("Erro ao enviar pedido.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-10">
      <PageHeader
        title="Tudo o que precisas"
        description="Financiamento, Tu pedes, nós resolvemos."
      />

      <div ref={listRef} id="servicos-lista" className="grid gap-6 md:grid-cols-3">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onRequest={() => {
              setSelectedService(service);
              setIsModalOpen(true);
            }}
          />
        ))}
      </div>

      <ServiceRequestModal
        open={isModalOpen}
        service={selectedService}
        onClose={() => setIsModalOpen(false)}
        onSubmit={submit}
      />
    </div>
  );
};

export default Services;
