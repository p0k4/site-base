import React, { useEffect, useState } from "react";
import api from "../lib/api";
import Toast from "../components/Toast";
import PageHeader from "../components/PageHeader";
import { brandText } from "../config/branding";

const AdminServices: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [serviceForm, setServiceForm] = useState({ name: "", description: "", price: "" });
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);

  const loadServices = async () => {
    const { data } = await api.get("/services/admin/all");
    setServices(data);
  };

  useEffect(() => {
    loadServices().catch(() => null);
  }, []);

  const saveService = async () => {
    try {
      const payload = {
        name: serviceForm.name,
        description: serviceForm.description,
        price: serviceForm.price ? Number(serviceForm.price) : undefined
      };
      if (editingServiceId) {
        await api.put(`/services/admin/${editingServiceId}`, payload);
      } else {
        await api.post("/services/admin", payload);
      }
      setServiceForm({ name: "", description: "", price: "" });
      setEditingServiceId(null);
      await loadServices();
      setToast({ message: editingServiceId ? "Serviço atualizado." : "Serviço criado." });
    } catch (error: any) {
      setToast({ message: error?.response?.data?.message || "Não foi possível criar serviço.", type: "error" });
    }
  };

  const deleteService = async (id: string) => {
    await api.delete(`/services/admin/${id}`);
    await loadServices();
  };

  const editService = (service: any) => {
    setServiceForm({
      name: service.name,
      description: service.description,
      price: service.price ? String(service.price) : ""
    });
    setEditingServiceId(service.id);
  };

  return (
    <div className="w-full max-w-7xl lg:max-w-[94%] xl:max-w-[92%] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      <PageHeader title={brandText.adminSectionTitle} />

      <section className="glass-panel rounded-3xl p-5 space-y-4">
        <p className="text-sm text-brand-700">Serviços</p>
        <div className="grid gap-4 md:grid-cols-3">
          <input
            value={serviceForm.name}
            onChange={(e) => setServiceForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Nome"
            className="rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm"
          />
          <input
            value={serviceForm.description}
            onChange={(e) => setServiceForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Descrição"
            className="rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm"
          />
          <input
            value={serviceForm.price}
            onChange={(e) => setServiceForm((prev) => ({ ...prev, price: e.target.value }))}
            placeholder="Preço (opcional)"
            className="rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm"
          />
        </div>
        <button
          className="brand-outline-btn rounded-full px-5 py-2 text-xs uppercase tracking-[0.4em]"
          onClick={saveService}
        >
          {editingServiceId ? "Atualizar serviço" : "Criar serviço"}
        </button>
        <div className="grid gap-3 md:grid-cols-2">
          {services.map((service) => (
            <div key={service.id} className="border border-brand-200 rounded-2xl p-4 flex items-center justify-between bg-white">
              <div>
                <p className="text-sm text-brand-900">{service.name}</p>
                <p className="text-xs text-brand-700">{service.description}</p>
              </div>
              <div className="flex gap-3">
                <button className="text-xs uppercase tracking-[0.3em] text-brand-700" onClick={() => editService(service)}>
                  Editar
                </button>
                <button className="text-xs uppercase tracking-[0.3em] text-red-400" onClick={() => deleteService(service.id)}>
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default AdminServices;
