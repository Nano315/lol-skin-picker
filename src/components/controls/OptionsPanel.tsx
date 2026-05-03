import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Toggle } from "@/components/ui";
import { api } from "@/features/api";
import type { PrefKey } from "@/features/hooks/usePrefs";
import { cn } from "@/lib/utils";

type OptionsPanelProps = {
  includeDefault: boolean;
  setIncludeDefault: (v: boolean) => void;
  autoRoll: boolean;
  setAutoRoll: (v: boolean) => void;
  autoAcceptMatch: boolean;
  setAutoAcceptMatch: (v: boolean) => void;
  performanceMode: boolean;
  setPerformanceMode: (v: boolean) => void;
  openAtLogin: boolean;
  setOpenAtLogin: (v: boolean) => void;
  historyEnabled: boolean;
  setHistoryEnabled: (v: boolean) => void;
  historySize: number;
  setHistorySize: (v: number) => void;
  savePref: (k: PrefKey, v: boolean) => void;
};

export default function OptionsPanel({
  includeDefault,
  setIncludeDefault,
  autoRoll,
  setAutoRoll,
  autoAcceptMatch,
  setAutoAcceptMatch,
  savePref,
  performanceMode,
  setPerformanceMode,
  openAtLogin,
  setOpenAtLogin,
  historyEnabled,
  setHistoryEnabled,
  historySize,
  setHistorySize,
}: OptionsPanelProps) {
  const onIncludeChange = (v: boolean) => {
    setIncludeDefault(v);
    savePref("includeDefault", v);
    void api.setIncludeDefault(v).catch(() => {});
  };

  const onAutoRollChange = (v: boolean) => {
    setAutoRoll(v);
    savePref("autoRoll", v);
    void api.setAutoRoll(v).catch(() => {});
  };

  const onAutoAcceptMatchChange = (v: boolean) => {
    setAutoAcceptMatch(v);
    void api.setAutoAcceptMatch(v).catch(() => {});
  };

  const onPerformanceModeChange = (v: boolean) => {
    setPerformanceMode(v);
    savePref("performanceMode", v);
    void api.setPerformanceMode(v).catch(() => {});
  };

  const onOpenAtLoginChange = (v: boolean) => {
    setOpenAtLogin(v);
    void api.setOpenAtLogin(v).catch(() => {});
  };

  const onHistoryEnabledChange = (v: boolean) => {
    setHistoryEnabled(v);
    void api.setHistorySettings({ historyEnabled: v }).catch(() => {});
  };

  const onHistorySizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = Number(e.target.value);
    setHistorySize(v);
    void api.setHistorySettings({ historySize: v }).catch(() => {});
  };

  return (
    <div className="flex flex-col gap-7">
      <Section title="Match & Reroll">
        <Row
          label="Auto-accept match"
          description="Automatically accept the ready check when a match is found."
        >
          <Toggle
            checked={autoAcceptMatch}
            onChange={onAutoAcceptMatchChange}
            aria-label="Auto-accept match"
          />
        </Row>

        <Row
          label="Auto roll on champion lock"
          description="Trigger a reroll automatically when you lock in a champion."
        >
          <Toggle
            checked={autoRoll}
            onChange={onAutoRollChange}
            aria-label="Auto roll on champion lock"
          />
        </Row>

        <Row
          label="Include default skin"
          description="Consider the default (classic) skin as a valid reroll outcome."
        >
          <Toggle
            checked={includeDefault}
            onChange={onIncludeChange}
            aria-label="Include default skin"
          />
        </Row>
      </Section>

      <Section title="History">
        <Row
          label="Avoid recent skins"
          description="Exclude recently rolled skins from future rerolls."
        >
          <Toggle
            checked={historyEnabled}
            onChange={onHistoryEnabledChange}
            aria-label="Avoid recent skins"
          />
        </Row>

        <Row
          label="History size"
          description="Number of recent skins to remember when avoiding repeats."
        >
          <HistorySelect
            value={historySize}
            onChange={onHistorySizeChange}
            disabled={!historyEnabled}
          />
        </Row>
      </Section>

      <Section title="Application">
        <Row
          label="Run on startup"
          description="Launch Skin Picker automatically when your computer starts."
        >
          <Toggle
            checked={openAtLogin}
            onChange={onOpenAtLoginChange}
            aria-label="Run on startup"
          />
        </Row>

        <Row
          label="Low spec mode"
          description="Disable heavy effects to reduce lag on older machines."
        >
          <Toggle
            checked={performanceMode}
            onChange={onPerformanceModeChange}
            aria-label="Low spec mode"
          />
        </Row>
      </Section>
    </div>
  );
}

/* ---------- Local primitives (scoped to OptionsPanel) ---------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <div className="mb-2 flex items-center gap-2">
        <span
          className="h-3 w-[3px] rounded-full bg-accent"
          aria-hidden
        />
        <h3
          className={cn(
            "text-xs font-bold uppercase tracking-[0.2em]",
            "text-accent"
          )}
        >
          {title}
        </h3>
      </div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

function Row({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.05] py-3.5 last:border-0">
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-sm font-semibold text-white">{label}</span>
        {description && (
          <span className="text-xs leading-relaxed text-white/50">
            {description}
          </span>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function HistorySelect({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
}) {
  return (
    <div className="relative inline-flex">
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          "appearance-none rounded-full border py-1.5 pl-4 pr-9 text-sm font-semibold transition-colors duration-200",
          "bg-white/[0.04] text-white border-white/10",
          "hover:border-white/20 hover:bg-white/[0.06]",
          "focus:border-accent/50 focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-40"
        )}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <option key={n} value={n} className="bg-[#1a1a2e] text-white">
            {n}
          </option>
        ))}
      </select>
      <ChevronDown
        className={cn(
          "pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/60",
          disabled && "opacity-40"
        )}
        aria-hidden
      />
    </div>
  );
}
