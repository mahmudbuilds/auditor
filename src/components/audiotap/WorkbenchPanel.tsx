"use client";

import React, { useState } from "react";
import { RecordingItem } from "@/types/recording";
import { ScrewHead } from "./ScrewHead";
import {
  FileText,
  Sparkles,
  Layers,
  MessageSquare,
  FileEdit,
  BookOpen,
  Lightbulb,
  Network,
  ChevronRight,
} from "lucide-react";

interface WorkbenchPanelProps {
  recording: RecordingItem;
  currentTimeSeconds: number;
  onSeek: (seconds: number) => void;
  onOpenStudyGuide?: () => void;
  onOpenMindMap?: () => void;
  className?: string;
}

export type WorkbenchTab =
  | "transcript"
  | "summary"
  | "flashcards"
  | "chat"
  | "notes";

export function WorkbenchPanel({
  recording,
  currentTimeSeconds,
  onSeek,
  onOpenStudyGuide,
  onOpenMindMap,
  className = "",
}: WorkbenchPanelProps) {
  const [activeTab, setActiveTab] = useState<WorkbenchTab>("transcript");
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [userNotes, setUserNotes] = useState<string>(
    "Key Lecture Notes:\n• Focus on class blueprint vs instance instantiation.\n• Encapsulation hides state attributes behind public methods.\n• Review Python __init__ syntax for Friday quiz.",
  );
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([
    {
      role: "assistant",
      text: "Hello! I am your AUDIOTAP Neural Assistant. Ask me anything about this lecture's transcript, definitions, or exam topics.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  const totalSeconds = recording.durationSeconds || 2537;
  const progressPercent = Math.min(
    100,
    (currentTimeSeconds / totalSeconds) * 100,
  );

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSendChat = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const query = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: "user", text: query }]);
    setChatInput("");

    setTimeout(() => {
      let reply = `Based on the lecture "${recording.title}": `;
      if (
        query.toLowerCase().includes("class") ||
        query.toLowerCase().includes("object")
      ) {
        reply +=
          "A class is the abstract template defining state attributes and methods, whereas an object is the concrete instance allocated in memory.";
      } else if (
        query.toLowerCase().includes("exam") ||
        query.toLowerCase().includes("quiz")
      ) {
        reply +=
          "High-yield topics for this session: Class definitions in Python, instantiation via constructors, and encapsulation.";
      } else {
        reply += `The speaker emphasizes that modular decomposition into objects makes large codebases vastly easier to test, refactor, and scale. Key takeaway: ${
          recording.summary.keyTakeaways[0] ||
          "model real-world entities directly."
        }`;
      }
      setChatMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    }, 600);
  };

  const flashcards =
    recording.summary.studyQuestions.length > 0
      ? recording.summary.studyQuestions
      : [
          {
            question:
              "What is the primary difference between a class and an object?",
            answer:
              "A class is a blueprint or template, while an object is a concrete instance allocated in memory.",
          },
          {
            question: "What does encapsulation accomplish?",
            answer:
              "It hides internal state behind public methods to prevent unauthorized mutations.",
          },
          {
            question: "How is a class instantiated in Python?",
            answer:
              "By calling the class name like a function (e.g. `car = Car()`), invoking `__init__`.",
          },
        ];

  const currentCard = flashcards[activeCardIndex % flashcards.length];

  return (
    <div
      className={`audiotap-panel rounded-[4px] p-3.5 relative flex flex-col justify-between select-none ${className}`}
    >
      {/* 4 Corner Chassis Screws */}
      <ScrewHead className="absolute top-2.5 left-2.5" rotation={35} />
      <ScrewHead className="absolute top-2.5 right-2.5" rotation={58} />
      <ScrewHead className="absolute bottom-2.5 left-2.5" rotation={12} />
      <ScrewHead className="absolute bottom-2.5 right-2.5" rotation={80} />

      {/* Top Tabs Bar */}
      <div className="flex items-center gap-1.5 px-2 mb-2.5 overflow-x-auto">
        {/* Transcript Tab */}
        <button
          type="button"
          onClick={() => setActiveTab("transcript")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-[3px] text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "transcript"
              ? "bg-[#eae3d5] border border-[#a89d8c] text-[#1b1916] shadow-[inset_0_1px_1px_rgba(255,255,255,0.95)]"
              : "text-[#544d41] hover:text-[#1b1916]"
          }`}
        >
          <FileText className="w-3.5 h-3.5 stroke-[1.8]" />
          <span>Transcript</span>
        </button>

        {/* Summary Tab */}
        <button
          type="button"
          onClick={() => setActiveTab("summary")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-[3px] text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "summary"
              ? "bg-[#eae3d5] border border-[#a89d8c] text-[#1b1916] shadow-[inset_0_1px_1px_rgba(255,255,255,0.95)]"
              : "text-[#544d41] hover:text-[#1b1916]"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 stroke-[1.8]" />
          <span>Summary</span>
        </button>

        {/* Flashcards Tab */}
        <button
          type="button"
          onClick={() => setActiveTab("flashcards")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-[3px] text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "flashcards"
              ? "bg-[#eae3d5] border border-[#a89d8c] text-[#1b1916] shadow-[inset_0_1px_1px_rgba(255,255,255,0.95)]"
              : "text-[#544d41] hover:text-[#1b1916]"
          }`}
        >
          <Layers className="w-3.5 h-3.5 stroke-[1.8]" />
          <span>Flashcards</span>
        </button>

        {/* AI Chat Tab */}
        <button
          type="button"
          onClick={() => setActiveTab("chat")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-[3px] text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "chat"
              ? "bg-[#eae3d5] border border-[#a89d8c] text-[#1b1916] shadow-[inset_0_1px_1px_rgba(255,255,255,0.95)]"
              : "text-[#544d41] hover:text-[#1b1916]"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 stroke-[1.8]" />
          <span>AI Chat</span>
        </button>

        {/* Notes Tab */}
        <button
          type="button"
          onClick={() => setActiveTab("notes")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-[3px] text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "notes"
              ? "bg-[#eae3d5] border border-[#a89d8c] text-[#1b1916] shadow-[inset_0_1px_1px_rgba(255,255,255,0.95)]"
              : "text-[#544d41] hover:text-[#1b1916]"
          }`}
        >
          <FileEdit className="w-3.5 h-3.5 stroke-[1.8]" />
          <span>Notes</span>
        </button>
      </div>

      {/* Split Inset Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-[305px]">
        {/* Left Column (lg:col-span-7): Recessed Dark Screen */}
        <div className="lg:col-span-7 rounded-[3px] bg-[#0c0d10] border border-[#23262c] shadow-[inset_0_4px_16px_rgba(0,0,0,0.99),_0_1px_0_rgba(255,255,255,0.7)] p-3 flex flex-col justify-between overflow-hidden relative">
          {/* Subtle CRT Phosphor Scanline Texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 2px)",
            }}
          />

          {/* VIEW: TRANSCRIPT */}
          {activeTab === "transcript" && (
            <>
              {/* Header inside screen */}
              <div className="flex items-center justify-between text-xs font-mono text-[#f5a623] border-b border-[#2d2518]/70 pb-1.5 mb-2 relative z-10">
                <span className="font-bold tracking-wider">Transcript</span>
                <span className="text-[9px] text-[#787063] tracking-widest uppercase">
                  Auto-generated
                </span>
              </div>

              {/* Scrollable Transcript Lines */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-[11px] leading-relaxed max-h-[220px] relative z-10">
                {recording.transcript.map((line) => {
                  const isCurrent =
                    currentTimeSeconds >= line.seconds &&
                    currentTimeSeconds < line.seconds + 45;

                  return (
                    <div
                      key={line.id}
                      onClick={() => onSeek(line.seconds)}
                      className={`flex items-start gap-2.5 p-1 rounded transition-colors cursor-pointer ${
                        isCurrent
                          ? "text-[#faf7ee] bg-[#1a1d22]"
                          : "text-[#c2bcad] hover:text-[#f5f2eb] hover:bg-[#14161a]"
                      }`}
                    >
                      <span className="text-[#f5a623] font-bold shrink-0 tabular-nums">
                        {line.timestamp}
                      </span>
                      <span className="text-[#dfa53b] font-bold shrink-0">
                        {line.speaker}:
                      </span>
                      <span className="flex-1 leading-normal">{line.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Playback Scrubber inside Screen matching target image */}
              <div className="pt-2 mt-2 border-t border-[#2d2518]/70 flex items-center gap-2.5 relative z-10 text-[10px] font-mono text-[#f5a623]">
                <span className="tabular-nums font-bold">
                  {formatTime(currentTimeSeconds)}
                </span>
                <div
                  className="flex-1 h-1.5 bg-[#1b1c20] rounded-full relative cursor-pointer border border-[#33373e]"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const percent = Math.max(
                      0,
                      Math.min(1, clickX / rect.width),
                    );
                    onSeek(Math.round(percent * totalSeconds));
                  }}
                >
                  <div
                    className="h-full bg-gradient-to-r from-[#d97706] to-[#f59e0b] rounded-full shadow-[0_0_6px_rgba(245,158,11,0.6)] relative"
                    style={{ width: `${progressPercent}%` }}
                  >
                    {/* Scrubbing thumb */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#fcd34d] shadow-[0_0_4px_#f59e0b]" />
                  </div>
                </div>
                <span className="tabular-nums text-[#7e7668]">
                  {formatTime(totalSeconds)}
                </span>
              </div>
            </>
          )}

          {/* VIEW: SUMMARY */}
          {activeTab === "summary" && (
            <div className="flex-1 overflow-y-auto space-y-2.5 font-mono text-xs leading-relaxed max-h-[260px] relative z-10 pr-1">
              <div className="flex items-center justify-between text-[#f5a623] border-b border-[#2d2518]/70 pb-1">
                <span className="font-bold">EXECUTIVE SUMMARY</span>
                <span className="text-[9px] text-[#787063]">
                  AI SYNTHESIZED
                </span>
              </div>
              <p className="text-[#d8d3c8] text-[11px] leading-relaxed">
                {recording.summary.overview}
              </p>
              <div className="pt-1">
                <span className="font-bold text-[#f5a623] text-[11px] block mb-1">
                  KEY TAKEAWAYS:
                </span>
                <ul className="space-y-1 pl-3 list-disc text-[#c9c4b8] text-[11px]">
                  {recording.summary.keyTakeaways.map((takeaway, i) => (
                    <li key={i}>{takeaway}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* VIEW: FLASHCARDS */}
          {activeTab === "flashcards" && (
            <div className="flex-1 flex flex-col justify-between relative z-10 font-mono">
              <div className="flex items-center justify-between text-xs text-[#f5a623] border-b border-[#2d2518]/70 pb-1">
                <span className="font-bold">
                  STUDY CARD {activeCardIndex + 1} OF {flashcards.length}
                </span>
                <span className="text-[9px] text-[#787063]">CLICK TO FLIP</span>
              </div>

              <div
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                className="my-3 flex-1 min-h-[140px] rounded-[3px] bg-[#141619] border border-[#2d3138] p-4 flex flex-col justify-center items-center text-center cursor-pointer transition-all hover:border-[#e5a93c]/50 shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)]"
              >
                <div className="text-[9px] text-[#8e8a82] mb-2 font-bold uppercase tracking-wider">
                  {isCardFlipped ? "ANSWER" : "QUESTION (TAP TO REVEAL)"}
                </div>
                <div className="text-[#f5f2eb] text-xs font-semibold leading-relaxed">
                  {isCardFlipped ? currentCard.answer : currentCard.question}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsCardFlipped(false);
                    setActiveCardIndex((prev) =>
                      prev > 0 ? prev - 1 : flashcards.length - 1,
                    );
                  }}
                  className="px-2.5 py-1 rounded bg-[#202328] hover:bg-[#2b2f36] text-[#e5a93c] text-[10px] font-bold border border-[#373c44] cursor-pointer"
                >
                  PREV
                </button>
                <button
                  type="button"
                  onClick={() => setIsCardFlipped(!isCardFlipped)}
                  className="px-3 py-1 rounded bg-[#f59e0b] hover:bg-[#fbbf24] text-[#141618] text-[10px] font-bold cursor-pointer"
                >
                  FLIP CARD
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCardFlipped(false);
                    setActiveCardIndex(
                      (prev) => (prev + 1) % flashcards.length,
                    );
                  }}
                  className="px-2.5 py-1 rounded bg-[#202328] hover:bg-[#2b2f36] text-[#e5a93c] text-[10px] font-bold border border-[#373c44] cursor-pointer"
                >
                  NEXT
                </button>
              </div>
            </div>
          )}

          {/* VIEW: AI CHAT */}
          {activeTab === "chat" && (
            <div className="flex-1 flex flex-col justify-between relative z-10 font-mono text-xs">
              <div className="flex items-center justify-between text-[#f5a623] border-b border-[#2d2518]/70 pb-1">
                <span className="font-bold">AI TUTOR CONSOLE</span>
                <span className="text-[9px] text-[#22c55e]">ONLINE</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 my-2 pr-1 max-h-[170px]">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-[2px] leading-relaxed text-[11px] ${
                      msg.role === "user"
                        ? "bg-[#22272e] text-[#f5f2eb] border border-[#343b44] ml-3"
                        : "bg-[#14181d] text-[#e5a93c] border border-[#282d34] mr-3"
                    }`}
                  >
                    <span className="font-bold block text-[8px] uppercase tracking-wider text-[#8a8375] mb-0.5">
                      {msg.role === "user" ? "YOU" : "AUDIOTAP AI"}
                    </span>
                    {msg.text}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="flex gap-1.5 pt-1">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a question about this lecture..."
                  className="flex-1 bg-[#14161a] border border-[#2b2f37] rounded px-2.5 py-1 text-xs text-[#f5f2eb] placeholder-[#6d685c] focus:outline-none focus:border-[#e5a93c]"
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-[#e5a93c] hover:bg-[#f5b04c] text-[#111316] text-xs font-bold rounded cursor-pointer"
                >
                  SEND
                </button>
              </form>
            </div>
          )}

          {/* VIEW: NOTES */}
          {activeTab === "notes" && (
            <div className="flex-1 flex flex-col justify-between relative z-10 font-mono text-xs">
              <div className="flex items-center justify-between text-[#f5a623] border-b border-[#2d2518]/70 pb-1 mb-2">
                <span className="font-bold">STUDY SCRATCHPAD</span>
                <span className="text-[9px] text-[#787063]">AUTO-SAVING</span>
              </div>
              <textarea
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                className="flex-1 w-full bg-[#14161a] border border-[#2b2f36] rounded p-2 text-xs font-mono text-[#dcd6c8] leading-relaxed focus:outline-none focus:border-[#e5a93c] resize-none min-h-[180px]"
                placeholder="Type your notes here..."
              />
            </div>
          )}
        </div>

        {/* Right Column (lg:col-span-5): "AI OUTPUTS" Action Cards */}
        <div className="lg:col-span-5 flex flex-col justify-between pl-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="audiotap-label text-[11px] font-extrabold text-[#38332b]">
              AI OUTPUTS
            </h3>
          </div>

          <div className="space-y-1.5 flex-1 flex flex-col justify-between">
            {/* Card 1: Summary */}
            <div
              onClick={() => setActiveTab("summary")}
              className="px-2.5 py-2 rounded-[3px] bg-[#dfd7ca]/50 hover:bg-[#eae3d5] border border-[#c9c1b2] shadow-[0_1px_1px_rgba(0,0,0,0.03)] flex items-center justify-between cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 flex items-center justify-center text-[#474135]">
                  <Sparkles className="w-4 h-4 stroke-[1.8]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1b1916]">
                    Summary
                  </div>
                  <div className="text-[10px] text-[#6d6658]">
                    Key points in simple terms
                  </div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#7a7364] group-hover:text-black" />
            </div>

            {/* Card 2: Flashcards */}
            <div
              onClick={() => setActiveTab("flashcards")}
              className="px-2.5 py-2 rounded-[3px] bg-[#dfd7ca]/50 hover:bg-[#eae3d5] border border-[#c9c1b2] shadow-[0_1px_1px_rgba(0,0,0,0.03)] flex items-center justify-between cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 flex items-center justify-center text-[#474135]">
                  <Layers className="w-4 h-4 stroke-[1.8]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1b1916]">
                    Flashcards
                  </div>
                  <div className="text-[10px] text-[#6d6658]">
                    Turn into study cards
                  </div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#7a7364] group-hover:text-black" />
            </div>

            {/* Card 3: Study Guide */}
            <div
              onClick={onOpenStudyGuide}
              className="px-2.5 py-2 rounded-[3px] bg-[#dfd7ca]/50 hover:bg-[#eae3d5] border border-[#c9c1b2] shadow-[0_1px_1px_rgba(0,0,0,0.03)] flex items-center justify-between cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 flex items-center justify-center text-[#474135]">
                  <BookOpen className="w-4 h-4 stroke-[1.8]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1b1916]">
                    Study Guide
                  </div>
                  <div className="text-[10px] text-[#6d6658]">
                    Topics, quiz & practice
                  </div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#7a7364] group-hover:text-black" />
            </div>

            {/* Card 4: Chat with AI */}
            <div
              onClick={() => setActiveTab("chat")}
              className="px-2.5 py-2 rounded-[3px] bg-[#dfd7ca]/50 hover:bg-[#eae3d5] border border-[#c9c1b2] shadow-[0_1px_1px_rgba(0,0,0,0.03)] flex items-center justify-between cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 flex items-center justify-center text-[#474135]">
                  <MessageSquare className="w-4 h-4 stroke-[1.8]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1b1916]">
                    Chat with AI
                  </div>
                  <div className="text-[10px] text-[#6d6658]">
                    Ask anything about this
                  </div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#7a7364] group-hover:text-black" />
            </div>

            {/* Card 5: Key Concepts */}
            <div
              onClick={() => setActiveTab("summary")}
              className="px-2.5 py-2 rounded-[3px] bg-[#dfd7ca]/50 hover:bg-[#eae3d5] border border-[#c9c1b2] shadow-[0_1px_1px_rgba(0,0,0,0.03)] flex items-center justify-between cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 flex items-center justify-center text-[#474135]">
                  <Lightbulb className="w-4 h-4 stroke-[1.8]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1b1916]">
                    Key Concepts
                  </div>
                  <div className="text-[10px] text-[#6d6658]">
                    Important terms & definitions
                  </div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#7a7364] group-hover:text-black" />
            </div>

            {/* Card 6: Mind Map */}
            <div
              onClick={onOpenMindMap}
              className="px-2.5 py-2 rounded-[3px] bg-[#dfd7ca]/50 hover:bg-[#eae3d5] border border-[#c9c1b2] shadow-[0_1px_1px_rgba(0,0,0,0.03)] flex items-center justify-between cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 flex items-center justify-center text-[#474135]">
                  <Network className="w-4 h-4 stroke-[1.8]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1b1916]">
                    Mind Map
                  </div>
                  <div className="text-[10px] text-[#6d6658]">
                    Visual overview
                  </div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#7a7364] group-hover:text-black" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
