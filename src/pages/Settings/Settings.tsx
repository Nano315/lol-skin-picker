import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  Bell,
  ChevronDown,
  FolderOpen,
  ShieldCheck,
  Sparkles,
  Info,
  SlidersHorizontal,
} from "lucide-react";
import Header from "@/components/layout/Header";
import OptionsPanel from "@/components/controls/OptionsPanel";
import ContactButton from "@/components/ContactButton";
import {
  GlassCard,
  Reveal,
  GradientText,
  CardHeader,
  Toggle,
  Button,
} from "@/components/ui";

import { usePrefs } from "@/features/hooks/usePrefs";
import {
  useWidgetSide,
  type WidgetSide,
} from "@/features/matchLock/widgetSide";
import { useTelemetryConsent } from "@/features/hooks/useTelemetryConsent";
import { useConnection } from "@/features/hooks/useConnection";
import { useGameflow } from "@/features/hooks/useGameflow";
import { api } from "@/features/api";
import { cn } from "@/lib/utils";

export default function Settings() {
  const { status, iconId } = useConnection();
  const phase = useGameflow();

  const { save, read } = usePrefs();
  const [widgetSide, setWidgetSide] = useWidgetSide();
  const {
    enabled: telemetryEnabled,
    setConsent: setTelemetryEnabled,
    loading: telemetryLoading,
  } = useTelemetryConsent();
  const [includeDefault, setIncludeDefault] = useState(true);
  const [autoRoll, setAutoRoll] = useState(true);
  const [autoAcceptMatch, setAutoAcceptMatch] = useState(false);
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
      api.getAutoAcceptMatch(),
    ]).then(
      ([incSrv, autoSrv, perfSrv, openAtLoginSrv, historySrv, autoAcceptSrv]) => {
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
        setAutoAcceptMatch(autoAcceptSrv);
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
      }
    );
  }, [read]);

  return (
    <div className="app">
      <Header status={status} phase={phase} iconId={iconId} />
      <main className="relative flex flex-col items-center px-4 pb-12 pt-7">
        <div className="mx-auto w-full max-w-[720px] px-2 sm:px-4">
          <div className="grid grid-cols-12 gap-6">
            {/* ---------- Preferences ---------- */}
            <Reveal delay={0} className="col-span-12">
              <GlassCard className="flex flex-col gap-5">
                <CardHeader
                  eyebrow="Preferences"
                  title={
                    <>
                      Application <GradientText>Behavior</GradientText>
                    </>
                  }
                />
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
                  autoAcceptMatch={autoAcceptMatch}
                  setAutoAcceptMatch={setAutoAcceptMatch}
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
              </GlassCard>
            </Reveal>

            {/* ---------- Quick Controls ---------- */}
            <Reveal delay={0.025} className="col-span-12">
              <GlassCard className="flex flex-col gap-5">
                <CardHeader
                  eyebrow="Layout"
                  title="Quick Controls"
                  trailing={
                    <SectionIcon>
                      <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
                    </SectionIcon>
                  }
                />
                <div className="flex flex-col">
                  <SettingRow
                    label="Position"
                    description="Side of the screen where the floating match controls sit."
                  >
                    <SidePicker side={widgetSide} onChange={setWidgetSide} />
                  </SettingRow>
                </div>
              </GlassCard>
            </Reveal>

            {/* ---------- Notifications ---------- */}
            <Reveal delay={0.05} className="col-span-12">
              <GlassCard className="flex flex-col gap-5">
                <CardHeader
                  eyebrow="Notifications"
                  title="Room Invitations"
                  trailing={
                    <SectionIcon>
                      <Bell className="h-3.5 w-3.5" aria-hidden />
                    </SectionIcon>
                  }
                />
                <div className="flex flex-col">
                  <SettingRow
                    label="Notification sound"
                    description="Play a sound when you receive a room invitation."
                  >
                    <Toggle
                      checked={notificationSound}
                      onChange={(v) => {
                        setNotificationSound(v);
                        save("notificationSound", v);
                      }}
                      aria-label="Notification sound"
                    />
                  </SettingRow>
                </div>
              </GlassCard>
            </Reveal>

            {/* ---------- Privacy ---------- */}
            <Reveal delay={0.1} className="col-span-12">
              <GlassCard className="flex flex-col gap-5">
                <CardHeader
                  eyebrow="Privacy"
                  title="Telemetry & Analytics"
                  trailing={
                    <SectionIcon>
                      <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                    </SectionIcon>
                  }
                />
                <div className="flex flex-col">
                  <SettingRow
                    label="Enable telemetry"
                    description="Help improve SkinPicker by sharing anonymous usage data."
                  >
                    <Toggle
                      checked={telemetryEnabled}
                      onChange={(v) => setTelemetryEnabled(v)}
                      disabled={telemetryLoading}
                      aria-label="Enable telemetry"
                    />
                  </SettingRow>
                </div>
                <TelemetryDetails />
              </GlassCard>
            </Reveal>

            {/* ---------- Support ---------- */}
            <Reveal delay={0.15} className="col-span-12">
              <GlassCard className="flex flex-col gap-5">
                <CardHeader
                  eyebrow="Support"
                  title="Troubleshooting"
                  trailing={
                    <SectionIcon>
                      <Sparkles className="h-3.5 w-3.5" aria-hidden />
                    </SectionIcon>
                  }
                />
                <div className="flex flex-col">
                  <SettingRow
                    label="Debug logs"
                    description="Open the logs folder to send files for bug reports."
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => api.openLogsFolder()}
                      icon={<FolderOpen className="h-3.5 w-3.5" aria-hidden />}
                    >
                      Open folder
                    </Button>
                  </SettingRow>

                  <SettingRow
                    label="Contact & feedback"
                    description="Found a bug or have a suggestion? Feel free to reach out."
                  >
                    <ContactButton />
                  </SettingRow>
                </div>
              </GlassCard>
            </Reveal>

            {/* ---------- About ---------- */}
            <Reveal delay={0.2} className="col-span-12">
              <GlassCard className="flex flex-col gap-4">
                <CardHeader
                  eyebrow="About"
                  title={
                    <>
                      Skin <GradientText>Picker</GradientText>
                    </>
                  }
                  trailing={<VersionPill>v{__APP_VERSION__}</VersionPill>}
                />
                <div className="flex flex-col gap-2">
                  <p className="m-0 flex items-center gap-2 text-sm leading-relaxed text-white/70">
                    <Info className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden />
                    Not affiliated with Riot Games or DPM.lol. Crafted to make
                    skin selection smoother and more delightful.
                  </p>
                  <p className="m-0 pl-5 text-xs text-muted">
                    © 2025 Skin Picker. All rights reserved.
                  </p>
                </div>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- Local primitives (scoped to Settings) ---------- */

function SettingRow({
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

function SidePicker({
  side,
  onChange,
}: {
  side: WidgetSide;
  onChange: (s: WidgetSide) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] p-1">
      {(["left", "right"] as const).map((opt) => {
        const active = side === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={active}
            className={cn(
              "rounded-full border px-3.5 py-1 text-xs font-medium transition-colors duration-150",
              active
                ? "border-accent/40 bg-gradient-to-br from-accent/20 to-accent-strong/10 text-white"
                : "border-transparent text-white/60 hover:text-white"
            )}
          >
            {opt === "left" ? "Left" : "Right"}
          </button>
        );
      })}
    </div>
  );
}

function SectionIcon({ children }: { children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-full",
        "border border-white/10 bg-white/[0.04] text-white/70"
      )}
      aria-hidden
    >
      {children}
    </span>
  );
}

function VersionPill({ children }: { children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/15 bg-white/[0.06]",
        "px-3 py-1 text-xs font-bold tracking-wider text-white"
      )}
    >
      {children}
    </span>
  );
}

function TelemetryDetails() {
  return (
    <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm">
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center justify-between gap-2 text-white/70",
          "transition-colors duration-200 hover:text-white",
          "[&::-webkit-details-marker]:hidden"
        )}
      >
        <span className="font-medium">What data is collected?</span>
        <ChevronDown
          className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <div className="mt-3 flex flex-col gap-3 text-xs leading-relaxed text-white/60">
        <div>
          <p className="m-0 mb-1 font-semibold text-white/80">Events we send</p>
          <ul className="m-0 flex list-disc flex-col gap-1 pl-5">
            <li>Feature usage — rerolls, rooms (with squad size), priorities, skinergy matches</li>
            <li>Settings you toggle (auto-roll, performance mode…)</li>
            <li>App lifecycle — launch, screen views, updates applied</li>
            <li>League client connect / disconnect (no game data)</li>
          </ul>
        </div>
        <div>
          <p className="m-0 mb-1 font-semibold text-white/80">
            Auto-added by the analytics provider
          </p>
          <ul className="m-0 flex list-disc flex-col gap-1 pl-5">
            <li>App version, OS, system language</li>
            <li>Country (derived from IP, then discarded)</li>
            <li>A random per-install identifier (no link to your Riot account)</li>
          </ul>
        </div>
        <p className="m-0 text-accent-strong">
          <strong className="text-accent">Never collected:</strong> summoner
          name, Riot account, owned or selected skins, match or rank data, IP
          address.
        </p>
      </div>
    </details>
  );
}
