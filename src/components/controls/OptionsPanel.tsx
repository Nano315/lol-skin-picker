import { api } from "@/features/api";

export default function OptionsPanel({
  includeDefault,
  setIncludeDefault,
  includeDefaultChroma,
  setIncludeDefaultChroma,
  includeDefaultChromaSupported,
  autoRoll,
  setAutoRoll,
  savePref,
}: {
  includeDefault: boolean;
  setIncludeDefault: (v: boolean) => void;
  includeDefaultChroma: boolean;
  setIncludeDefaultChroma: (v: boolean) => void;
  includeDefaultChromaSupported: boolean;
  autoRoll: boolean;
  setAutoRoll: (v: boolean) => void;
  savePref: (
    k: "includeDefault" | "includeDefaultChroma" | "autoRoll",
    v: boolean
  ) => void;
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

  const toggleIncludeChroma = () => {
    if (!includeDefaultChromaSupported) {
      setIncludeDefaultChroma(!includeDefaultChroma);
      return;
    }

    api
      .toggleIncludeDefaultChroma()
      .then(() => api.getIncludeDefaultChroma())
      .then((val) => {
        setIncludeDefaultChroma(val);
        savePref("includeDefaultChroma", val);
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
        <input
          type="checkbox"
          checked={includeDefaultChroma}
          disabled={!includeDefaultChromaSupported}
          onChange={toggleIncludeChroma}
        />
        <span className="dot" />
        <span className="txt">
          Include default chroma
          {!includeDefaultChromaSupported ? " (update app to enable)" : ""}
        </span>
      </label>

      <label className="option">
        <input type="checkbox" checked={autoRoll} onChange={toggleAuto} />
        <span className="dot" />
        <span className="txt">Auto roll on champion lock</span>
      </label>
    </div>
  );
}
