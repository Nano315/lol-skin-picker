// src/components/common/SocketConnectionIndicator.tsx
import { useSocketConnectionStatus } from "@/features/hooks/useSocketConnectionStatus";

/**
 * Visual indicator for socket connection status (Story 4.8).
 * - Hidden when connected (optional subtle indicator)
 * - Shows "Reconnecting..." when connecting
 * - Shows warning when disconnected
 */
export function SocketConnectionIndicator() {
  const status = useSocketConnectionStatus();

  // Don't show anything when connected (or show minimal indicator)
  if (status === "connected") {
    return null;
  }

  const isConnecting = status === "connecting";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: 500,
        background: isConnecting ? "rgba(251, 191, 36, 0.15)" : "rgba(239, 68, 68, 0.15)",
        color: isConnecting ? "#fbbf24" : "#ef4444",
        animation: isConnecting ? "pulse 1.5s ease-in-out infinite" : undefined,
      }}
    >
      <span
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: isConnecting ? "#fbbf24" : "#ef4444",
        }}
      />
      {isConnecting ? "Reconnecting..." : "Server offline"}
    </div>
  );
}
