import type { LucideIcon } from "lucide-react";
import { AudioLines, GraduationCap, Mic, Users } from "lucide-react";
import type { RecordingItem } from "@/types/recording";

/**
 * The app has no backend, so "today" is pinned. Using the real clock during
 * render would also break prerendering under Cache Components.
 */
export const TODAY = new Date(2026, 9, 15);
export const TODAY_LABEL = "Oct 15, 2026";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** "Yesterday · Oct 7, 2026" / "Oct 14, 2026" -> Date */
export function parseDateLabel(label: string): Date | null {
  const m = label.match(/([A-Z][a-z]{2}) (\d{1,2}), (\d{4})/);
  if (!m) return null;
  const month = MONTHS.indexOf(m[1]);
  if (month < 0) return null;
  return new Date(Number(m[3]), month, Number(m[2]));
}

export function relativeDate(label: string): string {
  const d = parseDateLabel(label);
  if (!d) return label;
  const days = Math.round((TODAY.getTime() - d.getTime()) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

export function dateValue(label: string): number {
  return parseDateLabel(label)?.getTime() ?? 0;
}

/** 252 -> "04:12", 4353 -> "1:12:33" */
export function clock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export type RecordKind = "lecture" | "memo" | "meeting" | "other";

export const KIND_META: Record<
  RecordKind,
  {
    label: string;
    blurb: string;
    icon: LucideIcon;
    recType: RecordingItem["type"];
  }
> = {
  lecture: {
    label: "Lecture",
    blurb: "Transcript, summary, flashcards and study guide.",
    icon: GraduationCap,
    recType: "lecture",
  },
  memo: {
    label: "Voice memo",
    blurb: "Quick ideas, reminders and notes.",
    icon: Mic,
    recType: "voice_memo",
  },
  meeting: {
    label: "Meeting",
    blurb: "Discussion notes, decisions and action items.",
    icon: Users,
    recType: "meeting",
  },
  other: {
    label: "Other",
    blurb: "Flexible capture for any audio.",
    icon: AudioLines,
    recType: "other",
  },
};

export const TYPE_META: Record<
  RecordingItem["type"],
  { label: string; icon: LucideIcon }
> = {
  lecture: { label: "Lecture", icon: GraduationCap },
  voice_memo: { label: "Memo", icon: Mic },
  meeting: { label: "Meeting", icon: Users },
  study_review: { label: "Review", icon: GraduationCap },
  other: { label: "Other", icon: AudioLines },
};

export const STATUS_LABEL: Record<RecordingItem["status"], string> = {
  ready: "Ready",
  processing: "Processing",
  recording: "Recording",
};

export function isKind(v: string | null): v is RecordKind {
  return v === "lecture" || v === "memo" || v === "meeting" || v === "other";
}
