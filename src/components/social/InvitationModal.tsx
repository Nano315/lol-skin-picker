// src/components/social/InvitationModal.tsx
import { useState, useEffect, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Gamepad2, LogIn, X } from "lucide-react";
import { Button, GradientText } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface Invitation {
  fromPuuid: string;
  fromName: string;
  roomCode: string;
  receivedAt: number;
}

interface InvitationModalProps {
  invitation: Invitation;
  onAccept: () => void;
  onDismiss: () => void;
  /** Seconds remaining before auto-dismiss (0..10). When provided, the
   *  animated progress bar at the bottom of the card shrinks towards zero. */
  timeRemaining?: number;
}

const EXIT_MS = 200;
const AUTO_DISMISS_TOTAL = 10;

/**
 * Room-invitation popup. Drops the legacy CSS-module blue card in favour of
 * the shared DA language: glass surface, gradient accent orbs, Lucide icons,
 * and the Button primitive. Enter/exit animations use framer-motion; respects
 * prefers-reduced-motion.
 */
export function InvitationModal({
  invitation,
  onAccept,
  onDismiss,
  timeRemaining,
}: InvitationModalProps) {
  const reduced = useReducedMotion();
  const [isExiting, setIsExiting] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    // Let the exit animation play before unmounting via onDismiss.
    window.setTimeout(onDismiss, EXIT_MS);
  }, [onDismiss]);

  const handleAccept = useCallback(() => {
    setIsAccepting(true);
    onAccept();
  }, [onAccept]);

  // Escape key closes the modal.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleDismiss();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleDismiss]);

  const timerWidth =
    timeRemaining !== undefined
      ? Math.max(0, Math.min(100, (timeRemaining / AUTO_DISMISS_TOTAL) * 100))
      : 100;

  const motionEnter = reduced
    ? { opacity: 1, scale: 1, y: 0 }
    : { opacity: 1, scale: 1, y: 0 };
  const motionInitial = reduced ? false : { opacity: 0, scale: 0.94, y: 16 };
  const motionExit = reduced
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.96, y: -8 };

  return (
    <>
      {/* Backdrop — semi-opaque, blurred, click to dismiss. */}
      <motion.div
        data-testid="invitation-backdrop"
        className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={handleDismiss}
        aria-hidden
      />

      {/* Centering wrapper — pointer-events are delegated to the card so the
          backdrop stays clickable around it. */}
      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-6">
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="invitation-title"
          initial={motionInitial}
          animate={isExiting ? motionExit : motionEnter}
          transition={{
            duration: 0.22,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={cn(
            "pointer-events-auto relative w-full max-w-sm overflow-hidden",
            "rounded-3xl border border-white/[0.08] bg-white/[0.04] shadow-glass backdrop-blur-xl"
          )}
        >
          {/* Top-edge gradient highlight — matches GlassCard primitive. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
          />

          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-strong to-accent shadow-accent-glow ring-1 ring-white/20">
                <Gamepad2 className="h-4 w-4 text-white" aria-hidden />
              </span>
              <h3
                id="invitation-title"
                className="m-0 text-base font-bold tracking-tight text-white"
              >
                Room invitation
              </h3>
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Close"
              className={cn(
                "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors",
                "hover:bg-white/[0.08] hover:text-white",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              )}
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-col items-center gap-3 px-6 py-4 text-center">
            <p className="m-0 text-[15px] leading-relaxed text-white/85">
              <GradientText className="font-bold">
                {invitation.fromName}
              </GradientText>{" "}
              invites you to join their room!
            </p>
            {invitation.roomCode && (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                {invitation.roomCode}
              </span>
            )}
          </div>

          {/* Footer actions */}
          <div className="flex items-center gap-2.5 border-t border-white/[0.06] px-5 py-4 pb-[18px]">
            <Button
              variant="secondary"
              size="md"
              className="flex-1"
              onClick={handleDismiss}
              disabled={isAccepting}
            >
              Dismiss
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              onClick={handleAccept}
              disabled={isAccepting}
              loading={isAccepting}
              icon={<LogIn className="h-4 w-4" aria-hidden />}
            >
              {isAccepting ? "Joining..." : "Join"}
            </Button>
          </div>

          {/* Auto-dismiss timer bar */}
          {timeRemaining !== undefined && (
            <div
              data-testid="invitation-timer-bar"
              className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-accent to-accent-strong shadow-[0_0_12px_rgba(139,92,246,0.55)] transition-[width] duration-100 ease-linear"
              style={{ width: `${timerWidth}%` }}
            />
          )}
        </motion.div>
      </div>
    </>
  );
}
