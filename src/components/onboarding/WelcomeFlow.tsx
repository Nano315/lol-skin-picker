/**
 * WelcomeFlow — first-launch onboarding overlay (Couche 1).
 *
 * Three steps designed to give a casual LoL player the gist of the app in
 * ~30 seconds, without blocking discovery of the rest:
 *
 *   1. Promise — "You lock. SkinPicker rolls." (single value-prop sentence)
 *   2. Map — the four tabs, animated chip grid with one-line each
 *   3. Bridge — live LCU connection status + telemetry consent inline
 *
 * Skip is always available top-right. If the user skips before reaching
 * step 3, the parent (AppShell) is responsible for falling back to the
 * existing TelemetryConsentModal so the consent prompt is still shown.
 *
 * Persistence is owned by the parent: this component just calls the
 * `onComplete` / `onSkip` callbacks. That keeps it pure and testable, and
 * lets Settings' "Replay tour" reuse the same component without re-binding
 * any state.
 */

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  BookOpen,
  ChevronRight,
  Dices,
  Settings as SettingsIcon,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { Button, GradientText } from "@/components/ui";
import { useConnection } from "@/features/hooks/useConnection";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3;

interface Props {
  /**
   * Called when the user reaches step 3 and explicitly accepts/declines the
   * consent prompt. The parent persists `welcomeCompleted=true` AND the
   * telemetry consent value in one go.
   *
   * When `consentAlreadyRecorded=true` (replay case), step 3 omits the
   * consent question and calls this with `undefined` — the parent must skip
   * the consent write in that case to preserve the existing value.
   */
  onComplete: (telemetryEnabled: boolean | undefined) => void;
  /**
   * Called when the user dismisses the flow before step 3. Parent persists
   * `welcomeCompleted=true` and falls back to the standalone consent modal
   * (only if consent is not yet recorded).
   */
  onSkip: () => void;
  /**
   * True when the user has already responded to the telemetry prompt in the
   * past. Step 3 then renders a "review" view with a single Done button
   * instead of the Enable / Continue without choice.
   */
  consentAlreadyRecorded?: boolean;
}

const STEP_TRANSITION = { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const };

const stepVariants: Variants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

export function WelcomeFlow({
  onComplete,
  onSkip,
  consentAlreadyRecorded = false,
}: Props) {
  const [step, setStep] = useState<Step>(1);
  const reduced = useReducedMotion();

  const handleAccept = () => onComplete(true);
  const handleDecline = () => onComplete(false);
  const handleDone = () => onComplete(undefined);

  return (
    <>
      {/* Backdrop — same depth as TelemetryConsentModal so the two can never
          stack on top of each other (AppShell guards against that anyway). */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="fixed inset-0 z-[9990] bg-black/75 backdrop-blur-sm"
        aria-hidden
      />

      <div className="pointer-events-none fixed inset-0 z-[9991] flex items-center justify-center p-6">
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-flow-title"
          initial={reduced ? false : { opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "pointer-events-auto relative w-full max-w-[640px] overflow-hidden",
            "rounded-3xl border border-white/[0.08] bg-white/[0.04] shadow-glass backdrop-blur-xl"
          )}
        >
          {/* Top-edge gradient highlight (matches GlassCard / TelemetryConsentModal) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
          />

          {/* Skip button — always available, even on step 3 */}
          <button
            type="button"
            onClick={onSkip}
            aria-label="Skip onboarding"
            className={cn(
              "absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium",
              "text-white/50 transition-colors duration-150 hover:bg-white/[0.05] hover:text-white"
            )}
          >
            Skip
            <X className="h-3 w-3" aria-hidden />
          </button>

          {/* Step body — AnimatePresence with mode="wait" so we never render
              two steps at once (avoids layout thrash on cross-fade). */}
          <AnimatePresence mode="wait" initial={false}>
            {step === 1 && (
              <Step1 key="step1" reduced={!!reduced} onNext={() => setStep(2)} />
            )}
            {step === 2 && (
              <Step2 key="step2" reduced={!!reduced} onNext={() => setStep(3)} />
            )}
            {step === 3 && (
              <Step3
                key="step3"
                reduced={!!reduced}
                consentAlreadyRecorded={consentAlreadyRecorded}
                onAccept={handleAccept}
                onDecline={handleDecline}
                onDone={handleDone}
              />
            )}
          </AnimatePresence>

          {/* Pagination dots */}
          <div className="flex items-center justify-center gap-1.5 border-t border-white/[0.06] bg-white/[0.01] py-3">
            {([1, 2, 3] as const).map((s) => (
              <span
                key={s}
                aria-hidden
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  step === s ? "w-6 bg-accent" : "w-1.5 bg-white/15"
                )}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}

/* --------------------------- Step 1 — Promise --------------------------- */

function Step1({ reduced, onNext }: { reduced: boolean; onNext: () => void }) {
  return (
    <motion.div
      variants={stepVariants}
      initial={reduced ? "center" : "enter"}
      animate="center"
      exit="exit"
      transition={STEP_TRANSITION}
      className="px-8 pb-7 pt-10 sm:px-10 sm:pt-12"
    >
      <div className="mb-6 flex justify-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-accent-strong to-accent shadow-accent-glow ring-1 ring-white/20">
          <Sparkles className="h-7 w-7 text-white" aria-hidden />
        </span>
      </div>
      <h1
        id="welcome-flow-title"
        className="m-0 text-center text-2xl font-bold leading-tight text-white sm:text-3xl"
      >
        You lock. <GradientText>SkinPicker</GradientText> rolls.
      </h1>
      <p className="m-0 mx-auto mt-4 max-w-[480px] text-center text-sm leading-relaxed text-white/70 sm:text-base">
        Lock in a champion and SkinPicker grabs a random skin and chroma from
        the ones you own — applied straight to your League client. Not a single
        button to press.
      </p>
      <div className="mt-8 flex justify-center">
        <Button
          variant="primary"
          size="md"
          onClick={onNext}
          icon={<ChevronRight className="h-4 w-4" aria-hidden />}
          iconPosition="right"
        >
          How it works
        </Button>
      </div>
    </motion.div>
  );
}

/* ----------------------------- Step 2 — Map ----------------------------- */

const TABS: Array<{
  icon: typeof Dices;
  name: string;
  desc: string;
  gradient: string;
}> = [
  {
    icon: Dices,
    name: "Solo",
    desc: "Auto-rolls a skin the moment you lock in",
    gradient: "from-violet-500/[0.16] to-fuchsia-500/[0.06]",
  },
  {
    icon: Users,
    name: "Premade",
    desc: "Sync skins across your whole team",
    gradient: "from-blue-500/[0.16] to-cyan-500/[0.06]",
  },
  {
    icon: BookOpen,
    name: "Library",
    desc: "Exclude the skins you'd rather not see",
    gradient: "from-emerald-500/[0.16] to-teal-500/[0.06]",
  },
  {
    icon: SettingsIcon,
    name: "Settings",
    desc: "Preferences, telemetry, shortcuts",
    gradient: "from-amber-500/[0.16] to-orange-500/[0.06]",
  },
];

function Step2({ reduced, onNext }: { reduced: boolean; onNext: () => void }) {
  return (
    <motion.div
      variants={stepVariants}
      initial={reduced ? "center" : "enter"}
      animate="center"
      exit="exit"
      transition={STEP_TRANSITION}
      className="px-8 pb-7 pt-10 sm:px-10 sm:pt-12"
    >
      <div className="text-center">
        <p className="m-0 text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
          The map
        </p>
        <h2
          id="welcome-flow-title"
          className="m-0 mt-1 text-2xl font-bold text-white"
        >
          Four tabs, <GradientText>one app</GradientText>
        </h2>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {TABS.map((tab, i) => {
          const Icon = tab.icon;
          return (
            <motion.div
              key={tab.name}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reduced ? 0 : 0.08 + i * 0.07,
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cn(
                "flex items-start gap-3 rounded-2xl border border-white/[0.06] p-4",
                "bg-gradient-to-br",
                tab.gradient
              )}
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white">
                  {tab.name}
                </div>
                <p className="m-0 mt-0.5 text-xs leading-relaxed text-white/65">
                  {tab.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-7 flex justify-center">
        <Button
          variant="primary"
          size="md"
          onClick={onNext}
          icon={<ChevronRight className="h-4 w-4" aria-hidden />}
          iconPosition="right"
        >
          Got it
        </Button>
      </div>
    </motion.div>
  );
}

/* ------------------------ Step 3 — Bridge + Consent --------------------- */

function Step3({
  reduced,
  consentAlreadyRecorded,
  onAccept,
  onDecline,
  onDone,
}: {
  reduced: boolean;
  consentAlreadyRecorded: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onDone: () => void;
}) {
  const { status } = useConnection();
  const connected = status === "connected";

  return (
    <motion.div
      variants={stepVariants}
      initial={reduced ? "center" : "enter"}
      animate="center"
      exit="exit"
      transition={STEP_TRANSITION}
      className="px-8 pb-7 pt-10 sm:px-10 sm:pt-12"
    >
      <div className="text-center">
        <p className="m-0 text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
          Almost there
        </p>
        <h2
          id="welcome-flow-title"
          className="m-0 mt-1 text-2xl font-bold text-white"
        >
          Ready to <GradientText>play</GradientText>?
        </h2>
      </div>

      {/* LCU bridge — useful even on replay so the user can verify connection */}
      <div
        className={cn(
          "mt-6 flex items-start gap-3 rounded-2xl border p-4 transition-colors duration-300",
          connected
            ? "border-emerald-400/30 bg-emerald-500/[0.08]"
            : "border-amber-400/25 bg-amber-500/[0.06]"
        )}
      >
        <span
          className={cn(
            "mt-0.5 inline-flex h-2 w-2 shrink-0 rounded-full",
            connected
              ? "bg-emerald-400 animate-pulse-slow"
              : "bg-amber-400 animate-pulse-slow"
          )}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-white">
            {connected ? "League detected" : "League not detected yet"}
          </div>
          <p className="m-0 mt-0.5 text-xs leading-relaxed text-white/65">
            {connected
              ? "All set — hop into a game whenever you want, SkinPicker takes it from there."
              : "Launch the League client and SkinPicker will hook in automatically as soon as it's running."}
          </p>
        </div>
      </div>

      {/* Telemetry consent — only shown the first time. On replay, the user
          has already answered; re-showing the toggle would invite an
          accidental change. The Privacy section in Settings is the dedicated
          spot for that. */}
      {!consentAlreadyRecorded && (
        <div className="mt-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-white/75 ring-1 ring-white/10">
              <ShieldCheck className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white">
                Help improve SkinPicker?
              </div>
              <p className="m-0 mt-0.5 text-xs leading-relaxed text-white/65">
                Share anonymous data about which features you use. Nothing
                about your account or your games. You can flip this back off
                anytime from Settings.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-7 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
        {consentAlreadyRecorded ? (
          <Button variant="primary" size="md" onClick={onDone}>
            Let's go
          </Button>
        ) : (
          <>
            <Button variant="secondary" size="md" onClick={onDecline}>
              No thanks
            </Button>
            <Button variant="primary" size="md" onClick={onAccept}>
              Enable telemetry
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
}
