import "@/App.css"; // on réutilise tes styles globaux existants
import Header from "@/components/layout/Header";
import SkinPreview from "@/components/skin/SkinPreview";
import RerollControls from "@/components/controls/RerollControls";
import OptionsPanel from "@/components/controls/OptionsPanel";
import MascotsLayer from "@/components/overlays/MascotsLayer";
import ContactButton from "@/components/ContactButton";

import { usePrefs } from "@/features/hooks/usePrefs";
import { useConnection } from "@/features/hooks/useConnection";
import { useGameflow } from "@/features/hooks/useGameflow";
import { useOwnedSkins } from "@/features/hooks/useOwnedSkins";
import { useSelection } from "@/features/hooks/useSelection";
import { useChromaColor } from "@/features/hooks/useChromaColor";
import { api } from "@/features/api";
import { useEffect, useState } from "react";

export default function Home() {
  const { save, read } = usePrefs();

  const { status, iconId } = useConnection();
  const phase = useGameflow();
  const skins = useOwnedSkins();
  const [selection, setSelection] = useSelection();
  const chromaColor = useChromaColor(selection);

  const [includeDefault, setIncludeDefault] = useState(true);
  const [autoRoll, setAutoRoll] = useState(true);

  // init prefs
  useEffect(() => {
    Promise.all([api.getIncludeDefault(), api.getAutoRoll()]).then(
      ([incSrv, autoSrv]) => {
        const incPref = read("includeDefault");
        const autoPref = read("autoRoll");

        if (incPref !== null && incPref !== incSrv) {
          api.toggleIncludeDefault().then(() => setIncludeDefault(incPref));
        } else setIncludeDefault(incSrv);

        if (autoPref !== null && autoPref !== autoSrv) {
          api.toggleAutoRoll().then(() => setAutoRoll(autoPref));
        } else setAutoRoll(autoSrv);
      }
    );
  }, []);

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

        <OptionsPanel
          includeDefault={includeDefault}
          setIncludeDefault={(v) => {
            setIncludeDefault(v);
            save("includeDefault", v);
          }}
          autoRoll={autoRoll}
          setAutoRoll={(v) => {
            setAutoRoll(v);
            save("autoRoll", v);
          }}
          savePref={save}
        />

        <MascotsLayer />
      </main>

      <ContactButton />
    </div>
  );
}
