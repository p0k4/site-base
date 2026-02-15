import React, { useEffect, useState } from "react";
import api from "../lib/api";
import ListingCard, { Listing } from "../components/ListingCard";
import { appConfig } from "../config/appConfig";
import { brandText } from "../config/branding";

const Home: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [tab, setTab] = useState<"featured" | "all">("featured");

  useEffect(() => {
    api.get<Listing[]>("/listings")
      .then((res) => setListings(res.data))
      .catch(() => setListings([]));
  }, []);

  const visibleListings = listings;
  const featuredListings = React.useMemo(
    () => visibleListings.filter((item: any) => item?.is_featured).slice(0, 3),
    [visibleListings]
  );
  const listingsToRender = tab === "featured" ? featuredListings : visibleListings;
  const featuredCount = featuredListings.length;
  const allCount = visibleListings.length;
  const heroLogo = appConfig.BRAND_LOGO_PATH;
  const heroLogoAlt = appConfig.APP_NAME;

  return (
    <div className="space-y-12 sm:space-y-16 pb-12 sm:pb-16">
      <section className="relative">
        <div className="w-full max-w-7xl lg:max-w-[94vw] mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-[2rem] border border-black/5 shadow-glow hero-premium">
            <div className="hero-blob hero-blob-1" aria-hidden="true" />
            <div className="hero-blob hero-blob-2" aria-hidden="true" />
            <div className="relative z-10 grid gap-8 sm:gap-10 px-5 py-8 sm:px-8 sm:py-12 lg:px-14 lg:py-24 items-center lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4 sm:space-y-6 animate-rise">
                <h1 className="hero-title max-w-[18ch]">
                  {brandText.heroTitle}
                </h1>
                <p className="mt-3 text-[13px] sm:text-sm md:text-base font-normal text-brand-600 leading-relaxed max-w-sm sm:max-w-md break-normal whitespace-normal hyphens-none">
                  {brandText.heroSubtitle}
                </p>
              </div>
              <div className="hidden lg:block" aria-hidden="true" />
            </div>
            {heroLogo ? (
              <div className="hero-brand" aria-hidden="true">
                <img src={heroLogo} alt={heroLogoAlt} />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex justify-center md:justify-start">
          <div className="relative inline-flex items-center rounded-full border border-brand-200/80 bg-white/70 p-1 shadow-sm w-full sm:w-auto justify-between">
            <span
              className={`absolute inset-y-1 left-1 w-1/2 rounded-full border border-brand-300 bg-accent-200/70 shadow-sm transition-transform duration-200 ease-out ${tab === "featured" ? "translate-x-0" : "translate-x-full"}`}
              aria-hidden="true"
            />
            <button
              type="button"
              onClick={() => setTab("featured")}
              className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.4em] transition ${tab === "featured" ? "text-brand-900" : "text-brand-600 hover:text-brand-900"}`}
              aria-pressed={tab === "featured"}
            >
              Destaques
              <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] text-brand-700 shadow-sm">
                {featuredCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setTab("all")}
              className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.4em] transition ${tab === "all" ? "text-brand-900" : "text-brand-600 hover:text-brand-900"}`}
              aria-pressed={tab === "all"}
            >
              Anúncios
              <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] text-brand-700 shadow-sm">
                {allCount}
              </span>
            </button>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {listingsToRender.length === 0 ? (
            tab === "featured" ? (
              <div className="md:col-span-3 rounded-3xl border border-brand-200 bg-white p-8 text-sm text-brand-700 shadow-sm">
                Ainda não existem anúncios destacados.
              </div>
            ) : (
              [1, 2, 3].map((item) => (
                <div key={item} className="rounded-3xl border border-brand-200 bg-white p-6 space-y-3 shadow-sm">
                  <div className="h-32 rounded-2xl bg-brand-100" />
                  <div className="h-4 bg-brand-100 rounded" />
                  <div className="h-3 bg-brand-100 rounded w-3/4" />
                </div>
              ))
            )
          ) : (
            listingsToRender.map((listing) => <ListingCard key={listing.id} listing={listing} />)
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;
