"use client";

import { create } from "zustand";
import type { ConfirmationResult } from "firebase/auth";

/**
 * Phase 3/4 — Client state store (Zustand).
 * currentUserId drives the data layer; demo mode defaults to "ali".
 */

export type Region = "PK" | "IN";

interface AppState {
  phone: string;
  countryCode: string;
  name: string;
  region: Region;
  isAuthed: boolean;
  currentUserId: string;
  confirmationResult: ConfirmationResult | null;
  isPro: boolean;
  // PWA install prompt (beforeinstallprompt)
  installPromptEvent: Event | null;
  setPhone: (phone: string) => void;
  setCountryCode: (code: string, region: Region) => void;
  setName: (name: string) => void;
  setAuthed: (authed: boolean) => void;
  setCurrentUserId: (id: string) => void;
  setConfirmationResult: (r: ConfirmationResult | null) => void;
  setInstallPromptEvent: (e: Event | null) => void;
  unlockPro: () => void;
}

function readProFlag(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem("bsd-pro") === "1";
  } catch {
    return false;
  }
}

export const useAppStore = create<AppState>((set) => ({
  phone: "",
  countryCode: "+92",
  name: "Ali Raza",
  region: "PK",
  isAuthed: false,
  currentUserId: "ali",
  confirmationResult: null,
  isPro: readProFlag(),
  installPromptEvent: null,
  setPhone: (phone) => set({ phone }),
  setCountryCode: (code, region) => set({ countryCode: code, region }),
  setName: (name) => set({ name }),
  setAuthed: (isAuthed) => set({ isAuthed }),
  setCurrentUserId: (currentUserId) => set({ currentUserId }),
  setConfirmationResult: (confirmationResult) => set({ confirmationResult }),
  setInstallPromptEvent: (installPromptEvent) => set({ installPromptEvent }),
  unlockPro: () => {
    set({ isPro: true });
    try {
      window.localStorage.setItem("bsd-pro", "1");
    } catch {
      /* storage unavailable */
    }
  },
}));
