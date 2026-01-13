// src/features/hooks/useToast.ts
import { createContext, useContext } from "react";
import type { ToastType } from "@/components/ui/Toast";

export interface ToastContextValue {
  showToast: (options: { type: ToastType; message: string; duration?: number }) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

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
