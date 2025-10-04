import { api } from "@/features/api";

export default function OptionsPanel({
  includeDefault,
  setIncludeDefault,
  autoRoll,
  setAutoRoll,
  autoWard,
  setAutoWard,
  savePref,
}: {
  includeDefault: boolean;
  setIncludeDefault: (v: boolean) => void;
  autoRoll: boolean;
  setAutoRoll: (v: boolean) => void;
  autoWard: boolean;
  setAutoWard: (v: boolean) => void;
  savePref: (k: "includeDefault" | "autoRoll" | "autoWard", v: boolean) => void;
}) {
  const toggleInclude = () => {
    api
      .toggleIncludeDefault()
      .then(() => api.getIncludeDefault())
      .then((val) => {
        setIncludeDefault(val);
        savePref("includeDefault", val);
      });
  };

  const toggleAuto = () => {
    api
      .toggleAutoRoll()
      .then(() => api.getAutoRoll())
      .then((val) => {
        setAutoRoll(val);
        savePref("autoRoll", val);
      });
  };

  const toggleAutoWard = () => {
    api
      .toggleAutoWard()
      .then(() => api.getAutoWard())
      .then((val) => {
        setAutoWard(val);
        savePref("autoWard", val);
      });
  };

  return (
    <div className="options-wrapper">
      <label className="option">
        <input
          type="checkbox"
          checked={includeDefault}
          onChange={toggleInclude}
        />
        <span className="dot" />
        <span className="txt">Include default skin</span>
      </label>

      <label className="option">
        <input type="checkbox" checked={autoRoll} onChange={toggleAuto} />
        <span className="dot" />
        <span className="txt">Auto roll on champion lock</span>
      </label>

      <label className="option">
        <input type="checkbox" checked={autoWard} onChange={toggleAutoWard} />
        <span className="dot" />
        <span className="txt">Auto random ward on lock</span>
      </label>
    </div>
  );
}
