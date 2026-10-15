"use client";

import Image from "next/image";
import React, { useState } from "react";

export function EveningAnalysisSection() {
  const [activeQuizModal, setActiveQuizModal] = useState(false);

  return (
    <section className="w-full py-16 md:py-24 border-b border-white/[0.06]">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Framed Candlelit Evening Photo with Tape */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="tape-top">
                <div className="rounded-sm border border-white/[0.12] bg-[#1e2227] p-2 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xs bg-[#14171a]">
                    <Image
                      src="/images/dinner.jpg"
                      alt="Candlelit wooden table on a stone terrace overlooking the sea at dusk"
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 360px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14171a]/50 via-transparent to-transparent pointer-events-none" />
                  </div>
                  <div className="mt-2.5 px-1 pb-1 flex justify-between text-[11px] text-[#8e959e] font-editorial italic">
                    <span>
                      Fig. 4 — Evening study table at dusk over the Amalfi cliff
                    </span>
                    <span className="font-telemetry text-[10px] not-italic text-[#a2a8b0]">
                      20:00 GMT
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Menu-Style Evening Synthesis */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h2 className="font-roman text-2xl sm:text-3xl tracking-[0.16em] text-[#f4f1eb]">
              ANALYSIS AT EIGHT
            </h2>
            <p className="font-editorial italic text-base text-[#8e959e] mt-2 mb-6">
              When the lectures conclude and dinner settles, Auditor delivers
              the evening study brief.
            </p>

            {/* Menu-style card */}
            <div className="rounded border border-white/[0.08] bg-[#16181d] p-6 space-y-4">
              <div className="flex items-baseline justify-between border-b border-white/[0.06] pb-2">
                <span className="font-roman text-xs tracking-wider text-[#e5a93c]">
                  I. THE EXECUTIVE BRIEF
                </span>
                <span className="font-telemetry text-[10px] text-[#8e959e]">
                  3 MIN READ
                </span>
              </div>
              <p className="font-editorial text-xs sm:text-sm text-[#9da4ad]">
                A rigorous 500-word synthesis of today’s lecture arguments,
                eliminating digressions and preserving high-density theorems.
              </p>

              <div className="flex items-baseline justify-between border-b border-white/[0.06] pb-2 pt-2">
                <span className="font-roman text-xs tracking-wider text-[#e5a93c]">
                  II. THE SOCRATIC TEST
                </span>
                <span className="font-telemetry text-[10px] text-[#8e959e]">
                  10 QUESTIONS
                </span>
              </div>
              <p className="font-editorial text-xs sm:text-sm text-[#9da4ad]">
                Adaptive questions constructed from the professor’s emphasis
                traps, designed to expose hidden gaps before the midterm.
              </p>

              <div className="flex items-baseline justify-between border-b border-white/[0.06] pb-2 pt-2">
                <span className="font-roman text-xs tracking-wider text-[#e5a93c]">
                  III. FLASHCARDS &amp; LATEX EXPORT
                </span>
                <span className="font-telemetry text-[10px] text-[#8e959e]">
                  READY TO SYNC
                </span>
              </div>
              <p className="font-editorial text-xs sm:text-sm text-[#9da4ad]">
                Algorithmic extraction of definitions, formulas, and diagrams
                formatted for direct import into Anki and Obsidian.
              </p>
            </div>

            {/* Interactive Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveQuizModal(true)}
                className="rounded bg-[#e5a93c] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#14171a] hover:bg-[#f3b74b] transition-colors"
              >
                Launch Evening Quiz
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(
                    "Obsidian export generated: All 14 sessions saved with YAML frontmatter, backlinks, and audio anchors.",
                  );
                }}
                className="rounded border border-white/[0.12] bg-[#1a1d22] px-4 py-2.5 text-xs font-roman tracking-wider text-[#f4f1eb] hover:bg-white/[0.06] transition-colors"
              >
                Sync with Obsidian
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {activeQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-sm border border-white/[0.12] bg-[#1a1d22] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <span className="font-roman text-xs tracking-widest text-[#e5a93c]">
                EVENING SOCRATIC QUIZ · SESSION #07
              </span>
              <button
                type="button"
                onClick={() => setActiveQuizModal(false)}
                className="text-[#8e959e] hover:text-[#f4f1eb] text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm font-editorial">
              <div className="rounded bg-[#14171a] p-3 border border-white/[0.06]">
                <p className="text-[#f4f1eb] font-semibold mb-2">
                  Question 1: Why does hippocampal damage spare remote memories
                  formed decades ago?
                </p>
                <div className="space-y-1.5 text-xs text-[#b8bdc5]">
                  <label className="flex items-center gap-2 p-1.5 rounded hover:bg-white/[0.04] cursor-pointer">
                    <input
                      type="radio"
                      name="q1"
                      className="accent-[#e5a93c]"
                    />
                    <span>
                      A) Hippocampus regenerates neurons every 7 years
                    </span>
                  </label>
                  <label className="flex items-center gap-2 p-1.5 rounded hover:bg-white/[0.04] cursor-pointer">
                    <input
                      type="radio"
                      name="q1"
                      className="accent-[#e5a93c]"
                    />
                    <span>
                      B) Memories undergo systems consolidation, transferring to
                      distributed neocortex
                    </span>
                  </label>
                  <label className="flex items-center gap-2 p-1.5 rounded hover:bg-white/[0.04] cursor-pointer">
                    <input
                      type="radio"
                      name="q1"
                      className="accent-[#e5a93c]"
                    />
                    <span>
                      C) Sensory receptors bypass the temporal lobe entirely
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setActiveQuizModal(false)}
                className="px-4 py-2 text-xs font-roman rounded bg-[#e5a93c] text-[#14171a] font-bold"
              >
                Submit Answers
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
