"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/utils";
import { useGroupData, useGroupUsers, useDeleteExpense, me } from "@/lib/data/hooks";
import { categoryEmoji } from "@/lib/data/selectors";
import { cn } from "@/lib/utils";

/**
 * Screen 14 — Expense detail (split breakdown + delete by payer).
 */
export default function ExpenseDetailPage() {
  const { locale, id } = useParams<{ locale: string; id: string }>();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [toast, setToast] = useState("");

  // id format: {groupId}__{expenseId}
  const [groupId, rawExpenseId] = (id ?? "").split("__");
  const results = useGroupData(groupId);
  const group = results[0].data;
  const expenses = results[1].data ?? [];
  const expense = expenses.find((e) => e.id === rawExpenseId);
  const { data: users } = useGroupUsers(group?.memberIds ?? []);
  const userMap = new Map((users ?? []).map((u) => [u.id, u]));
  const userId = me();
  const deleteExpense = useDeleteExpense();

  if (results[0].isLoading || results[1].isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand-600" />
      </main>
    );
  }

  if (!expense) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-5 text-center">
        <div className="text-4xl">🔍</div>
        <p className="text-sm text-muted">Expense not found.</p>
        <Link href={`/${locale}/groups/${groupId}`} className="font-semibold text-brand-600">
          ← Back to group
        </Link>
      </main>
    );
  }

  const expenseId = expense.id;
  const expenseGroupId = expense.groupId;
  const payer = userMap.get(expense.paidByUserId);
  const canDelete = expense.paidByUserId === userId;

  async function doDelete() {
    await deleteExpense.mutateAsync({ id: expenseId, groupId: expenseGroupId });
    setToast("Expense deleted ✓");
    setTimeout(() => router.push(`/${locale}/groups/${groupId}`), 900);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50 via-bg to-bg">
      <header className="flex h-14 items-center gap-3 px-5">
        <Link
          href={`/${locale}/groups/${groupId}`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface shadow-card"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-[21px] font-bold">Expense</h1>
      </header>

      <div className="flex flex-col gap-3 px-5">
        <div className="flex flex-col items-center py-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-100 text-3xl">
            {categoryEmoji(expense.category)}
          </span>
          <h2 className="mt-3 text-[22px] font-extrabold">{expense.title}</h2>
          <div className="text-[13.5px] text-muted">
            {payer?.name ?? "Someone"} paid ·{" "}
            {new Date(expense.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}{" "}
            · {group?.emoji} {group?.name}
          </div>
          <div className="money mt-2 text-[32px] font-bold">{formatMoney(expense.amount)}</div>
          <span className="mt-2 rounded-full bg-brand-100 px-3 py-1 text-[11.5px] font-bold text-brand-700">
            {expense.splitMode} split
          </span>
        </div>

        <Card className="px-4 py-1">
          {Object.entries(expense.shares).map(([uid, share]) => {
            const u = userMap.get(uid);
            const isPayer = uid === expense.paidByUserId;
            return (
              <div
                key={uid}
                className={cn(
                  "flex items-center gap-3 border-b border-line py-3 last:border-0",
                  isPayer && "bg-brand-50/50"
                )}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-[13px] font-bold">
                  {u?.name?.[0] ?? "?"}
                </span>
                <div className="flex-1">
                  <div className="text-[15px] font-semibold">
                    {u?.name ?? uid}
                    {uid === userId && <span className="text-xs text-muted"> (you)</span>}
                  </div>
                  <div className="text-[12px] text-muted">
                    {isPayer ? "paid — owed this share" : "owes"}
                  </div>
                </div>
                <span className="money text-[15px] font-bold">{formatMoney(share)}</span>
              </div>
            );
          })}
        </Card>

        {canDelete && (
          <div className="mt-2">
            {confirming ? (
              <div className="rounded-xl border border-danger/30 bg-red-50 p-4">
                <p className="mb-3 text-[13.5px] font-semibold text-danger">
                  Delete this expense? Everyone&apos;s balances will be recalculated.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={doDelete}
                    className="h-10 flex-1 rounded-[10px] bg-danger text-[13.5px] font-bold text-white"
                  >
                    Yes, delete
                  </button>
                  <button
                    onClick={() => setConfirming(false)}
                    className="h-10 flex-1 rounded-[10px] border border-line bg-surface text-[13.5px] font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirming(true)}
                className="w-full py-2 text-center text-[14px] font-semibold text-danger"
              >
                🗑 Delete expense
              </button>
            )}
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed inset-x-0 bottom-10 z-50 mx-auto w-fit max-w-[90%] rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white shadow-float">
          {toast}
        </div>
      )}
    </main>
  );
}
