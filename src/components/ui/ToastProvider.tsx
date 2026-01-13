import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { Toast, type ToastType } from "./Toast";
import "./Toast.css";

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

interface ToastContextValue {
  showToast: (options: { type: ToastType; message: string; duration?: number }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const MAX_VISIBLE_TOASTS = 3;

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    ({ type, message, duration = 5000 }: { type: ToastType; message: string; duration?: number }) => {
      const id = `toast-${++toastId}`;
      const newToast: ToastItem = { id, type, message, duration };

      setToasts((prev) => {
        // Add new toast to the end
        const updated = [...prev, newToast];
        return updated;
      });
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Only show the first MAX_VISIBLE_TOASTS, rest are queued
  const visibleToasts = toasts.slice(0, MAX_VISIBLE_TOASTS);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container" aria-label="Notifications">
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
      </div>
    </ToastContext.Provider>
  );
}

/**
 * Hook to show toast notifications.
 * Must be used within a ToastProvider.
 *
 * @example
 * const { showToast } = useToast();
 * showToast({ type: 'success', message: 'Room created!' });
 * showToast({ type: 'error', message: 'Connection lost', duration: 8000 });
 */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
