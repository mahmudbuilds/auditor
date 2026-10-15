"use client";

import Image from "next/image";
import React from "react";

export function PhilosophySection() {
  return (
    <section className="w-full py-16 md:py-24 border-b border-white/[0.06]">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Framed Archival Photograph */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="rounded-sm border border-white/[0.12] bg-[#1e2227] p-2 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xs bg-[#14171a]">
                  <Image
                    src="/images/doorway.jpg"
                    alt="Rustic academic library stone entrance with potted lemon trees"
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 360px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14171a]/60 via-transparent to-transparent pointer-events-none" />
                </div>
                <div className="mt-2.5 px-1 pb-1 flex justify-between text-[11px] text-[#8e959e] font-editorial italic">
                  <span>Library threshold &amp; acoustic study courtyard</span>
                  <span className="font-telemetry text-[10px] not-italic text-[#a2a8b0]">
                    EST. 2026
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Philosophy */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h2 className="font-roman text-2xl sm:text-3xl tracking-[0.16em] text-[#f4f1eb] leading-tight">
              A SANCTUARY, <br />
              NOT JUST A RECORDER
            </h2>

            <div className="mt-6 space-y-4 text-base sm:text-lg text-[#9da4ad] font-editorial leading-relaxed">
              <p>
                Manual note-taking is an act of neurological division. While
                your fingers struggle to write down the last sentence, your mind
                misses the critical transition into the next axiom.
              </p>
              <p>
                Auditor operates as a silent academic fellow sitting in the
                second row. It listens with studio-grade spatial clarity,
                isolates the professor’s thesis from the rustle of papers, and
                commits the entire lecture into an indelible, searchable
                knowledge bank.
              </p>
              <p>
                You walk away with every word preserved, every diagram
                transcribed into LaTeX, and full AI synthesis ready before you
                even exit the hall.
              </p>
            </div>

            {/* Bullets with Amber Accent */}
            <div className="mt-8 space-y-3 font-editorial text-sm sm:text-base border-t border-white/[0.08] pt-6">
              <div className="flex items-center gap-3 text-[#e6e2da]">
                <span className="text-[#e5a93c] text-lg leading-none">•</span>
                <span>
                  Zero-Latency Speech-to-Text with instant keyword indexing
                </span>
              </div>
              <div className="flex items-center gap-3 text-[#e6e2da]">
                <span className="text-[#e5a93c] text-lg leading-none">•</span>
                <span>
                  Strictly Grounded AI that cites exact timestamps without
                  hallucination
                </span>
              </div>
              <div className="flex items-center gap-3 text-[#e6e2da]">
                <span className="text-[#e5a93c] text-lg leading-none">•</span>
                <span>
                  Direct export to Markdown, Obsidian, LaTeX and Anki decks
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
