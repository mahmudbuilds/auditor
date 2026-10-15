import type { RecordingItem } from "@/types/recording";
import { dateValue } from "./format";

export const FILTERS = [
  "All",
  "Lectures",
  "Memos",
  "Meetings",
  "Imported",
  "Starred",
] as const;
export type FilterName = (typeof FILTERS)[number];

export const SORTS = {
  newest: "Newest first",
  oldest: "Oldest first",
  longest: "Longest first",
  title: "Title A–Z",
} as const;
export type SortName = keyof typeof SORTS;

export function matchesFilter(rec: RecordingItem, f: FilterName): boolean {
  switch (f) {
    case "All":
      return true;
    case "Lectures":
      return rec.type === "lecture";
    case "Memos":
      return rec.type === "voice_memo";
    case "Meetings":
      return rec.type === "meeting";
    case "Imported":
      return rec.source === "imported";
    case "Starred":
      return !!rec.isStarred;
  }
}

export function filterRecordings(
  recs: RecordingItem[],
  opts: {
    filter?: FilterName;
    query?: string;
    course?: string;
    sort?: SortName;
  },
): RecordingItem[] {
  const q = (opts.query ?? "").trim().toLowerCase();
  const out = recs.filter((r) => {
    if (!matchesFilter(r, opts.filter ?? "All")) return false;
    if (
      opts.course &&
      opts.course !== "All courses" &&
      r.course !== opts.course
    )
      return false;
    if (!q) return true;
    return (
      r.title.toLowerCase().includes(q) ||
      r.course.toLowerCase().includes(q) ||
      r.speaker.toLowerCase().includes(q) ||
      r.transcript.some((t) => t.text.toLowerCase().includes(q))
    );
  });
  return sortRecordings(out, opts.sort ?? "newest");
}

export function sortRecordings(
  recs: RecordingItem[],
  sort: SortName,
): RecordingItem[] {
  const copy = [...recs];
  switch (sort) {
    case "newest":
      return copy.sort((a, b) => dateValue(b.date) - dateValue(a.date));
    case "oldest":
      return copy.sort((a, b) => dateValue(a.date) - dateValue(b.date));
    case "longest":
      return copy.sort((a, b) => b.durationSeconds - a.durationSeconds);
    case "title":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
  }
}

export function statusNote(rec: RecordingItem): string {
  if (rec.status === "processing") return "Processing…";
  return rec.summary.keyTakeaways.length > 0
    ? "Summary ready"
    : "Transcript ready";
}
