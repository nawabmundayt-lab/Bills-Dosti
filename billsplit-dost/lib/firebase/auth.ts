"use client";

import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from "firebase/auth";
import { getFirebaseAuth } from "./config";

/**
 * Phase 4 Module 1 — Phone auth (PK +92 / IN +91).
 *
 * These wrappers work against real Firebase when configured; until then
 * they throw a clear "demo mode" error so the UI can still be built.
 *
 * WebOTP autofill happens automatically via the browser when the OTP
 * <input> has `autoComplete="one-time-code"` — no SMS permission needed.
 */

let verifier: RecaptchaVerifier | null = null;

export function getRecaptchaVerifier(containerId = "recaptcha-container") {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error(
      "Firebase not configured — add NEXT_PUBLIC_FIREBASE_* env vars (see .env.example)"
    );
  }
  if (!verifier) {
    verifier = new RecaptchaVerifier(auth, containerId, { size: "invisible" });
  }
  return verifier;
}

export async function sendOtp(phoneNumber: string): Promise<ConfirmationResult> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("DEMO_MODE: Firebase not configured. OTP sending will be wired in Phase 4.");
  }
  const verifier = getRecaptchaVerifier();
  return signInWithPhoneNumber(auth, phoneNumber, verifier);
}

export async function verifyOtp(confirmationResult: ConfirmationResult, code: string) {
  return confirmationResult.confirm(code);
}
