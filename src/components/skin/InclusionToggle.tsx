/**
 * Quick toggle to exclude/include the currently displayed skin or chroma
 * from the random pool. Operates on the current variant: when a chroma is
 * applied we target the chroma id, otherwise we target the base skin id.
 *
 * Granular control across all skins/chromas of a champion lives on the
 * Library page; this is a one-click shortcut for "I don't want to roll into
 * this one again."
 */

import { Ban } from "lucide-react";
import { useChampionExclusions } from "@/features/exclusions/useExclusions";
import { useOnboarding } from "@/features/onboarding/useOnboarding";
import { useToast } from "@/features/hooks/useToast";
import { cn } from "@/lib/utils";

interface InclusionToggleProps {
  championId: number;
  skinId: number;
  chromaId: number;
  disabled?: boolean;
}

export default function InclusionToggle({
  championId,
  skinId,
  chromaId,
  disabled = false,
}: InclusionToggleProps) {
  const { isExcluded, toggle, loading } = useChampionExclusions(championId);
  const { state, hydrated, markCompleted } = useOnboarding();
  const { showToast } = useToast();
  const targetId = chromaId || skinId;
  const excluded = isExcluded(targetId);
  const isDisabled = disabled || loading || !championId || !targetId;

  const label = excluded ? "Include in random pool" : "Exclude from random pool";

  // Couche 3 — first time the user EXCLUDES a skin/chroma, fire a one-shot
  // toast that points them to the Library page where they can manage the
  // full exclusion list. Shown once per install (post welcome flow), then
  // muted forever — repeat clicks should feel snappy without a teaching
  // moment every time.
  const handleClick = () => {
    const willExclude = !excluded;
    void toggle(targetId);
    if (
      willExclude &&
      hydrated &&
      state.welcomeCompleted &&
      !state.exclusionToastSeen
    ) {
      showToast({
        type: "info",
        message: "Excluded from rolls — manage every skin from the Library tab.",
        duration: 5000,
      });
      void markCompleted("exclusionToastSeen");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      title={label}
      aria-label={label}
      aria-pressed={excluded}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-colors duration-150",
        excluded
          ? "border-rose-300/40 bg-rose-300/15 text-rose-300 hover:bg-rose-300/20"
          : "border-white/[0.08] bg-white/[0.04] text-white/50 hover:border-white/20 hover:text-white",
        isDisabled && "cursor-not-allowed opacity-40"
      )}
    >
      <Ban className="h-4 w-4" aria-hidden />
    </button>
  );
}
