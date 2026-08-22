"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useJoinGroup } from "@/lib/data/hooks";

export default function JoinGroupPage() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const joinGroup = useJoinGroup();

  async function submit() {
    if (!code.trim()) return;
    const group = await joinGroup.mutateAsync(code.trim().toUpperCase());
    if (group) {
      router.push(`/${locale}/groups/${group.id}`);
    } else {
      setError("Invite code not found — check and try again");
    }
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
        <h1 className="text-[21px] font-bold">Join group</h1>
      </header>

      <div className="flex flex-col gap-4 px-5">
        <p className="text-sm text-muted">
          Paste the invite code you got from your dost (e.g. <b>CHAI-7F2K</b>).
        </p>
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="XXXX-XXXX"
          className="text-center text-lg font-bold uppercase"
        />
        {error && <p className="text-[13px] text-danger">{error}</p>}
        <Button onClick={submit} disabled={!code.trim() || joinGroup.isPending}>
          {joinGroup.isPending ? "Joining…" : "Join"}
        </Button>
      </div>
    </main>
  );
}
