"use client";

import {
  Brain,
  Check,
  ChevronRight,
  Copy,
  Layers,
  ListChecks,
  Network,
  NotebookText,
  RotateCcw,
  X,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import {
  Button,
  EmptyState,
  INNER_CARD,
  Panel,
  SectionLabel,
} from "@/components/ui/kit";
import { conceptsOf, flashcardsOf, quizOf, shorten } from "@/lib/study";
import type { RecordingItem } from "@/types/recording";

type Tool = "flashcards" | "quiz" | "notes" | "map";

const OPTIONS: {
  id: Tool;
  title: string;
  blurb: string;
  icon: typeof Layers;
}[] = [
  {
    id: "flashcards",
    title: "Flashcards",
    blurb: "Quiz yourself on the key ideas, one card at a time.",
    icon: Layers,
  },
  {
    id: "quiz",
    title: "Practice quiz",
    blurb: "Test your understanding with questions and explanations.",
    icon: ListChecks,
  },
  {
    id: "notes",
    title: "Revision notes",
    blurb: "Structured notes you can skim before an exam.",
    icon: NotebookText,
  },
  {
    id: "map",
    title: "Concept map",
    blurb: "See how the main ideas connect to each other.",
    icon: Network,
  },
];

/* ------------------------------ flashcards ------------------------------ */

function Flashcards({ recs }: { recs: RecordingItem[] }) {
  const cards = flashcardsOf(recs);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<string>>(new Set());

  if (cards.length === 0) {
    return (
      <EmptyState
        icon={Layers}
        title="No flashcards yet"
        body="Flashcards are built from a recording's summary. Once this one has a summary they'll appear here."
      />
    );
  }

  const card = cards[Math.min(i, cards.length - 1)];
  const done = known.size === cards.length;
  const go = (n: number) => {
    setFlipped(false);
    setI((n + cards.length) % cards.length);
  };

  if (done) {
    return (
      <EmptyState
        icon={Check}
        title="Deck complete"
        body={`You marked all ${cards.length} cards as known. Nice work.`}
        action={
          <Button
            variant="dark"
            onClick={() => {
              setKnown(new Set());
              go(0);
            }}
          >
            <RotateCcw className="h-4 w-4" aria-hidden /> Study again
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-[12px] text-[#5f594c]">
        <span>
          Card {Math.min(i, cards.length - 1) + 1} of {cards.length}
        </span>
        <span>{known.size} known</span>
      </div>
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-label={flipped ? "Show question" : "Show answer"}
        className="flex min-h-[220px] w-full flex-col justify-between rounded-[6px] border border-[#2a2a2a] bg-gradient-to-b from-[#1a1a1a] to-[#101010] p-5 text-left text-[#f3efe6] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
      >
        <span className="text-[10px] font-semibold tracking-[0.18em] text-[#f6ad3c] uppercase">
          {flipped ? "Answer" : "Question"} · {shorten(card.recTitle, 4)}
        </span>
        <span
          key={`${card.id}-${flipped}`}
          className="animate-fade-in my-4 text-[18px] leading-snug font-medium"
        >
          {flipped ? card.back : card.front}
        </span>
        <span className="text-[12px] text-[#a8a296]">
          {flipped ? "Tap to see the question" : "Tap to reveal the answer"}
        </span>
      </button>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <Button variant="light" onClick={() => go(i - 1)}>
          Previous
        </Button>
        <Button
          variant="light"
          onClick={() => {
            setKnown((k) => {
              const n = new Set(k);
              n.delete(card.id);
              return n;
            });
            go(i + 1);
          }}
        >
          <X className="h-4 w-4" aria-hidden /> Again
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            setKnown((k) => new Set(k).add(card.id));
            go(i + 1);
          }}
        >
          <Check className="h-4 w-4" aria-hidden /> Got it
        </Button>
      </div>
    </div>
  );
}

/* --------------------------------- quiz --------------------------------- */

function Quiz({ recs }: { recs: RecordingItem[] }) {
  const questions = quizOf(recs);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  if (questions.length === 0) {
    return (
      <EmptyState
        icon={ListChecks}
        title="No quiz questions yet"
        body="Questions are generated from a recording's summary."
      />
    );
  }

  if (i >= questions.length) {
    return (
      <EmptyState
        icon={Check}
        title={`You scored ${score} / ${questions.length}`}
        body={
          score === questions.length
            ? "Perfect. You've got this material down."
            : "Review the explanations and try again."
        }
        action={
          <Button
            variant="dark"
            onClick={() => {
              setI(0);
              setScore(0);
              setPicked(null);
            }}
          >
            <RotateCcw className="h-4 w-4" aria-hidden /> Retake quiz
          </Button>
        }
      />
    );
  }

  const q = questions[i];
  const answered = picked !== null;
  return (
    <div>
      <p className="mb-2 text-[12px] text-[#5f594c]">
        Question {i + 1} of {questions.length}
      </p>
      <p className="mb-3 text-[17px] leading-snug font-semibold">
        {q.question}
      </p>
      <ul className="flex flex-col gap-2">
        {q.options.map((opt, idx) => {
          const isCorrect = idx === q.correct;
          const isPicked = idx === picked;
          const tone = !answered
            ? "border-[#bdb4a3] bg-[#ece6da] hover:bg-[#e4ddd0]"
            : isCorrect
              ? "border-[#3aa55d] bg-[#dff0e2]"
              : isPicked
                ? "border-[#c62820] bg-[#f6dcda]"
                : "border-[#cdc4b3] bg-[#ece6da] opacity-70";
          return (
            <li key={opt}>
              <button
                type="button"
                disabled={answered}
                onClick={() => {
                  setPicked(idx);
                  if (isCorrect) setScore((s) => s + 1);
                }}
                className={`flex w-full items-start gap-3 rounded-[5px] border p-3 text-left text-[13px] leading-snug transition ${tone}`}
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-[11px] font-semibold">
                  {answered && isCorrect ? (
                    <Check className="h-3 w-3" aria-hidden />
                  ) : (
                    String.fromCharCode(65 + idx)
                  )}
                </span>
                {opt}
              </button>
            </li>
          );
        })}
      </ul>
      {answered && (
        <div className={`${INNER_CARD} animate-fade-in mt-3 p-3 text-[13px]`}>
          <p className="font-semibold">
            {picked === q.correct ? "Correct." : "Not quite."}
          </p>
          <p className="mt-0.5 text-[#4d473d]">{q.explanation}</p>
          <Button
            variant="dark"
            size="sm"
            className="mt-3"
            onClick={() => {
              setPicked(null);
              setI((n) => n + 1);
            }}
          >
            {i + 1 === questions.length ? "See results" : "Next question"}
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      )}
    </div>
  );
}

/* ----------------------------- revision notes ---------------------------- */

function RevisionNotes({ recs }: { recs: RecordingItem[] }) {
  const { toast } = useApp();
  const usable = recs.filter((r) => r.summary.overview);
  if (usable.length === 0) {
    return (
      <EmptyState
        icon={NotebookText}
        title="No notes to show yet"
        body="Revision notes appear once a recording has finished processing."
      />
    );
  }
  const text = usable
    .map(
      (r) =>
        `${r.title}\n${r.summary.overview}\n${r.summary.keyTakeaways.map((t) => `• ${t}`).join("\n")}`,
    )
    .join("\n\n");
  return (
    <div className="flex flex-col gap-4">
      {usable.map((r) => (
        <article key={r.id}>
          <h3 className="text-[15px] font-semibold">{r.title}</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-[#4d473d]">
            {r.summary.overview}
          </p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[13px] leading-snug marker:text-[#e0963a]">
            {r.summary.keyTakeaways.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </article>
      ))}
      <Button
        variant="light"
        size="sm"
        className="self-start"
        onClick={() => {
          navigator.clipboard
            ?.writeText(text)
            .then(() => toast("Notes copied."))
            .catch(() => toast("Couldn't copy to the clipboard."));
        }}
      >
        <Copy className="h-4 w-4" aria-hidden /> Copy notes
      </Button>
    </div>
  );
}

/* ------------------------------ concept map ------------------------------ */

function ConceptMap({ recs }: { recs: RecordingItem[] }) {
  const [active, setActive] = useState<string | null>(null);
  const nodes = recs.flatMap((r) =>
    conceptsOf(r)
      .slice(0, recs.length > 1 ? 3 : 8)
      .map((c) => ({ label: c, rec: r })),
  );
  if (nodes.length === 0) {
    return (
      <EmptyState
        icon={Network}
        title="Nothing to map yet"
        body="Concepts appear once a recording has been processed."
      />
    );
  }
  const W = 640;
  const H = 360;
  const cx = W / 2;
  const cy = H / 2;
  const centre =
    recs.length === 1 ? shorten(recs[0].title, 3) : "All recordings";
  const detail = nodes.find((n) => n.label === active);
  const takeaway = detail?.rec.summary.keyTakeaways.find((t) =>
    t.toLowerCase().includes(detail.label.toLowerCase().split(" ")[0]),
  );

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Concept map of ${centre}`}
      >
        {nodes.map((n, idx) => {
          const a = (idx / nodes.length) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(a) * 250;
          const y = cy + Math.sin(a) * 135;
          return (
            <line
              key={`l-${n.label}-${n.rec.id}`}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="#a99f8e"
              strokeWidth="1.2"
            />
          );
        })}
        <g>
          <rect
            x={cx - 70}
            y={cy - 22}
            width="140"
            height="44"
            rx="6"
            fill="#1a1a1a"
          />
          <text
            x={cx}
            y={cy + 5}
            textAnchor="middle"
            fontSize="13"
            fontWeight="600"
            fill="#f6ad3c"
          >
            {centre}
          </text>
        </g>
        {nodes.map((n, idx) => {
          const a = (idx / nodes.length) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(a) * 250;
          const y = cy + Math.sin(a) * 135;
          const w = Math.max(80, n.label.length * 7.4 + 22);
          const on = n.label === active;
          return (
            <g
              key={`n-${n.label}-${n.rec.id}`}
              role="button"
              tabIndex={0}
              aria-label={n.label}
              onClick={() => setActive(on ? null : n.label)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActive(on ? null : n.label);
                }
              }}
              className="cursor-pointer"
            >
              <rect
                x={x - w / 2}
                y={y - 16}
                width={w}
                height="32"
                rx="5"
                fill={on ? "#e0963a" : "#ece6da"}
                stroke={on ? "#b9761f" : "#a99f8e"}
              />
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                fontSize="12"
                fontWeight="500"
                fill="#22201d"
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
      <p
        className="mt-2 min-h-10 text-[13px] text-[#4d473d]"
        aria-live="polite"
      >
        {detail
          ? (takeaway ?? `"${detail.label}" comes up in ${detail.rec.title}.`)
          : "Select a concept to see what the recording said about it."}
      </p>
    </div>
  );
}

/* --------------------------------- shell --------------------------------- */

export function StudyTools({
  recs,
  heading = "Turn this lecture into study material",
  initialTool = null,
}: {
  recs: RecordingItem[];
  heading?: string;
  initialTool?: Tool | null;
}) {
  const [tool, setTool] = useState<Tool | null>(initialTool);
  const current = OPTIONS.find((o) => o.id === tool);

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
      <Panel>
        <SectionLabel icon={Brain}>{heading}</SectionLabel>
        <p className="mb-3 -mt-1 text-[13px] text-[#5f594c]">
          Choose what you want to create from this recording.
        </p>
        <ul className="flex flex-col gap-2">
          {OPTIONS.map((o) => {
            const on = o.id === tool;
            return (
              <li key={o.id}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setTool(o.id)}
                  className={`flex w-full items-center gap-3 rounded-[5px] border p-3 text-left transition ${
                    on
                      ? "border-[#e0963a] bg-[#f3eee4] shadow-[0_0_0_1px_#e0963a]"
                      : "border-[#bdb4a3] bg-[#ece6da] hover:bg-[#e4ddd0]"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] ${on ? "bg-[#1a1a1a] text-[#f6ad3c]" : "bg-[#d8d1c2]"}`}
                  >
                    <o.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1 leading-tight">
                    <span className="block text-[14px] font-semibold">
                      {o.title}
                    </span>
                    <span className="mt-0.5 block text-[12px] text-[#5f594c]">
                      {o.blurb}
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>
      </Panel>

      <Panel className="min-h-[320px]">
        {!current ? (
          <EmptyState
            icon={Brain}
            title="Pick a study tool"
            body="Flashcards, a practice quiz, revision notes or a concept map. All built from what was said in the recording."
          />
        ) : (
          <>
            <SectionLabel icon={current.icon}>{current.title}</SectionLabel>
            {tool === "flashcards" && <Flashcards recs={recs} />}
            {tool === "quiz" && <Quiz recs={recs} />}
            {tool === "notes" && <RevisionNotes recs={recs} />}
            {tool === "map" && <ConceptMap recs={recs} />}
          </>
        )}
      </Panel>
    </div>
  );
}
