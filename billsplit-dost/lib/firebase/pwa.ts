"use client";

import { useAppStore } from "@/lib/store/app-store";

/**
 * Screen 31 — custom install prompt action.
 * Fires the captured beforeinstallprompt event (or falls back to a hint).
 */
export async function triggerInstall(): Promise<boolean> {
  const { installPromptEvent, setInstallPromptEvent } = useAppStore.getState();
  if (installPromptEvent) {
    const evt = installPromptEvent as Event & {
      prompt: () => Promise<void>;
      userChoice?: Promise<{ outcome: string }>;
    };
    await evt.prompt();
    setInstallPromptEvent(null);
    return true;
  }
  return false;
}
