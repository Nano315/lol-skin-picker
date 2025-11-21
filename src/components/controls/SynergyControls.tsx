import { useState, useEffect } from "react";
import type { SynergyResult } from "@/features/roomsClient";
import "./SynergyControls.css"; // A créer pour le style

type Props = {
  result: SynergyResult;
  onApply: (
    selection: Record<string, { skinId: number; chromaId: number }>
  ) => void;
  onCancel: () => void;
};

export function SynergyControls({ result, onApply, onCancel }: Props) {
  const [activeTierIndex, setActiveTierIndex] = useState(0);
  const [comboIndexes, setComboIndexes] = useState<Record<number, number>>({});

  // Reset quand le résultat change
  useEffect(() => {
    setActiveTierIndex(0);
    setComboIndexes({});
  }, [result]);

  if (!result.tiers.length) {
    return (
      <div className="synergy-panel">
        <p>No matching skins found within the team.</p>
        <button onClick={onCancel}>Close</button>
      </div>
    );
  }

  const activeTier = result.tiers[activeTierIndex];
  const currentComboIndex = comboIndexes[activeTierIndex] || 0;
  const currentCombo = activeTier.combinations[currentComboIndex];

  // Handlers
  const handleReroll = () => {
    const nextIndex = (currentComboIndex + 1) % activeTier.totalCombinations;
    setComboIndexes({ ...comboIndexes, [activeTierIndex]: nextIndex });

    // Optionnel : Tu pourrais vouloir prévisualiser immédiatement sur les cartes
    // Pour l'instant on visualise via le texte et l'action "Apply" fera le changement réel
  };

  const handleApply = () => {
    onApply(currentCombo.selection);
  };

  return (
    <div className="synergy-panel fade-in">
      <div className="synergy-header">
        <h3>Team Synergy Found!</h3>
        <button className="close-btn" onClick={onCancel}>
          ×
        </button>
      </div>

      {/* --- TABS (TIERS) --- */}
      <div className="synergy-tabs">
        {result.tiers.map((tier, idx) => (
          <button
            key={tier.id}
            className={`synergy-tab ${
              idx === activeTierIndex ? "active" : ""
            } tier-${tier.score}`}
            onClick={() => setActiveTierIndex(idx)}
          >
            <span className="tier-label">{tier.label}</span>
            <span className="tier-count">{tier.totalCombinations}</span>
          </button>
        ))}
      </div>

      {/* --- CONTENT --- */}
      <div className="synergy-content">
        <div className="synergy-info">
          <span className="synergy-description">
            {currentCombo.description}
          </span>
          {activeTier.totalCombinations > 1 && (
            <span className="synergy-counter">
              Option {currentComboIndex + 1} / {activeTier.totalCombinations}
            </span>
          )}
        </div>

        <div className="synergy-actions">
          {/* Reroll Button (si plusieurs choix) */}
          {activeTier.totalCombinations > 1 && (
            <button className="synergy-btn secondary" onClick={handleReroll}>
              🎲 Reroll Variant
            </button>
          )}

          <button className="synergy-btn primary" onClick={handleApply}>
            Apply to Team
          </button>
        </div>
      </div>
    </div>
  );
}
