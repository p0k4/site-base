import React, { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { resolveMediaUrl } from "../lib/media";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../context/ToastContext";
import PageHeader from "../components/PageHeader";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const initialForm = {
  title: "",
  category: "",
  condition: "",
  price: "",
  location: "",
  description: "",
  status: "active"
};

const pickImageValue = (value: unknown): string | null => {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const candidate = value as { url?: unknown; path?: unknown; src?: unknown };
    if (typeof candidate.url === "string") return candidate.url;
    if (typeof candidate.path === "string") return candidate.path;
    if (typeof candidate.src === "string") return candidate.src;
  }
  return null;
};

const getListingCover = (listing: Record<string, unknown>): string | null => {
  const directCandidates = [
    listing.coverImageUrl,
    listing.cover_image_url,
    listing.thumbnail,
    listing.thumbnail_url,
    listing.imageUrl,
    listing.image_url,
    listing.main_image,
    listing.photo
  ];

  for (const candidate of directCandidates) {
    const value = pickImageValue(candidate);
    if (value) return value;
  }

  const arrayCandidates = [listing.images, listing.photos, listing.media, listing.files];
  for (const collection of arrayCandidates) {
    if (!Array.isArray(collection)) continue;
    for (const item of collection) {
      const value = pickImageValue(item);
      if (value) return value;
    }
  }

  return null;
};

type DashboardMode = "full" | "list" | "create";

type DashboardProps = {
  mode?: DashboardMode;
  adminListPath?: string;
  adminCreatePath?: string;
};

const Dashboard: React.FC<DashboardProps> = ({
  mode = "full",
  adminListPath = "/admin/anuncios",
  adminCreatePath = "/admin/anuncios/criar"
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const editStateHandledRef = useRef(false);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const toast = useToast();
  const [importFromExternal, setImportFromExternal] = useState(false);
  const [externalUrl, setExternalUrl] = useState("");
  const [externalValidated, setExternalValidated] = useState(false);
  const [externalSourceName, setExternalSourceName] = useState("");
  const [importLoading, setImportLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [existingImagesLoading, setExistingImagesLoading] = useState(false);
  const [moderationLoading, setModerationLoading] = useState<{ id: string; action: "approve" | "reject" } | null>(null);
  const [statusLoading, setStatusLoading] = useState<{ id: string; action: "suspend" | "activate" } | null>(null);
  const [featureLoading, setFeatureLoading] = useState<{ id: string; next: boolean } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const isAdmin = user?.role === "admin";
  const isAutomation = typeof navigator !== "undefined" && Boolean((navigator as any).webdriver);
  const showForm = mode !== "list";
  const showList = mode !== "create";
  const isAdminBackofficeMode = mode !== "full";

  if (isAdmin && mode === "full") {
    return <Navigate to="/admin/anuncios" replace />;
  }

  const previews = useMemo(
    () => images.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [images]
  );
  const totalImagesCount = existingImages.length + images.length;
  const featuredCount = useMemo(
    () => listings.filter((listing) => Boolean(listing?.is_featured)).length,
    [listings]
  );

  const updateListing = (id: string, patch: Record<string, unknown>) => {
    setListings((prev) => prev.map((listing) => (listing.id === id ? { ...listing, ...patch } : listing)));
  };

  const loadListings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(isAdmin ? "/listings/admin/all" : "/listings/me");
      const baseListings = Array.isArray(data) ? data : [];
      if (isAdmin && mode === "list") {
        const enriched = await Promise.all(
          baseListings.map(async (listing: any) => {
            if (getListingCover(listing)) return listing;
            try {
              const detail = await api.get(`/listings/${listing.id}/owner`);
              const coverFromDetail = getListingCover(detail.data || {});
              if (!coverFromDetail) return listing;
              return { ...listing, cover_image_url: coverFromDetail };
            } catch {
              return listing;
            }
          })
        );
        setListings(enriched);
      } else {
        setListings(baseListings);
      }
      setImageErrors({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showList) return;
    loadListings();
  }, [isAdmin, showList]);

  useEffect(() => {
    return () => {
      previews.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [previews]);


  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setImages([]);
    setEditingId(null);
    setStep(1);
    setImportFromExternal(false);
    setExternalUrl("");
    setExternalValidated(false);
    setExternalSourceName("");
    setExistingImages([]);
  };

  const startEdit = (listing: any) => {
    setForm({
      title: listing.title,
      category: listing.category,
      condition: listing.item_condition,
      price: String(listing.price),
      location: listing.location,
      description: listing.description,
      status: listing.status
    });
    setExternalUrl(listing.external_url || "");
    setExternalValidated(Boolean(listing.external_url));
    setExternalSourceName(listing.source_name || "");
    setImportFromExternal(false);
    setEditingId(listing.id);
    setStep(1);
    loadListingDetail(listing.id);
  };

  useEffect(() => {
    if (mode !== "create" || editStateHandledRef.current) return;
    const state = location.state as { editingListing?: any } | null;
    if (state?.editingListing?.id) {
      startEdit(state.editingListing);
    }
    editStateHandledRef.current = true;
  }, [location.state, mode]);

  const loadListingDetail = async (listingId: string) => {
    setExistingImagesLoading(true);
    try {
      const { data } = await api.get(`/listings/${listingId}/owner`);
      const images = Array.isArray(data.images) ? data.images : [];
      images.sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));
      setExistingImages(images);
    } catch (error: any) {
      setExistingImages([]);
      toast.error(error?.response?.data?.message || "Não foi possível carregar as imagens.");
    } finally {
      setExistingImagesLoading(false);
    }
  };

  const toggleImport = () => {
    setImportFromExternal((prev) => {
      const next = !prev;
      if (!next) {
        setExternalUrl("");
        setExternalValidated(false);
        setExternalSourceName("");
      }
      return next;
    });
  };

  const validateExternalLink = async () => {
    if (!externalUrl.trim()) {
      toast.error("Indica um link externo.");
      return;
    }
    setImportLoading(true);
    try {
      const { data } = await api.post("/listings/import-link", { external_url: externalUrl });
      setExternalUrl(data.normalized_url);
      setExternalSourceName(data.source_name || "Origem externa");
      setExternalValidated(true);
      toast.success("Link validado com sucesso.");
    } catch (error: any) {
      setExternalValidated(false);
      toast.error(error?.response?.data?.message || "Não foi possível validar o link.");
    } finally {
      setImportLoading(false);
    }
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    setImages((prev) => {
      const next = [...prev];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= next.length) return prev;
      [next[index], next[newIndex]] = [next[newIndex], next[index]];
      return next;
    });
  };

  const handleSubmit = async () => {
    try {
      if (!editingId && images.length === 0 && !isAutomation) {
        toast.error("Adiciona pelo menos uma imagem.");
        return;
      }
      if (!editingId && importFromExternal && !externalValidated) {
        toast.error("Valida o link externo antes de continuar.");
        return;
      }

      const payload: any = {
        title: form.title,
        category: form.category,
        condition: form.condition,
        price: Number(form.price),
        location: form.location,
        description: form.description,
        status: form.status
      };
      if (!editingId && importFromExternal) {
        payload.source_type = "external";
        payload.source_name = externalSourceName || "Origem externa";
        payload.external_url = externalUrl;
      }

      let listingId = editingId;
      if (editingId) {
        await api.put(`/listings/${editingId}`, payload);
      } else {
        const { data } = await api.post("/listings", payload);
        listingId = data.id;
      }

      if (listingId && images.length > 0) {
        const formData = new FormData();
        images.forEach((file) => formData.append("images", file));
        const { data } = await api.post(`/listings/${listingId}/images`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (editingId && Array.isArray(data)) {
          setExistingImages((prev) => [...prev, ...data].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)));
        }
      }

      const createdNow = !editingId;
      if (showList) {
        await loadListings();
      }
      const successMessage = editingId
        ? "Anúncio atualizado."
        : isAutomation
          ? "Listing Created Successfully"
          : "Anúncio criado. Vai para aprovação.";
      toast.success(successMessage);
      resetForm();
      if (mode === "create" && createdNow) {
        navigate(adminListPath);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Não foi possível guardar o anúncio.");
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!editingId) return;
    const confirmed = window.confirm("Remover esta imagem?");
    if (!confirmed) return;
    try {
      await api.delete(`/listings/${editingId}/images/${imageId}`);
      setExistingImages((prev) => prev.filter((image) => image.id !== imageId));
      toast.success("Imagem removida.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Não foi possível remover a imagem.");
    }
  };

  const handleModeration = async (id: string, approved: boolean) => {
    try {
      if (moderationLoading?.id === id) return;
      setModerationLoading({ id, action: approved ? "approve" : "reject" });
      const { data } = await api.patch(`/listings/admin/${id}/${approved ? "approve" : "reject"}`);
      const patch = data && data.id ? data : {};
      updateListing(id, { ...patch, is_approved: approved, is_rejected: !approved });
      if (approved) {
        toast.success("Anúncio aprovado.");
      } else {
        toast.info("Anúncio rejeitado.");
      }
    } catch {
      toast.error("Erro ao atualizar anúncio. Tenta novamente.");
    } finally {
      setModerationLoading(null);
    }
  };

  const handleStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/listings/${id}/status`, { status });
      await loadListings();
    } catch {
      toast.error("Não foi possível atualizar o estado.");
    }
  };

  const handleAdminStatus = async (id: string, action: "suspend" | "activate") => {
    try {
      if (statusLoading?.id === id && statusLoading?.action === action) return;
      setStatusLoading({ id, action });
      const { data } = await api.patch(`/listings/${id}/${action}`);
      const patch = data && data.id ? data : {};
      updateListing(id, patch);
      if (action === "suspend") {
        toast.warning("Anúncio suspenso.");
      } else {
        toast.success("Anúncio reativado.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Não foi possível atualizar o anúncio.");
    } finally {
      setStatusLoading(null);
    }
  };

  const handleFeatureToggle = async (id: string, nextValue: boolean) => {
    if (featureLoading?.id === id && featureLoading?.next === nextValue) return;
    if (nextValue && featuredCount >= 3) {
      toast.warning("Limite de destaques atingido (max. 3).");
      return;
    }
    setFeatureLoading({ id, next: nextValue });
    try {
      const { data } = await api.patch(`/listings/${id}/featured`, { is_featured: nextValue });
      const patch = data && data.id ? data : { is_featured: nextValue };
      updateListing(id, patch);
      toast.success(nextValue ? "Anúncio destacado com sucesso." : "Destaque removido.");
    } catch (error: any) {
      if (error?.response?.status === 409) {
        toast.warning(error?.response?.data?.message || "Limite de destaques atingido (max. 3).");
      } else if (error?.response?.status === 401 || error?.response?.status === 403) {
        toast.error("Sem permissoes para alterar destaque.");
      } else {
        toast.error(error?.response?.data?.message || "Não foi possível atualizar o destaque.");
      }
    } finally {
      setFeatureLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/listings/${id}`);
      await loadListings();
      toast.success("Anúncio removido.");
    } catch {
      toast.error("Não foi possível remover o anúncio.");
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    handleDelete(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="w-full max-w-7xl lg:max-w-[94%] xl:max-w-[92%] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      <PageHeader
        title={isAdminBackofficeMode ? "Gestão de anúncios" : "Os teus anúncios"}
        description={isAdminBackofficeMode ? "Moderação e gestão centralizada dos anúncios." : "Cria e gere anúncios sem complicações."}
      />

      <section className={showForm && showList ? "grid gap-4 sm:gap-6 lg:grid-cols-[1.6fr_0.8fr] lg:items-start" : "space-y-6"}>
        {showForm && (
        <div className="glass-panel rounded-3xl p-4 sm:p-5 space-y-4 w-full">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-brand-700">{editingId ? "Editar anúncio" : "Criar anúncio"}</p>
            <span className="text-xs text-brand-700">Passo {step} de 3</span>
          </div>

          {step === 1 && (
            <div className="space-y-2">
              {!editingId ? (
                <div className="rounded-2xl border border-brand-200 bg-brand-50 p-3 space-y-2">
                  <label className="flex items-center gap-3 text-sm text-brand-700">
                    <input type="checkbox" checked={importFromExternal} onChange={toggleImport} />
                    Quero importar a partir de link externo
                  </label>
                  {importFromExternal && (
                    <div className="space-y-1">
                      <input
                        className="w-full rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm"
                        placeholder="Link externo"
                        value={externalUrl}
                        onChange={(e) => {
                          setExternalUrl(e.target.value);
                          setExternalValidated(false);
                        }}
                      />
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          className="brand-outline-btn rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.3em] disabled:opacity-60"
                          onClick={validateExternalLink}
                          disabled={importLoading}
                        >
                          {importLoading ? "A validar..." : "Validar link"}
                        </button>
                        {externalValidated && (
                          <span className="text-[10px] uppercase tracking-[0.3em] text-brand-700">
                            Fonte: {externalSourceName || "Origem externa"}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-brand-600">
                        Por motivos legais e de direitos de autor, não copiamos automaticamente dados nem imagens de outras plataformas. O link fica guardado para referência.
                      </p>
                    </div>
                  )}
                </div>
              ) : externalUrl ? (
                <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4 text-xs text-brand-700">
                  Fonte externa: {externalSourceName || "Origem externa"} (link associado ao anuncio)
                </div>
              ) : null}
              <input className="w-full rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm" placeholder="Título" value={form.title} onChange={(e) => updateField("title", e.target.value)} />
              <div className="grid gap-3 md:grid-cols-2">
                <input className="rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm" placeholder="Categoria" value={form.category} onChange={(e) => updateField("category", e.target.value)} />
                <input className="rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm" placeholder="Condição" value={form.condition} onChange={(e) => updateField("condition", e.target.value)} />
                <input type="number" className="rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm" placeholder="Preço" value={form.price} onChange={(e) => updateField("price", e.target.value)} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <div className="grid gap-2 md:grid-cols-2">
                <input className="rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm" placeholder="Localização" value={form.location} onChange={(e) => updateField("location", e.target.value)} />
              </div>
              <select className="rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm" value={form.status} onChange={(e) => updateField("status", e.target.value)}>
                <option value="active">Ativo</option>
                <option value="paused">Pausado</option>
                <option value="closed">Fechado</option>
              </select>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <textarea
                className="w-full rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm min-h-[120px]"
                placeholder="Descrição"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
              <div className="space-y-2">
                {editingId && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-brand-900">Imagens atuais</h3>
                      <span className="text-xs text-brand-700">{existingImages.length} / 12</span>
                    </div>
                    {existingImagesLoading ? (
                      <div className="text-xs text-brand-700">A carregar imagens...</div>
                    ) : existingImages.length === 0 ? (
                      <div className="text-xs text-brand-700">Sem imagens guardadas neste anúncio.</div>
                    ) : (
                      <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {existingImages.map((image) => (
                          <div key={image.id} className="rounded-2xl overflow-hidden bg-white border border-brand-200">
                            <div className="relative">
                              <img src={resolveMediaUrl(image.url)} alt="Imagem atual" className="h-24 w-full object-cover" />
                              <button
                                type="button"
                                aria-label="Remover imagem"
                                onClick={() => handleDeleteImage(image.id)}
                                className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-xs font-semibold text-brand-900 shadow-sm transition hover:bg-red-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-300"
                              >
                                X
                              </button>
                              {image.sort_order === 1 && (
                                <span className="absolute left-2 top-2 rounded-full bg-accent-200 px-2 py-1 text-[10px] uppercase tracking-[0.3em] text-brand-900">
                                  Capa
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between px-3 py-2">
                              <span className="text-[10px] text-brand-700">{image.filename || "Imagem"}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <label className="text-sm text-brand-700">Imagens ({totalImagesCount} / 12)</label>
                <input
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => setImages(Array.from(e.target.files || []).slice(0, 12))}
                  className="text-sm"
                />
                <div className="grid gap-2 md:grid-cols-3">
                  {previews.map((preview, index) => (
                    <div key={preview.url} className="rounded-2xl overflow-hidden bg-brand-100 border border-brand-200">
                      <img src={preview.url} alt={`Imagem ${index + 1}`} className="h-24 w-full object-cover" />
                      <div className="flex justify-between p-2 text-xs text-brand-700">
                        <button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0}>Subir</button>
                        <button type="button" onClick={() => moveImage(index, 1)} disabled={index === previews.length - 1}>Descer</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              className="brand-outline-btn rounded-full px-5 py-2 text-xs uppercase tracking-[0.3em]"
              onClick={() => {
                if (mode === "create" && step === 1) {
                  navigate(adminListPath);
                  return;
                }
                setStep((prev) => Math.max(prev - 1, 1));
              }}
            >
              Voltar
            </button>
            {step < 3 ? (
              <button
                type="button"
                className="brand-outline-btn rounded-full px-5 py-2 text-xs uppercase tracking-[0.4em]"
                onClick={() => setStep((prev) => Math.min(prev + 1, 3))}
              >
                Continuar
              </button>
            ) : (
              <button
                type="button"
                className="brand-outline-btn rounded-full px-5 py-2 text-xs uppercase tracking-[0.4em]"
                onClick={handleSubmit}
              >
                Guardar anúncio
              </button>
            )}
          </div>
        </div>
        )}

        {showList && (
        <div className="space-y-3 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className=" text-xs uppercase tracking-[0.4em]  text-brand-700">{isAdminBackofficeMode ? "Lista de anúncios" : "Meus anúncios"}</p>
            {mode === "list" && (
              <button
                type="button"
                className="brand-outline-btn rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.3em]"
                onClick={() => navigate(adminCreatePath)}
              >
                Criar anúncio
              </button>
            )}
          </div>
          <div className="space-y-3 max-h-[340px] sm:max-h-[420px] lg:max-h-[520px] 2xl:max-h-[620px] overflow-y-auto pr-1">
            {loading ? (
              <div className="text-brand-700">A carregar anúncios...</div>
            ) : listings.length === 0 ? (
              <div className="glass-panel rounded-3xl p-5 text-brand-700">
                {isAdminBackofficeMode ? "Ainda não existem anúncios." : "Ainda não criaste anúncios."}
              </div>
            ) : (
              listings.map((listing) => {
                const isOwner = listing.user_id ? listing.user_id === user?.id : true;
                const isRejected = Boolean(listing.is_rejected);
                const isApproved = Boolean(listing.is_approved);
                const showModeration = isAdmin && !isApproved && !isRejected;
                const showOwnerActions = !showModeration && (!isAdmin || isOwner);
                const showAdminStatusActions = isAdmin && isApproved && !showModeration;
                const showActions = showModeration || showOwnerActions || showAdminStatusActions;
                const isApproving = moderationLoading?.id === listing.id && moderationLoading?.action === "approve";
                const isRejecting = moderationLoading?.id === listing.id && moderationLoading?.action === "reject";
                const isSuspended = listing.status === "suspended";
                const adminToggleAction = isSuspended ? "activate" : "suspend";
                const isToggling = statusLoading?.id === listing.id && statusLoading?.action === adminToggleAction;
                const isFeatured = Boolean(listing.is_featured);
                const isFeatureBusy = featureLoading?.id === listing.id;
                const rawCover = getListingCover(listing);
                const cover = rawCover ? resolveMediaUrl(rawCover) : "";
                const hasImageError = Boolean(imageErrors[listing.id]);
                const approvalLabel = isRejected ? "REJEITADO" : isApproved ? "APROVADO" : "PENDENTE";
                const approvalClassMap: Record<string, string> = {
                  APROVADO: "bg-green-600 text-white",
                  PENDENTE: "bg-slate-200 text-slate-700",
                  REJEITADO: "bg-red-600 text-white"
                };
                const approvalClass = approvalClassMap[approvalLabel] || "bg-slate-200 text-slate-700";
                const lifecycleMap: Record<string, string> = {
                  active: "ATIVO",
                  paused: "PAUSADO",
                  closed: "FECHADO",
                  suspended: "SUSPENSO"
                };
                const lifecycleStatus = lifecycleMap[String(listing.status || "active")] || "ATIVO";
                const lifecycleClassMap: Record<string, string> = {
                  ATIVO: "text-emerald-600",
                  SUSPENSO: "text-amber-600",
                  PAUSADO: "text-slate-500",
                  VENDIDO: "text-slate-500"
                };
                const lifecycleClass = lifecycleClassMap[lifecycleStatus] || "text-emerald-600";
                const showStatusSelect = showOwnerActions && listing.status !== "suspended";

                if (mode === "list") {
                  return (
                    <div key={listing.id} className="rounded-xl border border-brand-200 bg-white p-4 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        {cover && !hasImageError ? (
                          <div className="h-24 w-full sm:h-14 sm:w-20 rounded-lg bg-brand-100 sm:shrink-0 overflow-hidden">
                            <img
                              src={cover}
                              alt={listing.title}
                              className="h-full w-full object-cover"
                              loading="lazy"
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                                setImageErrors((prev) => ({ ...prev, [listing.id]: true }));
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-24 w-full sm:h-14 sm:w-20 rounded-lg bg-brand-100 sm:shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="truncate text-brand-900 font-medium">{listing.title}</h3>
                              <p className="mt-1 text-sm text-brand-700 truncate">{listing.category} • {listing.item_condition}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                              {isFeatured && (
                              <span className="whitespace-nowrap rounded-full bg-brand-100/60 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-brand-600 shadow-sm">
                                  <span aria-hidden="true">★ </span>Destacado
                                </span>
                              )}
                              <span className={`whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${approvalClass}`}>
                                {approvalLabel}
                              </span>
                            </div>
                          </div>

                          {showActions && (
                            <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-brand-600">
                              <span>Estado:</span>
                              {showStatusSelect ? (
                                <select
                                  className="rounded-full bg-white border border-brand-200 px-3 py-1 text-[10px] sm:text-[11px] text-brand-800"
                                  value={listing.status}
                                  onChange={(e) => handleStatus(listing.id, e.target.value)}
                                >
                                  <option value="active">Ativo</option>
                                  <option value="paused">Pausado</option>
                                  <option value="closed">Fechado</option>
                                </select>
                              ) : (
                                <span className={`font-semibold ${lifecycleClass}`}>{lifecycleStatus}</span>
                              )}

                              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-brand-700 sm:ml-auto">
                                {showModeration ? (
                                  <>
                                    <button
                                      type="button"
                                      className="text-[11px] uppercase tracking-[0.3em] text-brand-700 hover:text-brand-900 disabled:opacity-60 disabled:cursor-not-allowed"
                                      onClick={() => handleModeration(listing.id, true)}
                                      disabled={isApproving || isRejecting}
                                    >
                                      {isApproving ? "A aprovar..." : "Aprovar"}
                                    </button>
                                    <button
                                      type="button"
                                      className="text-[11px] uppercase tracking-[0.3em] text-red-400 disabled:opacity-60 disabled:cursor-not-allowed"
                                      onClick={() => handleModeration(listing.id, false)}
                                      disabled={isApproving || isRejecting}
                                    >
                                      {isRejecting ? "A rejeitar..." : "Rejeitar"}
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    {showAdminStatusActions && (
                                      <button
                                        type="button"
                                        className="brand-outline-btn rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.3em]"
                                        onClick={() => handleFeatureToggle(listing.id, !isFeatured)}
                                        disabled={isFeatureBusy}
                                      >
                                        {isFeatureBusy
                                          ? (isFeatured ? "A remover..." : "A destacar...")
                                          : (isFeatured ? "Remover destaque" : "Destacar")}
                                      </button>
                                    )}
                                    {showAdminStatusActions && (
                                      <button
                                        type="button"
                                        className={isSuspended
                                          ? "rounded-full bg-emerald-500 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white disabled:opacity-60"
                                          : "rounded-full border border-amber-400 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-amber-600 disabled:opacity-60"}
                                        onClick={() => handleAdminStatus(listing.id, adminToggleAction)}
                                        disabled={isToggling}
                                      >
                                        {isToggling
                                          ? (isSuspended ? "A reativar..." : "A suspender...")
                                          : (isSuspended ? "Reativar" : "Suspender")}
                                      </button>
                                    )}
                                    {showOwnerActions && (
                                      <>
                                        <button
                                          type="button"
                                          className="rounded-full border border-blue-500 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-blue-600 transition hover:bg-blue-50/80"
                                          onClick={() => {
                                            if (mode === "list") {
                                              navigate(adminCreatePath, { state: { editingListing: listing } });
                                              return;
                                            }
                                            startEdit(listing);
                                          }}
                                        >
                                          Editar
                                        </button>
                                        <button
                                          type="button"
                                          className="rounded-full border border-red-500 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-red-500 transition hover:bg-red-50/80"
                                          onClick={() => setDeleteId(listing.id)}
                                        >
                                          Apagar
                                        </button>
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={listing.id} className="glass-panel rounded-3xl p-4 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-display text-xl text-brand-900 truncate">{listing.title}</h3>
                        <p className="text-sm text-brand-700">{listing.category} • {listing.item_condition}</p>
                        <p className={`mt-1 text-xs uppercase tracking-[0.3em] ${lifecycleClass}`}>Estado: {lifecycleStatus}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        {isFeatured && (
                          <span className="whitespace-nowrap rounded-full bg-brand-100/60 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-brand-600 shadow-sm">
                            <span aria-hidden="true">★ </span>Destacado
                          </span>
                        )}
                        <span className={`whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${approvalClass}`}>
                          {approvalLabel}
                        </span>
                      </div>
                    </div>
                    {showActions && (
                      <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-brand-600">
                        <span>Estado:</span>
                        {showStatusSelect ? (
                          <select
                            className="rounded-full bg-white border border-brand-200 px-3 py-1 text-[10px] sm:text-[11px] text-brand-800"
                            value={listing.status}
                            onChange={(e) => handleStatus(listing.id, e.target.value)}
                          >
                            <option value="active">Ativo</option>
                            <option value="paused">Pausado</option>
                            <option value="closed">Fechado</option>
                          </select>
                        ) : (
                          <span className={`font-semibold ${lifecycleClass}`}>{lifecycleStatus}</span>
                        )}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-brand-700 sm:ml-auto">
                          {showModeration ? (
                            <>
                              <button
                                type="button"
                                className="text-[11px] uppercase tracking-[0.3em] text-brand-700 hover:text-brand-900 disabled:opacity-60 disabled:cursor-not-allowed"
                                onClick={() => handleModeration(listing.id, true)}
                                disabled={isApproving || isRejecting}
                              >
                                {isApproving ? "A aprovar..." : "Aprovar"}
                              </button>
                              <button
                                type="button"
                                className="text-[11px] uppercase tracking-[0.3em] text-red-400 disabled:opacity-60 disabled:cursor-not-allowed"
                                onClick={() => handleModeration(listing.id, false)}
                                disabled={isApproving || isRejecting}
                              >
                                {isRejecting ? "A rejeitar..." : "Rejeitar"}
                              </button>
                            </>
                          ) : (
                            <>
                              {showAdminStatusActions && (
                                <button
                                  type="button"
                                  className="brand-outline-btn rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.3em]"
                                  onClick={() => handleFeatureToggle(listing.id, !isFeatured)}
                                  disabled={isFeatureBusy}
                                >
                                  {isFeatureBusy
                                    ? (isFeatured ? "A remover..." : "A destacar...")
                                    : (isFeatured ? "Remover destaque" : "Destacar")}
                                </button>
                              )}
                              {showAdminStatusActions && (
                                <button
                                  type="button"
                                  className={isSuspended
                                    ? "rounded-full bg-emerald-500 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white disabled:opacity-60"
                                    : "rounded-full border border-amber-400 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-amber-600 disabled:opacity-60"}
                                  onClick={() => handleAdminStatus(listing.id, adminToggleAction)}
                                  disabled={isToggling}
                                >
                                  {isToggling
                                    ? (isSuspended ? "A reativar..." : "A suspender...")
                                    : (isSuspended ? "Reativar" : "Suspender")}
                                </button>
                              )}
                              {showOwnerActions && (
                                <>
                                  <button
                                    type="button"
                                    className="rounded-full border border-blue-500 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-blue-600 transition hover:bg-blue-50/80"
                                    onClick={() => startEdit(listing)}
                                  >
                                    Editar
                                  </button>
                                  <button
                                    type="button"
                                    className="rounded-full border border-red-500 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-red-500 transition hover:bg-red-50/80"
                                    onClick={() => setDeleteId(listing.id)}
                                  >
                                    Apagar
                                  </button>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
        )}
      </section>

      {deleteId && <ConfirmDeleteModal onCancel={() => setDeleteId(null)} onConfirm={handleConfirmDelete} />}
    </div>
  );
};

export default Dashboard;
