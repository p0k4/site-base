import React from "react";
import { Link } from "react-router-dom";
import { resolveMediaUrl } from "../lib/media";

export type Listing = {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: string | number;
  fuel_type: string;
  transmission: string;
  mileage: number;
  location: string;
  source_type?: string;
  source_name?: string | null;
  external_url?: string | null;
  external_ref?: string | null;
  is_featured?: boolean;
  cover_image_url?: string | null;
  coverImageUrl?: string | null;
  images?: { url: string }[];
};

const formatPrice = (price: string | number) => {
  const value = typeof price === "string" ? Number(price) : price;
  return value.toLocaleString("pt-PT", { style: "currency", currency: "EUR" });
};

const ListingCard: React.FC<{ listing: Listing }> = ({ listing }) => {
  const placeholder = "/placeholder.svg";
  const coverUrl =
    listing.coverImageUrl ||
    listing.cover_image_url ||
    listing.images?.[0]?.url ||
    placeholder;
  const cover = resolveMediaUrl(coverUrl);

  return (
    <Link
      to={`/carros/${listing.id}`}
      className="group rounded-3xl overflow-hidden bg-white border border-brand-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="h-44 bg-brand-100 overflow-hidden">
        <img
          src={cover}
          alt={listing.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(event) => {
            const target = event.currentTarget;
            if (!target.src.endsWith(placeholder)) {
              target.src = placeholder;
            }
          }}
        />
      </div>
      <div className="p-4 sm:p-5 space-y-3">
        <div>
          <h3 className="font-display text-lg sm:text-xl text-brand-900">{listing.title}</h3>
          <p className="text-xs sm:text-sm text-brand-700">{listing.brand} {listing.model} • {listing.year}</p>
        </div>
        {listing.external_url && (
          <span className="listing-chip">
            Anúncio com link externo
          </span>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-base sm:text-lg font-semibold text-brand-600">{formatPrice(listing.price)}</span>
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-brand-700 max-w-[120px] sm:max-w-none truncate">
            {listing.location}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] sm:text-xs text-brand-700">
          <span>{listing.fuel_type}</span>
          <span>•</span>
          <span>{listing.transmission}</span>
          <span>•</span>
          <span>{listing.mileage.toLocaleString("pt-PT")} km</span>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
