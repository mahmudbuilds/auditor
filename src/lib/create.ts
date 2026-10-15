import type { RecordKind } from "@/lib/format";
import { KIND_META, TODAY_LABEL, clock } from "@/lib/format";
import type { RecordingItem } from "@/types/recording";

/** How long the simulated "AI processing" takes for new recordings. */
const PROCESSING_MS = 12_000;

function waveFor(seed: number): number[] {
  return Array.from({ length: 24 }, (_, i) =>
    Math.round(45 + 40 * Math.abs(Math.sin(seed * 0.37 + i * 0.9))),
  );
}

export function defaultTitle(kind: RecordKind): string {
  const label = KIND_META[kind].label;
  return `${label} · ${TODAY_LABEL.replace(", 2026", "")}`;
}

/** Builds a new recording in the "processing" state. Call from handlers only. */
export function makeRecording(opts: {
  kind: RecordKind;
  title: string;
  seconds: number;
  marks?: number[];
  source?: "recorded" | "imported";
}): RecordingItem {
  const now = Date.now();
  const seconds = Math.max(0, Math.round(opts.seconds));
  return {
    id: `rec-${now.toString(36)}`,
    title: opts.title.trim() || defaultTitle(opts.kind),
    course: "Unsorted",
    speaker: "You",
    date: TODAY_LABEL,
    duration: seconds > 0 ? clock(seconds) : "--:--",
    durationSeconds: seconds,
    type: KIND_META[opts.kind].recType,
    status: "processing",
    isStarred: false,
    waveform: waveFor(seconds),
    source: opts.source ?? "recorded",
    marks: opts.marks ?? [],
    startedAt: now,
    readyAt: now + PROCESSING_MS,
    summary: { overview: "", keyTakeaways: [], studyQuestions: [] },
    transcript: [],
  };
}
