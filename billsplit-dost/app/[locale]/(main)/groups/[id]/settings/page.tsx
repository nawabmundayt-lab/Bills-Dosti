"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, LogOut, Trash2, Share2, Copy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useGroupData, useLeaveGroup, useDeleteGroup, useGroupUsers, me } from "@/lib/data/hooks";

/**
 * Screen 9 — Group settings: invite code, share, leave, delete (admin/creator).
 */
export default function GroupSettingsPage() {
  const { locale, id } = useParams<{ locale: string; id: string }>();
  const router = useRouter();
  const results = useGroupData(id);
  const group = results[0].data;
  const { data: users } = useGroupUsers(group?.memberIds ?? []);
  const userMap = new Map((users ?? []).map((u) => [u.id, u]));
  const userId = me();
  const leaveGroup = useLeaveGroup();
  const deleteGroup = useDeleteGroup();
  const [confirming, setConfirming] = useState<"leave" | "delete" | null>(null);
  const [copied, setCopied] = useState(false);

  if (results[0].isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand-600" />
      </main>
    );
  }
  if (!group) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg">
        <p className="text-sm text-muted">Group not found</p>
      </main>
    );
  }

  const g = group;
  const isCreator = g.createdBy === userId;
  const inviteLink = `${window.location.origin}/${locale}/groups/join?code=${g.inviteCode}`;

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title: `Join ${g.name} on BillSplit Dost`, url: inviteLink });
      } else {
        await navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* cancelled */
    }
  }

  async function doLeave() {
    await leaveGroup.mutateAsync({ id: g.id, userId });
    router.push(`/${locale}/groups`);
  }

  async function doDelete() {
    await deleteGroup.mutateAsync(g.id);
    router.push(`/${locale}/groups`);
  }

  return (
    <main className="min-h-screen bg-bg">
      <header className="flex h-14 items-center gap-3 px-5">
        <Link
          href={`/${locale}/groups/${id}`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface shadow-card"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-[20px] font-bold leading-tight">Group settings</h1>
          <div className="text-[12.5px] text-muted">
            {g.emoji} {g.name}
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-4 px-5">
        {/* Members */}
        <div>
          <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted">
            Members ({g.memberIds.length})
          </div>
          <Card className="px-4 py-1">
            {g.memberIds.map((mid) => {
              const u = userMap.get(mid);
              return (
                <div
                  key={mid}
                  className="flex items-center gap-3 border-b border-line py-3 last:border-0"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-[13px] font-bold">
                    {u?.name?.[0] ?? "?"}
                  </span>
                  <span className="flex-1 text-[15px] font-semibold">
                    {u?.name ?? mid}
                    {mid === userId && <span className="text-xs text-muted"> (you)</span>}
                  </span>
                  {mid === g.createdBy && (
                    <span className="rounded-full bg-gold-100 px-2.5 py-0.5 text-[10.5px] font-bold text-gold-700">
                      admin
                    </span>
                  )}
                </div>
              );
            })}
          </Card>
        </div>

        {/* Invite */}
        <div>
          <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted">Invite</div>
          <Card className="p-4">
            <div className="mb-2 text-[12px] text-muted">Invite code</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-[10px] border border-line bg-bg px-3.5 py-2.5 text-center text-[15px] font-extrabold tracking-widest text-brand-700">
                {g.inviteCode}
              </div>
              <button
                onClick={async () => {
                  await navigator.clipboard?.writeText(inviteLink).catch(() => {});
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-line bg-surface"
                aria-label="Copy link"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={share}
                className="flex h-10 items-center gap-1.5 rounded-[10px] bg-brand-600 px-3.5 text-[13px] font-bold text-white"
              >
                <Share2 className="h-4 w-4" /> Share
              </button>
            </div>
            {copied && (
              <p className="mt-2 text-center text-[12px] font-semibold text-brand-600">
                Invite link copied ✓
              </p>
            )}
          </Card>
        </div>

        {/* Danger zone */}
        <div>
          <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted">
            Danger zone
          </div>
          <Card className="p-4">
            {confirming === null && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setConfirming("leave")}
                  className="flex h-11 items-center gap-2.5 rounded-[10px] border border-line px-3.5 text-[14px] font-semibold text-ink"
                >
                  <LogOut className="h-4 w-4 text-muted" /> Leave group
                </button>
                {isCreator && (
                  <button
                    onClick={() => setConfirming("delete")}
                    className="flex h-11 items-center gap-2.5 rounded-[10px] border border-danger/30 px-3.5 text-[14px] font-semibold text-danger"
                  >
                    <Trash2 className="h-4 w-4" /> Delete group (admin)
                  </button>
                )}
              </div>
            )}

            {confirming === "leave" && (
              <div>
                <p className="mb-3 text-[13.5px] font-semibold">
                  Leave {g.name}? Your expenses stay, but you lose access.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={doLeave}
                    className="h-10 flex-1 rounded-[10px] bg-danger text-[13.5px] font-bold text-white"
                  >
                    Leave
                  </button>
                  <button
                    onClick={() => setConfirming(null)}
                    className="h-10 flex-1 rounded-[10px] border border-line bg-surface text-[13.5px] font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {confirming === "delete" && (
              <div>
                <p className="mb-3 text-[13.5px] font-semibold text-danger">
                  Delete {g.name} permanently? All {results[1].data?.length ?? 0} expenses and
                  settlement history will be erased for everyone.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={doDelete}
                    className="h-10 flex-1 rounded-[10px] bg-danger text-[13.5px] font-bold text-white"
                  >
                    Yes, delete
                  </button>
                  <button
                    onClick={() => setConfirming(null)}
                    className="h-10 flex-1 rounded-[10px] border border-line bg-surface text-[13.5px] font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}
