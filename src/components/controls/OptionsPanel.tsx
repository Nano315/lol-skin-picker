import { api } from "@/features/api";

export default function OptionsPanel({
  includeDefault,
  setIncludeDefault,
  autoRoll,
  setAutoRoll,
  savePref,
}: {
  includeDefault: boolean;
  setIncludeDefault: (v: boolean) => void;
  autoRoll: boolean;
  setAutoRoll: (v: boolean) => void;
  savePref: (k: "includeDefault" | "autoRoll", v: boolean) => void;
}) {
  const onIncludeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.checked;
    // 1) UI + stockage local immédiats
    setIncludeDefault(v);
    savePref("includeDefault", v);
    // 2) IPC en arrière-plan
    void api.setIncludeDefault(v).catch(() => {
    });
  };

  const onAutoRollChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.checked;
    setAutoRoll(v);
    savePref("autoRoll", v);
    void api.setAutoRoll(v).catch(() => {});
  };

  return (
    <div className="options-wrapper">
      <div className="option">
        <div className="option-copy">
          <p className="option-title">Include default skin</p>
          <p className="option-sub">Allow the base skin to be considered.</p>
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={includeDefault}
            onChange={onIncludeChange}
          />
          <span className="toggle-track">
            <span className="toggle-thumb" />
          </span>
        </label>
      </div>

      <div className="option">
        <div className="option-copy">
          <p className="option-title">Auto roll on champion lock</p>
          <p className="option-sub">Automatically apply your pick when ready.</p>
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={autoRoll}
            onChange={onAutoRollChange}
          />
          <span className="toggle-track">
            <span className="toggle-thumb" />
          </span>
        </label>
      </div>
    </div>
  );
}
