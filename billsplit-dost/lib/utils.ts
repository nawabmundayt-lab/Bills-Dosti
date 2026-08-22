import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a money amount in PKR/INR style: "Rs 1,500" */
export function formatMoney(amount: number, currency: "PKR" | "INR" = "PKR"): string {
  const prefix = currency === "PKR" ? "Rs" : "₹";
  return `${prefix} ${new Intl.NumberFormat("en-IN").format(Math.round(amount * 100) / 100)}`;
}
