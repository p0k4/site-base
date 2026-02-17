import React from "react";

type Filters = {
  search: string;
  category: string;
  condition: string;
  priceMin: string;
  priceMax: string;
  location: string;
};

const FiltersPanel: React.FC<{
  filters: Filters;
  onChange: (filters: Filters) => void;
  onApply: () => void;
}> = ({ filters, onChange, onApply }) => {
  const update = (field: keyof Filters, value: string) => {
    onChange({ ...filters, [field]: value });
  };

  return (
    <div className="glass-panel rounded-3xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-brand-900">Filtrar</h3>
        <button
          onClick={onApply}
          className="brand-outline-btn px-4 py-2 text-xs uppercase tracking-[0.3em] rounded-full"
        >
          Aplicar filtros
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <input
          className="rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm"
          placeholder="Pesquisa"
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
        />
        <input
          className="rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm"
          placeholder="Categoria"
          value={filters.category}
          onChange={(e) => update("category", e.target.value)}
        />
        <input
          type="number"
          className="rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm"
          placeholder="Preço mínimo"
          value={filters.priceMin}
          onChange={(e) => update("priceMin", e.target.value)}
        />
        <input
          type="number"
          className="rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm"
          placeholder="Preço máximo"
          value={filters.priceMax}
          onChange={(e) => update("priceMax", e.target.value)}
        />
        <input
          className="rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm"
          placeholder="Condição"
          value={filters.condition}
          onChange={(e) => update("condition", e.target.value)}
        />
        <input
          className="rounded-2xl bg-white border border-brand-200 px-3 py-2 text-sm"
          placeholder="Localização"
          value={filters.location}
          onChange={(e) => update("location", e.target.value)}
        />
      </div>
    </div>
  );
};

export default FiltersPanel;
export type { Filters };
