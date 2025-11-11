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
      <label className="option">
        <input
          type="checkbox"
          checked={includeDefault}
          onChange={onIncludeChange}
        />
        <span className="dot" />
        <span className="txt">Include default skin</span>
      </label>

      <label className="option">
        <input type="checkbox" checked={autoRoll} onChange={onAutoRollChange} />
        <span className="dot" />
        <span className="txt">Auto roll on champion lock</span>
      </label>
    </div>
  );
}
