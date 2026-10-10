"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { RecordingItem } from "@/types/recording";

export type StudyMode = "flashcards" | "tutor" | "quiz" | "guide";

interface AiStudyHubProps {
  recordings: RecordingItem[];
  onOpenRecording: (rec: RecordingItem) => void;
  selectedCourse?: string;
  courses?: (string | { id?: string; name: string; icon?: string })[];
  onSelectCourse?: (course: string) => void;
}

interface StudyCard {
  id: string;
  question: string;
  answer: string;
  course: string;
  sourceTitle: string;
  recording: RecordingItem;
}

interface QuizItem {
  id: string;
  course: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sourceTitle: string;
  recordingId: string;
}

interface ChatMessage {
  id: string;
  question: string;
  answer: string;
  courseScope: string;
  timestamp: string;
  citations: {
    course: string;
    title: string;
    timestamp: string;
    recording: RecordingItem;
  }[];
}

const STATIC_QUIZ_BANK: QuizItem[] = [
  {
    id: "q-econ-1",
    course: "Economics 101",
    question:
      "Why do essential goods like staple food and prescription medicine exhibit inelastic demand?",
    options: [
      "Consumers easily substitute them with luxury alternatives when prices fluctuate.",
      "Consumers cannot easily reduce consumption or find immediate substitutes despite price surges.",
      "Government price ceilings mathematically flatten the market demand curve.",
      "Suppliers can expand or contract production instantaneously without cost.",
    ],
    correctIndex: 1,
    explanation:
      "Because consumers depend on essentials for daily survival, demand quantity drops very little even when market prices rise steeply.",
    sourceTitle: "Introduction to Economics: How Supply, Demand & Prices Work",
    recordingId: "rec-01",
  },
  {
    id: "q-econ-2",
    course: "Economics 101",
    question:
      "What is the primary economic outcome if a municipality imposes a strict price ceiling below market equilibrium?",
    options: [
      "Suppliers produce surplus inventory, leading to price discounts.",
      "Producer profit margins increase and eliminate shortages.",
      "Suppliers reduce production because costs exceed the ceiling, resulting in shortages and long lines.",
      "Consumer demand permanently drops to zero.",
    ],
    correctIndex: 2,
    explanation:
      "When prices are artificially capped below equilibrium, sellers cannot afford to supply enough goods, creating shortages and queues.",
    sourceTitle: "Introduction to Economics: How Supply, Demand & Prices Work",
    recordingId: "rec-01",
  },
  {
    id: "q-psych-1",
    course: "Cognitive Psychology",
    question:
      "According to behavioral neuroscience, what is the 'Golden Rule' of habit change?",
    options: [
      "Rely on conscious willpower during morning hours to suppress routines.",
      "Keep the established cue and reward intact, while deliberately substituting a new middle routine.",
      "Completely eliminate every familiar cue from your daily schedule.",
      "Punish unwanted routines immediately to unlearn the basal ganglia loop.",
    ],
    correctIndex: 1,
    explanation:
      "Ingrained habit loops cannot simply be erased from the brain; behavioral psychologists find you must preserve the cue and reward while rewiring the routine.",
    sourceTitle:
      "Psychology & Habit Formation: How Daily Routines Shape the Brain",
    recordingId: "rec-02",
  },
  {
    id: "q-psych-2",
    course: "Cognitive Psychology",
    question:
      "Why do high-performing individuals often exhibit strong consistency without relying on high willpower?",
    options: [
      "Their genetic dopamine levels make them immune to mental fatigue.",
      "They sleep 12 hours every night to restore cognitive willpower.",
      "They intentionally design their physical environments to minimize friction and remove temptation.",
      "They avoid all repetitive routines so their brain stays in conscious deliberation.",
    ],
    correctIndex: 2,
    explanation:
      "Willpower is an exhaustible mental resource. High performers structure their physical spaces and schedules so they rarely have to exert willpower to begin studying.",
    sourceTitle:
      "Psychology & Habit Formation: How Daily Routines Shape the Brain",
    recordingId: "rec-02",
  },
  {
    id: "q-hist-1",
    course: "History 204",
    question:
      "Why was James Watt's improved steam engine decisive in concentrating manufacturing in urban centers?",
    options: [
      "Earlier water-powered mills had to stay beside fast-flowing rivers; steam power could operate anywhere coal arrived.",
      "Steam engines could only function in cold metropolitan climates.",
      "Parliament passed laws prohibiting steam power in rural agricultural districts.",
      "It completely eliminated the need for human labor inside textile factories.",
    ],
    correctIndex: 0,
    explanation:
      "Steam engines freed factories from natural riverbanks, allowing industrialists to cluster operations in cities with abundant transport and labor.",
    sourceTitle:
      "Modern World History: The Industrial Revolution & Rise of Cities",
    recordingId: "rec-03",
  },
  {
    id: "q-hci-1",
    course: "Human-Computer Interaction",
    question:
      "In interface design, what is cognitive load and how should digital tools address it?",
    options: [
      "The download speed of assets; addressed with server-side caching.",
      "The mental effort required to use an interface; minimized by displaying only information needed for the current step.",
      "The number of available menu options; maximized to give users exhaustive choices.",
      "The physical battery drain caused by rendering complex animations.",
    ],
    correctIndex: 1,
    explanation:
      "Cognitive load measures mental exertion. Clean interfaces respect user attention by showing only the necessary tools for the current task.",
    sourceTitle: "Product Strategy & UX: Designing Apps People Love to Use",
    recordingId: "rec-04",
  },
  {
    id: "q-bio-1",
    course: "Biology 102",
    question:
      "Why does aerobic cellular respiration in mitochondria yield substantially more energy (ATP) than anaerobic glycolysis?",
    options: [
      "Oxygen accelerates glucose consumption without molecular oxidation.",
      "Mitochondrial respiration with oxygen yields 30–32 ATP per glucose, versus only 2 ATP produced in anaerobic glycolysis.",
      "Anaerobic glycolysis converts ATP back into complex sugars.",
      "Cells do not utilize mitochondria during aerobic exercise.",
    ],
    correctIndex: 1,
    explanation:
      "With oxygen, the full citric acid cycle and oxidative phosphorylation yield approximately 30–32 ATP molecules, compared to just 2 ATP anaerobically.",
    sourceTitle:
      "Life Sciences: Cellular Energy, Mitochondria & Daily Metabolism",
    recordingId: "rec-05",
  },
  {
    id: "q-lit-1",
    course: "Literature & Writing",
    question:
      "In creative writing and dialogue craft, what distinguishes 'subtext' from 'on-the-nose' speech?",
    options: [
      "On-the-nose speech rhymes; subtext uses prose.",
      "On-the-nose dialogue states feelings and motives directly; subtext carries unspoken tension beneath everyday words.",
      "Subtext is restricted to theatrical stage directions.",
      "On-the-nose dialogue is preferred in literary fiction for direct clarity.",
    ],
    correctIndex: 1,
    explanation:
      "Compelling dialogue rarely spells out internal emotions verbatim. Subtext is the emotional current running beneath the surface conversation.",
    sourceTitle: "Creative Writing Workshop: Dialogue Pacing and Subtext",
    recordingId: "rec-07",
  },
  {
    id: "q-env-1",
    course: "Earth & Environmental Studies",
    question:
      "What remains the chief engineering hurdle in transitioning modern regional grids to wind and solar power?",
    options: [
      "The levelized generation cost of renewables remains higher than coal in all markets.",
      "Renewable electricity cannot be converted into alternating current.",
      "Transmission bottlenecking and the need for long-duration grid storage to balance weather variability.",
      "Solar panels degrade completely after six months of active use.",
    ],
    correctIndex: 2,
    explanation:
      "Generating renewable power is now very cost-competitive; the bottleneck is transporting electricity from remote generation sites and storing it across calm or cloudy days.",
    sourceTitle:
      "Environmental Science: Clean Energy Transitions & The Power Grid",
    recordingId: "rec-08",
  },
];

export function AiStudyHub({
  recordings,
  onOpenRecording,
  selectedCourse = "All Courses",
  courses = [],
  onSelectCourse,
}: AiStudyHubProps) {
  // Current focused activity chosen by the student
  const [activeMode, setActiveMode] = useState<StudyMode>("flashcards");

  // Local active course scope (defaults to selectedCourse prop)
  const [activeCourse, setActiveCourse] = useState(selectedCourse);

  // Sync with incoming prop if it changes
  useEffect(() => {
    if (selectedCourse) {
      setActiveCourse(selectedCourse);
    }
  }, [selectedCourse]);

  const handleCourseChange = (course: string) => {
    setActiveCourse(course);
    onSelectCourse?.(course);
    // Reset card index when filtering
    setActiveCardIndex(0);
    setIsFlipped(false);
  };

  // Filter recordings according to the active course scope
  const filteredRecordings = useMemo(() => {
    if (activeCourse === "All Courses") {
      return recordings;
    }
    return recordings.filter((r) => r.course === activeCourse);
  }, [recordings, activeCourse]);

  // Extract all study flashcards
  const allCards: StudyCard[] = useMemo(() => {
    const list: StudyCard[] = [];
    for (const rec of filteredRecordings) {
      rec.summary.studyQuestions.forEach((q, idx) => {
        list.push({
          id: `${rec.id}-card-${idx}`,
          question: q.question,
          answer: q.answer,
          course: rec.course,
          sourceTitle: rec.title,
          recording: rec,
        });
      });
    }
    return list;
  }, [filteredRecordings]);

  // ----------------------------------------------------
  // FLASHCARDS STATE
  // ----------------------------------------------------
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCardIds, setMasteredCardIds] = useState<Set<string>>(
    new Set(),
  );
  const [reviewCardIds, setReviewCardIds] = useState<Set<string>>(new Set());
  const [isDeckFinished, setIsDeckFinished] = useState(false);

  const currentCard: StudyCard | undefined = allCards[activeCardIndex];

  const handleNextCard = useCallback(() => {
    setIsFlipped(false);
    if (activeCardIndex + 1 >= allCards.length) {
      setIsDeckFinished(true);
    } else {
      setActiveCardIndex((prev) => prev + 1);
    }
  }, [activeCardIndex, allCards.length]);

  const handlePrevCard = useCallback(() => {
    setIsFlipped(false);
    setIsDeckFinished(false);
    setActiveCardIndex((prev) => (prev > 0 ? prev - 1 : allCards.length - 1));
  }, [allCards.length]);

  const handleFlipCard = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleMarkMastered = () => {
    if (!currentCard) return;
    setMasteredCardIds((prev) => {
      const next = new Set(prev);
      next.add(currentCard.id);
      return next;
    });
    setReviewCardIds((prev) => {
      const next = new Set(prev);
      next.delete(currentCard.id);
      return next;
    });
    handleNextCard();
  };

  const handleMarkReview = () => {
    if (!currentCard) return;
    setReviewCardIds((prev) => {
      const next = new Set(prev);
      next.add(currentCard.id);
      return next;
    });
    setMasteredCardIds((prev) => {
      const next = new Set(prev);
      next.delete(currentCard.id);
      return next;
    });
    handleNextCard();
  };

  const handleRestartDeck = () => {
    setActiveCardIndex(0);
    setIsFlipped(false);
    setIsDeckFinished(false);
  };

  // Keyboard shortcut for flashcards (Space to flip, Arrows for next/prev)
  useEffect(() => {
    if (activeMode !== "flashcards") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        handleFlipCard();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        handleNextCard();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        handlePrevCard();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeMode, handleFlipCard, handleNextCard, handlePrevCard]);

  // ----------------------------------------------------
  // AI TUTOR Q&A STATE
  // ----------------------------------------------------
  const [tutorQuery, setTutorQuery] = useState("");
  const [isSearchingTutor, setIsSearchingTutor] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  // Suggested high-yield questions adapted to the active course
  const suggestedPrompts = useMemo(() => {
    if (activeCourse === "Economics 101") {
      return [
        "Explain price elasticity and why daily essentials have low elasticity",
        "What happens to equilibrium when the city imposes a price ceiling?",
        "What problem sets or assignments are due for recitation this week?",
      ];
    }
    if (activeCourse === "Cognitive Psychology") {
      return [
        "How do habit loops replace the need for exhaustible willpower?",
        "What is the Golden Rule of habit change according to Dr. Jenkins?",
        "What textbook reading was assigned for Wednesday's seminar?",
      ];
    }
    if (activeCourse === "Human-Computer Interaction") {
      return [
        "What is cognitive load and how does Marcus Vance recommend reducing it?",
        "What guidelines were recorded for Thursday's team presentation?",
      ];
    }
    if (activeCourse === "History 204") {
      return [
        "How did Watt's steam engine alter the geography of factory labor?",
        "Why did industrialization replace seasonal farming rhythms with clock time?",
      ];
    }
    // All courses general
    return [
      "What assignments or deadlines are coming up across all lectures?",
      "Compare habit formation in psychology with economic incentives in economics",
      "Explain price elasticity and how market equilibrium is achieved",
      "Why did the steam engine accelerate urban factory growth?",
    ];
  }, [activeCourse]);

  const handleAskTutor = (queryToAsk: string) => {
    const cleanQ = queryToAsk.trim();
    if (!cleanQ) return;

    setIsSearchingTutor(true);

    setTimeout(() => {
      const q = cleanQ.toLowerCase();
      let answerText = "";
      const citations: ChatMessage["citations"] = [];

      if (
        q.includes("due") ||
        q.includes("deadline") ||
        q.includes("homework") ||
        q.includes("assignment")
      ) {
        answerText =
          "Here are all upcoming assignments and preparation milestones recorded in your lectures:\n\n" +
          "• Economics 101: Review textbook Chapter 3 problem sets on consumer surplus before Thursday's recitation, and complete the 5-question online supply/demand quiz by Friday at 5:00 PM.\n" +
          "• Cognitive Psychology: Read Chapter 4 of 'The Power of Habit' for Wednesday's seminar discussion.\n" +
          "• Human-Computer Interaction: Rehearse team presentation with Maya and Jordan on Wednesday afternoon, and clean up staging data before Thursday's demo.";

        const econ = recordings.find((r) => r.course === "Economics 101");
        const psych = recordings.find(
          (r) => r.course === "Cognitive Psychology",
        );
        if (econ) {
          citations.push({
            course: "Economics 101",
            title: econ.title,
            timestamp: "00:46:15",
            recording: econ,
          });
        }
        if (psych) {
          citations.push({
            course: "Cognitive Psychology",
            title: psych.title,
            timestamp: "00:16:05",
            recording: psych,
          });
        }
      } else if (
        q.includes("habit") ||
        q.includes("willpower") ||
        q.includes("psychology")
      ) {
        answerText =
          "In Dr. Sarah Jenkins' Cognitive Psychology lecture on habit loops:\n\n" +
          "1. Anatomy of a Habit: Every routine consists of a cue (environmental trigger), a routine (behavior), and a reward (dopamine/relief).\n" +
          "2. The Limits of Willpower: Willpower acts like a muscle that quickly depletes throughout the day. High performers succeed not through brute restraint, but by designing physical environments that remove distraction.\n" +
          "3. The Golden Rule of Change: You cannot erase an ingrained habit pathway in the basal ganglia. Instead, preserve the cue and reward, but substitute a healthier middle routine.";

        const psych = recordings.find(
          (r) => r.course === "Cognitive Psychology",
        );
        if (psych) {
          citations.push({
            course: "Cognitive Psychology",
            title: psych.title,
            timestamp: "00:08:40",
            recording: psych,
          });
        }
      } else if (
        q.includes("price") ||
        q.includes("elasticity") ||
        q.includes("demand") ||
        q.includes("supply")
      ) {
        answerText =
          "In Economics 101, Prof. David Miller synthesized how market equilibrium and elasticity interact:\n\n" +
          "1. Market Equilibrium: The price point where buyer demand exactly balances seller inventory without surplus or shortages.\n" +
          "2. Price Elasticity: Measures how sensitive buyers are to changes in price. Everyday necessities (like milk or medicine) exhibit inelastic demand because consumers cannot easily defer purchases or substitute them.\n" +
          "3. Price Ceilings: Imposing an artificial cap below equilibrium reduces seller incentives to brew or manufacture, creating empty shelves and queues.";

        const econ = recordings.find((r) => r.course === "Economics 101");
        if (econ) {
          citations.push({
            course: "Economics 101",
            title: econ.title,
            timestamp: "00:10:12",
            recording: econ,
          });
        }
      } else if (
        q.includes("steam") ||
        q.includes("industrial") ||
        q.includes("city") ||
        q.includes("urban")
      ) {
        answerText =
          "In History 204, Prof. Robert Hastings highlighted the structural transformation of the Industrial Revolution:\n\n" +
          "• Geographical Freedom: Earlier water mills were bound to natural river rapids. James Watt's improved steam engine allowed factories to operate anywhere coal was accessible, clustering industry in rapid urban hubs like Manchester.\n" +
          "• The Clock-Work Rhythm: Work was no longer dictated by daylight or agricultural harvest cycles; it was synchronized by mechanical factory bells and strict hour shifts.";

        const hist = recordings.find((r) => r.course === "History 204");
        if (hist) {
          citations.push({
            course: "History 204",
            title: hist.title,
            timestamp: "00:03:00",
            recording: hist,
          });
        }
      } else if (
        q.includes("cognitive load") ||
        q.includes("ux") ||
        q.includes("design") ||
        q.includes("presentation")
      ) {
        answerText =
          "In Marcus Vance's Human-Computer Interaction session:\n\n" +
          "• Cognitive Load: The mental effort required to navigate an interface. Designers should reveal only what the user needs for their immediate task rather than displaying all features simultaneously.\n" +
          "• Presentation Guidelines (From Voice Memo): Lead with the user pain-point within the first 2 minutes, keep slides under 8, and protect 10 minutes for open discussion.";

        const hci = recordings.find(
          (r) => r.course === "Human-Computer Interaction",
        );
        if (hci) {
          citations.push({
            course: "Human-Computer Interaction",
            title: hci.title,
            timestamp: "00:01:45",
            recording: hci,
          });
        }
      } else {
        answerText = `Grounded across your audio sessions in ${activeCourse}:\n\n• Core Finding: Practical environmental structure and progressive discipline consistently outperform theoretical ideals or raw willpower.\n• Highlighted Sessions: "${recordings[0]?.title}" and "${recordings[1]?.title}".`;
        if (recordings[0]) {
          citations.push({
            course: recordings[0].course,
            title: recordings[0].title,
            timestamp: "00:04:30",
            recording: recordings[0],
          });
        }
      }

      const newMsg: ChatMessage = {
        id: `chat-${Date.now()}`,
        question: cleanQ,
        answer: answerText,
        courseScope: activeCourse,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        citations,
      };

      setChatHistory((prev) => [...prev, newMsg]);
      setTutorQuery("");
      setIsSearchingTutor(false);
    }, 600);
  };

  const handleCopyAnswer = (msg: ChatMessage) => {
    navigator.clipboard.writeText(
      `Q: ${msg.question}\n\n${msg.answer}\n\nCitations: ${msg.citations.map((c) => `${c.course} (${c.title})`).join(", ")}`,
    );
    setCopiedMessageId(msg.id);
    setTimeout(() => setCopiedMessageId(null), 2500);
  };

  // ----------------------------------------------------
  // PRACTICE QUIZ STATE
  // ----------------------------------------------------
  const quizQuestions: QuizItem[] = useMemo(() => {
    if (activeCourse === "All Courses") {
      return STATIC_QUIZ_BANK;
    }
    const filtered = STATIC_QUIZ_BANK.filter((q) => q.course === activeCourse);
    return filtered.length > 0 ? filtered : STATIC_QUIZ_BANK;
  }, [activeCourse]);

  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const currentQuizItem = quizQuestions[quizIndex];

  const handleSelectQuizOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
    setIsAnswerSubmitted(true);
    if (idx === currentQuizItem.correctIndex) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    if (quizIndex + 1 >= quizQuestions.length) {
      setIsQuizComplete(true);
    } else {
      setQuizIndex((prev) => prev + 1);
    }
  };

  const handleRestartQuiz = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setIsQuizComplete(false);
  };

  // ----------------------------------------------------
  // HIGH-YIELD STUDY GUIDE DATA
  // ----------------------------------------------------
  const [guideSubTab, setGuideSubTab] = useState<
    "concepts" | "deadlines" | "takeaways"
  >("concepts");
  const [completedActions, setCompletedActions] = useState<Set<string>>(
    new Set(),
  );
  const [isGuideCopied, setIsGuideCopied] = useState(false);

  const allDeadlines = useMemo(() => {
    const items: { id: string; course: string; text: string }[] = [];
    for (const rec of filteredRecordings) {
      rec.summary.actionItems?.forEach((act, idx) => {
        items.push({
          id: `${rec.id}-act-${idx}`,
          course: rec.course,
          text: act,
        });
      });
    }
    return items;
  }, [filteredRecordings]);

  const allTakeaways = useMemo(() => {
    const items: {
      id: string;
      course: string;
      title: string;
      takeaway: string;
    }[] = [];
    for (const rec of filteredRecordings) {
      rec.summary.keyTakeaways.forEach((t, idx) => {
        items.push({
          id: `${rec.id}-takeaway-${idx}`,
          course: rec.course,
          title: rec.title,
          takeaway: t,
        });
      });
    }
    return items;
  }, [filteredRecordings]);

  const toggleActionItem = (id: string) => {
    setCompletedActions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCopyStudyGuide = () => {
    let text = `AUDITOR HIGH-YIELD STUDY GUIDE: ${activeCourse}\n\n`;

    text += `=== UPCOMING ACTION ITEMS & DEADLINES ===\n`;
    for (const d of allDeadlines) {
      text += `• [${d.course}] ${d.text}\n`;
    }

    text += `\n=== KEY LECTURE TAKEAWAYS ===\n`;
    for (const t of allTakeaways) {
      text += `• [${t.course}] ${t.takeaway}\n`;
    }

    navigator.clipboard.writeText(text);
    setIsGuideCopied(true);
    setTimeout(() => setIsGuideCopied(false), 2500);
  };

  // Course options list
  const courseOptions = useMemo(() => {
    if (courses && courses.length > 0) {
      return courses.map((c) => (typeof c === "string" ? c : c.name));
    }
    return [
      "All Courses",
      "Economics 101",
      "Cognitive Psychology",
      "History 204",
      "Human-Computer Interaction",
      "Biology 102",
    ];
  }, [courses]);

  return (
    <div className="space-y-6">
      {/* ==================================================== */}
      {/* 1. TOP HEADER & INTENT PICKER BAR                   */}
      {/* ==================================================== */}
      <div className="rounded-xl bg-[#1a1e24] border border-white/[0.08] p-5 sm:p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#f5f2eb]">
              AI Study Assistant
            </h2>
            <p className="text-xs text-[#9ba1a8] mt-1 leading-relaxed max-w-xl">
              Targeted revision grounded in your lecture transcripts. Choose
              what you want to work on right now without distractions.
            </p>
          </div>

          {/* Scope Selector: Course Filter */}
          <div className="flex items-center gap-2.5 self-start md:self-auto bg-[#14171a] px-3 py-1.5 rounded-lg border border-white/[0.08]">
            <span className="text-[11px] font-medium text-[#9ba1a8]">
              Scope:
            </span>
            <select
              value={activeCourse}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-[#e5a93c] outline-none cursor-pointer pr-1"
            >
              {courseOptions.map((c) => (
                <option
                  key={c}
                  value={c}
                  className="bg-[#1a1e24] text-[#f5f2eb]"
                >
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tactical Study Intent Selector */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 pt-1 border-t border-white/[0.06]">
          {/* Option 1: Flashcards */}
          <button
            type="button"
            onClick={() => setActiveMode("flashcards")}
            className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
              activeMode === "flashcards"
                ? "bg-[#232a32] text-[#f5f2eb] border border-[#e5a93c]/50 shadow-sm"
                : "bg-[#16191e] text-[#9ba1a8] hover:bg-[#1f242b] hover:text-[#f5f2eb] border border-transparent"
            }`}
          >
            <div
              className={`p-2 rounded-md ${
                activeMode === "flashcards"
                  ? "bg-[#e5a93c]/20 text-[#e5a93c]"
                  : "bg-white/[0.05] text-[#9ba1a8]"
              }`}
            >
              <svg
                aria-hidden="true"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold truncate flex items-center gap-1.5">
                <span>Revision Flashcards</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-[#c59e5e]">
                  {allCards.length}
                </span>
              </div>
              <p className="text-[11px] text-[#9ba1a8] truncate mt-0.5">
                Active recall & spaced testing
              </p>
            </div>
          </button>

          {/* Option 2: Ask AI Tutor */}
          <button
            type="button"
            onClick={() => setActiveMode("tutor")}
            className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
              activeMode === "tutor"
                ? "bg-[#232a32] text-[#f5f2eb] border border-[#e5a93c]/50 shadow-sm"
                : "bg-[#16191e] text-[#9ba1a8] hover:bg-[#1f242b] hover:text-[#f5f2eb] border border-transparent"
            }`}
          >
            <div
              className={`p-2 rounded-md ${
                activeMode === "tutor"
                  ? "bg-[#e5a93c]/20 text-[#e5a93c]"
                  : "bg-white/[0.05] text-[#9ba1a8]"
              }`}
            >
              <svg
                aria-hidden="true"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold truncate flex items-center gap-1.5">
                <span>Ask AI Tutor</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400">
                  Grounded
                </span>
              </div>
              <p className="text-[11px] text-[#9ba1a8] truncate mt-0.5">
                Q&A with exact lecture citations
              </p>
            </div>
          </button>

          {/* Option 3: Practice Quiz */}
          <button
            type="button"
            onClick={() => setActiveMode("quiz")}
            className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
              activeMode === "quiz"
                ? "bg-[#232a32] text-[#f5f2eb] border border-[#e5a93c]/50 shadow-sm"
                : "bg-[#16191e] text-[#9ba1a8] hover:bg-[#1f242b] hover:text-[#f5f2eb] border border-transparent"
            }`}
          >
            <div
              className={`p-2 rounded-md ${
                activeMode === "quiz"
                  ? "bg-[#e5a93c]/20 text-[#e5a93c]"
                  : "bg-white/[0.05] text-[#9ba1a8]"
              }`}
            >
              <svg
                aria-hidden="true"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold truncate flex items-center gap-1.5">
                <span>Practice Quiz</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-[#c59e5e]">
                  {quizQuestions.length} Qs
                </span>
              </div>
              <p className="text-[11px] text-[#9ba1a8] truncate mt-0.5">
                Interactive tests & explanations
              </p>
            </div>
          </button>

          {/* Option 4: High-Yield Study Guide */}
          <button
            type="button"
            onClick={() => setActiveMode("guide")}
            className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
              activeMode === "guide"
                ? "bg-[#232a32] text-[#f5f2eb] border border-[#e5a93c]/50 shadow-sm"
                : "bg-[#16191e] text-[#9ba1a8] hover:bg-[#1f242b] hover:text-[#f5f2eb] border border-transparent"
            }`}
          >
            <div
              className={`p-2 rounded-md ${
                activeMode === "guide"
                  ? "bg-[#e5a93c]/20 text-[#e5a93c]"
                  : "bg-white/[0.05] text-[#9ba1a8]"
              }`}
            >
              <svg
                aria-hidden="true"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold truncate flex items-center gap-1.5">
                <span>Study Guide</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-[#c59e5e]">
                  Cheat Sheet
                </span>
              </div>
              <p className="text-[11px] text-[#9ba1a8] truncate mt-0.5">
                Concepts, deadlines & takeaways
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. DEDICATED WORKSPACE: FLASHCARDS                   */}
      {/* ==================================================== */}
      {activeMode === "flashcards" && (
        <div className="space-y-4">
          {/* Deck Stats Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1a1e24] px-4 py-3 rounded-xl border border-white/[0.08]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#f5f2eb]">
                {activeCourse} Flashcard Deck
              </span>
              <span className="text-xs font-mono text-[#9ba1a8]">
                {allCards.length > 0
                  ? `Card ${activeCardIndex + 1} of ${allCards.length}`
                  : "0 cards"}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-[#9ba1a8]">Mastered:</span>
                <span className="font-mono font-semibold text-[#f5f2eb]">
                  {masteredCardIds.size}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#e5a93c]" />
                <span className="text-[#9ba1a8]">Needs Review:</span>
                <span className="font-mono font-semibold text-[#f5f2eb]">
                  {reviewCardIds.size}
                </span>
              </div>

              <button
                type="button"
                onClick={handleRestartDeck}
                className="text-[11px] text-[#9ba1a8] hover:text-[#f5f2eb] underline cursor-pointer"
              >
                Reset Progress
              </button>
            </div>
          </div>

          {/* Flashcard Body */}
          {allCards.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-[#1a1e24] border border-white/[0.08] space-y-3">
              <p className="text-sm text-[#f5f2eb] font-semibold">
                No flashcards found for {activeCourse}
              </p>
              <p className="text-xs text-[#9ba1a8] max-w-md mx-auto">
                Select "All Courses" above to practice across all 8 indexed
                lectures.
              </p>
              <button
                type="button"
                onClick={() => handleCourseChange("All Courses")}
                className="px-4 py-2 bg-[#e5a93c] text-[#14171a] font-semibold text-xs rounded-lg transition-all"
              >
                Switch to All Courses
              </button>
            </div>
          ) : isDeckFinished ? (
            /* Completed Deck Summary */
            <div className="p-8 sm:p-12 text-center rounded-xl bg-[#1a1e24] border border-[#e5a93c]/30 space-y-5">
              <div className="h-12 w-12 rounded-full bg-[#e5a93c]/20 border border-[#e5a93c]/40 mx-auto flex items-center justify-center text-[#e5a93c]">
                <svg
                  aria-hidden="true"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <div className="space-y-1">
                <h3 className="font-editorial text-2xl font-bold text-[#f5f2eb]">
                  Deck Complete!
                </h3>
                <p className="text-xs text-[#9ba1a8] max-w-sm mx-auto">
                  You reviewed all {allCards.length} cards in this session. Here
                  is your recall breakdown:
                </p>
              </div>

              <div className="inline-flex items-center gap-6 p-4 rounded-xl bg-[#14171a] border border-white/[0.08]">
                <div className="text-center">
                  <div className="font-mono text-xl font-bold text-emerald-400">
                    {masteredCardIds.size}
                  </div>
                  <div className="text-[11px] text-[#9ba1a8]">Mastered</div>
                </div>
                <div className="h-8 w-px bg-white/[0.08]" />
                <div className="text-center">
                  <div className="font-mono text-xl font-bold text-[#e5a93c]">
                    {reviewCardIds.size}
                  </div>
                  <div className="text-[11px] text-[#9ba1a8]">Needs Review</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleRestartDeck}
                  className="px-4 py-2 rounded-lg bg-[#20252b] hover:bg-[#282f37] text-xs font-semibold text-[#f5f2eb] border border-white/[0.08] transition-colors"
                >
                  Restart Deck
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMode("quiz")}
                  className="px-4 py-2 rounded-lg bg-[#e5a93c] hover:bg-[#f3b74b] text-xs font-semibold text-[#14171a] transition-all"
                >
                  Take Practice Quiz →
                </button>
              </div>
            </div>
          ) : (
            currentCard && (
              <div className="space-y-4">
                {/* Tactical Card Component (Semantic button with keyboard support) */}
                <button
                  type="button"
                  onClick={handleFlipCard}
                  aria-label={
                    isFlipped
                      ? "Show flashcard question"
                      : "Reveal flashcard answer"
                  }
                  className="w-full text-left cursor-pointer min-h-[300px] sm:min-h-[320px] rounded-xl bg-[#1a1e24] border border-white/[0.08] hover:border-[#e5a93c]/40 focus:border-[#e5a93c] focus:outline-none p-6 sm:p-8 flex flex-col justify-between transition-all shadow-md select-none"
                >
                  <div>
                    {/* Card Top Metadata */}
                    <div className="flex items-center justify-between gap-2 mb-6">
                      <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[#e5a93c] bg-[#e5a93c]/10 px-2 py-0.5 rounded">
                        {currentCard.course}
                      </span>
                      <span className="text-xs text-[#9ba1a8] flex items-center gap-1.5">
                        <svg
                          aria-hidden="true"
                          className="w-3.5 h-3.5 text-[#9ba1a8]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        <span>
                          {isFlipped
                            ? "Click to see Question"
                            : "Click to reveal Answer"}
                        </span>
                      </span>
                    </div>

                    {/* Card Content Face */}
                    {!isFlipped ? (
                      <div className="space-y-3">
                        <span className="text-xs font-medium text-[#c59e5e] uppercase tracking-wider block">
                          Question:
                        </span>
                        <p className="font-editorial text-xl sm:text-2xl font-semibold text-[#f5f2eb] leading-relaxed tracking-tight">
                          {currentCard.question}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider block">
                          Answer:
                        </span>
                        <p className="text-sm sm:text-base text-[#f5f2eb] leading-relaxed">
                          {currentCard.answer}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Source Info */}
                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-2 text-xs text-[#9ba1a8]">
                    <div className="truncate max-w-md">
                      <span>Source: </span>
                      <span className="text-[#f5f2eb] font-medium">
                        {currentCard.sourceTitle}
                      </span>
                    </div>

                    <span className="text-[#e5a93c] text-xs font-medium">
                      {isFlipped ? "Answer revealed" : "Click to flip"}
                    </span>
                  </div>
                </button>

                {/* Card Controls & Rating Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrevCard}
                      className="px-3.5 py-2 rounded-lg bg-[#20252b] hover:bg-[#282f37] text-xs font-medium text-[#f5f2eb] border border-white/[0.06] transition-colors"
                      title="Previous Card (Left Arrow)"
                    >
                      ← Previous
                    </button>

                    <button
                      type="button"
                      onClick={handleFlipCard}
                      className="px-4 py-2 rounded-lg bg-[#252c34] hover:bg-[#2e3640] text-xs font-medium text-[#e5a93c] border border-[#e5a93c]/20 transition-colors"
                      title="Flip Card (Spacebar)"
                    >
                      {isFlipped ? "Show Question" : "Reveal Answer"}
                    </button>

                    <button
                      type="button"
                      onClick={handleNextCard}
                      className="px-3.5 py-2 rounded-lg bg-[#20252b] hover:bg-[#282f37] text-xs font-medium text-[#f5f2eb] border border-white/[0.06] transition-colors"
                      title="Next Card (Right Arrow)"
                    >
                      Next →
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenRecording(currentCard.recording)}
                      className="hidden md:inline-flex px-3 py-2 rounded-lg text-xs font-medium text-[#c59e5e] hover:text-[#e5a93c] hover:bg-[#20252b] transition-colors"
                    >
                      Open Lecture →
                    </button>
                  </div>

                  {/* Confidence Rating Buttons */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#9ba1a8] hidden md:inline">
                      Self-Evaluation:
                    </span>
                    <button
                      type="button"
                      onClick={handleMarkReview}
                      className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/20 transition-colors"
                    >
                      Needs Review
                    </button>
                    <button
                      type="button"
                      onClick={handleMarkMastered}
                      className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/20 transition-colors"
                    >
                      Mastered
                    </button>
                  </div>
                </div>

                {/* Keyboard Shortcut Hint */}
                <div className="text-center pt-2 text-[11px] text-[#9ba1a8]">
                  <span>Keyboard shortcuts: </span>
                  <kbd className="px-1.5 py-0.5 rounded bg-[#1f242b] border border-white/[0.08] text-[#f5f2eb] text-[10px] font-mono">
                    Space
                  </kbd>{" "}
                  to flip ·{" "}
                  <kbd className="px-1.5 py-0.5 rounded bg-[#1f242b] border border-white/[0.08] text-[#f5f2eb] text-[10px] font-mono">
                    ←
                  </kbd>{" "}
                  previous ·{" "}
                  <kbd className="px-1.5 py-0.5 rounded bg-[#1f242b] border border-white/[0.08] text-[#f5f2eb] text-[10px] font-mono">
                    →
                  </kbd>{" "}
                  next
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. DEDICATED WORKSPACE: ASK AI TUTOR                 */}
      {/* ==================================================== */}
      {activeMode === "tutor" && (
        <div className="space-y-4">
          {/* Ask Input Container */}
          <div className="rounded-xl bg-[#1a1e24] border border-white/[0.08] p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-[#f5f2eb]">
                Ask Your Grounded Lecture Tutor
              </h3>
              <span className="text-xs text-[#9ba1a8]">
                Indexing {filteredRecordings.length} audio lectures
              </span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskTutor(tutorQuery);
              }}
              className="space-y-3"
            >
              <div className="relative">
                <input
                  type="text"
                  value={tutorQuery}
                  onChange={(e) => setTutorQuery(e.target.value)}
                  placeholder={`Ask anything across ${activeCourse} (e.g. assignments, theories, professor examples)...`}
                  className="w-full px-4 py-3 bg-[#14171a] border border-white/[0.08] focus:border-[#e5a93c]/50 rounded-lg text-xs sm:text-sm text-[#f5f2eb] placeholder-[#8b919a] outline-none pr-24 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!tutorQuery.trim() || isSearchingTutor}
                  className="absolute right-2 top-2 bottom-2 px-3.5 bg-[#e5a93c] hover:bg-[#f3b74b] disabled:opacity-40 text-[#14171a] font-semibold text-xs rounded-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {isSearchingTutor ? (
                    <span className="inline-block h-3 w-3 rounded-full border-2 border-[#14171a] border-t-transparent animate-spin" />
                  ) : (
                    <span>Ask AI</span>
                  )}
                </button>
              </div>

              {/* High-Yield Prompts */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-medium text-[#9ba1a8]">
                  Suggested inquiry prompts for {activeCourse}:
                </span>
                <div className="flex flex-wrap gap-2">
                  {suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => {
                        setTutorQuery(prompt);
                        handleAskTutor(prompt);
                      }}
                      className="px-2.5 py-1 rounded bg-[#20252b] hover:bg-[#282f37] hover:text-[#f5f2eb] text-[11px] text-[#cfd4dc] border border-white/[0.04] transition-colors text-left"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* Conversation Stream */}
          <div className="space-y-4">
            {chatHistory.length === 0 && !isSearchingTutor && (
              <div className="p-8 text-center rounded-xl bg-[#1a1e24] border border-white/[0.08] space-y-2">
                <p className="text-xs sm:text-sm text-[#f5f2eb] font-medium">
                  No questions asked in this study session yet.
                </p>
                <p className="text-xs text-[#9ba1a8] max-w-md mx-auto">
                  Type a question above or click one of the suggested prompts to
                  synthesize explanations with verbatim lecture citations.
                </p>
              </div>
            )}

            {isSearchingTutor && (
              <div className="p-6 rounded-xl bg-[#1a1e24] border border-[#e5a93c]/30 flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-[#e5a93c] animate-ping" />
                <span className="text-xs text-[#e5a93c] font-medium">
                  Scanning lecture transcripts & synthesizing grounded answer...
                </span>
              </div>
            )}

            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className="rounded-xl bg-[#1a1e24] border border-white/[0.08] p-5 sm:p-6 space-y-4"
              >
                {/* User Prompt */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#e5a93c]" />
                    <span className="text-xs font-semibold text-[#f5f2eb]">
                      {msg.question}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#9ba1a8]">
                    {msg.timestamp}
                  </span>
                </div>

                {/* Grounded Tutor Answer */}
                <div className="text-xs sm:text-sm text-[#cfd4dc] leading-relaxed whitespace-pre-line">
                  {msg.answer}
                </div>

                {/* Citations & Source Links */}
                {msg.citations.length > 0 && (
                  <div className="pt-3 border-t border-white/[0.06] space-y-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#c59e5e]">
                      Verified Lecture Citations:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {msg.citations.map((cite) => (
                        <button
                          key={`${cite.recording.id}-${cite.timestamp}`}
                          type="button"
                          onClick={() => onOpenRecording(cite.recording)}
                          className="px-2.5 py-1 rounded bg-[#20252b] hover:bg-[#282f37] border border-white/[0.06] text-[11px] text-[#f5f2eb] flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span className="text-[#e5a93c] font-mono">
                            {cite.timestamp}
                          </span>
                          <span className="truncate max-w-[200px]">
                            {cite.title}
                          </span>
                          <span className="text-[#e5a93c]">↗</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Bar */}
                <div className="flex items-center justify-end gap-2 pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => handleCopyAnswer(msg)}
                    className="text-[11px] text-[#9ba1a8] hover:text-[#f5f2eb] underline"
                  >
                    {copiedMessageId === msg.id ? "Copied!" : "Copy Answer"}
                  </button>
                </div>
              </div>
            ))}

            {chatHistory.length > 0 && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setChatHistory([])}
                  className="text-xs text-[#9ba1a8] hover:text-[#f5f2eb] underline cursor-pointer"
                >
                  Clear Chat History
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. DEDICATED WORKSPACE: PRACTICE QUIZ                */}
      {/* ==================================================== */}
      {activeMode === "quiz" && (
        <div className="space-y-4">
          {/* Quiz Top Progress */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1a1e24] px-4 py-3 rounded-xl border border-white/[0.08]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#f5f2eb]">
                {activeCourse} Practice Quiz
              </span>
              <span className="text-xs font-mono text-[#9ba1a8]">
                Question {quizIndex + 1} of {quizQuestions.length}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[#9ba1a8]">Score:</span>
                <span className="font-mono font-semibold text-[#e5a93c]">
                  {quizScore} / {quizQuestions.length}
                </span>
              </div>

              <button
                type="button"
                onClick={handleRestartQuiz}
                className="text-[11px] text-[#9ba1a8] hover:text-[#f5f2eb] underline cursor-pointer"
              >
                Reset Quiz
              </button>
            </div>
          </div>

          {isQuizComplete ? (
            /* Quiz Results Finished Screen */
            <div className="p-8 sm:p-12 text-center rounded-xl bg-[#1a1e24] border border-[#e5a93c]/30 space-y-5">
              <div className="h-12 w-12 rounded-full bg-[#e5a93c]/20 border border-[#e5a93c]/40 mx-auto flex items-center justify-center text-[#e5a93c]">
                <svg
                  aria-hidden="true"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>

              <div className="space-y-1">
                <h3 className="font-editorial text-2xl font-bold text-[#f5f2eb]">
                  Quiz Complete!
                </h3>
                <p className="text-xs text-[#9ba1a8]">
                  You answered {quizScore} out of {quizQuestions.length}{" "}
                  questions correctly (
                  {Math.round((quizScore / quizQuestions.length) * 100)}%).
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleRestartQuiz}
                  className="px-4 py-2 rounded-lg bg-[#20252b] hover:bg-[#282f37] text-xs font-semibold text-[#f5f2eb] border border-white/[0.08] transition-colors"
                >
                  Retake Quiz
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMode("flashcards")}
                  className="px-4 py-2 rounded-lg bg-[#e5a93c] hover:bg-[#f3b74b] text-xs font-semibold text-[#14171a] transition-all"
                >
                  Review Weak Areas in Flashcards →
                </button>
              </div>
            </div>
          ) : (
            currentQuizItem && (
              <div className="rounded-xl bg-[#1a1e24] border border-white/[0.08] p-6 sm:p-8 space-y-6">
                {/* Question Prompt */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[#e5a93c] bg-[#e5a93c]/10 px-2 py-0.5 rounded">
                      {currentQuizItem.course}
                    </span>
                    <span className="text-xs text-[#9ba1a8]">
                      {currentQuizItem.sourceTitle}
                    </span>
                  </div>
                  <h3 className="font-sans text-lg sm:text-xl font-semibold text-[#f5f2eb] leading-snug">
                    {currentQuizItem.question}
                  </h3>
                </div>

                {/* Multiple Choice Options */}
                <div className="space-y-2.5">
                  {currentQuizItem.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQuizItem.correctIndex;

                    let btnClass =
                      "bg-[#14171a] border-white/[0.08] hover:border-[#e5a93c]/40 text-[#cfd4dc]";

                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        btnClass =
                          "bg-emerald-500/15 border-emerald-500/60 text-emerald-300";
                      } else if (isSelected && !isCorrect) {
                        btnClass =
                          "bg-rose-500/15 border-rose-500/60 text-rose-300";
                      }
                    }

                    return (
                      <button
                        key={`${currentQuizItem.id}-opt-${idx}`}
                        type="button"
                        onClick={() => handleSelectQuizOption(idx)}
                        disabled={isAnswerSubmitted}
                        className={`w-full p-4 rounded-lg border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3 ${btnClass}`}
                      >
                        <span className="h-5 w-5 rounded-full border border-white/[0.2] flex items-center justify-center text-[10px] font-mono flex-shrink-0 mt-0.5">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1 leading-relaxed">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Box & Next Button */}
                {isAnswerSubmitted && (
                  <div className="p-4 rounded-lg bg-[#14171a] border border-white/[0.08] space-y-3 animate-fade-in">
                    <div className="flex items-center gap-2">
                      {selectedOption === currentQuizItem.correctIndex ? (
                        <>
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          <span className="text-xs font-semibold text-emerald-400">
                            Correct Answer
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="h-2 w-2 rounded-full bg-rose-400" />
                          <span className="text-xs font-semibold text-rose-400">
                            Incorrect
                          </span>
                        </>
                      )}
                    </div>

                    <p className="text-xs text-[#cfd4dc] leading-relaxed">
                      {currentQuizItem.explanation}
                    </p>

                    <div className="flex items-center justify-end pt-2">
                      <button
                        type="button"
                        onClick={handleNextQuizQuestion}
                        className="px-4 py-2 rounded-lg bg-[#e5a93c] hover:bg-[#f3b74b] text-[#14171a] font-semibold text-xs transition-all cursor-pointer"
                      >
                        {quizIndex + 1 >= quizQuestions.length
                          ? "View Final Results →"
                          : "Next Question →"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 5. DEDICATED WORKSPACE: STUDY GUIDE & CHEAT SHEET    */}
      {/* ==================================================== */}
      {activeMode === "guide" && (
        <div className="space-y-4">
          {/* Guide Sub-Navigation Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1a1e24] px-4 py-3 rounded-xl border border-white/[0.08]">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setGuideSubTab("concepts")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  guideSubTab === "concepts"
                    ? "bg-[#252c34] text-[#e5a93c] font-semibold"
                    : "text-[#9ba1a8] hover:text-[#f5f2eb]"
                }`}
              >
                Key Takeaways ({allTakeaways.length})
              </button>

              <button
                type="button"
                onClick={() => setGuideSubTab("deadlines")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  guideSubTab === "deadlines"
                    ? "bg-[#252c34] text-[#e5a93c] font-semibold"
                    : "text-[#9ba1a8] hover:text-[#f5f2eb]"
                }`}
              >
                Action Items & Deadlines ({allDeadlines.length})
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyStudyGuide}
              className="text-xs font-semibold text-[#e5a93c] hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <span>
                {isGuideCopied ? "✓ Copied to Clipboard" : "Copy Study Guide"}
              </span>
            </button>
          </div>

          {/* SubTab 1: Key Takeaways */}
          {guideSubTab === "concepts" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allTakeaways.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl bg-[#1a1e24] border border-white/[0.08] p-5 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[#e5a93c] bg-[#e5a93c]/10 px-2 py-0.5 rounded">
                        {item.course}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#f5f2eb] leading-relaxed">
                      {item.takeaway}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] text-[11px] text-[#9ba1a8] truncate">
                    From: {item.title}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SubTab 2: Action Items & Deadlines */}
          {guideSubTab === "deadlines" && (
            <div className="rounded-xl bg-[#1a1e24] border border-white/[0.08] p-5 sm:p-6 space-y-3">
              <h3 className="text-sm font-semibold text-[#f5f2eb] pb-2 border-b border-white/[0.06]">
                Upcoming Academic Deadlines & Action Items
              </h3>

              {allDeadlines.length === 0 ? (
                <p className="text-xs text-[#9ba1a8] py-4">
                  No pending action items recorded for this course.
                </p>
              ) : (
                <div className="space-y-2">
                  {allDeadlines.map((act) => {
                    const isDone = completedActions.has(act.id);
                    return (
                      <label
                        key={act.id}
                        htmlFor={act.id}
                        className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-start gap-3 ${
                          isDone
                            ? "bg-[#14171a] border-white/[0.04] opacity-50"
                            : "bg-[#181c22] border-white/[0.08] hover:border-[#e5a93c]/40"
                        }`}
                      >
                        <input
                          id={act.id}
                          type="checkbox"
                          checked={isDone}
                          onChange={() => toggleActionItem(act.id)}
                          className="mt-0.5 rounded bg-transparent border-white/[0.3] text-[#e5a93c] focus:ring-0 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#c59e5e] block mb-0.5">
                            {act.course}
                          </span>
                          <span
                            className={`text-xs text-[#f5f2eb] leading-relaxed ${
                              isDone ? "line-through text-[#8b919a]" : ""
                            }`}
                          >
                            {act.text}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
