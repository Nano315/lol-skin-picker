import { useState, useCallback, type ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { Toast, type ToastType } from "./Toast";
import { ToastContext } from "@/features/hooks/useToast";

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

let toastId = 0;

const MAX_VISIBLE_TOASTS = 3;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    ({
      type,
      message,
      duration = 5000,
    }: {
      type: ToastType;
      message: string;
      duration?: number;
    }) => {
      const id = `toast-${++toastId}`;
      const newToast: ToastItem = { id, type, message, duration };
      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const visibleToasts = toasts.slice(0, MAX_VISIBLE_TOASTS);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-label="Notifications"
        className="pointer-events-none fixed right-4 top-4 z-[9999] flex max-w-sm flex-col gap-3"
      >
        <AnimatePresence initial={false}>
          {visibleToasts.map((toast) => (
            <Toast
              key={toast.id}
              id={toast.id}
              type={toast.type}
              message={toast.message}
              duration={toast.duration}
              onDismiss={dismissToast}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
