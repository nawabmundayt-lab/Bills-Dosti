/**
 * Phase 4 — CSV export for history (client-side).
 */
import type { Expense, Settlement, UserProfile } from "./types";

export function expensesToCsv(expenses: Expense[], users: Map<string, UserProfile>): string {
  const header = [
    "Date",
    "Title",
    "Category",
    "Amount",
    "Currency",
    "Paid by",
    "Split",
    "Your share (if any)",
  ].join(",");
  const rows = expenses.map((e) => {
    const payer = users.get(e.paidByUserId)?.name ?? e.paidByUserId;
    const share = Object.entries(e.shares)
      .map(([uid, amt]) => `${users.get(uid)?.name ?? uid}:${amt}`)
      .join(" | ");
    return [
      new Date(e.createdAt).toISOString().slice(0, 10),
      csvEscape(e.title),
      csvEscape(e.category),
      e.amount,
      e.currency,
      csvEscape(payer),
      e.splitMode,
      csvEscape(share),
    ].join(",");
  });
  return [header, ...rows].join("\n");
}

export function settlementsToCsv(
  settlements: Settlement[],
  users: Map<string, UserProfile>
): string {
  const header = ["Date", "From", "To", "Amount", "Currency", "Status"].join(",");
  const rows = settlements.map((s) =>
    [
      new Date(s.createdAt).toISOString().slice(0, 10),
      csvEscape(users.get(s.fromUserId)?.name ?? s.fromUserId),
      csvEscape(users.get(s.toUserId)?.name ?? s.toUserId),
      s.amount,
      s.currency,
      s.status,
    ].join(",")
  );
  return [header, ...rows].join("\n");
}

function csvEscape(v: string): string {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export function downloadCsv(filename: string, content: string) {
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
