// src/components/social/FriendCard.tsx
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Loader2, UserCheck, UserPlus, X } from "lucide-react";
import type { OnlineFriend } from "@/features/types";
import { useInvitations } from "@/features/hooks/useInvitations";
import { inviteErrorMessages } from "@/features/utils/errorMessages";
import { cn } from "@/lib/utils";

interface FriendCardProps {
  friend: OnlineFriend;
  /** Active room code. When set, clicking invite sends directly. */
  roomCode?: string;
  /** If provided, the card can invite even without a current room — clicking
   *  will call this to auto-create the room, then send the invite. Returns
   *  the fresh room code or null on failure. */
  ensureRoom?: () => Promise<string | null>;
  /** True when this friend is already a member of the current room —
   *  hides the invite action and shows a disabled "In room" chip instead. */
  isAlreadyInRoom?: boolean;
}

export function FriendCard({
  friend,
  roomCode,
  ensureRoom,
  isAlreadyInRoom = false,
}: FriendCardProps) {
  const reduced = useReducedMotion();
  const { sendInvite, canInvite, getTimeUntilCanInvite, getInviteState } =
    useInvitations();

  const inviteState = getInviteState(friend.puuid);
  const canSend = canInvite(friend.puuid);
  const timeRemaining = getTimeUntilCanInvite(friend.puuid);

  // Local busy flag covers the (potentially slow) ensureRoom await, before the
  // store-driven `pending` state takes over.
  const [isBusy, setIsBusy] = useState(false);

  const canShowInviteAction = !isAlreadyInRoom && (!!roomCode || !!ensureRoom);

  const handleInvite = async () => {
    if (isAlreadyInRoom || isBusy) return;
    if (!canSend) return;
    if (inviteState.status === "pending" || inviteState.status === "sent") return;

    setIsBusy(true);
    try {
      let code = roomCode;
      if (!code && ensureRoom) {
        code = (await ensureRoom()) ?? undefined;
      }
      if (!code) return;
      sendInvite(friend.puuid, code);
    } finally {
      setIsBusy(false);
    }
  };

  const isPending = inviteState.status === "pending" || isBusy;
  const isSent = inviteState.status === "sent";
  const isFailed = inviteState.status === "failed";
  const isRateLimited = !canSend && timeRemaining > 0;
  const isDisabled = isPending || isSent || isRateLimited;

  const buttonLabel = (() => {
    if (isPending) return "Sending";
    if (isSent) return "Sent";
    if (isFailed) return "Retry";
    if (isRateLimited) return `${timeRemaining}s`;
    return "Invite";
  })();

  const buttonIcon = (() => {
    if (isPending) return <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />;
    if (isSent) return <Check className="h-3.5 w-3.5" aria-hidden />;
    if (isFailed) return <X className="h-3.5 w-3.5" aria-hidden />;
    return <UserPlus className="h-3.5 w-3.5" aria-hidden />;
  })();

  const buttonTitle = (() => {
    if (isSent) return "Invitation sent!";
    if (isFailed) {
      const key = inviteState.error ?? "";
      return inviteErrorMessages[key] ?? key ?? "Invite failed";
    }
    if (isRateLimited) return `Wait ${timeRemaining}s before retrying`;
    if (!roomCode && ensureRoom)
      return `Create a room and invite ${friend.summonerName}`;
    return `Invite ${friend.summonerName} to your room`;
  })();

  return (
    <motion.div
      layout
      initial={reduced ? false : { opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03]",
        "px-4 py-3 transition-colors duration-200",
        "hover:border-white/10 hover:bg-white/[0.06]"
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className="inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse-slow"
          aria-label="Online"
        />
        <span className="truncate text-sm font-medium text-white/90">
          {friend.summonerName}
        </span>
      </div>

      {isAlreadyInRoom ? (
        <span
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/[0.08] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-emerald-200"
          title={`${friend.summonerName} is already in the room`}
        >
          <UserCheck className="h-3 w-3" aria-hidden />
          In room
        </span>
      ) : (
        canShowInviteAction && (
          <motion.button
            type="button"
            onClick={handleInvite}
            disabled={isDisabled}
            title={buttonTitle}
            whileHover={reduced || isDisabled ? undefined : { y: -1 }}
            whileTap={reduced || isDisabled ? undefined : { scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 24 }}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold",
              "transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
              "disabled:cursor-not-allowed",
              isSent &&
                "border border-emerald-400/40 bg-emerald-500/15 text-emerald-200",
              isFailed &&
                "border border-rose-400/40 bg-rose-500/15 text-rose-200 hover:bg-rose-500/20",
              isRateLimited &&
                "border border-white/10 bg-white/[0.04] text-white/60",
              isPending &&
                "border border-white/15 bg-white/[0.08] text-white/80",
              !isSent && !isFailed && !isRateLimited && !isPending &&
                "border border-transparent bg-gradient-to-br from-accent-strong to-accent text-white shadow-accent-glow ring-1 ring-white/20 hover:shadow-accent-glow-strong"
            )}
          >
            {buttonIcon}
            <span>{buttonLabel}</span>
          </motion.button>
        )
      )}
    </motion.div>
  );
}
