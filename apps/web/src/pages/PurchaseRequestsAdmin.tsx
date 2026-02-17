import React, { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import PageHeader from "../components/PageHeader";
import { resolveMediaUrl } from "../lib/media";

type PurchaseRequestStatus = "NOVO" | "EM_CONTACTO" | "RESOLVIDO" | "ARQUIVADO";

type PurchaseRequest = {
  id: string;
  listingId: string | null;
  listingTitle: string | null;
  listingCategory: string | null;
  listingCondition: string | null;
  listingCoverUrl: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  createdAt: string | null;
  status: PurchaseRequestStatus;
};

type RawPurchaseRequest = Omit<PurchaseRequest, "status"> & {
  statusFromBackend: PurchaseRequestStatus | null;
};

const STATUS_STORAGE_KEY = "purchaseRequestStatusMap";
const STATUS_OPTIONS: PurchaseRequestStatus[] = ["NOVO", "EM_CONTACTO", "RESOLVIDO", "ARQUIVADO"];
const STATUS_LABELS: Record<PurchaseRequestStatus, string> = {
  NOVO: "NOVO",
  EM_CONTACTO: "EM CONTACTO",
  RESOLVIDO: "RESOLVIDO",
  ARQUIVADO: "ARQUIVADO"
};
const STATUS_STYLES: Record<PurchaseRequestStatus, string> = {
  NOVO: "bg-brand-100 text-brand-800",
  EM_CONTACTO: "bg-brand-300 text-brand-900",
  RESOLVIDO: "bg-green-100 text-green-700",
  ARQUIVADO: "bg-black/5 text-brand-600"
};
const STATUS_SORT_ORDER: Record<PurchaseRequestStatus, number> = {
  NOVO: 0,
  EM_CONTACTO: 1,
  RESOLVIDO: 2,
  ARQUIVADO: 3
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

const normalizeStatus = (value: unknown): PurchaseRequestStatus | null => {
  if (typeof value !== "string") return null;
  const cleaned = value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s-]+/g, "_");

  if (cleaned === "novo") return "NOVO";
  if (cleaned === "em_contacto" || cleaned === "contato" || cleaned === "contacto") return "EM_CONTACTO";
  if (cleaned === "resolvido" || cleaned === "concluido") return "RESOLVIDO";
  if (cleaned === "arquivado") return "ARQUIVADO";
  return null;
};

const readStoredStatusMap = (): Record<string, PurchaseRequestStatus> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STATUS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const normalized: Record<string, PurchaseRequestStatus> = {};
    Object.entries(parsed).forEach(([key, value]) => {
      const status = normalizeStatus(value);
      if (status) normalized[key] = status;
    });
    return normalized;
  } catch {
    return {};
  }
};

const saveStoredStatusMap = (map: Record<string, PurchaseRequestStatus>) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(map));
};

const normalizeRequest = (value: any): RawPurchaseRequest | null => {
  const listingId = value.listingId || value.listing_id || value.listing?.id || null;
  const listingTitle = value.listingTitle || value.listing_title || value.listing?.title || null;
  const listingCategory = value.listingCategory || value.listing_category || value.category || value.listing?.category || null;
  const listingCondition = value.listingCondition || value.listing_condition || value.item_condition || value.listing?.item_condition || null;
  const listingCoverUrl =
    value.listingCoverUrl ||
    value.listing_cover_url ||
    value.cover_url ||
    value.coverUrl ||
    value.listing?.cover_url ||
    value.listing?.coverUrl ||
    null;

  const hasListingContext = Boolean(listingId || listingTitle || listingCategory || listingCondition);
  if (!hasListingContext) return null;

  return {
    id: String(value.id || ""),
    listingId,
    listingTitle,
    listingCategory,
    listingCondition,
    listingCoverUrl,
    name: value.name || "",
    email: value.email || "",
    phone: value.phone || null,
    message: value.message || "",
    createdAt: value.createdAt || value.created_at || null,
    statusFromBackend: normalizeStatus(value.status || value.state || value.pedido_status)
  };
};

const formatDate = (value: string | null) => {
  if (!value) return "Sem data";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sem data";
  return date.toLocaleString("pt-PT");
};

const getListingLabel = (request: PurchaseRequest) => {
  const title = request.listingTitle;
  if (title) return title;

  const category = request.listingCategory;
  const condition = request.listingCondition;
  const combined = [category, condition].filter(Boolean).join(" • ");
  if (combined) return combined;

  return request.listingId || "-";
};

const PurchaseRequestsAdmin: React.FC = () => {
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

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
        const requestsResponse = await api.get("/leads/admin/purchase");

        const storedStatusMap = readStoredStatusMap();
        const requestItems = toArray(requestsResponse.data)
          .map(normalizeRequest)
          .filter((item): item is RawPurchaseRequest => Boolean(item?.id))
          .map((item) => ({
            id: item.id,
            listingId: item.listingId,
            listingTitle: item.listingTitle,
            listingCategory: item.listingCategory,
            listingCondition: item.listingCondition,
            listingCoverUrl: item.listingCoverUrl,
            name: item.name,
            email: item.email,
            phone: item.phone,
            message: item.message,
            createdAt: item.createdAt,
            status: item.statusFromBackend || storedStatusMap[item.id] || "NOVO"
          }));

        setRequests(requestItems);
        setImageErrors({});
      } catch {
        setLoadError("Nao foi possivel carregar os pedidos de interesse.");
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
        title="Pedidos de interesse"
        description="Pedidos de contacto submetidos a partir dos anuncios publicados."
      />

      {loading ? (
        <div className="glass-panel rounded-3xl p-6 text-brand-700">A carregar pedidos...</div>
      ) : loadError ? (
        <div className="glass-panel rounded-3xl p-6 text-brand-700">{loadError}</div>
      ) : requests.length === 0 ? (
        <div className="glass-panel rounded-3xl p-6 text-brand-700">Ainda nao existem pedidos de interesse.</div>
      ) : (
        <div className="grid gap-4">
          {sortedRequests.map((request) => (
            <article key={request.id} className="rounded-2xl border border-brand-200 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-4">
                {request.listingCoverUrl && !imageErrors[request.id] ? (
                  <div className="h-14 w-20 rounded-lg border border-brand-200 bg-brand-100 shrink-0 overflow-hidden">
                    <img
                      src={resolveMediaUrl(request.listingCoverUrl)}
                      alt={getListingLabel(request)}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onError={() => {
                        setImageErrors((prev) => ({ ...prev, [request.id]: true }));
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-14 w-20 rounded-lg border border-brand-200 bg-brand-100 shrink-0" />
                )}

                <div className="min-w-0 flex-1">
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
                    <span className="mr-1 text-xs font-medium uppercase tracking-wide text-brand-600">Item:</span>
                    <span className="text-sm text-brand-900 normal-case">{getListingLabel(request)}</span>
                  </p>

                  <p className="mb-2">
                    <span className="mr-1 text-xs font-medium uppercase tracking-wide text-brand-600">Nome:</span>
                    <span className="text-sm text-brand-900 normal-case">{request.name || "-"}</span>
                  </p>

                  <p className="mb-2">
                    <span className="mr-1 text-xs font-medium uppercase tracking-wide text-brand-600">Telefone:</span>
                    <span className="text-sm text-brand-900 normal-case">{request.phone || "-"}</span>
                  </p>

                  <p className="mb-2 break-all">
                    <span className="mr-1 text-xs font-medium uppercase tracking-wide text-brand-600">Email:</span>
                    <span className="text-sm text-brand-900 normal-case">{request.email || "-"}</span>
                  </p>

                  <p className="mb-2 leading-relaxed">
                    <span className="mr-1 text-xs font-medium uppercase tracking-wide text-brand-600">Mensagem:</span>
                    <span className="text-sm text-brand-900 normal-case">{request.message || "-"}</span>
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchaseRequestsAdmin;
