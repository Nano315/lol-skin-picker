import { useState } from "react";
import styles from "./ControlBar.module.css";
import type { GroupSkinOption, ColorSynergy } from "@/features/roomsClient";

type SuggestionStatus = 'idle' | 'pending' | 'success' | 'error';

type ColorSuggestionButtonProps = {
  synergy: ColorSynergy;
  skinOptions: GroupSkinOption[];
  suggestColor: (skinId: number, chromaId: number) => Promise<{ success: boolean; error?: string }>;
  disabled?: boolean;
};

export function ColorSuggestionButton({
  synergy,
  skinOptions,
  suggestColor,
  disabled = false,
}: ColorSuggestionButtonProps) {
  const [status, setStatus] = useState<SuggestionStatus>('idle');
  const isPending = status === 'pending';

  const handleSuggest = async () => {
    if (isPending || disabled) return;

    // Find matching skin/chroma for this color
    const candidate = skinOptions.find(opt => opt.auraColor === synergy.color);

    if (!candidate) {
      console.warn("No candidate found for suggestion color", synergy.color);
      return;
    }

    // Set pending state
    setStatus('pending');

    try {
      const result = await suggestColor(candidate.skinId, candidate.chromaId);

      if (result.success) {
        setStatus('success');
        // Reset to idle after animation
        setTimeout(() => setStatus('idle'), 1500);
      } else {
        setStatus('error');
        // Reset to idle after animation
        setTimeout(() => setStatus('idle'), 1000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 1000);
    }
  };

  // Build class names based on status
  const statusClass = status === 'pending' ? styles.suggestionPending
    : status === 'success' ? styles.suggestionSuccess
    : status === 'error' ? styles.suggestionError
    : '';

  return (
    <button
      className={`${styles.colorOption} ${styles.suggestionButton} ${statusClass}`}
      style={{
        "--opt-color": synergy.color,
        cursor: isPending ? 'wait' : 'pointer'
      } as React.CSSProperties}
      title={`Cliquez pour suggérer cette couleur à l'owner (${synergy.combinationCount} combinaisons)`}
      onClick={handleSuggest}
      disabled={disabled || isPending}
      aria-label={`Suggérer la couleur ${synergy.color}`}
    />
  );
}
