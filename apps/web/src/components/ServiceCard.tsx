import React from "react";

export type Service = {
  id: string;
  name: string;
  description: string;
  price?: string | null;
};

const ServiceCard: React.FC<{ service: Service; onRequest: (service: Service) => void }> = ({ service, onRequest }) => {
  return (
    <div className="glass-panel rounded-3xl p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="font-display text-xl text-brand-900">{service.name}</h3>
        <p className="text-sm text-brand-700">{service.description}</p>
        {service.price && (
          <p className="text-sm text-brand-900 font-medium">{service.price}€</p>
        )}
      </div>
      <button
        className="w-full rounded-full border border-brand-200 py-2 text-xs uppercase tracking-[0.3em] text-brand-700 hover:bg-accent-200 hover:text-brand-900 transition"
        onClick={() => onRequest(service)}
      >
        Pedir proposta
      </button>
    </div>
  );
};

export default ServiceCard;
