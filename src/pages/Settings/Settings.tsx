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

  useEffect(() => {
    Promise.all([api.getIncludeDefault(), api.getAutoRoll()]).then(
      ([incSrv, autoSrv]) => {
        const incPref = read("includeDefault"); // string->bool déjà géré dans le hook
        const autoPref = read("autoRoll");

        // UI d’abord : si local existe, on le montre; sinon valeur service
        setIncludeDefault(incPref ?? incSrv);
        setAutoRoll(autoPref ?? autoSrv);

        // Pousser la préférence locale vers le service si divergence (fire-and-forget)
        if (incPref !== null && incPref !== incSrv) {
          void api.setIncludeDefault(incPref).catch(() => {});
        }
        if (autoPref !== null && autoPref !== autoSrv) {
          void api.setAutoRoll(autoPref).catch(() => {});
        }
      }
    );
  }, [read]);

  return (
    <div className="app">
      <Header status={status} phase={phase} iconId={iconId} />

      <main className="main settings-main">
        <div className="page-shell settings-shell">
          <div className="settings-stack">
            <section className="card settings-card">
              <div className="card-header">
                <div>
                  <p className="eyebrow">PREFERENCES</p>
                  <h2 className="card-title">Application Behavior</h2>
                </div>
              </div>

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
            </section>

            <section className="card settings-card">
              <div className="card-header about-header">
                <div>
                  <p className="eyebrow">ABOUT</p>
                  <h2 className="card-title">Skin Picker</h2>
                </div>
                <span className="version-pill">v6.1.0</span>
              </div>

              <div className="about-body">
                <p className="about-text">
                  Not affiliated with Riot Games or DPM.lol. Crafted to make
                  skin selection smoother and more delightful.
                </p>
                <p className="about-meta">
                  © 2025 Skin Picker. All rights reserved.
                </p>
                <div className="about-actions">
                  <ContactButton />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
