import React from "react";

type ListingStatusBadgeProps = {
  isApproved?: boolean;
  isRejected?: boolean;
};

const ListingStatusBadge: React.FC<ListingStatusBadgeProps> = ({ isApproved, isRejected }) => {
  const label = isRejected ? "REJEITADO" : isApproved ? "APROVADO" : "EM ANÁLISE";
  const styles = isRejected
    ? "bg-red-50 text-red-500 border border-red-200"
    : isApproved
      ? "bg-brand-100 text-brand-800 border border-brand-200"
      : "bg-white/70 text-brand-700 border border-black/10";
  const dot = isRejected ? "✕" : "●";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide ${styles}`}>
      <span aria-hidden="true">{dot}</span>
      {label}
    </span>
  );
};

export default ListingStatusBadge;
