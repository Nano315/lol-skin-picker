import { api } from "@/features/api";

export default function OptionsPanel({
  includeDefault,
  setIncludeDefault,
  autoRoll,
  setAutoRoll,
  savePref,
  performanceMode,
  setPerformanceMode,
  openAtLogin,
  setOpenAtLogin,
}: {
  includeDefault: boolean;
  setIncludeDefault: (v: boolean) => void;
  autoRoll: boolean;
  setAutoRoll: (v: boolean) => void;
  performanceMode: boolean;
  setPerformanceMode: (v: boolean) => void;
  openAtLogin: boolean;
  setOpenAtLogin: (v: boolean) => void;
  savePref: (k: "includeDefault" | "autoRoll" | "performanceMode", v: boolean) => void;
}) {
  const onIncludeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.checked;
    // 1) UI + stockage local immediats
    setIncludeDefault(v);
    savePref("includeDefault", v);
    // 2) IPC en arriere-plan
    void api.setIncludeDefault(v).catch(() => {
    });
  };

  const onAutoRollChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.checked;
    setAutoRoll(v);
    savePref("autoRoll", v);
    void api.setAutoRoll(v).catch(() => {});
  };

  const onPerformanceModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.checked;
    setPerformanceMode(v);
    savePref("performanceMode", v);
    void api.setPerformanceMode(v).catch(() => {});
  };

  const onOpenAtLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.checked;
    setOpenAtLogin(v);
    // Pas de savePref ici car c'est gere côte main process via setOpenAtLogin
    void api.setOpenAtLogin(v).catch(() => {});
  };

  return (
    <div className="options-wrapper">
      <div className="option-row">
        <span className="option-label">Include default skin</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={includeDefault}
            onChange={onIncludeChange}
          />
          <span className="track">
            <span className="thumb" />
          </span>
        </label>
      </div>

      <div className="option-row">
        <span className="option-label">Auto roll on champion lock</span>
        <label className="switch">
          <input type="checkbox" checked={autoRoll} onChange={onAutoRollChange} />
          <span className="track">
            <span className="thumb" />
          </span>
        </label>
      </div>

      <div className="option-row">
        <span className="option-label">Low Spec Mode (Reduces lag)</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={performanceMode}
            onChange={onPerformanceModeChange}
          />
          <span className="track">
            <span className="thumb" />
          </span>
        </label>
      </div>

      <div className="option-row">
        <span className="option-label">Run on Startup</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={openAtLogin}
            onChange={onOpenAtLoginChange}
          />
          <span className="track">
            <span className="thumb" />
          </span>
        </label>
      </div>
    </div>
  );
}
