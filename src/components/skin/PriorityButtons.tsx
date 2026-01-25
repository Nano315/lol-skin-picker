/**
 * PriorityButtons - Quick toggle for skin priority (favorite/deprioritized)
 */

import { useSkinPriority } from "@/features/priority/usePriority";

interface PriorityButtonsProps {
  championId: number;
  skinId: number;
  disabled?: boolean;
}

export default function PriorityButtons({
  championId,
  skinId,
  disabled = false,
}: PriorityButtonsProps) {
  const { isFavorite, isDeprioritized, toggleFavorite, toggleDeprioritized, loading } =
    useSkinPriority(championId, skinId);

  const isDisabled = disabled || loading || !championId || !skinId;

  return (
    <div className="priority-buttons">
      <button
        className={`priority-btn favorite-btn ${isFavorite ? "active" : ""}`}
        onClick={toggleFavorite}
        disabled={isDisabled}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <svg
          className="priority-icon"
          viewBox="0 0 24 24"
          fill={isFavorite ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </button>

      <button
        className={`priority-btn deprioritize-btn ${isDeprioritized ? "active" : ""}`}
        onClick={toggleDeprioritized}
        disabled={isDisabled}
        title={isDeprioritized ? "Remove deprioritization" : "Deprioritize skin"}
        aria-label={isDeprioritized ? "Remove deprioritization" : "Deprioritize skin"}
      >
        <svg
          className="priority-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        </svg>
      </button>
    </div>
  );
}
