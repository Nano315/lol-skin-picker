import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { useSyncPrefsWithBackend } from "@/features/hooks/useSyncPrefsWithBackend";
import MascotsLayer from "@/components/overlays/MascotsLayer";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { RoomsClientConnector } from "./RoomsClientConnector";
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
    // On mount, check if performance mode is enabled
    const isPerf = read("performanceMode");
    if (isPerf) {
      document.body.classList.add("low-spec");
    } else {
      document.body.classList.remove("low-spec");
    }
    
    // Listen for storage changes to update immediately if changed in another tab/window
    // or if changed in Settings and we want global effect
    const handler = () => {
       const val = localStorage.getItem("pref-performanceMode") === "true";
       if (val) document.body.classList.add("low-spec");
       else document.body.classList.remove("low-spec");
    };
    window.addEventListener("storage", handler);
    // Also listen to a custom event if we want instant update within same window
    // But for now, since we update localStorage in OptionsPanel, we can rely on that if we dispatch a storage event manually or just rely on state in Settings.
    // However, AppShell is at the top. 
    // A simple way is to poll or use an event emitter. 
    // Given the architecture, let's just check on mount and maybe add a small interval or rely on the fact that 
    // when user changes it in Settings, the class is applied there? No, Settings is a page.
    // Let's make it simple: Add a listener to a custom event dispatched by usePrefs/OptionsPanel?
    // Or simpler: usePrefs could return the current value if it was a context.
    // For now, let's stick to the requirement: "Utilise un useEffect pour surveiller la preference".
    // Since usePrefs reads from localStorage, we need a way to know when it changes.
    // The user requirement says "Fichier : src/app/AppShell.tsx ... Utilise un useEffect pour surveiller la preference 'performanceMode'."
    
    // To make it reactive without a Context, we can listen to the window event we might dispatch or just storage event.
    // But actually, since OptionsPanel updates localStorage, we can dispatch a custom event there?
    // Or better, let's just use an interval check or the storage event (which only works across windows).
    // Wait, the user instructions say: "Lors du changement, il doit : mettre a jour l'etat React, sauvegarder via savePref..."
    // And in AppShell: "Utilise un useEffect pour surveiller la preference".
    
    // Let's implement a simple polling or event listener for the custom event if we add one. 
    // But to be safe and follow instructions strictly:
    // We can add a custom event dispatch in usePrefs save function? 
    // No, I shouldn't modify usePrefs more than requested.
    
    // Actually, if I look at `useSyncPrefsWithBackend`, maybe I can leverage that?
    // Let's just add a `storage` listener which is standard, and maybe a custom one.
    
    // Let's try to be smart. If I change the preference in Settings, I want the class to apply immediately.
    // I will add a custom event dispatch in `OptionsPanel` or `usePrefs`? 
    // The user didn't ask to modify `usePrefs` to dispatch events.
    // But `OptionsPanel` calls `savePref`.
    
    // Let's look at `AppShell.tsx` again.
    // It's the root component.
    
    // I will implement a `useEffect` that checks `localStorage` on mount and adds a listener for a custom event `pref-change`.
    // And I'll update `usePrefs` to dispatch that event? 
    // The user instruction for `usePrefs` was "Mets a jour les types et la logique pour gerer une nouvelle cle".
    // It didn't explicitly forbid adding an event dispatch.
    
    // Let's add the dispatch to `usePrefs` `save` function. It's cleaner.
    
    return () => {
      window.removeEventListener("storage", handler);
    };
  }, [read]);

  // To ensure reactivity within the same window when `save` is called:
  useEffect(() => {
      const localHandler = (e: CustomEvent) => {
          if (e.detail.key === "performanceMode") {
              if (e.detail.value) document.body.classList.add("low-spec");
              else document.body.classList.remove("low-spec");
          }
      };
      window.addEventListener("pref-changed", localHandler as EventListener);
      return () => window.removeEventListener("pref-changed", localHandler as EventListener);
  }, []);

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
      <div>
        <RouterProvider router={router} />
        <MascotsLayer />
      </div>
    </ToastProvider>
  );
}
