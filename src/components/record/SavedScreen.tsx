"use client";

import { Check, SearchX } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { ProcessingSteps } from "@/components/recordings/ProcessingSteps";
import {
  EmptyState,
  IconTile,
  LinkButton,
  Panel,
  Waveform,
} from "@/components/ui/kit";
import { relativeDate, TYPE_META } from "@/lib/format";

function Saved() {
  const id = useSearchParams().get("id") ?? "";
  const { getRecording, hydrated } = useApp();
  const rec = getRecording(id);

  if (!hydrated) return <div className="h-[420px]" aria-busy="true" />;
  if (!rec) {
    return (
      <Panel className="mx-auto max-w-xl">
        <EmptyState
          icon={SearchX}
          title="We couldn't find that recording"
          body="It may have been deleted. Your library has everything that's saved."
          action={
            <LinkButton href="/library" variant="dark">
              Open library
            </LinkButton>
          }
        />
      </Panel>
    );
  }

  const meta = TYPE_META[rec.type];
  return (
    <div className="mx-auto max-w-xl">
      <Panel className="p-5 pt-7">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1a1a1a] text-[#6fcf8a]">
            <Check className="h-6 w-6" aria-hidden />
          </span>
          <div className="leading-tight">
            <h1 className="text-[22px] font-bold tracking-tight">
              Recording saved!
            </h1>
            <p className="text-[13px] text-[#5f594c]">
              Your audio has been saved. We&apos;re processing it with AI.
            </p>
          </div>
        </div>

        <div className="mb-5 flex items-center gap-3 rounded-[5px] border border-[#bdb4a3] bg-[#ece6da] p-3">
          <IconTile icon={meta.icon} className="h-11 w-11" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold">{rec.title}</p>
            <p className="text-[12px] text-[#6b6455]">
              <span className="font-mono">{rec.duration}</span> ·{" "}
              {relativeDate(rec.date)} · {meta.label}
            </p>
          </div>
          <Waveform
            bars={rec.waveform ?? []}
            tone="cream"
            className="hidden h-9 w-28 sm:flex"
          />
        </div>

        <ProcessingSteps rec={rec} />

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <LinkButton href={`/recordings/${rec.id}`} variant="dark" size="lg">
            View recording
          </LinkButton>
          <LinkButton href="/" variant="light" size="lg">
            Keep processing
          </LinkButton>
        </div>
        <p className="mt-3 text-center text-[12px] text-[#6b6455]">
          &ldquo;Keep processing&rdquo; lets this finish in the background.
        </p>
      </Panel>
    </div>
  );
}

export function SavedScreen() {
  return (
    <Suspense fallback={<div className="h-[420px]" aria-busy="true" />}>
      <Saved />
    </Suspense>
  );
}
