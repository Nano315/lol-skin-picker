// src/components/rooms/KickConfirmModal.tsx
import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { UserMinus, X } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface KickConfirmModalProps {
  memberName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const EXIT_MS = 200;

/**
 * Owner-only destructive confirmation. Mirrors `InvitationModal`'s glass +
 * gradient language so the room views feel consistent. Escape and the
 * backdrop both cancel; only the explicit "Kick" button confirms.
 */
export function KickConfirmModal({
  memberName,
  onConfirm,
  onCancel,
}: KickConfirmModalProps) {
  const reduced = useReducedMotion();
  const [isExiting, setIsExiting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleCancel = useCallback(() => {
    setIsExiting(true);
    window.setTimeout(onCancel, EXIT_MS);
  }, [onCancel]);

  const handleConfirm = useCallback(() => {
    setIsConfirming(true);
    onConfirm();
  }, [onConfirm]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCancel]);

  const motionEnter = reduced
    ? { opacity: 1, scale: 1, y: 0 }
    : { opacity: 1, scale: 1, y: 0 };
  const motionInitial = reduced ? false : { opacity: 0, scale: 0.94, y: 16 };
  const motionExit = reduced
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.96, y: -8 };

  return (
    <>
      <motion.div
        data-testid="kick-confirm-backdrop"
        className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={handleCancel}
        aria-hidden
      />

      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-6">
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="kick-confirm-title"
          initial={motionInitial}
          animate={isExiting ? motionExit : motionEnter}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "pointer-events-auto relative w-full max-w-sm overflow-hidden",
            "rounded-3xl border border-white/[0.08] bg-white/[0.04] shadow-glass backdrop-blur-xl"
          )}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
          />

          <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-rose-700 shadow-[0_0_16px_rgba(244,63,94,0.45)] ring-1 ring-white/20">
                <UserMinus className="h-4 w-4 text-white" aria-hidden />
              </span>
              <h3
                id="kick-confirm-title"
                className="m-0 text-base font-bold tracking-tight text-white"
              >
                Remove member?
              </h3>
            </div>
            <button
              type="button"
              onClick={handleCancel}
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

          <div className="flex flex-col items-center gap-3 px-6 py-4 text-center">
            <p className="m-0 text-[15px] leading-relaxed text-white/85">
              Remove{" "}
              <span className="font-bold text-white">{memberName}</span> from
              the room?
            </p>
            <p className="m-0 text-xs text-white/55">
              They'll be disconnected immediately. They can re-join later with
              the room code.
            </p>
          </div>

          <div className="flex items-center gap-2.5 border-t border-white/[0.06] px-5 py-4 pb-[18px]">
            <Button
              variant="secondary"
              size="md"
              className="flex-1"
              onClick={handleCancel}
              disabled={isConfirming}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1 !bg-gradient-to-b !from-rose-500 !to-rose-700 !shadow-[0_0_16px_rgba(244,63,94,0.45)]"
              onClick={handleConfirm}
              disabled={isConfirming}
              loading={isConfirming}
              icon={<UserMinus className="h-4 w-4" aria-hidden />}
            >
              {isConfirming ? "Removing..." : "Remove"}
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
