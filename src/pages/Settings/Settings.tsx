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
  const [includeDefault, setIncludeDefault] = useState(true);
  const [autoRoll, setAutoRoll] = useState(true);
  const [autoWard, setAutoWard] = useState(false);

  useEffect(() => {
    Promise.all([
      api.getIncludeDefault(),
      api.getAutoRoll(),
      api.getAutoWard(),
    ]).then(([incSrv, autoSrv, wardSrv]) => {
      const incPref = read("includeDefault");
      const autoPref = read("autoRoll");
      const wardPref = read("autoWard");

      if (incPref !== null && incPref !== incSrv) {
        api.toggleIncludeDefault().then(() => setIncludeDefault(incPref));
      } else setIncludeDefault(incSrv);

      if (autoPref !== null && autoPref !== autoSrv) {
        api.toggleAutoRoll().then(() => setAutoRoll(autoPref));
      } else setAutoRoll(autoSrv);

      if (wardPref !== null && wardPref !== wardSrv) {
        api.toggleAutoWard().then(() => setAutoWard(wardPref));
      } else setAutoWard(wardSrv);
    });
  }, [read]);

  return (
    <div className="app">
      <Header status={status} phase={phase} iconId={iconId} />

      <main className="main settings-main">
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
          autoWard={autoWard}
          setAutoWard={(v) => {
            setAutoWard(v);
            save("autoWard", v);
          }}
          savePref={save}
        />
      </main>

      <footer className="disclaimer">
        <em>Not affiliated with Riot Games or DPM.lol.</em>
        <ContactButton />
      </footer>
    </div>
  );
}
