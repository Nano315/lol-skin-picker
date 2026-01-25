import { useState, useEffect, useCallback } from "react";

export function useTelemetryConsent() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.lcu.getTelemetryConsent().then((value) => {
      setEnabled(value);
      setLoading(false);
    });
  }, []);

  const setConsent = useCallback(async (value: boolean) => {
    await window.lcu.setTelemetryConsent(value);
    setEnabled(value);
    // Emit event to notify Sentry/Umami
    window.dispatchEvent(
      new CustomEvent("telemetry-consent-changed", { detail: { enabled: value } })
    );
  }, []);

  return { enabled, setConsent, loading };
}
