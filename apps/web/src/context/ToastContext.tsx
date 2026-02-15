import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Toast from "../components/ui/toast";

export type ToastType = "success" | "warning" | "error" | "info";

export type ToastPayload = {
  message: string;
  type?: ToastType;
  duration?: number;
};

type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
  visible: boolean;
};

type ToastContextValue = {
  showToast: (payload: ToastPayload) => void;
  dismissToast: (id: number) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const DEFAULT_DURATION = 3500;
const EXIT_MS = 240;
const MAX_TOASTS = 4;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counterRef = useRef(0);
  const timersRef = useRef(new Map<number, { hide: number; remove: number }>());

  const clearTimers = useCallback((id: number) => {
    const timers = timersRef.current.get(id);
    if (!timers) return;
    window.clearTimeout(timers.hide);
    window.clearTimeout(timers.remove);
    timersRef.current.delete(id);
  }, []);

  const scheduleRemoval = useCallback((id: number, duration: number) => {
    const hide = window.setTimeout(() => {
      setToasts((prev) => prev.map((toast) => (toast.id === id ? { ...toast, visible: false } : toast)));
    }, duration);
    const remove = window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
      timersRef.current.delete(id);
    }, duration + EXIT_MS);
    timersRef.current.set(id, { hide, remove });
  }, []);

  const showToast = useCallback((payload: ToastPayload) => {
    const id = Date.now() + counterRef.current++;
    const toast: ToastItem = {
      id,
      message: payload.message,
      type: payload.type || "info",
      visible: true
    };

    setToasts((prev) => {
      const next = [toast, ...prev];
      if (next.length <= MAX_TOASTS) return next;
      const trimmed = next.slice(0, MAX_TOASTS);
      next.slice(MAX_TOASTS).forEach((item) => clearTimers(item.id));
      return trimmed;
    });

    scheduleRemoval(id, payload.duration ?? DEFAULT_DURATION);
  }, [clearTimers, scheduleRemoval]);

  const dismissToast = useCallback((id: number) => {
    clearTimers(id);
    setToasts((prev) => prev.map((toast) => (toast.id === id ? { ...toast, visible: false } : toast)));
    const remove = window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
      timersRef.current.delete(id);
    }, EXIT_MS);
    timersRef.current.set(id, { hide: remove, remove });
  }, [clearTimers]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timers) => {
        window.clearTimeout(timers.hide);
        window.clearTimeout(timers.remove);
      });
      timersRef.current.clear();
    };
  }, []);

  const value = useMemo<ToastContextValue>(() => ({
    showToast,
    dismissToast
  }), [dismissToast, showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed right-4 top-4 z-[60] flex w-[min(420px,calc(100vw-2rem))] flex-col gap-3 sm:right-6 sm:top-6"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => dismissToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return {
    showToast: ctx.showToast,
    dismissToast: ctx.dismissToast,
    success: (message: string) => ctx.showToast({ message, type: "success" }),
    warning: (message: string) => ctx.showToast({ message, type: "warning" }),
    error: (message: string) => ctx.showToast({ message, type: "error" }),
    info: (message: string) => ctx.showToast({ message, type: "info" })
  };
};
