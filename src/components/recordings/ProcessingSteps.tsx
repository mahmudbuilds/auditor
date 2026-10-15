"use client";

import { Check, Loader2 } from "lucide-react";
import { useNow } from "@/lib/hooks";
import type { RecordingItem } from "@/types/recording";

const STEPS = [
  { label: "Save audio", end: 0.1 },
  { label: "Transcribe", end: 0.55 },
  { label: "Generate summary", end: 0.8 },
  { label: "Create study materials", end: 1 },
];

/** 0..1 progress of the simulated pipeline. */
export function progressOf(rec: RecordingItem, now: number): number {
  if (rec.status === "ready") return 1;
  if (!rec.startedAt || !rec.readyAt || now === 0) return 0;
  return Math.min(
    1,
    Math.max(0, (now - rec.startedAt) / (rec.readyAt - rec.startedAt)),
  );
}

export function ProcessingSteps({ rec }: { rec: RecordingItem }) {
  const now = useNow(400);
  const p = progressOf(rec, now);

  return (
    <div>
      <p className="mb-2 text-[12px] font-semibold text-[#2b2822]">
        Processing steps
      </p>
      <ol className="flex flex-col gap-2">
        {STEPS.map((s, i) => {
          const prevEnd = i === 0 ? 0 : STEPS[i - 1].end;
          const done = p >= s.end;
          const active = !done && p >= prevEnd;
          return (
            <li
              key={s.label}
              className="flex items-center gap-3 rounded-[5px] border border-[#bdb4a3] bg-[#ece6da] px-3 py-2.5 text-[13px]"
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full ${
                  done
                    ? "bg-[#3aa55d] text-white"
                    : active
                      ? "bg-[#3b82d6] text-white"
                      : "border border-[#a99f8e]"
                }`}
              >
                {done ? (
                  <Check className="h-3 w-3" aria-hidden />
                ) : active ? (
                  <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
                ) : null}
              </span>
              <span className="flex-1">{s.label}</span>
              <span
                className={`text-[12px] font-medium ${
                  done
                    ? "text-[#2f8a4c]"
                    : active
                      ? "text-[#2f6fb8]"
                      : "text-[#7a7365]"
                }`}
              >
                {done ? "Completed" : active ? "Processing…" : "Waiting"}
              </span>
            </li>
          );
        })}
      </ol>
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#cfc6b5]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(p * 100)}
        aria-label="Processing progress"
      >
        <div
          className="h-full rounded-full bg-[#e0963a] transition-[width] duration-500"
          style={{ width: `${p * 100}%` }}
        />
      </div>
    </div>
  );
}
