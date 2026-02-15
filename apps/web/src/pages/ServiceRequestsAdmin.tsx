import React, { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import PageHeader from "../components/PageHeader";

type ServiceRequestStatus = "NOVO" | "EM_ANALISE" | "EM_CONTACTO" | "CONCLUIDO" | "ARQUIVADO";

type ServiceRequest = {
  id: string;
  serviceId: string | null;
  serviceName: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  createdAt: string | null;
  status: ServiceRequestStatus;
};

type AdminService = {
  id: string;
  name: string;
};

type RawServiceRequest = Omit<ServiceRequest, "status"> & {
  statusFromBackend: ServiceRequestStatus | null;
};

const STATUS_STORAGE_KEY = "serviceRequestStatusMap";
const STATUS_OPTIONS: ServiceRequestStatus[] = ["NOVO", "EM_ANALISE", "EM_CONTACTO", "CONCLUIDO", "ARQUIVADO"];
const STATUS_LABELS: Record<ServiceRequestStatus, string> = {
  NOVO: "NOVO",
  EM_ANALISE: "EM ANALISE",
  EM_CONTACTO: "EM CONTACTO",
  CONCLUIDO: "CONCLUIDO",
  ARQUIVADO: "ARQUIVADO"
};
const STATUS_STYLES: Record<ServiceRequestStatus, string> = {
  NOVO: "bg-brand-100 text-brand-800",
  EM_ANALISE: "bg-accent-200 text-brand-900",
  EM_CONTACTO: "bg-brand-300 text-brand-900",
  CONCLUIDO: "bg-green-100 text-green-700",
  ARQUIVADO: "bg-black/5 text-brand-600"
};
const STATUS_SORT_ORDER: Record<ServiceRequestStatus, number> = {
  NOVO: 0,
  EM_ANALISE: 1,
  EM_CONTACTO: 2,
  CONCLUIDO: 3,
  ARQUIVADO: 4
};

const normalizeStatus = (value: unknown): ServiceRequestStatus | null => {
  if (typeof value !== "string") return null;
  const cleaned = value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s-]+/g, "_");

  if (cleaned === "novo") return "NOVO";
  if (cleaned === "em_analise" || cleaned === "analise") return "EM_ANALISE";
  if (cleaned === "em_contacto" || cleaned === "contato" || cleaned === "contacto") return "EM_CONTACTO";
  if (cleaned === "concluido") return "CONCLUIDO";
  if (cleaned === "arquivado") return "ARQUIVADO";
  return null;
};

const readStoredStatusMap = (): Record<string, ServiceRequestStatus> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STATUS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const normalized: Record<string, ServiceRequestStatus> = {};
    Object.entries(parsed).forEach(([key, value]) => {
      const status = normalizeStatus(value);
      if (status) normalized[key] = status;
    });
    return normalized;
  } catch {
    return {};
  }
};

const saveStoredStatusMap = (map: Record<string, ServiceRequestStatus>) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(map));
};

const toArray = (value: unknown): any[] => {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    const candidate = value as { items?: unknown; data?: unknown; rows?: unknown };
    if (Array.isArray(candidate.items)) return candidate.items;
    if (Array.isArray(candidate.data)) return candidate.data;
    if (Array.isArray(candidate.rows)) return candidate.rows;
  }
  return [];
};

const normalizeRequest = (value: any): RawServiceRequest => ({
  id: String(value.id || ""),
  serviceId: value.serviceId || value.service_id || null,
  serviceName: value.serviceName || value.service_name || null,
  name: value.name || "",
  email: value.email || "",
  phone: value.phone || null,
  message: value.message || "",
  createdAt: value.createdAt || value.created_at || null,
  statusFromBackend: normalizeStatus(value.status || value.state || value.pedido_status)
});

const formatDate = (value: string | null) => {
  if (!value) return "Sem data";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sem data";
  return date.toLocaleString("pt-PT");
};

const ServiceRequestsAdmin: React.FC = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const serviceNameById = useMemo(
    () => new Map(services.map((service) => [service.id, service.name])),
    [services]
  );

  const sortedRequests = useMemo(() => {
    return [...requests].sort((a, b) => {
      const byStatus = STATUS_SORT_ORDER[a.status] - STATUS_SORT_ORDER[b.status];
      if (byStatus !== 0) return byStatus;
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [requests]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setLoadError(null);

      try {
        const [requestsResponse, servicesResponse] = await Promise.all([
          api.get("/leads/admin"),
          api.get("/services/admin/all").catch(() => ({ data: [] }))
        ]);

        const storedStatusMap = readStoredStatusMap();
        const requestItems = toArray(requestsResponse.data)
          .map(normalizeRequest)
          .filter((item) => item.id)
          .map((item) => ({
            id: item.id,
            serviceId: item.serviceId,
            serviceName: item.serviceName,
            name: item.name,
            email: item.email,
            phone: item.phone,
            message: item.message,
            createdAt: item.createdAt,
            status: item.statusFromBackend || storedStatusMap[item.id] || "NOVO"
          }));
        const serviceItems = toArray(servicesResponse.data) as AdminService[];

        setRequests(requestItems);
        setServices(serviceItems);
      } catch (error: any) {
        const status = error?.response?.status;
        if (status === 404 || status === 405) {
          setLoadError("A API atual não disponibiliza listagem de pedidos de serviço.");
        } else {
          setLoadError("Não foi possível carregar os pedidos de serviço.");
        }
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleStatusChange = (requestId: string, nextStatusRaw: string) => {
    const nextStatus = normalizeStatus(nextStatusRaw) || "NOVO";
    setRequests((prev) => prev.map((item) => (item.id === requestId ? { ...item, status: nextStatus } : item)));

    const storedStatusMap = readStoredStatusMap();
    storedStatusMap[requestId] = nextStatus;
    saveStoredStatusMap(storedStatusMap);
  };

  return (
    <div className="w-full max-w-7xl lg:max-w-[94%] xl:max-w-[92%] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      <PageHeader
        title="Pedidos de serviço"
        description="Aqui vais encontrar os pedidos de proposta submetidos pelos utilizadores."
      />

      {loading ? (
        <div className="glass-panel rounded-3xl p-6 text-brand-700">A carregar pedidos...</div>
      ) : loadError ? (
        <div className="glass-panel rounded-3xl p-6 text-brand-700">{loadError}</div>
      ) : requests.length === 0 ? (
        <div className="glass-panel rounded-3xl p-6 text-brand-700">Ainda não existem pedidos de serviço.</div>
      ) : (
        <div className="grid gap-4">
          {sortedRequests.map((request) => (
            <article key={request.id} className="rounded-2xl border border-brand-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-brand-600">{formatDate(request.createdAt)}</span>
                <div className="flex items-center gap-2">
                  <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wide ${STATUS_STYLES[request.status]}`}>
                    {STATUS_LABELS[request.status]}
                  </span>
                  <select
                    value={request.status}
                    onChange={(event) => handleStatusChange(request.id, event.target.value)}
                    className="rounded-full border border-brand-200 bg-white px-2 py-1 text-[10px] uppercase tracking-wide text-brand-700"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="mb-2 break-words">
                <span className="mr-1 text-xs font-medium uppercase tracking-wide text-brand-600">Serviço:</span>
                <span className="text-sm text-brand-900 normal-case">
                  {request.serviceName || (request.serviceId ? serviceNameById.get(request.serviceId) : null) || request.serviceId || "-"}
                </span>
              </p>

              <p className="mb-2">
                <span className="mr-1 text-xs font-medium uppercase tracking-wide text-brand-600">Nome:</span>
                <span className="text-sm text-brand-900 normal-case">{request.name || "-"}</span>
              </p>

              <p className="mb-2">
                <span className="mr-1 text-xs font-medium uppercase tracking-wide text-brand-600">Contacto:</span>
                <span className="text-sm text-brand-900 normal-case">{request.phone || "-"}</span>
              </p>

              <p className="mb-2 break-all">
                <span className="mr-1 text-xs font-medium uppercase tracking-wide text-brand-600">E-mail:</span>
                <span className="text-sm text-brand-900 normal-case">{request.email || "-"}</span>
              </p>

              <p className="mb-2 leading-relaxed">
                <span className="mr-1 text-xs font-medium uppercase tracking-wide text-brand-600">Mensagem:</span>
                <span className="text-sm text-brand-900 normal-case">{request.message || "-"}</span>
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceRequestsAdmin;
