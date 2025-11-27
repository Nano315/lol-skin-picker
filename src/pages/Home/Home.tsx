import Header from "@/components/layout/Header";
import SkinPreview from "@/components/skin/SkinPreview";
import RerollControls from "@/components/controls/RerollControls";

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

  return (
    <div className="app">
      <Header status={status} phase={phase} iconId={iconId} />
      <main className="main">
        <div className="page-shell">
          <div className="bento-grid">
            <section className="card preview-card">
              <div className="card-header">
                <div>
                  <p className="eyebrow">Prévisualisation</p>
                  <h2 className="card-title">Skin Spotlight</h2>
                </div>
                <div className="status-pill">
                  {hasLockedChampion ? "Prêt" : "En attente"}
                </div>
              </div>

              <SkinPreview selection={selection} chromaColor={chromaColor} />
            </section>

            <section className="card details-card">
              <div className="card-header">
                <div>
                  <p className="eyebrow">Sélection</p>
                  <h3 className="card-title">Détails en direct</h3>
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
                    {selection.championAlias || "En attente du lock-in"}
                  </p>
                </div>

                <div className="detail-item">
                  <p className="detail-label">Skin ID</p>
                  <p className="detail-value">
                    {selection.skinId ? selection.skinId : "Aucun skin actif"}
                  </p>
                </div>

                <div className="detail-item">
                  <p className="detail-label">Chroma</p>
                  <p className="detail-value">
                    {selection.chromaId || "Défaut"}
                  </p>
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

              <RerollControls
                phase={phase}
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
