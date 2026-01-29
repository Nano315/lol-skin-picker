import Header from "@/components/layout/Header";
import OptionsPanel from "@/components/controls/OptionsPanel";
import ContactButton from "@/components/ContactButton";

import { usePrefs } from "@/features/hooks/usePrefs";
import { useTelemetryConsent } from "@/features/hooks/useTelemetryConsent";
import { useConnection } from "@/features/hooks/useConnection";
import { useGameflow } from "@/features/hooks/useGameflow";
import { useEffect, useState } from "react";
import { api } from "@/features/api";

export default function Settings() {
  const { status, iconId } = useConnection();
  const phase = useGameflow();

  const { save, read } = usePrefs();
  const { enabled: telemetryEnabled, setConsent: setTelemetryEnabled, loading: telemetryLoading } = useTelemetryConsent();
  const [includeDefault, setIncludeDefault] = useState(true);
  const [autoRoll, setAutoRoll] = useState(true);
  const [performanceMode, setPerformanceMode] = useState(false);
  const [openAtLogin, setOpenAtLogin] = useState(false);
  const [historyEnabled, setHistoryEnabled] = useState(true);
  const [historySize, setHistorySize] = useState(5);
  const [notificationSound, setNotificationSound] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getIncludeDefault(),
      api.getAutoRoll(),
      api.getPerformanceMode(),
      api.getOpenAtLogin(),
      api.getHistorySettings(),
    ]).then(([incSrv, autoSrv, perfSrv, openAtLoginSrv, historySrv]) => {
      const incPref = read("includeDefault");
      const autoPref = read("autoRoll");
      const perfPref = read("performanceMode");
      const soundPref = read("notificationSound");

      setIncludeDefault(incPref ?? incSrv);
      setAutoRoll(autoPref ?? autoSrv);
      setPerformanceMode(perfPref ?? perfSrv);
      setOpenAtLogin(openAtLoginSrv);
      setHistoryEnabled(historySrv.historyEnabled);
      setHistorySize(historySrv.historySize);
      // notificationSound defaults to true if not set
      setNotificationSound(soundPref ?? true);

      if (incPref !== null && incPref !== incSrv) {
        void api.setIncludeDefault(incPref).catch(() => {});
      }
      if (autoPref !== null && autoPref !== autoSrv) {
        void api.setAutoRoll(autoPref).catch(() => {});
      }
      if (perfPref !== null && perfPref !== perfSrv) {
        void api.setPerformanceMode(perfPref).catch(() => {});
      }
    });
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
                performanceMode={performanceMode}
                setPerformanceMode={(v) => {
                  setPerformanceMode(v);
                  save("performanceMode", v);
                }}
                openAtLogin={openAtLogin}
                setOpenAtLogin={setOpenAtLogin}
                historyEnabled={historyEnabled}
                setHistoryEnabled={setHistoryEnabled}
                historySize={historySize}
                setHistorySize={setHistorySize}
                savePref={save}
              />
            </section>

            <section className="card settings-card">
              <div className="card-header">
                <div>
                  <p className="eyebrow">NOTIFICATIONS</p>
                  <h2 className="card-title">Room Invitations</h2>
                </div>
              </div>
              <div className="options-group">
                <div className="option-row">
                  <div className="option-info">
                    <span className="option-label">Notification sound</span>
                    <span className="option-desc">
                      Play a sound when you receive a room invitation.
                    </span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notificationSound}
                      onChange={(e) => {
                        const v = e.target.checked;
                        setNotificationSound(v);
                        save("notificationSound", v);
                      }}
                    />
                    <span className="track">
                      <span className="thumb" />
                    </span>
                  </label>
                </div>
              </div>
            </section>

            <section className="card settings-card">
              <div className="card-header">
                <div>
                  <p className="eyebrow">PRIVACY</p>
                  <h2 className="card-title">Telemetry & Analytics</h2>
                </div>
              </div>
              <div className="options-group">
                <div className="option-row">
                  <div className="option-info">
                    <span className="option-label">Enable telemetry</span>
                    <span className="option-desc">
                      Help improve SkinPicker by sharing anonymous usage data.
                    </span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={telemetryEnabled}
                      disabled={telemetryLoading}
                      onChange={(e) => setTelemetryEnabled(e.target.checked)}
                    />
                    <span className="track">
                      <span className="thumb" />
                    </span>
                  </label>
                </div>
                <div className="option-row" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                  <details className="telemetry-details">
                    <summary>What data is collected?</summary>
                    <ul className="telemetry-list">
                      <li>Anonymous crash reports (to fix bugs)</li>
                      <li>Features used (reroll, rooms, etc.)</li>
                      <li>App version and operating system</li>
                    </ul>
                    <p className="telemetry-never"><strong>Never collected:</strong> Summoner name, owned skins, game data.</p>
                  </details>
                </div>
              </div>
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
                <span className="version-pill">v7.1.4</span>
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
