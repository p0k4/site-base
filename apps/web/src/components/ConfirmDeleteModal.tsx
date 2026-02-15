import React, { useEffect } from "react";

type ConfirmDeleteModalProps = {
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ onCancel, onConfirm }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("modal-open");

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("modal-open");
    };
  }, [onCancel]);

  const handleOverlayMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      className="app-modal fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onMouseDown={handleOverlayMouseDown}
      role="presentation"
    >
      <div className="app-modal-card w-full max-w-md rounded-xl bg-white p-6 shadow-xl" role="dialog" aria-modal="true">
        <h3 className="text-lg font-semibold text-brand-900">Tem a certeza que pretende apagar este anúncio?</h3>
        <p className="mt-2 text-sm text-brand-600">Esta ação não pode ser revertida.</p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            className="rounded-full border border-brand-300 px-4 py-2 text-sm text-brand-700 transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="rounded-full bg-red-500 px-4 py-2 text-sm text-white shadow-sm transition hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
            onClick={onConfirm}
          >
            Apagar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
