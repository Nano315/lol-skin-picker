import { ipcMain } from "electron";
import {
  getOnboardingState,
  markOnboardingCompleted,
  resetOnboardingState,
  type OnboardingKey,
  type OnboardingState,
} from "../onboardingState";

// Keep the allow-list explicit so a malicious renderer (compromised or
// pre-release dev builds) can't flip arbitrary keys.
const VALID_KEYS: ReadonlySet<OnboardingKey> = new Set([
  "welcomeCompleted",
  "consentRecorded",
  "rerollCoachSeen",
  "matchLockCoachSeen",
  "synergyCoachSeen",
  "exclusionToastSeen",
]);

export function registerOnboardingIpc() {
  ipcMain.handle("onboarding:getState", async (): Promise<OnboardingState> => {
    return getOnboardingState();
  });

  ipcMain.handle(
    "onboarding:markCompleted",
    async (_e, key: unknown): Promise<OnboardingState> => {
      if (typeof key !== "string" || !VALID_KEYS.has(key as OnboardingKey)) {
        throw new Error(`[onboarding] Invalid key: ${String(key)}`);
      }
      return markOnboardingCompleted(key as OnboardingKey);
    }
  );

  ipcMain.handle("onboarding:reset", async (): Promise<OnboardingState> => {
    return resetOnboardingState();
  });
}
