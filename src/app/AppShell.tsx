import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { useSyncPrefsWithBackend } from "@/features/hooks/useSyncPrefsWithBackend";
import MascotsLayer from "@/components/overlays/MascotsLayer";
import MatchControls from "@/components/overlays/MatchControls";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { RoomsClientConnector } from "./RoomsClientConnector";
import { IdentityConnector } from "./IdentityConnector";
import { MatchLockSyncConnector } from "./MatchLockSyncConnector";
import { TelemetryConsentModal } from "@/components/TelemetryConsentModal";
import { WelcomeFlow } from "@/components/onboarding/WelcomeFlow";
import { useTelemetryConsent } from "@/features/hooks/useTelemetryConsent";
import { useOnboarding } from "@/features/onboarding/useOnboarding";
import { useConnection } from "@/features/hooks/useConnection";
import { trackAppLaunch } from "@/features/analytics/tracker";

import { usePrefs } from "@/features/hooks/usePrefs";
import { useEffect } from "react";

export default function AppShell() {
  useSyncPrefsWithBackend();
  const { read } = usePrefs();
  const { state: onboarding, hydrated, markCompleted } = useOnboarding();
  const { setConsent } = useTelemetryConsent();
  const { status: lcuStatus } = useConnection();

  // Track app launch
  useEffect(() => {
    trackAppLaunch();
  }, []);

  // Pre-warm caches that the Solo standby carousel depends on. Both IPCs
  // are server-side cached (5min TTL on champion library); we just want to
  // trigger the LCU fetch as soon as the client is up so by the time the
  // user lands on Solo the data is already in memory and the carousel
  // doesn't have to wait for the first IPC roundtrip to render. Pre-fix,
  // the first Solo visit of a session would render an empty carousel for
  // ~300-800ms (LCU champion-library fetch), making it look like the
  // carousel didn't "start" until the user navigated and came back.
  useEffect(() => {
    if (lcuStatus !== "connected") return;
    void window.lcu.getOwnedChampions().catch(() => {});
    void window.lcu.getGlobalRecentHistory(10).catch(() => {});
  }, [lcuStatus]);

  useEffect(() => {
    const applyPerf = (val: boolean) => {
      document.body.classList.toggle("low-spec", val);
    };

    applyPerf(!!read("performanceMode"));

    // Cross-window changes come through the standard storage event; same-window
    // changes go through a custom "pref-changed" event dispatched by usePrefs.
    const storageHandler = () => {
      applyPerf(localStorage.getItem("pref-performanceMode") === "true");
    };
    const localHandler = (e: Event) => {
      const detail = (e as CustomEvent<{ key: string; value: boolean }>).detail;
      if (detail?.key === "performanceMode") applyPerf(!!detail.value);
    };

    window.addEventListener("storage", storageHandler);
    window.addEventListener("pref-changed", localHandler);
    return () => {
      window.removeEventListener("storage", storageHandler);
      window.removeEventListener("pref-changed", localHandler);
    };
  }, [read]);

  // ----- Onboarding gates -----
  // Welcome flow takes priority over the standalone consent modal.
  // After hydration:
  //   • welcomeCompleted=false                   → show WelcomeFlow
  //   • welcomeCompleted=true, consentRecorded=false → show TelemetryConsentModal (skip path)
  //   • both true                                → app as usual
  const showWelcome = hydrated && !onboarding.welcomeCompleted;
  const showConsentFallback =
    hydrated && onboarding.welcomeCompleted && !onboarding.consentRecorded;

  // Step 3: user explicitly finished the flow.
  //
  //   • First-time path  (telemetryEnabled = true | false)
  //       setConsent() flips both `telemetryEnabled` (settings.json) AND
  //       `consentRecorded` (onboarding.json) atomically server-side. We
  //       then mark the welcome as completed — that single call returns the
  //       latest full state, so the local store ends up consistent with
  //       both flags true in one round-trip.
  //
  //   • Replay path      (telemetryEnabled = undefined)
  //       The user has already responded to the consent prompt at some
  //       point. Step 3 hides the toggle and we MUST NOT touch `setConsent`
  //       — otherwise a misclick would silently overwrite their pref.
  const handleWelcomeComplete = async (
    telemetryEnabled: boolean | undefined
  ) => {
    if (telemetryEnabled !== undefined) {
      await setConsent(telemetryEnabled);
    }
    await markCompleted("welcomeCompleted");
  };

  // Skip path: dismiss the welcome but DON'T silently grant or refuse
  // telemetry — fall back to the existing standalone consent modal so the
  // user still gets the explicit accept/decline prompt (regulatory).
  const handleWelcomeSkip = async () => {
    await markCompleted("welcomeCompleted");
  };

  // Fallback consent modal handlers. setConsent() flips consentRecorded
  // server-side, but the renderer store needs a separate sync — markCompleted
  // is idempotent server-side (returns cached state without rewriting) and
  // hands back the latest full state, which closes the modal locally.
  const handleConsentAccept = async () => {
    await setConsent(true);
    await markCompleted("consentRecorded");
  };
  const handleConsentDecline = async () => {
    await setConsent(false);
    await markCompleted("consentRecorded");
  };

  return (
    <ToastProvider>
      {showWelcome && (
        <WelcomeFlow
          onComplete={handleWelcomeComplete}
          onSkip={handleWelcomeSkip}
          consentAlreadyRecorded={onboarding.consentRecorded}
        />
      )}
      {showConsentFallback && (
        <TelemetryConsentModal
          onAccept={() => {
            void handleConsentAccept();
          }}
          onDecline={() => {
            void handleConsentDecline();
          }}
        />
      )}
      <RoomsClientConnector />
      <IdentityConnector />
      <MatchLockSyncConnector />
      <div>
        <RouterProvider router={router} />
        <MascotsLayer />
        <MatchControls />
      </div>
    </ToastProvider>
  );
}
