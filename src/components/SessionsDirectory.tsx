"use client";

import Image from "next/image";
import React, { useState } from "react";

export interface SessionItem {
  id: string;
  number: string;
  title: string;
  speaker: string;
  duration: string;
  date: string;
  category: string;
  location: string;
  image: string;
  summary: {
    thesis: string;
    keyPoints: string[];
    examQuestions: string[];
  };
  concepts: { term: string; definition: string }[];
  transcript: {
    speaker: string;
    timestamp: string;
    seconds: number;
    text: string;
  }[];
}

const SESSIONS_DATA: SessionItem[] = [
  {
    id: "session-01",
    number: "01",
    title: "Quantum Computing: Topological Qubits",
    speaker: "Prof. Arthur Sterling · Quantum Institute",
    duration: "54m",
    date: "Oct 1, 2026",
    category: "Physics",
    location: "Auditorium I",
    image: "/images/hero.jpg",
    summary: {
      thesis:
        "Topological quantum computation protects quantum information from environmental decoherence by braiding non-Abelian anyons in two-dimensional quasiparticle spaces.",
      keyPoints: [
        "Majorana zero modes at superconductor-semiconductor nanowire interfaces.",
        "Braiding operations are fault-tolerant by geometric necessity.",
        "Error rates drop exponentially as separation distance between bound states increases.",
      ],
      examQuestions: [
        "Explain why topological braiding operations are invariant under continuous spatial deformation.",
        "Derive the non-Abelian exchange statistics for Ising anyons.",
      ],
    },
    concepts: [
      {
        term: "Majorana Fermion",
        definition:
          "A fermion that is its own antiparticle, proposed to form protected zero modes.",
      },
      {
        term: "Non-Abelian Anyon",
        definition:
          "Quasiparticles whose exchange operations do not commute, enabling quantum gates.",
      },
    ],
    transcript: [
      {
        speaker: "Prof. Sterling",
        timestamp: "00:04:12",
        seconds: 252,
        text: "Notice that conventional qubits require active quantum error correction cycles running hundreds of times per millisecond. Topological systems shift that burden onto topology itself.",
      },
      {
        speaker: "Student Question",
        timestamp: "00:18:45",
        seconds: 1125,
        text: "Professor, how do we experimentally distinguish a true Majorana bound state from a trivial Andreev bound state?",
      },
      {
        speaker: "Prof. Sterling",
        timestamp: "00:19:30",
        seconds: 1170,
        text: "That is the central experimental bottleneck. The quantized zero-bias conductance peak must remain stubbornly locked at 2e squared over h across changing magnetic fields.",
      },
    ],
  },
  {
    id: "session-02",
    number: "02",
    title: "Macroeconomic Multipliers & Sovereign Debt",
    speaker: "Dr. Tariq Al-Mansoor · Dept of Economics",
    duration: "1h 12m",
    date: "Oct 2, 2026",
    category: "Economics",
    location: "Hall IV",
    image: "/images/room.jpg",
    summary: {
      thesis:
        "Fiscal multipliers vary substantially depending on monetary policy stance, whether interest rates reside at the effective lower bound, and initial sovereign debt ratios.",
      keyPoints: [
        "Multipliers exceed 1.5 during recessions with monetary accommodation.",
        "When public debt surpasses 90% of GDP, fiscal impulses suffer credibility risk.",
        "Automatic stabilizers provide countercyclical smoothing with zero implementation lag.",
      ],
      examQuestions: [
        "How does the zero lower bound amplify Keynesian government expenditure multipliers?",
      ],
    },
    concepts: [
      {
        term: "Fiscal Multiplier",
        definition:
          "The ratio of a change in national income to the exogenous change in government spending.",
      },
    ],
    transcript: [
      {
        speaker: "Dr. Al-Mansoor",
        timestamp: "00:08:10",
        seconds: 490,
        text: "The crucial mistake policymakers made in 2011 was assuming the multiplier was constant across boom and bust cycles.",
      },
    ],
  },
  {
    id: "session-03",
    number: "03",
    title: "Organic Chemistry: Asymmetric Catalysis",
    speaker: "Dr. Wei Chen · Molecular Sciences",
    duration: "42m",
    date: "Oct 2, 2026",
    category: "Chemistry",
    location: "Lab B",
    image: "/images/doorway.jpg",
    summary: {
      thesis:
        "Chiral phosphoric acids provide robust enantioselective induction for organocatalytic Friedel-Crafts alkylations.",
      keyPoints: [
        "Dual hydrogen-bonding networks lock substrate conformers in rigid transition states.",
        "Enantiomeric excess exceeding 99% achieved with sub-mol% catalyst loadings.",
      ],
      examQuestions: [
        "Draw the proposed transition state stereochemistry of the proline-catalyzed aldol reaction.",
      ],
    },
    concepts: [
      {
        term: "Enantioselectivity",
        definition:
          "The preferential formation of one enantiomer over another in a chemical reaction.",
      },
    ],
    transcript: [
      {
        speaker: "Dr. Chen",
        timestamp: "00:11:05",
        seconds: 665,
        text: "Look at the steric hindrance exerted by the 3,3-dinaphthyl substituents on the binol backbone. That blocks the re-face completely.",
      },
    ],
  },
  {
    id: "session-04",
    number: "04",
    title: "Intellectual Property in Generative AI",
    speaker: "Prof. Sarah Hastings · Law Faculty",
    duration: "1h 05m",
    date: "Oct 3, 2026",
    category: "Law",
    location: "Hall IX",
    image: "/images/hero.jpg",
    summary: {
      thesis:
        "Fair use jurisprudence faces structural tension when diffusion models reproduce recognizable training subsets without licensing agreements.",
      keyPoints: [
        "Transformative use doctrine under Campbell v. Acuff-Rose.",
        "Market substitution concerns in automated artistic style imitation.",
      ],
      examQuestions: [
        "Contrast the four factors of fair use as applied to text scraping versus synthetic image outputs.",
      ],
    },
    concepts: [
      {
        term: "Transformative Use",
        definition:
          "A fair use defense doctrine where copyrighted work is used for a purpose distinct from the original.",
      },
    ],
    transcript: [
      {
        speaker: "Prof. Hastings",
        timestamp: "00:14:30",
        seconds: 870,
        text: "The copyright office has taken an uncompromising stance: without human authorship behind the expressive elements, registration is denied.",
      },
    ],
  },
  {
    id: "session-05",
    number: "05",
    title: "Cellular Bioenergetics & Mitochondrial DNA",
    speaker: "Dr. Elena Gomez · Biomedicine",
    duration: "38m",
    date: "Oct 3, 2026",
    category: "Biology",
    location: "Auditorium III",
    image: "/images/doorway.jpg",
    summary: {
      thesis:
        "Mitochondrial heteroplasmy dictates the phenotypic threshold for metabolic and neurodegenerative disease manifestation.",
      keyPoints: [
        "Complex I and Complex IV electron transport chain stoichiometry.",
        "Reactive oxygen species signaling versus oxidative apoptosis.",
      ],
      examQuestions: [
        "Explain the mitochondrial genetic bottleneck occurring during early oogenesis.",
      ],
    },
    concepts: [
      {
        term: "Heteroplasmy",
        definition:
          "The coexistence of more than one type of organellar genome within a single cell.",
      },
    ],
    transcript: [
      {
        speaker: "Dr. Gomez",
        timestamp: "00:07:22",
        seconds: 442,
        text: "Unlike the nuclear genome, mitochondria replicate independently of the mitotic cell cycle.",
      },
    ],
  },
  {
    id: "session-06",
    number: "06",
    title: "Contemporary Architecture & Space",
    speaker: "Prof. Marco Rossi · Architecture Dept",
    duration: "1h 18m",
    date: "Oct 4, 2026",
    category: "Architecture",
    location: "Design Studio II",
    image: "/images/room.jpg",
    summary: {
      thesis:
        "Mediterranean vernacular architecture utilizes thermal mass, cross-ventilation, and shaded porticos to attain environmental comfort with zero active cooling.",
      keyPoints: [
        "Tufa and limestone stone masonry as diurnal thermal regulators.",
        "Orientation relative to maritime sea breezes and solar azimuth.",
      ],
      examQuestions: [
        "Evaluate how courtyard typology mediates microclimates in coastal Italian topography.",
      ],
    },
    concepts: [
      {
        term: "Thermal Mass",
        definition:
          "The ability of a material to absorb, store, and release heat energy slowly.",
      },
    ],
    transcript: [
      {
        speaker: "Prof. Rossi",
        timestamp: "00:22:40",
        seconds: 1360,
        text: "The thick stone walls do not merely support the vault; they are the thermodynamic lungs of the entire house.",
      },
    ],
  },
  {
    id: "session-07",
    number: "07",
    title: "Cognitive Neuroscience: Memory Consolidation",
    speaker: "Prof. Elizabeth Vance · Cognitive Science Lab",
    duration: "58m",
    date: "Oct 4, 2026",
    category: "Neuroscience",
    location: "Auditorium VII",
    image: "/images/room.jpg",
    summary: {
      thesis:
        "Memories are not statically archived at encoding; system consolidation involves two-stage transfer from the labile hippocampal register to stable neocortical networks during slow-wave sleep.",
      keyPoints: [
        "Hippocampal sharp-wave ripples (SWRs, 150-250 Hz) coordinate time-compressed replay of waking experiences.",
        "Neocortical slow oscillations orchestrate thalamocortical sleep spindles to potentiate synaptic consolidation.",
        "Patient H.M. demonstrated that bilateral medial temporal lobe resection spares remote memories while abolishing anterograde declarative formation.",
        "Synaptic tagging and capture hypothesis explains how weak memories are rescued when paired with novel stimuli.",
      ],
      examQuestions: [
        "Compare synaptic consolidation with systems consolidation regarding timescales and molecular mechanisms.",
        "Describe the empirical evidence supporting replay during slow-wave sleep as opposed to REM sleep.",
      ],
    },
    concepts: [
      {
        term: "Sharp-Wave Ripple (SWR)",
        definition:
          "High-frequency transient neuronal oscillations in the CA1 hippocampus synchronizing neocortical replay during sleep.",
      },
      {
        term: "Long-Term Potentiation (LTP)",
        definition:
          "Persistent strengthening of synapses based on recent patterns of activity, fundamental to memory encoding.",
      },
      {
        term: "System Consolidation",
        definition:
          "The time-dependent reorganization of long-term memory circuits where neocortex acquires independence from hippocampus.",
      },
    ],
    transcript: [
      {
        speaker: "Prof. Elizabeth Vance",
        timestamp: "00:02:14",
        seconds: 134,
        text: "Good afternoon everyone. Today we are tackling memory consolidation. Please close your laptops; Auditor is capturing the recording, so I want your minds entirely in the conceptual architecture.",
      },
      {
        speaker: "Prof. Elizabeth Vance",
        timestamp: "00:14:22",
        seconds: 862,
        text: "Notice that the hippocampus acts like a rapid scratchpad with high synaptic plasticity. But it has finite capacity. If we kept every experience there, catastrophic interference would erase older traces.",
      },
      {
        speaker: "Student (Hall Mic)",
        timestamp: "00:16:04",
        seconds: 964,
        text: "Professor, how does the brain prevent waking sensory inputs from disrupting that hippocampal replay during the night?",
      },
      {
        speaker: "Prof. Elizabeth Vance",
        timestamp: "00:17:10",
        seconds: 1030,
        text: "A marvelous question. The thalamic reticular nucleus effectively gates out ascending sensory signals during non-REM stage 3 sleep. It creates an insulated internal sandbox where ripples and spindles replay uninterrupted.",
      },
      {
        speaker: "Prof. Elizabeth Vance",
        timestamp: "00:28:45",
        seconds: 1725,
        text: "Let’s look at the classic case of Patient H.M. Bilateral removal of the medial temporal lobe left his childhood memories intact. Why? Because decades had allowed those memories to consolidate into distributed neocortical circuits.",
      },
      {
        speaker: "Prof. Elizabeth Vance",
        timestamp: "00:44:12",
        seconds: 2652,
        text: "In your exam, remember to contrast synaptic consolidation—which takes hours and protein synthesis—against systems consolidation, which can take months or years in humans.",
      },
    ],
  },
  {
    id: "session-08",
    number: "08",
    title: "Epistemology of Science: Popper vs Kuhn",
    speaker: "Prof. Henrik Lindqvist · Philosophy",
    duration: "49m",
    date: "Oct 5, 2026",
    category: "Philosophy",
    location: "Hall II",
    image: "/images/hero.jpg",
    summary: {
      thesis:
        "Scientific progress cannot be reduced to naive falsificationism; normal science operates within paradigm consensus until anomalies precipitate revolutionary shifts.",
      keyPoints: [
        "Popper's demarcation criterion: Falsifiability versus verification.",
        "Kuhn's paradigm shifts, incommensurability, and sociology of scientific revolutions.",
      ],
      examQuestions: [
        "Is Kuhn's concept of incommensurability fatal to scientific realism?",
      ],
    },
    concepts: [
      {
        term: "Incommensurability",
        definition:
          "The thesis that successive paradigms cannot be directly compared by a common neutral measure.",
      },
    ],
    transcript: [
      {
        speaker: "Prof. Lindqvist",
        timestamp: "00:12:18",
        seconds: 738,
        text: "Scientists do not abandon a paradigm when a contrary anomaly appears; they invent auxiliary hypotheses to protect the core model.",
      },
    ],
  },
  {
    id: "session-09",
    number: "09",
    title: "Advanced Fluid Dynamics: Turbulence",
    speaker: "Dr. Liam O'Connor · Applied Mathematics",
    duration: "1h 22m",
    date: "Oct 5, 2026",
    category: "Physics",
    location: "Hall V",
    image: "/images/room.jpg",
    summary: {
      thesis:
        "The Kolmogorov 1941 hypothesis provides the universal energy cascade scaling law in homogeneous isotropic turbulence.",
      keyPoints: [
        "Energy cascade from integral scales to viscous dissipation scale (eta).",
        "Navier-Stokes non-linear convective term drives vortex stretching.",
      ],
      examQuestions: [
        "Derive the -5/3 power law spectrum using dimensional analysis.",
      ],
    },
    concepts: [
      {
        term: "Kolmogorov Scale",
        definition:
          "The smallest spatial scales in turbulent flow where kinetic energy is dissipated into heat.",
      },
    ],
    transcript: [
      {
        speaker: "Dr. O'Connor",
        timestamp: "00:26:00",
        seconds: 1560,
        text: "At the dissipation scale, the Reynolds number based on eddy size drops to unity. Molecular viscosity takes command.",
      },
    ],
  },
  {
    id: "session-10",
    number: "10",
    title: "Microeconomic Game Theory: Nash",
    speaker: "Prof. Kenji Tanaka · Economics",
    duration: "56m",
    date: "Oct 6, 2026",
    category: "Economics",
    location: "Hall VII",
    image: "/images/doorway.jpg",
    summary: {
      thesis:
        "Mixed strategy Nash equilibria guarantee equilibrium existence in finite non-cooperative games, even where pure strategies fail.",
      keyPoints: [
        "Kakutani fixed point theorem application.",
        "Subgame perfect equilibrium in extensive form games via backward induction.",
      ],
      examQuestions: [
        "Prove that any finite zero-sum game possesses a unique minimax value.",
      ],
    },
    concepts: [
      {
        term: "Nash Equilibrium",
        definition:
          "A state where no player can benefit by changing their strategy unilaterally.",
      },
    ],
    transcript: [
      {
        speaker: "Prof. Tanaka",
        timestamp: "00:19:15",
        seconds: 1155,
        text: "Notice that in mixed equilibrium, you must randomize such that your opponent is indifferent between their pure strategies.",
      },
    ],
  },
  {
    id: "session-11",
    number: "11",
    title: "Computational Genomics: CRISPR Guides",
    speaker: "Dr. Camille Moreau · Bio-Informatics",
    duration: "1h 04m",
    date: "Oct 6, 2026",
    category: "Genomics",
    location: "Lab 3",
    image: "/images/hero.jpg",
    summary: {
      thesis:
        "Deep learning models predict off-target Cas9 cleavage kinetics by modeling chromatin accessibility and DNA bulge tolerance.",
      keyPoints: [
        "PAM sequence distal vs proximal seed mismatch tolerance.",
        "Guide RNA secondary structure stability affects on-target cutting efficiency.",
      ],
      examQuestions: [
        "How does epigenetic DNA methylation modulate Cas9 binding kinetics?",
      ],
    },
    concepts: [
      {
        term: "PAM Sequence",
        definition:
          "Protospacer adjacent motif required for Cas9 targeting and target DNA unwinding.",
      },
    ],
    transcript: [
      {
        speaker: "Dr. Moreau",
        timestamp: "00:15:40",
        seconds: 940,
        text: "A single mismatch in the 8-12 base seed region adjacent to PAM collapses cleavage efficiency to near zero.",
      },
    ],
  },
  {
    id: "session-12",
    number: "12",
    title: "Classical Roman Law & Jurisprudence",
    speaker: "Prof. Gianluigi Bellini · Legal History",
    duration: "51m",
    date: "Oct 7, 2026",
    category: "History",
    location: "Auditorium VI",
    image: "/images/doorway.jpg",
    summary: {
      thesis:
        "The Corpus Juris Civilis established foundational doctrines of contract, tort (lex Aquilia), and unjust enrichment that anchor civil law codes today.",
      keyPoints: [
        "Stipulatio as formal verbal contract enforceable through verbal cadence.",
        "Culpa levis versus culpa lata standards of liability in mandate.",
      ],
      examQuestions: [
        "Trace the evolution of actionable damage under the third chapter of the Lex Aquilia.",
      ],
    },
    concepts: [
      {
        term: "Lex Aquilia",
        definition:
          "Ancient Roman statute providing compensation for unlawful damage to property.",
      },
    ],
    transcript: [
      {
        speaker: "Prof. Bellini",
        timestamp: "00:21:10",
        seconds: 1270,
        text: "The praetorian edicts introduced flexibility when archaic statutory actions (legis actiones) proved too rigid for commercial reality.",
      },
    ],
  },
  {
    id: "session-13",
    number: "13",
    title: "Astrophysics: Stellar Nucleosynthesis",
    speaker: "Dr. Evelyn Thorne · Institute of Cosmology",
    duration: "1h 15m",
    date: "Oct 7, 2026",
    category: "Astronomy",
    location: "Hall III",
    image: "/images/room.jpg",
    summary: {
      thesis:
        "Elements heavier than iron originate predominantly through rapid neutron capture (r-process) in binary neutron star mergers.",
      keyPoints: [
        "Triple-alpha process overcoming the mass-8 instability bottleneck.",
        "Kilonova electromagnetic counterparts confirm heavy element enrichment.",
      ],
      examQuestions: [
        "Why does nuclear fusion terminate at Iron-56 in stellar cores?",
      ],
    },
    concepts: [
      {
        term: "r-Process",
        definition:
          "Rapid neutron capture process responsible for creating gold, platinum, and uranium.",
      },
    ],
    transcript: [
      {
        speaker: "Dr. Thorne",
        timestamp: "00:30:15",
        seconds: 1815,
        text: "Every gold atom in the wedding band on your finger was forged in the catastrophic merger of two neutron stars.",
      },
    ],
  },
  {
    id: "session-14",
    number: "14",
    title: "Ethics of Automated Decision Systems",
    speaker: "Prof. Mateo Vasquez · Computer Science",
    duration: "46m",
    date: "Oct 8, 2026",
    category: "AI Ethics",
    location: "Auditorium V",
    image: "/images/hero.jpg",
    summary: {
      thesis:
        "Algorithmic fairness criteria (demographic parity, equalized odds) are mathematically incompatible when baseline prevalence rates diverge.",
      keyPoints: [
        "Kleinberg impossibility theorem in risk score parity.",
        "Procedural justice and contestability in automated administrative decisions.",
      ],
      examQuestions: [
        "Formally state the trade-off between calibration within groups and error rate equality across groups.",
      ],
    },
    concepts: [
      {
        term: "Equalized Odds",
        definition:
          "Fairness metric requiring true positive and false positive rates to be identical across protected groups.",
      },
    ],
    transcript: [
      {
        speaker: "Prof. Vasquez",
        timestamp: "00:17:50",
        seconds: 1070,
        text: "Mathematical fairness is not a technical bug to patch; it is an ethical value judgment about which harm you are willing to distribute.",
      },
    ],
  },
];

export function SessionsDirectory({
  onJumpToTimestamp,
}: {
  onJumpToTimestamp?: (seconds: number) => void;
}) {
  const [selectedSessionId, setSelectedSessionId] = useState("session-07");
  const [activeTab, setActiveTab] = useState<
    "transcript" | "summary" | "concepts" | "chat"
  >("transcript");

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayTime, setCurrentPlayTime] = useState(862); // 14:22
  const [playbackSpeed, setPlaybackSpeed] = useState("1.0x");
  const [transcriptSearch, setTranscriptSearch] = useState("");

  // Grounded AI Chat state
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "ai"; text: string; citation?: string }[]
  >([
    {
      role: "ai",
      text: "I have fully digested the 58-minute lecture on Memory Consolidation by Prof. Elizabeth Vance. What would you like to explore?",
      citation: "Session #07 · All 14 timestamps indexed",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  const activeSession =
    SESSIONS_DATA.find((s) => s.id === selectedSessionId) || SESSIONS_DATA[6];

  const handleSeek = (seconds: number) => {
    setCurrentPlayTime(seconds);
    if (onJumpToTimestamp) {
      onJumpToTimestamp(seconds);
    }
  };

  const handleAskChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userQ = chatInput.trim();
    setChatInput("");

    // Add user message
    const newHistory = [
      ...chatMessages,
      { role: "user" as const, text: userQ },
    ];
    setChatMessages(newHistory);

    // Provide immediate intelligent grounded answer
    setTimeout(() => {
      let aiReply = "";
      let citation = "";

      if (
        userQ.toLowerCase().includes("sleep") ||
        userQ.toLowerCase().includes("ripple")
      ) {
        aiReply =
          "Prof. Vance emphasized that during slow-wave sleep (specifically non-REM stage 3), the thalamic reticular nucleus gates out sensory input. Hippocampal sharp-wave ripples (150–250 Hz) coordinate time-compressed replay of waking experiences to consolidate them into neocortical circuits.";
        citation = "Prof. Vance at [00:14:22] & [00:17:10]";
      } else if (
        userQ.toLowerCase().includes("h.m.") ||
        userQ.toLowerCase().includes("patient")
      ) {
        aiReply =
          "Patient H.M. underwent bilateral medial temporal lobe resection. While he could no longer form new declarative memories (anterograde amnesia), his remote childhood memories were intact because they had already consolidated into the neocortex over decades.";
        citation = "Prof. Vance at [00:28:45]";
      } else if (
        userQ.toLowerCase().includes("exam") ||
        userQ.toLowerCase().includes("question")
      ) {
        aiReply =
          "Prof. Vance explicitly cautioned students at 00:44:12 to contrast synaptic consolidation (requiring hours and local protein synthesis) with systems consolidation (requiring months/years of neocortical reorganization).";
        citation = "Exam Alert at [00:44:12]";
      } else {
        aiReply = `Based on Prof. Vance’s remarks in "${activeSession.title}", this topic is addressed through the two-stage memory framework: the hippocampus functions as a fast, flexible scratchpad, while the neocortex stabilizes the representations over time to prevent catastrophic interference.`;
        citation = `Grounded in ${activeSession.title} · [00:14:22]`;
      }

      setChatMessages((prev) => [
        ...prev,
        { role: "ai", text: aiReply, citation },
      ]);
    }, 450);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const filteredTranscript = activeSession.transcript.filter(
    (item) =>
      item.text.toLowerCase().includes(transcriptSearch.toLowerCase()) ||
      item.speaker.toLowerCase().includes(transcriptSearch.toLowerCase()),
  );

  return (
    <section
      id="sessions"
      className="w-full py-16 md:py-24 border-b border-white/[0.06]"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        {/* Section Header */}
        <div className="mb-10">
          <h2 className="font-roman text-2xl sm:text-3xl tracking-[0.2em] text-[#f4f1eb]">
            FOURTEEN SESSIONS
          </h2>
          <p className="font-editorial italic text-base text-[#8e959e] mt-1">
            Archival audio recordings, synchronous transcripts, and grounded AI
            syntheses
          </p>
        </div>

        {/* 2-Column Split: Directory Ledger on Left, Interactive Preview Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Numbered Ledger Directory List */}
          <div className="lg:col-span-5 rounded-sm border border-white/[0.08] bg-[#1a1d22] divide-y divide-white/[0.06] overflow-hidden max-h-[720px] overflow-y-auto">
            <div className="sticky top-0 z-10 bg-[#16181d] px-4 py-3 border-b border-white/[0.08] flex items-center justify-between">
              <span className="font-roman text-[11px] tracking-[0.16em] text-[#8e959e]">
                DIRECTORY INDEX
              </span>
              <span className="font-telemetry text-[11px] text-[#e5a93c]">
                14 TAPES READY
              </span>
            </div>

            {SESSIONS_DATA.map((session) => {
              const isSelected = session.id === selectedSessionId;
              return (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => setSelectedSessionId(session.id)}
                  className={`w-full text-left px-4 py-3.5 transition-all flex items-center justify-between group ${
                    isSelected
                      ? "bg-[#252a32] text-[#f4f1eb] border-l-2 border-[#e5a93c]"
                      : "text-[#8e959e] hover:bg-white/[0.03] hover:text-[#e8e4dc]"
                  }`}
                >
                  <div className="flex items-baseline gap-3 min-w-0 pr-2">
                    <span
                      className={`font-telemetry text-xs font-semibold shrink-0 ${
                        isSelected
                          ? "text-[#e5a93c]"
                          : "text-[#828892] group-hover:text-[#b0b6bf]"
                      }`}
                    >
                      {session.number}
                    </span>
                    <div className="truncate">
                      <div
                        className={`font-editorial text-sm truncate ${
                          isSelected
                            ? "text-[#f4f1eb] font-semibold"
                            : "text-[#b8bdc5]"
                        }`}
                      >
                        {session.title}
                      </div>
                      <div className="font-telemetry text-[10px] text-[#828892] truncate mt-0.5">
                        {session.speaker}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-telemetry text-[11px] text-[#a0a5ad]">
                      {session.duration}
                    </span>
                    {isSelected && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#e5a93c]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Session Preview Card with Tape, Player, and AI Tabs */}
          <div className="lg:col-span-7 rounded-sm border border-white/[0.12] bg-[#1a1d22] p-6 sm:p-8 shadow-[0_16px_48px_rgba(0,0,0,0.6)]">
            {/* Top Tape photo and Title */}
            <div className="relative mb-6">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xs bg-[#14171a] border border-white/[0.08]">
                <Image
                  src={activeSession.image}
                  alt={activeSession.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 600px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14171a] via-[#14171a]/40 to-transparent pointer-events-none" />

                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded bg-[#e5a93c] text-[#14171a] font-telemetry text-[10px] font-bold tracking-wider uppercase mb-1">
                      {activeSession.category} · {activeSession.location}
                    </span>
                    <h3 className="font-roman text-lg sm:text-xl text-[#f4f1eb] tracking-[0.1em] drop-shadow">
                      {activeSession.number} /{" "}
                      {activeSession.title.toUpperCase()}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-[#8e959e] font-editorial italic border-b border-white/[0.08] pb-3">
                <span>{activeSession.speaker}</span>
                <span className="font-telemetry text-[11px] not-italic text-[#e5a93c]">
                  {activeSession.date} · {activeSession.duration} TOTAL
                </span>
              </div>
            </div>

            {/* Interactive Audio Player Bar */}
            <div className="rounded border border-white/[0.08] bg-[#16181d] p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e5a93c] text-[#14171a] hover:bg-[#f3b74b] transition-all transform active:scale-95 shadow-[0_0_12px_rgba(229,169,60,0.3)]"
                  >
                    {isPlaying ? (
                      <span className="text-xs font-bold font-telemetry">
                        ⏸
                      </span>
                    ) : (
                      <span className="text-xs font-bold font-telemetry ml-0.5">
                        ▶
                      </span>
                    )}
                  </button>
                  <div>
                    <span className="font-telemetry text-xs text-[#f4f1eb]">
                      {formatTime(currentPlayTime)}
                    </span>
                    <span className="font-telemetry text-xs text-[#828892]">
                      {" "}
                      / {activeSession.duration}:00
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {["1.0x", "1.2x", "1.5x", "2.0x"].map((speed) => (
                    <button
                      key={speed}
                      type="button"
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`px-2 py-0.5 text-[10px] font-telemetry rounded transition-colors ${
                        playbackSpeed === speed
                          ? "bg-white/[0.12] text-[#e5a93c] font-bold"
                          : "text-[#828892] hover:text-[#f4f1eb]"
                      }`}
                    >
                      {speed}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated Waveform with scrub position */}
              <div
                className="relative h-10 w-full flex items-center gap-[2px] cursor-pointer group"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - rect.left) / rect.width;
                  handleSeek(Math.floor(pct * 3500));
                }}
              >
                {Array.from({ length: 64 }).map((_, i) => {
                  const height = 12 + Math.sin(i * 0.4) * 16 + ((i * 13) % 18);
                  const activeThresh = Math.floor(
                    (currentPlayTime / 3500) * 64,
                  );
                  const isPast = i <= activeThresh;
                  return (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition-all duration-150 ${
                        isPast
                          ? "bg-[#e5a93c]"
                          : "bg-white/[0.12] group-hover:bg-white/[0.2]"
                      }`}
                      style={{ height: `${height}px` }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Card Sub-Navigation Tabs */}
            <div className="flex items-center border-b border-white/[0.08] mb-6 overflow-x-auto gap-2">
              {[
                { id: "transcript", label: "Live Transcript" },
                { id: "summary", label: "AI Summary" },
                { id: "concepts", label: "Key Concepts" },
                { id: "chat", label: "Ask Grounded AI" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-2.5 text-xs font-roman tracking-wider transition-all whitespace-nowrap border-b-2 ${
                      isActive
                        ? "border-[#e5a93c] text-[#f4f1eb] font-semibold"
                        : "border-transparent text-[#8e959e] hover:text-[#e8e4dc]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Live Transcript View */}
            {activeTab === "transcript" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="text"
                    value={transcriptSearch}
                    onChange={(e) => setTranscriptSearch(e.target.value)}
                    placeholder="Search words, concepts, or timestamps..."
                    className="w-full rounded border border-white/[0.1] bg-[#14171a] px-3 py-1.5 text-xs text-[#f4f1eb] placeholder-[#6f7580] focus:border-[#e5a93c] focus:outline-none font-editorial"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const allText = activeSession.transcript
                        .map((t) => `[${t.timestamp}] ${t.speaker}: ${t.text}`)
                        .join("\n\n");
                      navigator.clipboard.writeText(allText);
                      alert("Transcript copied to clipboard!");
                    }}
                    className="shrink-0 px-3 py-1.5 text-[11px] font-telemetry rounded border border-white/[0.1] text-[#e5a93c] hover:bg-white/[0.04]"
                  >
                    Copy All
                  </button>
                </div>

                <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
                  {filteredTranscript.map((t, idx) => (
                    <div
                      key={idx}
                      className="group rounded p-3 transition-colors hover:bg-white/[0.03] border border-transparent hover:border-white/[0.06]"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-telemetry text-xs font-semibold text-[#e5a93c]">
                          {t.speaker}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSeek(t.seconds)}
                          className="font-telemetry text-[11px] text-[#828892] hover:text-[#e5a93c] group-hover:underline"
                        >
                          [{t.timestamp}]
                        </button>
                      </div>
                      <p className="font-editorial text-sm text-[#d8d4cc] leading-relaxed">
                        {t.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: AI Summary View */}
            {activeTab === "summary" && (
              <div className="space-y-6 max-h-[360px] overflow-y-auto pr-2">
                <div>
                  <h4 className="font-roman text-xs tracking-wider text-[#e5a93c] mb-1.5">
                    CORE THESIS
                  </h4>
                  <p className="font-editorial text-sm text-[#f4f1eb] leading-relaxed bg-[#14171a] p-3 rounded border border-white/[0.06]">
                    {activeSession.summary.thesis}
                  </p>
                </div>

                <div>
                  <h4 className="font-roman text-xs tracking-wider text-[#e5a93c] mb-2">
                    KEY TAKEAWAYS &amp; SYNTHESIS
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm font-editorial text-[#d8d4cc]">
                    {activeSession.summary.keyPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#e5a93c] mt-0.5">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-roman text-xs tracking-wider text-[#e5a93c] mb-2">
                    POTENTIAL EXAM QUESTIONS
                  </h4>
                  <div className="space-y-2">
                    {activeSession.summary.examQuestions.map((q, i) => (
                      <div
                        key={i}
                        className="rounded border border-white/[0.08] bg-[#14171a] p-2.5 text-xs font-editorial text-[#b8bdc5]"
                      >
                        <span className="text-[#e5a93c] font-telemetry mr-1.5">
                          Q{i + 1}:
                        </span>
                        {q}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Key Concepts View */}
            {activeTab === "concepts" && (
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
                {activeSession.concepts.map((c, i) => (
                  <div
                    key={i}
                    className="rounded border border-white/[0.08] bg-[#14171a] p-3.5"
                  >
                    <div className="font-roman text-xs text-[#e5a93c] tracking-wider mb-1">
                      {c.term}
                    </div>
                    <div className="font-editorial text-sm text-[#d8d4cc] leading-relaxed">
                      {c.definition}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 4: Grounded AI Q&A Chat */}
            {activeTab === "chat" && (
              <div className="flex flex-col h-[360px]">
                {/* Pre-canned prompt suggestions */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-white/[0.08] mb-3">
                  {[
                    "What role does sleep play?",
                    "Explain Patient H.M.'s case",
                    "What will be on the final exam?",
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        setChatInput(chip);
                      }}
                      className="shrink-0 px-2.5 py-1 text-[11px] rounded bg-white/[0.04] text-[#b0b6c0] hover:text-[#e5a93c] hover:bg-white/[0.08] transition-colors font-editorial italic"
                    >
                      &ldquo;{chip}&rdquo;
                    </button>
                  ))}
                </div>

                {/* Messages stream */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-3">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex flex-col ${
                        msg.role === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded p-3 text-xs sm:text-sm font-editorial leading-relaxed ${
                          msg.role === "user"
                            ? "bg-[#e5a93c] text-[#14171a] font-medium"
                            : "bg-[#14171a] text-[#f4f1eb] border border-white/[0.08]"
                        }`}
                      >
                        {msg.text}
                      </div>
                      {msg.citation && (
                        <span className="font-telemetry text-[10px] text-[#e5a93c] mt-1 italic">
                          {msg.citation}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Chat input */}
                <form
                  onSubmit={handleAskChat}
                  className="flex items-center gap-2 border-t border-white/[0.08] pt-2"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask Auditor anything grounded in this lecture..."
                    className="flex-1 rounded border border-white/[0.1] bg-[#14171a] px-3 py-2 text-xs text-[#f4f1eb] placeholder-[#6f7580] focus:border-[#e5a93c] focus:outline-none font-editorial"
                  />
                  <button
                    type="submit"
                    className="rounded bg-[#e5a93c] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#14171a] hover:bg-[#f3b74b] transition-colors"
                  >
                    Query AI
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
