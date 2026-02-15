import React from "react";
import type { ToastType } from "../../context/ToastContext";

type ToastProps = {
  toast: {
    id: number;
    message: string;
    type: ToastType;
    visible: boolean;
  };
  onClose: () => void;
};

const accentByType: Record<ToastType, string> = {
  success: "border-l-emerald-500",
  warning: "border-l-amber-500",
  error: "border-l-red-500",
  info: "border-l-brand-300"
};

const iconBgByType: Record<ToastType, string> = {
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  error: "bg-red-100 text-red-700",
  info: "bg-accent-200 text-brand-700"
};

const labelByType: Record<ToastType, string> = {
  success: "Sucesso",
  warning: "Aviso",
  error: "Erro",
  info: "Info"
};

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const accentClass = accentByType[toast.type];
  const iconClass = iconBgByType[toast.type];

  return (
    <div
      className={`pointer-events-auto w-full transition-all duration-200 ease-out ${toast.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}`}
      role="status"
      aria-label={labelByType[toast.type]}
    >
      <div
        className={`flex items-start gap-3 rounded-2xl border border-black/10 border-l-4 bg-white/95 px-4 py-3 text-sm text-brand-900 shadow-lg backdrop-blur-sm ${accentClass}`}
      >
        <span className={`mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full ${iconClass}`} aria-hidden="true">
          {toast.type === "success" && (
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M16.704 5.29a1 1 0 0 1 0 1.416l-7.5 7.5a1 1 0 0 1-1.416 0l-3.5-3.5a1 1 0 1 1 1.416-1.416l2.792 2.792 6.792-6.792a1 1 0 0 1 1.416 0Z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {toast.type === "warning" && (
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l6.518 11.59c.75 1.334-.213 2.99-1.743 2.99H3.482c-1.53 0-2.493-1.656-1.743-2.99l6.518-11.59Zm1.743 5.15a1 1 0 0 0-1 1v3.5a1 1 0 1 0 2 0v-3.5a1 1 0 0 0-1-1Zm0 8.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {toast.type === "error" && (
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7.28 7.28a1 1 0 0 1 1.414 0L10 8.586l1.306-1.306a1 1 0 1 1 1.414 1.414L11.414 10l1.306 1.306a1 1 0 0 1-1.414 1.414L10 11.414l-1.306 1.306a1 1 0 0 1-1.414-1.414L8.586 10 7.28 8.694a1 1 0 0 1 0-1.414Z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {toast.type === "info" && (
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M18 10A8 8 0 1 1 2 10a8 8 0 0 1 16 0ZM9 8a1 1 0 1 0 2 0 1 1 0 0 0-2 0Zm1 2a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0v-3a1 1 0 0 0-1-1Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </span>
        <span className="flex-1 text-sm">{toast.message}</span>
        <button
          type="button"
          onClick={onClose}
          className="-m-1 rounded-full p-1 text-xs uppercase tracking-[0.3em] text-brand-600 transition hover:text-brand-900"
          aria-label="Fechar"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
