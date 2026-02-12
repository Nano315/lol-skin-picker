import { useState, useCallback, useEffect } from "react";
import type {
  RoomState,
  SkinLineSynergy,
  ColorSynergy,
} from "@/features/roomsClient";
import { MemberPickSelector } from "./MemberPickSelector";
import { CombinationPreview } from "./CombinationPreview";
import styles from "./CombinationBuilder.module.css";

type SynergyType = "skinLine" | "color";

interface MemberPick {
  memberId: string;
  skinId: number;
  chromaId: number;
}

interface CombinationBuilderProps {
  room: RoomState;
  isOpen: boolean;
  onClose: () => void;
  onApply: (picks: MemberPick[]) => void;
}

function generateRandomPicks(
  room: RoomState,
  synergy: SkinLineSynergy | ColorSynergy,
  _type: SynergyType,
): Map<string, { skinId: number; chromaId: number }> {
  const picks = new Map<string, { skinId: number; chromaId: number }>();

  for (const member of room.members) {
    const isParticipant = synergy.members.includes(member.id);
    if (isParticipant) {
      // For skin line: chromaId = 0 (base skin)
      picks.set(member.id, {
        skinId: member.skinId,
        chromaId: _type === "skinLine" ? 0 : member.chromaId,
      });
    } else {
      // Keep current selection for non-participants
      picks.set(member.id, {
        skinId: member.skinId,
        chromaId: member.chromaId,
      });
    }
  }

  return picks;
}

export function CombinationBuilder({
  room,
  isOpen,
  onClose,
  onApply,
}: CombinationBuilderProps) {
  const [selectedType, setSelectedType] = useState<SynergyType | null>(null);
  const [selectedSynergy, setSelectedSynergy] = useState<
    SkinLineSynergy | ColorSynergy | null
  >(null);
  const [memberPicks, setMemberPicks] = useState<
    Map<string, { skinId: number; chromaId: number }>
  >(new Map());

  // Reset on close/open
  useEffect(() => {
    if (!isOpen) {
      setSelectedType(null);
      setSelectedSynergy(null);
      setMemberPicks(new Map());
    }
  }, [isOpen]);

  // Reset picks if synergy becomes unavailable (member leaves)
  useEffect(() => {
    if (!selectedSynergy) return;
    const skinLines = room.synergy?.skinLines ?? [];
    const colors = room.synergy?.colors ?? [];

    if (selectedType === "skinLine") {
      const still = skinLines.find(
        (s) => s.skinLineId === (selectedSynergy as SkinLineSynergy).skinLineId,
      );
      if (!still) {
        setSelectedSynergy(null);
        setSelectedType(null);
        setMemberPicks(new Map());
      }
    } else if (selectedType === "color") {
      const still = colors.find(
        (s) => s.color === (selectedSynergy as ColorSynergy).color,
      );
      if (!still) {
        setSelectedSynergy(null);
        setSelectedType(null);
        setMemberPicks(new Map());
      }
    }
  }, [room.synergy, selectedSynergy, selectedType]);

  const handleSelectSynergy = useCallback(
    (synergy: SkinLineSynergy | ColorSynergy, type: SynergyType) => {
      setSelectedType(type);
      setSelectedSynergy(synergy);
      setMemberPicks(generateRandomPicks(room, synergy, type));
    },
    [room],
  );

  const handleRandomize = useCallback(() => {
    if (!selectedSynergy || !selectedType) return;
    setMemberPicks(generateRandomPicks(room, selectedSynergy, selectedType));
  }, [room, selectedSynergy, selectedType]);

  const handleReset = useCallback(() => {
    setSelectedType(null);
    setSelectedSynergy(null);
    setMemberPicks(new Map());
  }, []);

  const handleApply = useCallback(() => {
    const picks: MemberPick[] = Array.from(memberPicks.entries()).map(
      ([memberId, pick]) => ({
        memberId,
        skinId: pick.skinId,
        chromaId: pick.chromaId,
      }),
    );
    onApply(picks);
    onClose();
  }, [memberPicks, onApply, onClose]);

  const isComplete = memberPicks.size === room.members.length;

  const skinLines = room.synergy?.skinLines ?? [];
  const colors = room.synergy?.colors ?? [];

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2 className={styles.title}>Build Combination</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            &times;
          </button>
        </header>

        <div className={styles.content}>
          {/* Step 1: Synergy Selection */}
          <section className={styles.step}>
            <h3 className={styles.stepLabel}>1. Choose Synergy</h3>

            {skinLines.length > 0 && (
              <div className={styles.synergyGroup}>
                <span className={styles.groupLabel}>Skin Lines</span>
                <div className={styles.synergyList}>
                  {skinLines.map((s) => (
                    <button
                      key={s.skinLineId}
                      className={`${styles.synergyBtn} ${
                        selectedType === "skinLine" &&
                        (selectedSynergy as SkinLineSynergy)?.skinLineId ===
                          s.skinLineId
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() => handleSelectSynergy(s, "skinLine")}
                    >
                      <span className={styles.synergyName}>
                        {s.skinLineName}
                      </span>
                      <span className={styles.synergyCoverage}>
                        {s.members.length}/{room.members.length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {colors.length > 0 && (
              <div className={styles.synergyGroup}>
                <span className={styles.groupLabel}>Colors</span>
                <div className={styles.synergyList}>
                  {colors.map((s) => (
                    <button
                      key={s.color}
                      className={`${styles.synergyBtn} ${
                        selectedType === "color" &&
                        (selectedSynergy as ColorSynergy)?.color === s.color
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() => handleSelectSynergy(s, "color")}
                    >
                      <span
                        className={styles.colorDot}
                        style={{ background: s.color }}
                      />
                      <span className={styles.synergyName}>{s.color}</span>
                      <span className={styles.synergyCoverage}>
                        {s.members.length}/{room.members.length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {skinLines.length === 0 && colors.length === 0 && (
              <p className={styles.emptyMsg}>
                No synergies available. Wait for all members to pick champions.
              </p>
            )}
          </section>

          {/* Step 2: Fine-tune */}
          {selectedSynergy && (
            <section className={styles.step}>
              <h3 className={styles.stepLabel}>2. Fine-tune (optional)</h3>
              <MemberPickSelector
                members={room.members}
                synergy={selectedSynergy}
                synergyType={selectedType!}
                picks={memberPicks}
              />
            </section>
          )}

          {/* Step 3: Preview */}
          {memberPicks.size > 0 && (
            <section className={styles.step}>
              <h3 className={styles.stepLabel}>3. Preview</h3>
              <CombinationPreview
                members={room.members}
                picks={memberPicks}
              />
            </section>
          )}
        </div>

        <footer className={styles.footer}>
          <button className={styles.btnSecondary} onClick={handleReset}>
            Reset
          </button>
          <button
            className={styles.btnSecondary}
            onClick={handleRandomize}
            disabled={!selectedSynergy}
          >
            Randomize
          </button>
          <button
            className={styles.btnPrimary}
            onClick={handleApply}
            disabled={!isComplete}
          >
            Apply
          </button>
        </footer>
      </div>
    </div>
  );
}
