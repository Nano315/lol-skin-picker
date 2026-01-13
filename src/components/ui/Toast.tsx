import { useEffect, useState, useCallback } from "react";
import "./Toast.css";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onDismiss: (id: string) => void;
}

const ICONS: Record<ToastType, string> = {
  success: "fa-circle-check",
  error: "fa-circle-xmark",
  info: "fa-circle-info",
  warning: "fa-triangle-exclamation",
};

export function Toast({ id, type, message, duration = 5000, onDismiss }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    // Wait for exit animation to complete
    setTimeout(() => {
      onDismiss(id);
    }, 300);
  }, [id, onDismiss]);

  useEffect(() => {
    if (isPaused || duration <= 0) return;

    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, isPaused, handleDismiss]);

  return (
    <div
      className={`toast toast--${type} ${isExiting ? "toast--exiting" : ""}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="alert"
      aria-live="polite"
    >
      <i className={`fa-solid ${ICONS[type]} toast__icon`} aria-hidden="true" />
      <span className="toast__message">{message}</span>
      <button
        className="toast__dismiss"
        onClick={handleDismiss}
        aria-label="Dismiss notification"
      >
        <i className="fa-solid fa-xmark" aria-hidden="true" />
      </button>
    </div>
  );
}
