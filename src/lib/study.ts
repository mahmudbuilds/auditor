import type { RecordingItem } from "@/types/recording";

export interface Flashcard {
  id: string;
  recId: string;
  recTitle: string;
  front: string;
  back: string;
}

export interface QuizQuestion {
  id: string;
  recTitle: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

/** Key concepts per seeded recording; user recordings fall back to course. */
const CONCEPTS: Record<string, string[]> = {
  "rec-cs-101": [
    "Classes",
    "Objects",
    "Encapsulation",
    "Methods",
    "Attributes",
  ],
  "rec-bio-class": [
    "Glycolysis",
    "Citric acid cycle",
    "ATP",
    "Electron transport",
  ],
  "rec-voice-memo": ["Flashcards", "Project outline", "Office hours"],
  "rec-physics-lecture": [
    "Faraday's Law",
    "Lenz's Law",
    "Eddy currents",
    "EMF",
  ],
  "rec-ideas-notes": ["Tactile UI", "VU meters", "Cassette deck"],
  "rec-01": ["Equilibrium", "Elasticity", "Price ceiling", "Demand curve"],
  "rec-02": ["Habit loop", "Cue", "Routine", "Reward", "Habit stacking"],
  "rec-03": ["Steam engine", "Urbanisation", "Clock time", "Labour laws"],
  "rec-04": ["Clarity", "Cognitive load", "Undo", "Typography"],
  "rec-05": ["Mitochondria", "Aerobic training", "Anaerobic metabolism"],
  "rec-06": ["Lead with the problem", "Live demo", "Backup numbers"],
  "rec-07": ["Subtext", "On-the-nose dialogue", "Competing goals"],
  "rec-08": ["Grid storage", "HVDC", "Transmission"],
};

export function conceptsOf(rec: RecordingItem): string[] {
  return CONCEPTS[rec.id] ?? [rec.course];
}

export function flashcardsOf(recs: RecordingItem[]): Flashcard[] {
  return recs.flatMap((r) => {
    const fromQuestions = r.summary.studyQuestions.map((q, i) => ({
      id: `${r.id}-q${i}`,
      recId: r.id,
      recTitle: r.title,
      front: q.question,
      back: q.answer,
    }));
    const fromConcepts = conceptsOf(r)
      .slice(0, 2)
      .map((c, i) => ({
        id: `${r.id}-c${i}`,
        recId: r.id,
        recTitle: r.title,
        front: `What did the recording say about "${c}"?`,
        back:
          r.summary.keyTakeaways.find((t) =>
            t.toLowerCase().includes(c.toLowerCase().split(" ")[0]),
          ) ?? r.summary.overview,
      }));
    return [...fromQuestions, ...fromConcepts];
  });
}

export function quizOf(recs: RecordingItem[]): QuizQuestion[] {
  const pool = recs.flatMap((r) =>
    r.summary.studyQuestions.map((q) => q.answer),
  );
  return recs.flatMap((r) =>
    r.summary.studyQuestions.map((q, i) => {
      const wrong = pool
        .filter((a) => a !== q.answer)
        .slice(i % 3, (i % 3) + 2);
      const options = [...wrong];
      const correct = (i + r.title.length) % (wrong.length + 1);
      options.splice(correct, 0, q.answer);
      return {
        id: `${r.id}-quiz${i}`,
        recTitle: r.title,
        question: q.question,
        options,
        correct,
        explanation: q.answer,
      };
    }),
  );
}

/** First few words of a sentence, for compact labels. */
export function shorten(text: string, words = 5): string {
  const parts = text.replace(/[`'"]/g, "").split(/\s+/);
  const out = parts.slice(0, words).join(" ");
  return parts.length > words ? `${out}…` : out;
}

export const REVIEW_DUE = ["Due today", "Due tomorrow", "Due in 2 days"];
