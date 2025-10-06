import Header from "@/components/layout/Header";
import OptionsPanel from "@/components/controls/OptionsPanel";
import ContactButton from "@/components/ContactButton";

import { usePrefs } from "@/features/hooks/usePrefs";
import { useConnection } from "@/features/hooks/useConnection";
import { useGameflow } from "@/features/hooks/useGameflow";
import { useEffect, useState } from "react";
import { api } from "@/features/api";

export default function Settings() {
  const { status, iconId } = useConnection();
  const phase = useGameflow();

  const { save, read } = usePrefs();
  const [includeDefaultChromaSupported] = useState(
    api.hasDefaultChromaOption
  );
  const [includeDefault, setIncludeDefault] = useState(true);
  const [includeDefaultChroma, setIncludeDefaultChroma] = useState(false);
  const [autoRoll, setAutoRoll] = useState(true);

  useEffect(() => {
    const sync = async () => {
      const [incSrv, autoSrv] = await Promise.all([
        api.getIncludeDefault(),
        api.getAutoRoll(),
      ]);

      const incPref = read("includeDefault");
      const autoPref = read("autoRoll");

      if (incPref !== null && incPref !== incSrv) {
        api.toggleIncludeDefault().then(() => setIncludeDefault(incPref));
      } else setIncludeDefault(incSrv);

      if (autoPref !== null && autoPref !== autoSrv) {
        api.toggleAutoRoll().then(() => setAutoRoll(autoPref));
      } else setAutoRoll(autoSrv);

      if (includeDefaultChromaSupported) {
        const incChromaSrv = await api.getIncludeDefaultChroma();
        const incChromaPref = read("includeDefaultChroma");

        if (incChromaPref !== null && incChromaPref !== incChromaSrv) {
          api
            .toggleIncludeDefaultChroma()
            .then(() => setIncludeDefaultChroma(incChromaPref));
        } else setIncludeDefaultChroma(incChromaSrv);
      } else {
        const incChromaPref = read("includeDefaultChroma");
        setIncludeDefaultChroma(incChromaPref ?? false);
      }
    };

    void sync();
  }, [includeDefaultChromaSupported, read]);

  return (
    <div className="app">
      <Header status={status} phase={phase} iconId={iconId} />

      {/* options centrées */}
      <main className="main settings-main">
        <OptionsPanel
          includeDefault={includeDefault}
          setIncludeDefault={(v) => {
            setIncludeDefault(v);
            save("includeDefault", v);
          }}
          includeDefaultChroma={includeDefaultChroma}
          setIncludeDefaultChroma={(v) => {
            setIncludeDefaultChroma(v);
            save("includeDefaultChroma", v);
          }}
          includeDefaultChromaSupported={includeDefaultChromaSupported}
          autoRoll={autoRoll}
          setAutoRoll={(v) => {
            setAutoRoll(v);
            save("autoRoll", v);
          }}
          savePref={save}
        />
      </main>

      {/* mention légale en bas, centrée */}
      <footer className="disclaimer">
        <em>Not affiliated with Riot Games or DPM.lol.</em>
        <ContactButton />
      </footer>
    </div>
  );
}
