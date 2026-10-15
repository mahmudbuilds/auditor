"use client";

import { ArrowRight, Check, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, PageHeader, Panel } from "@/components/ui/kit";
import { KIND_META, type RecordKind } from "@/lib/format";

const ORDER: RecordKind[] = ["lecture", "memo", "meeting", "other"];

export function RecordTypeSelect() {
  const router = useRouter();
  const [kind, setKind] = useState<RecordKind>("lecture");

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Record"
        title="What are you recording?"
        subtitle="Choose a type. You can change it later."
      />
      <Panel className="p-5 pt-6">
        <div
          role="radiogroup"
          aria-label="Recording type"
          className="grid gap-3 sm:grid-cols-2"
        >
          {ORDER.map((k) => {
            const meta = KIND_META[k];
            const selected = k === kind;
            return (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setKind(k)}
                className={`relative flex items-start gap-4 rounded-[6px] border p-4 text-left transition ${
                  selected
                    ? "border-[#e0963a] bg-[#f3eee4] shadow-[0_0_0_2px_#e0963a]"
                    : "border-[#bdb4a3] bg-[#ece6da] hover:bg-[#e4ddd0]"
                }`}
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[5px] ${
                    selected ? "bg-[#1a1a1a] text-[#f6ad3c]" : "bg-[#d8d1c2]"
                  }`}
                >
                  <meta.icon className="h-6 w-6" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-[16px] font-semibold">
                    {meta.label}
                  </span>
                  <span className="mt-0.5 block text-[13px] text-[#5f594c]">
                    {meta.blurb}
                  </span>
                </span>
                {selected && (
                  <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#e0963a]">
                    <Check className="h-3 w-3 text-[#1a1a1a]" aria-hidden />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <Button
          variant="dark"
          size="lg"
          className="mt-5 w-full"
          onClick={() => router.push(`/record/live?type=${kind}`)}
        >
          Continue <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
        <p className="mt-4 text-center text-[13px] text-[#5f594c]">
          Already have a file?{" "}
          <Link
            href="/import"
            className="inline-flex items-center gap-1 font-semibold text-[#22201d] underline underline-offset-2"
          >
            <Upload className="h-3.5 w-3.5" aria-hidden /> Import audio
          </Link>
        </p>
      </Panel>
    </div>
  );
}
