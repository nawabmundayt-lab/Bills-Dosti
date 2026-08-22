"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store/app-store";

/**
 * Phase 4/7 — PWA wiring:
 *  1. Captures `beforeinstallprompt` so the install button can fire it.
 *  2. Listens for service-worker updates → shows the "new version" banner.
 */
export function PwaHooks() {
  const setInstallPromptEvent = useAppStore((s) => s.setInstallPromptEvent);

  useEffect(() => {
    // Install prompt capture
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPromptEvent(e);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, [setInstallPromptEvent]);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  }, []);

  return null;
}
