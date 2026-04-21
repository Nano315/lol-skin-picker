import { NavLink, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import fallbackIcon from "/fallback-icon.png?url";
import appIcon from "/icon.ico?url";
import { useInvitationBadgeCount } from "@/features/hooks/useInvitationQueue";
import { SocketConnectionIndicator } from "@/components/common/SocketConnectionIndicator";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; withBadge?: boolean };

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Home" },
  { to: "/rooms", label: "Rooms", withBadge: true },
  { to: "/priority", label: "Priority" },
  { to: "/settings", label: "Settings" },
];

export default function Header({
  status,
  phase,
  iconId,
}: {
  status: string;
  phase: string;
  iconId: number | null;
}) {
  const location = useLocation();
  const invitationCount = useInvitationBadgeCount();
  const reduced = useReducedMotion();
  const showBadge = invitationCount > 0 && location.pathname !== "/rooms";
  const iconUrl = iconId
    ? `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${iconId}.jpg`
    : fallbackIcon;

  const connectionLabel = () => {
    if (status === "disconnected" || phase === "Unknown")
      return "Not connected to client";
    if (status === "checking") return "Searching for client…";
    return status === "connected" ? "Connected to client" : status;
  };

  const dotColor =
    status === "connected"
      ? "bg-accent-strong"
      : status === "checking"
      ? "bg-amber-400"
      : "bg-red-400";

  return (
    <header className="sticky top-3 z-20 mx-auto mt-3 flex w-[min(1200px,calc(100%-2rem))] items-center justify-between gap-4 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 shadow-glass backdrop-blur-xl">
      {/* Left: brand + nav */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2.5 pl-1">
          <img
            src={appIcon}
            alt=""
            aria-hidden
            className="h-7 w-7 shrink-0 rounded-lg object-contain drop-shadow-[0_4px_14px_rgba(139,92,246,0.45)]"
          />
          <span className="text-base font-bold tracking-tight text-white">
            Skin{" "}
            <span className="bg-gradient-to-r from-white to-accent-strong bg-clip-text text-transparent">
              Picker
            </span>
          </span>
        </div>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "text-white"
                    : "text-ink/70 hover:text-white"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full border border-accent/50 bg-gradient-to-br from-accent/15 to-accent-strong/10"
                      transition={
                        reduced
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 380, damping: 32 }
                      }
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                  {item.withBadge && showBadge && (
                    <span className="absolute -right-1 -top-1 z-20 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-bg animate-pulse-slow">
                      {invitationCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Right: connection + avatar */}
      <div className="flex items-center gap-3">
        {status === "connected" && <SocketConnectionIndicator />}
        <div className="hidden items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs text-ink/80 sm:flex">
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              dotColor,
              status === "connected" && "animate-pulse-slow"
            )}
          />
          <span className="capitalize">{connectionLabel()}</span>
        </div>
        {iconUrl && (
          <img
            src={iconUrl}
            alt="summoner"
            className="h-9 w-9 rounded-full border border-white/10 object-cover shadow-glass"
          />
        )}
      </div>
    </header>
  );
}
