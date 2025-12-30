import Header from "@/components/layout/Header";
import SkinPreview from "@/components/skin/SkinPreview";
import ControlBar from "@/components/controls/ControlBar";

import { useConnection } from "@/features/hooks/useConnection";
import { useGameflow } from "@/features/hooks/useGameflow";
import { useOwnedSkins } from "@/features/hooks/useOwnedSkins";
import { useSelection } from "@/features/hooks/useSelection";
import { useChromaColor } from "@/features/hooks/useChromaColor";
import { api } from "@/features/api";

export default function Home() {
  const { status, iconId } = useConnection();
  const phase = useGameflow();
  const skins = useOwnedSkins();
  const [selection, setSelection] = useSelection();
  const chromaColor = useChromaColor(selection);

  const hasLockedChampion =
    selection.championId !== 0 && selection.locked && phase === "ChampSelect";

  const activeSkin = skins.find((s) => s.id === selection.skinId);

  const skinLabel =
    phase === "ChampSelect"
      ? activeSkin
        ? activeSkin.name
        : selection.skinId || "Waiting for lock-in"
      : "...";

  const chromaLabel =
    phase === "ChampSelect"
      ? activeSkin
        ? selection.chromaId || "Default"
        : "Waiting for lock-in"
      : "...";

  return (
    <div className="app">
      <Header status={status} phase={phase} iconId={iconId} />
      <main className="main">
        <div className="page-shell">
          <div className="bento-grid">
            <section
              className="card preview-card"
              style={{
                backgroundColor: chromaColor ?? undefined,
                transition:
                  "background-color 0.5s ease, border-color 0.5s ease",
                borderColor: chromaColor ? "rgba(255,255,255,0.2)" : undefined,
              }}
            >
              <div className="card-header">
                <div>
                  <p className="eyebrow">Preview</p>
                  <h2 className="card-title">Skin Spotlight</h2>
                </div>
                <div className="status-pill">
                  {hasLockedChampion ? "Ready" : "Waiting"}
                </div>
              </div>

              <SkinPreview selection={selection} />
            </section>

            <section className="card details-card">
              <div className="card-header">
                <div>
                  <p className="eyebrow">Selection</p>
                  <h3 className="card-title">Live Details</h3>
                </div>
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <p className="detail-label">Phase</p>
                  <p className="detail-value">{phase}</p>
                </div>

                <div className="detail-item">
                  <p className="detail-label">Champion</p>
                  <p className="detail-value">
                    {phase === "ChampSelect" ? hasLockedChampion
                      ? selection.championAlias
                      : "Waiting for lock-in" : "..."}{" "}
                  </p>
                </div>

                <div className="detail-item">
                  <p className="detail-label">Skin</p>
                  <p className="detail-value">{skinLabel}</p>
                </div>

                <div className="detail-item">
                  <p className="detail-label">Chroma</p>
                  <p className="detail-value">{chromaLabel}</p>
                </div>
              </div>
            </section>

            <section className="card actions-card">
              <div className="card-header">
                <div>
                  <p className="eyebrow">Actions</p>
                  <h3 className="card-title">Reroll Lab</h3>
                </div>
              </div>

              <ControlBar
                phase={phase}
                status={status}
                selection={selection}
                skins={skins}
                onChanged={() => api.getSelection().then(setSelection)}
              />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
