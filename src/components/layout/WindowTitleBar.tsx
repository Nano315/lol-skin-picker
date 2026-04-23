import { useEffect, useState } from "react";
import { Minus, Square, Copy, X } from "lucide-react";
import { cn } from "@/lib/utils";
import UpdateAvailableChip from "@/components/UpdateAvailableChip";

/**
 * Custom titlebar for the frameless Electron window. Sits at top-0 with a
 * drag region for moving the window, and 3 no-drag controls on the right:
 * minimize, toggle maximize/restore, close. The maximize icon swaps between
 * Square (restore ≠> maximize) and Copy (restore from maximized).
 */
export default function WindowTitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    void window.windowControls?.isMaximized().then(setIsMaximized);
    unsub = window.windowControls?.onMaximizeChange(setIsMaximized);
    return () => unsub?.();
  }, []);

  const handleMinimize = () => void window.windowControls?.minimize();
  const handleToggleMax = () => void window.windowControls?.toggleMaximize();
  const handleClose = () => void window.windowControls?.close();

  return (
    <div className="drag-region flex h-8 shrink-0 items-center justify-end">
      {/* Pastille update : se monte en permanence, conditionne son rendu en
          interne via le hook (pas d'affichage si rien a signaler). Place a
          gauche des controles fenetre pour ne pas perturber la zone de drag. */}
      <UpdateAvailableChip />
      <div className="no-drag flex h-full items-center">
        <TitleBarButton onClick={handleMinimize} aria-label="Minimize">
          <Minus className="h-3.5 w-3.5" aria-hidden />
        </TitleBarButton>
        <TitleBarButton onClick={handleToggleMax} aria-label={isMaximized ? "Restore" : "Maximize"}>
          {isMaximized ? (
            <Copy className="h-3 w-3 -scale-x-100" aria-hidden />
          ) : (
            <Square className="h-3 w-3" aria-hidden />
          )}
        </TitleBarButton>
        <TitleBarButton onClick={handleClose} aria-label="Close" variant="danger">
          <X className="h-3.5 w-3.5" aria-hidden />
        </TitleBarButton>
      </div>
    </div>
  );
}

function TitleBarButton({
  children,
  onClick,
  variant = "default",
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
  "aria-label": string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "group inline-flex h-full w-11 items-center justify-center text-ink/60 transition-colors",
        variant === "danger"
          ? "hover:bg-red-500/90 hover:text-white"
          : "hover:bg-white/[0.08] hover:text-white"
      )}
    >
      {children}
    </button>
  );
}
