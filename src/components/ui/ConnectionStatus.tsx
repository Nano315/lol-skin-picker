// src/components/ui/ConnectionStatus.tsx
import { Wifi, WifiOff, Loader2, RefreshCw, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ConnectionState =
  | "connected"
  | "connecting"
  | "disconnected"
  | "reconnecting";

type ConnectionStatusProps = {
  state: ConnectionState;
  roomCode?: string;
};

const CONFIG: Record<
  ConnectionState,
  {
    label: string;
    icon: LucideIcon;
    iconClass: string;
    dotClass: string;
    pillClass: string;
    spin?: boolean;
  }
> = {
  connected: {
    label: "Connected",
    icon: Wifi,
    iconClass: "text-emerald-400",
    dotClass: "bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.55)]",
    pillClass:
      "border-emerald-400/25 bg-emerald-500/[0.08] text-emerald-100",
  },
  connecting: {
    label: "Connecting...",
    icon: Loader2,
    iconClass: "text-amber-300 animate-spin",
    dotClass: "bg-amber-300",
    pillClass: "border-amber-400/25 bg-amber-500/[0.08] text-amber-100",
    spin: true,
  },
  disconnected: {
    label: "Disconnected",
    icon: WifiOff,
    iconClass: "text-rose-400",
    dotClass: "bg-rose-400",
    pillClass: "border-rose-400/25 bg-rose-500/[0.08] text-rose-100",
  },
  reconnecting: {
    label: "Reconnecting...",
    icon: RefreshCw,
    iconClass: "text-amber-300 animate-spin",
    dotClass: "bg-amber-300",
    pillClass: "border-amber-400/25 bg-amber-500/[0.08] text-amber-100",
    spin: true,
  },
};

/**
 * Compact connection-state pill. Replaces the legacy CSS-module badge with a
 * Tailwind pill styled with a soft coloured glass tint. A colored dot + Lucide
 * icon mirror the state at a glance.
 */
export function ConnectionStatus({ state, roomCode }: ConnectionStatusProps) {
  const cfg = CONFIG[state];
  const Icon = cfg.icon;
  const title = roomCode ? `${cfg.label} - Room ${roomCode}` : cfg.label;

  return (
    <div
      role="status"
      aria-live="polite"
      title={title}
      className={cn(
        "inline-flex cursor-default items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-200",
        cfg.pillClass
      )}
    >
      <span
        aria-hidden
        className={cn(
          "inline-block h-1.5 w-1.5 shrink-0 rounded-full",
          cfg.dotClass,
          cfg.spin && "animate-pulse-slow"
        )}
      />
      <Icon className={cn("h-3 w-3 shrink-0", cfg.iconClass)} aria-hidden />
      <span>{cfg.label}</span>
    </div>
  );
}
