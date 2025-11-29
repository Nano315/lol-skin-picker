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
        const incPref = read("includeDefault");
        const autoPref = read("autoRoll");

        setIncludeDefault(incPref ?? incSrv);
        setAutoRoll(autoPref ?? autoSrv);

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
              <div className="card-header">
                <div>
                  <p className="eyebrow">SUPPORT</p>
                  <h2 className="card-title">Troubleshooting</h2>
                </div>
              </div>
              <div className="options-group">
                <div className="option-row">
                  <div className="option-info">
                    <span className="option-label">Debug Logs</span>
                    <span className="option-desc">
                      Open the logs folder to send files for bug reports.
                    </span>
                  </div>
                  <button
                    className="contact-btn"
                    onClick={() => api.openLogsFolder()}
                  >
                    OPEN FOLDER
                  </button>
                </div>

                <div className="option-row">
                  <div className="option-info">
                    <span className="option-label">Contact & Feedback</span>
                    <span className="option-desc">
                      Found a bug or have a suggestion? Feel free to reach out!
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <ContactButton />
                  </div>
                </div>
              </div>
            </section>

            <section className="card settings-card">
              <div className="card-header about-header">
                <div>
                  <p className="eyebrow">ABOUT</p>
                  <h2 className="card-title">Skin Picker</h2>
                </div>
                <span className="version-pill">v6.2.0</span>
              </div>

              <div className="about-body">
                <p className="about-text">
                  Not affiliated with Riot Games or DPM.lol. Crafted to make
                  skin selection smoother and more delightful.
                </p>
                <p className="about-meta">
                  © 2025 Skin Picker. All rights reserved.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
