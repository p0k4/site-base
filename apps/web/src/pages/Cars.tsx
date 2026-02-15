import React, { useEffect, useState } from "react";
import api from "../lib/api";
import ListingCard, { Listing } from "../components/ListingCard";
import FiltersPanel, { Filters } from "../components/FiltersPanel";
import PageHeader from "../components/PageHeader";

const defaultFilters: Filters = {
  brand: "",
  model: "",
  yearMin: "",
  yearMax: "",
  priceMin: "",
  priceMax: "",
  fuelType: "",
  transmission: "",
  mileageMax: "",
  location: ""
};

const Cars: React.FC = () => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);

  const loadListings = async () => {
    setLoading(true);
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value)
    );

    try {
      const { data } = await api.get<Listing[]>("/listings", { params });
      setListings(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-8">
      <PageHeader
        title="Escolhe o teu próximo carro"
        description="Filtra por marca, ano ou preço. Sem complicações."
      />
      <FiltersPanel filters={filters} onChange={setFilters} onApply={loadListings} />

      {loading ? (
        <div className="text-brand-700">A procurar carros...</div>
      ) : listings.length === 0 ? (
        <div className="glass-panel rounded-3xl p-6 text-brand-700">Sem anúncios disponíveis com estes filtros.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Cars;
