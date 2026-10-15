"use client";

import { Flag, Mic, Pause, Play, Square, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Button, PageHeader, Panel, SectionLabel } from "@/components/ui/kit";
import { defaultTitle, makeRecording } from "@/lib/create";
import { clock, isKind, KIND_META } from "@/lib/format";
import { useMicLevels } from "@/lib/hooks";

const BARS = 40;

function hms(s: number) {
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${sec}`;
}

function Recorder({ kind }: { kind: keyof typeof KIND_META }) {
  const router = useRouter();
  const { addRecording, toast } = useApp();
  const [title, setTitle] = useState(defaultTitle(kind));
  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(false);
  const [marks, setMarks] = useState<number[]>([]);
  const [finishing, setFinishing] = useState(false);
  const { levels, micState } = useMicLevels(!paused && !finishing, BARS);

  useEffect(() => {
    if (paused || finishing) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [paused, finishing]);

  const mark = () => {
    setMarks((m) => [...m, seconds]);
    toast(`Moment marked at ${clock(seconds)}.`);
  };

  const finish = () => {
    if (seconds < 1) {
      toast("Record at least a second before finishing.");
      return;
    }
    setFinishing(true);
    const rec = makeRecording({ kind, title, seconds, marks });
    addRecording(rec);
    router.push(`/record/saved?id=${rec.id}`);
  };

  const discard = () => {
    if (seconds > 5 && !window.confirm("Discard this recording?")) return;
    setFinishing(true);
    router.push("/record");
  };

  const meta = KIND_META[kind];

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow={`Recording · ${meta.label}`}
        title="Recording"
        actions={
          <Button variant="ghost" size="sm" onClick={discard}>
            <X className="h-4 w-4" aria-hidden /> Discard
          </Button>
        }
      />

      <Panel tone="dark" className="p-5 pt-7">
        <div className="mb-3 flex items-center justify-between text-[11px] font-semibold tracking-[0.18em]">
          <span className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full bg-[#d6322b] shadow-[0_0_8px_#d6322b] ${paused ? "opacity-30" : "rec-blink"}`}
            />
            {paused ? "PAUSED" : "RECORDING"}
          </span>
          <span className="text-[#a8a296]">
            {micState === "live"
              ? "Mic live"
              : micState === "demo"
                ? "Demo signal"
                : "Connecting…"}
          </span>
        </div>

        <label className="sr-only" htmlFor="rec-title">
          Recording title
        </label>
        <input
          id="rec-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4 h-11 w-full rounded-[5px] border border-[#3a3a3a] bg-[#161616] px-3 text-[15px] font-semibold text-[#f3efe6] outline-none focus:border-[#e0963a]"
        />

        <p
          className="text-center font-mono text-[56px] leading-none font-medium tracking-wider text-[#f6ad3c] sm:text-[72px]"
          role="timer"
          aria-label={`Elapsed ${clock(seconds)}`}
        >
          {hms(seconds)}
        </p>

        <div
          className="mt-6 flex h-[120px] items-center gap-[3px] border-y border-[#2d2d2d] px-1"
          aria-hidden
        >
          {levels.map((l, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed-size meter
              key={i}
              className="flex-1 rounded-full bg-gradient-to-t from-[#b9761f] to-[#f6ad3c] transition-[height] duration-100"
              style={{ height: `${Math.max(4, l * 100)}%` }}
            />
          ))}
        </div>

        <p className="mt-3 flex items-center justify-center gap-2 text-center text-[12px] text-[#a8a296]">
          <Mic className="h-3.5 w-3.5" aria-hidden />
          {micState === "demo"
            ? "Microphone unavailable. Showing a demo signal so you can try the flow."
            : "Audio is being captured. Keep this screen open."}
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <Button
            variant="darkGhost"
            size="lg"
            onClick={() => setPaused((p) => !p)}
            className="!h-16 flex-col !gap-1 !text-[13px]"
          >
            {paused ? (
              <Play className="h-5 w-5" fill="currentColor" aria-hidden />
            ) : (
              <Pause className="h-5 w-5" aria-hidden />
            )}
            {paused ? "Resume" : "Pause"}
          </Button>
          <Button
            variant="darkGhost"
            size="lg"
            onClick={mark}
            disabled={paused}
            className="!h-16 flex-col !gap-1 !text-[13px]"
          >
            <Flag className="h-5 w-5" aria-hidden />
            Mark moment
          </Button>
          <Button
            variant="danger"
            size="lg"
            onClick={finish}
            disabled={finishing}
            className="!h-16 flex-col !gap-1 !text-[13px]"
          >
            <Square className="h-5 w-5" fill="currentColor" aria-hidden />
            Finish
          </Button>
        </div>
      </Panel>

      {marks.length > 0 && (
        <Panel className="mt-3">
          <SectionLabel icon={Flag}>Marked moments</SectionLabel>
          <ul className="flex flex-wrap gap-2">
            {marks.map((m, i) => (
              <li
                // biome-ignore lint/suspicious/noArrayIndexKey: marks can repeat the same second
                key={i}
                className="rounded-full border border-[#bdb4a3] bg-[#ece6da] px-3 py-1 font-mono text-[12px]"
              >
                {clock(m)}
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}

function FromParams() {
  const raw = useSearchParams().get("type");
  const kind = isKind(raw) ? raw : "lecture";
  // Re-key so changing ?type= starts a fresh session.
  return <Recorder key={kind} kind={kind} />;
}

export function LiveRecorder() {
  return (
    <Suspense fallback={<div className="h-[520px]" aria-busy="true" />}>
      <FromParams />
    </Suspense>
  );
}
