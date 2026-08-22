"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useCreateGroup, useGroupUsers } from "@/lib/data/hooks";
import { me } from "@/lib/data/hooks";
import { cn } from "@/lib/utils";

const KNOWN_IDS = ["ali", "imran", "sara", "bilal", "hassan", "fatima"];
const EMOJIS = ["🍵", "🏠", "🏔️", "🎉", "⚽", "📚", "🚗", "💼"];

export default function NewGroupPage() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🍵");
  const [memberIds, setMemberIds] = useState<Set<string>>(new Set([me()]));
  const { data: users } = useGroupUsers(KNOWN_IDS);
  const createGroup = useCreateGroup();

  function toggle(id: string) {
    setMemberIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function submit() {
    if (!name.trim()) return;
    const group = await createGroup.mutateAsync({
      name: name.trim(),
      emoji,
      memberIds: [...memberIds],
      createdBy: me(),
    });
    router.push(`/${locale}/groups/${group.id}`);
  }

  return (
    <main className="min-h-screen bg-bg">
      <header className="flex h-14 items-center gap-3 px-5">
        <Link
          href={`/${locale}/groups`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface shadow-card"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-[21px] font-bold">New group</h1>
      </header>

      <div className="flex flex-col gap-4 px-5">
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-muted">Group name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Chai Gang" />
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-muted">Icon</label>
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border text-lg transition",
                  emoji === e ? "border-brand-600 bg-brand-100" : "border-line bg-surface"
                )}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-muted">
            Members ({memberIds.size})
          </label>
          <Card className="px-4 py-1">
            {(users ?? []).map((u) => (
              <button
                key={u.id}
                onClick={() => toggle(u.id)}
                className="flex w-full items-center gap-3 border-b border-line py-3 text-left last:border-0"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-[13px] font-bold">
                  {u.name[0]}
                </span>
                <span className="flex-1 text-[15px] font-semibold">
                  {u.name}
                  {u.id === me() && <span className="text-xs text-muted"> (you)</span>}
                </span>
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border text-xs",
                    memberIds.has(u.id)
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-line text-transparent"
                  )}
                >
                  ✓
                </span>
              </button>
            ))}
          </Card>
        </div>

        <Button onClick={submit} disabled={!name.trim() || createGroup.isPending}>
          {createGroup.isPending ? "Creating…" : "Create group"}
        </Button>
      </div>
    </main>
  );
}
