// src/components/common/SocketConnectionIndicator.tsx
import { Loader2, WifiOff } from "lucide-react";
import { useSocketConnectionStatus } from "@/features/hooks/useSocketConnectionStatus";
import { cn } from "@/lib/utils";

/**
 * Visual indicator for socket connection status (Story 4.8).
 * - Hidden when connected (avoids chrome noise in the happy path)
 * - Shows "Reconnecting..." when connecting
 * - Shows "Server offline" warning when fully disconnected
 *
 * Compact Tailwind pill matching the overall DA (soft-tinted glass).
 */
export function SocketConnectionIndicator() {
  const status = useSocketConnectionStatus();
  if (status === "connected") return null;

  const isConnecting = status === "connecting";

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-200",
        isConnecting
          ? "border-amber-400/30 bg-amber-500/[0.1] text-amber-100"
          : "border-rose-400/30 bg-rose-500/[0.1] text-rose-100"
      )}
    >
      {isConnecting ? (
        <Loader2 className="h-3 w-3 shrink-0 animate-spin" aria-hidden />
      ) : (
        <WifiOff className="h-3 w-3 shrink-0" aria-hidden />
      )}
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-80 animate-pulse-slow" aria-hidden />
      <span>{isConnecting ? "Reconnecting..." : "Server offline"}</span>
    </div>
  );
}
