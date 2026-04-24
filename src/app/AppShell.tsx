import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { useSyncPrefsWithBackend } from "@/features/hooks/useSyncPrefsWithBackend";
import MascotsLayer from "@/components/overlays/MascotsLayer";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { RoomsClientConnector } from "./RoomsClientConnector";
import { IdentityConnector } from "./IdentityConnector";
import { TelemetryConsentModal } from "@/components/TelemetryConsentModal";
import { useTelemetryConsent } from "@/features/hooks/useTelemetryConsent";
import { isFirstLaunch } from "@/features/api";
import { trackAppLaunch } from "@/features/analytics/tracker";

import { usePrefs } from "@/features/hooks/usePrefs";
import { useEffect, useState } from "react";

export default function AppShell() {
  useSyncPrefsWithBackend();
  const { read } = usePrefs();
  const [showConsentModal, setShowConsentModal] = useState(false);
  const { setConsent } = useTelemetryConsent();

  // Check for first launch to show telemetry consent modal
  useEffect(() => {
    isFirstLaunch().then((isFirst) => {
      if (isFirst) setShowConsentModal(true);
    });
  }, []);

  // Track app launch
  useEffect(() => {
    trackAppLaunch();
  }, []);

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

  return (
    <ToastProvider>
      {showConsentModal && (
        <TelemetryConsentModal
          onAccept={() => {
            setConsent(true);
            setShowConsentModal(false);
          }}
          onDecline={() => {
            setConsent(false);
            setShowConsentModal(false);
          }}
        />
      )}
      <RoomsClientConnector />
      <IdentityConnector />
      <div>
        <RouterProvider router={router} />
        <MascotsLayer />
      </div>
    </ToastProvider>
  );
}
