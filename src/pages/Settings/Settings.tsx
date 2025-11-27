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

  const isConnected = status === "connected";

  return (
    <div className="app">
      <Header status={status} phase={phase} iconId={iconId} />

      <main className="main settings-main">
        <div className="page-shell">
          <div className="bento-grid settings-grid">
            <section className="card settings-card settings-card--wide">
              <div className="card-header">
                <div>
                  <p className="eyebrow">Skin picker</p>
                  <h2 className="card-title">Reroll preferences</h2>
                </div>
                <span className="chip">
                  <span className="chip-dot" />
                  Saved locally & synced
                </span>
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
                  <p className="eyebrow">Client</p>
                  <h3 className="card-title">Connection & status</h3>
                </div>
                <span className={`chip ${isConnected ? "chip--success" : "chip--danger"}`}>
                  <span className="chip-dot" />
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
              <div className="detail-grid settings-detail-grid">
                <div className="detail-item">
                  <p className="detail-label">Game phase</p>
                  <p className="detail-value">{phase ?? "Unknown"}</p>
                </div>
                <div className="detail-item">
                  <p className="detail-label">Summoner state</p>
                  <p className="detail-value">{status}</p>
                </div>
              </div>
              <p className="muted">
                We rely on the League client being open to read your summoner
                name and push skins automatically.
              </p>
            </section>

            <section className="card settings-card">
              <div className="card-header">
                <div>
                  <p className="eyebrow">About</p>
                  <h3 className="card-title">Credits & support</h3>
                </div>
              </div>
              <p className="muted">
                Not affiliated with Riot Games or DPM.lol. For questions or
                issues, reach out directly.
              </p>
              <ContactButton />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
