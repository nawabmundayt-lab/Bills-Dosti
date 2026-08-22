"use client";

import { useEffect } from "react";

/**
 * Registers the Serwist service worker (prod builds only).
 * Phase 4 will add: update-available banner + beforeinstallprompt capture.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* SW optional in dev/preview */
      });
    }
  }, []);
  return null;
}
