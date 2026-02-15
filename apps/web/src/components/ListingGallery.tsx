import React, { useMemo, useState } from "react";
import { resolveMediaUrl } from "../lib/media";

type ListingGalleryProps = {
  images: string[];
  title?: string;
  overlayAction?: React.ReactNode;
};

const ListingGallery: React.FC<ListingGalleryProps> = ({ images, title, overlayAction }) => {
  const sources = useMemo(() => {
    const cleaned = images.filter(Boolean);
    return cleaned.length ? cleaned : ["/placeholder.svg"];
  }, [images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = sources[activeIndex] || sources[0];
  const hasMultiple = sources.length > 1;

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + sources.length) % sources.length);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % sources.length);
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden rounded-3xl bg-brand-100 shadow-sm">
        <img
          src={resolveMediaUrl(activeImage)}
          alt={title ? `${title} - imagem ${activeIndex + 1}` : "Imagem do anúncio"}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {overlayAction ? <div className="absolute inset-0 pointer-events-none">{overlayAction}</div> : null}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Imagem anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 sm:p-2 text-brand-900 shadow-sm transition hover:bg-brand-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-300"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Imagem seguinte"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 sm:p-2 text-brand-900 shadow-sm transition hover:bg-brand-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-300"
            >
              ›
            </button>
          </>
        )}
      </div>
      <div className="overflow-visible pt-2">
        <div className="flex justify-start gap-2 sm:gap-3 overflow-x-auto overflow-y-visible pl-2 pb-1">
          {sources.map((image, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`ml-1 flex-shrink-0 rounded-2xl border ${isActive ? "border-brand-500 ring-2 ring-brand-500 ring-offset-2 ring-offset-white" : "border-transparent"} bg-white p-1 shadow-sm transition`}
                aria-label={`Selecionar imagem ${index + 1}`}
              >
                <img
                  src={resolveMediaUrl(image)}
                  alt={title ? `${title} miniatura ${index + 1}` : "Miniatura do anúncio"}
                  className={`h-16 w-16 sm:h-20 sm:w-20 rounded-xl object-cover ${isActive ? "opacity-100" : "opacity-70 hover:opacity-100"}`}
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ListingGallery;
