// src/components/ConnectionStatusIndicator.tsx
import type { AppError } from "@/features/types";
import { errorMessages } from "@/features/utils/errorMessages";
import { Button } from "@/components/ui";
import { WifiOff, PlugZap, RefreshCw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  isConnected: boolean;
  error: AppError | null;
  isRetrying?: boolean;
  onRetry?: () => void;
};

/**
 * Compact connection banner. Two states:
 *   - network error (rose) with optional retry CTA
 *   - LCU disconnected (amber)
 * Rendered inline above the bento grid; returns null when everything is fine.
 */
export function ConnectionStatusIndicator({
  isConnected,
  error,
  isRetrying,
  onRetry,
}: Props) {
  if (error && error.code === "NETWORK_ERROR") {
    return (
      <div
        className={cn(
          "mb-5 flex flex-wrap items-center justify-center gap-3",
          "rounded-2xl border border-rose-400/30 bg-rose-500/[0.06] px-5 py-3",
          "text-sm font-medium text-rose-100 shadow-glass backdrop-blur-xl"
        )}
        role="alert"
      >
        <WifiOff className="h-4 w-4 shrink-0" aria-hidden />
        <span>{errorMessages[error.code] || error.message}</span>
        {onRetry && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onRetry}
            disabled={isRetrying}
            icon={
              isRetrying ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" aria-hidden />
              )
            }
          >
            {isRetrying ? "Reconnecting..." : "Retry"}
          </Button>
        )}
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div
        className={cn(
          "mb-5 flex flex-wrap items-center justify-center gap-3",
          "rounded-2xl border border-amber-400/30 bg-amber-500/[0.06] px-5 py-3",
          "text-sm font-medium text-amber-100 shadow-glass backdrop-blur-xl"
        )}
        role="status"
      >
        <PlugZap className="h-4 w-4 shrink-0" aria-hidden />
        <span>Disconnected from League Client. Waiting for connection...</span>
      </div>
    );
  }

  return null;
}
