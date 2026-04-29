import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { GroupSkinOption, ColorSynergy } from "@/features/roomsClient";

type SuggestionStatus = "idle" | "pending" | "success" | "error";

type ColorSuggestionButtonProps = {
  synergy: ColorSynergy;
  skinOptions: GroupSkinOption[];
  totalMembers: number;
  suggestColor: (skinId: number, chromaId: number) => Promise<{ success: boolean; error?: string }>;
  disabled?: boolean;
};

/**
 * Animated color orb used by the commander strip. Status transitions are
 * driven by framer-motion variants so the CSS-module animations can retire.
 *
 * - idle: resting orb, slight hover scale
 * - pending: pulsing scale + glow, cursor wait
 * - success: quick pop with emerald ring
 * - error: horizontal shake with rose border
 */
const variants: Variants = {
  idle: {
    scale: 1,
    boxShadow: "0 0 0 0 rgba(255,255,255,0)",
    borderColor: "rgba(255,255,255,0.1)",
    transition: { duration: 0.2, ease: "easeOut" },
  },
  pending: {
    scale: [1, 1.1, 1],
    boxShadow: [
      "0 0 8px rgba(255,255,255,0.3)",
      "0 0 16px rgba(255,255,255,0.55)",
      "0 0 8px rgba(255,255,255,0.3)",
    ],
    borderColor: "rgba(255,255,255,0.6)",
    transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
  },
  success: {
    scale: [1, 1.2, 1],
    boxShadow: [
      "0 0 0 rgba(74,222,128,0)",
      "0 0 20px rgba(74,222,128,0.6)",
      "0 0 8px rgba(74,222,128,0.3)",
    ],
    borderColor: "#4ade80",
    transition: { duration: 0.5, ease: "easeOut" },
  },
  error: {
    x: [0, -3, 3, -3, 3, 0],
    borderColor: "#f87171",
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export function ColorSuggestionButton({
  synergy,
  skinOptions,
  totalMembers,
  suggestColor,
  disabled = false,
}: ColorSuggestionButtonProps) {
  const reduced = useReducedMotion();
  const [status, setStatus] = useState<SuggestionStatus>("idle");
  const isPending = status === "pending";

  const handleSuggest = async () => {
    if (isPending || disabled) return;

    // Find matching skin/chroma for this color
    const candidate = skinOptions.find((opt) => opt.auraColor === synergy.color);

    if (!candidate) {
      console.warn("No candidate found for suggestion color", synergy.color);
      return;
    }

    setStatus("pending");

    try {
      const result = await suggestColor(candidate.skinId, candidate.chromaId);

      if (result.success) {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 1500);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 1000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 1000);
    }
  };

  return (
    <motion.button
      type="button"
      initial="idle"
      animate={reduced ? "idle" : status}
      variants={variants}
      whileHover={!disabled && !isPending && !reduced ? { scale: 1.1 } : undefined}
      whileTap={!disabled && !isPending && !reduced ? { scale: 0.85 } : undefined}
      style={
        {
          backgroundColor: synergy.color,
          cursor: isPending ? "wait" : disabled ? "not-allowed" : "pointer",
        } as React.CSSProperties
      }
      className="relative h-8 w-8 rounded-full border-2 border-white/10 transition-[filter] disabled:pointer-events-none disabled:opacity-50 disabled:grayscale"
      title={`Click to suggest this color to the owner (${synergy.members.length}/${totalMembers} players)`}
      onClick={handleSuggest}
      disabled={disabled || isPending}
      aria-label={`Suggest ${synergy.color} color`}
    />
  );
}
