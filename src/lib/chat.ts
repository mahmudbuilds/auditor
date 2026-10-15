import type { RecordingItem } from "@/types/recording";

export interface Citation {
  recId: string;
  recTitle: string;
  timestamp?: string;
}

export interface Answer {
  text: string;
  cite?: Citation;
}

const STOP = new Set(
  "the and for are was what how why when who does did with that this from about have has had you your can not but they them then there their into out our its just also been which would could should will than more some any all one two".split(
    " ",
  ),
);

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

interface Passage {
  text: string;
  haystack: string;
  rec: RecordingItem;
  timestamp?: string;
  boost: number;
}

/**
 * Grounded retrieval: answers are always lifted from the recording's own
 * transcript or summary, never invented. No match means an honest "not found".
 */
export function answerQuestion(
  question: string,
  recs: RecordingItem[],
): Answer {
  const q = question.toLowerCase();
  const ready = recs.filter(
    (r) => r.transcript.length > 0 || r.summary.overview,
  );
  if (ready.length === 0) {
    return {
      text: "There's nothing to search yet. Recordings need to finish processing first.",
    };
  }

  if (/summar|overview|tl;?dr|main idea/.test(q) && ready.length === 1) {
    const r = ready[0];
    return {
      text: r.summary.overview || "This recording doesn't have a summary yet.",
      cite: { recId: r.id, recTitle: r.title },
    };
  }
  if (/action|homework|to-?do|assignment|deadline|due/.test(q)) {
    const items = ready.flatMap((r) =>
      (r.summary.actionItems ?? []).map((a) => ({ a, r })),
    );
    if (items.length > 0) {
      return {
        text: items
          .slice(0, 4)
          .map((i) => `• ${i.a}`)
          .join("\n"),
        cite: { recId: items[0].r.id, recTitle: items[0].r.title },
      };
    }
    return { text: "I didn't find any action items in what was recorded." };
  }

  const passages: Passage[] = ready.flatMap((r) => [
    ...r.transcript.map((t) => ({
      text: t.text,
      haystack: t.text,
      rec: r,
      timestamp: t.timestamp,
      boost: 0,
    })),
    ...r.summary.keyTakeaways.map((t) => ({
      text: t,
      haystack: t,
      rec: r,
      boost: 0.5,
    })),
    ...r.summary.studyQuestions.map((s) => ({
      text: s.answer,
      haystack: `${s.question} ${s.answer}`,
      rec: r,
      boost: 1,
    })),
  ]);

  const qTokens = new Set(tokens(question));
  let best: { p: Passage; score: number } | null = null;
  for (const p of passages) {
    const hits = tokens(p.haystack).filter((w) => qTokens.has(w));
    const score = new Set(hits).size + (hits.length > 0 ? p.boost : 0);
    if (score > 0 && (!best || score > best.score)) best = { p, score };
  }

  if (!best) {
    return {
      text: "I couldn't find that in the recording, so I won't guess. Try rephrasing, or ask about a topic that was discussed.",
    };
  }
  const { p } = best;
  return {
    text: p.timestamp ? `Around ${p.timestamp}: “${p.text}”` : p.text,
    cite: { recId: p.rec.id, recTitle: p.rec.title, timestamp: p.timestamp },
  };
}

export function suggestionsFor(recs: RecordingItem[]): string[] {
  const qs = recs.flatMap((r) =>
    r.summary.studyQuestions.map((s) => s.question),
  );
  const base = recs.length === 1 ? ["Summarize this recording"] : [];
  const extra = recs.some((r) => (r.summary.actionItems ?? []).length > 0)
    ? ["What are the action items?"]
    : [];
  return [...base, ...qs.slice(0, 3), ...extra];
}
