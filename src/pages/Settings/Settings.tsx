import "@/App.css";
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

  // init prefs depuis service + localStorage
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

      <main
        className="main"
        style={{ alignItems: "flex-start", padding: "0 24px" }}
      >
        <h2 style={{ margin: "12px 0 16px 0" }}>Settings</h2>

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

        <div style={{ marginTop: 18 }}>
          <ContactButton />
        </div>

        {/* Disclaimer */}
        <p
          style={{
            marginTop: 24,
            opacity: 0.8,
            fontSize: ".9rem",
            lineHeight: 1.4,
          }}
        >
          <em>Not affiliated with Riot Games or DPM.lol.</em>
        </p>
      </main>
    </div>
  );
}
