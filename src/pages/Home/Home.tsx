import "@/App.css"; // on réutilise tes styles globaux existants
import Header from "@/components/layout/Header";
import SkinPreview from "@/components/skin/SkinPreview";
import RerollControls from "@/components/controls/RerollControls";
import MascotsLayer from "@/components/overlays/MascotsLayer";

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

  return (
    <div className="app">
      <Header status={status} phase={phase} iconId={iconId} />
      <main className="main">
        <SkinPreview selection={selection} chromaColor={chromaColor} />

        <RerollControls
          phase={phase}
          selection={selection}
          skins={skins}
          onChanged={() => api.getSelection().then(setSelection)}
        />

        <MascotsLayer />
      </main>
    </div>
  );
}
