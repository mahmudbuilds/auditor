"use client";

import Image from "next/image";
import React from "react";

interface HeroSectionProps {
  onStartRecord: () => void;
  onExploreSessions: () => void;
}

export function HeroSection({
  onStartRecord,
  onExploreSessions,
}: HeroSectionProps) {
  return (
    <section className="relative w-full pt-12 pb-16 md:pt-20 md:pb-24 border-b border-white/[0.06]">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          {/* Left Column: Editorial Copy */}
          <div className="lg:col-span-7 flex flex-col justify-center pt-2">
            {/* Expressive Script Headline */}
            <div className="mb-6 space-y-1">
              <h1 className="font-script text-4xl sm:text-5xl md:text-6xl text-[#f4f1eb] leading-[1.15] font-normal tracking-wide">
                Auditorium 7 has the <br className="hidden sm:inline" />
                best theories.
              </h1>
              <p className="font-script text-4xl sm:text-5xl md:text-6xl text-[#e5a93c] leading-[1.15] font-semibold tracking-wide">
                Record it early.
              </p>
            </div>

            {/* Subtitle */}
            <p className="font-editorial italic text-xl sm:text-2xl text-[#d8d4cc] mb-6 font-light">
              Auditor — Ambient lecture intelligence & effortless voice
              transcription.
            </p>

            {/* Narrative Body Copy */}
            <div className="space-y-4 text-base sm:text-lg text-[#9da4ad] font-editorial leading-relaxed max-w-xl">
              <p>
                Walk into the amphitheater, place your phone on the desk, and
                tap record. You never have to scramble to take manual notes
                again.
              </p>
              <p>
                Auditor captures every nuance with studio fidelity, isolates the
                speaker’s voice, and streams the transcript live. It extracts
                key theorems, creates structured AI summaries, and answers
                questions grounded strictly in what was spoken.
              </p>
            </div>

            {/* CTA Group */}
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <button
                type="button"
                onClick={onStartRecord}
                className="inline-flex items-center gap-2.5 rounded bg-[#e5a93c] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[#14171a] shadow-[0_4px_20px_rgba(229,169,60,0.3)] hover:bg-[#f3b74b] hover:shadow-[0_6px_24px_rgba(229,169,60,0.4)] transition-all transform active:scale-[0.98]"
              >
                <span className="h-2 w-2 rounded-full bg-[#14171a] animate-pulse" />
                <span>Start Live Capture</span>
              </button>

              <button
                type="button"
                onClick={onExploreSessions}
                className="group inline-flex items-center gap-2 text-sm text-[#e8e4dc] hover:text-[#e5a93c] transition-colors py-2"
              >
                <span className="font-editorial italic border-b border-[#e5a93c]/40 group-hover:border-[#e5a93c]">
                  Browse 14 Archived Sessions
                </span>
                <span className="text-[#e5a93c] transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>

            {/* Micro Specs */}
            <div className="mt-10 flex items-center gap-6 border-t border-white/[0.08] pt-6 text-xs text-[#828892] font-telemetry">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e5a93c]" />
                <span>Zero Latency Speech-to-Text</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e5a93c]" />
                <span>Grounded AI Synthesis</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e5a93c]" />
                <span>Local-First Resilience</span>
              </div>
            </div>
          </div>

          {/* Right Column: Framed Archival Photograph Card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-md">
              {/* Subtle vintage tape at top */}
              <div className="tape-top">
                <div className="overflow-hidden rounded-sm border border-white/[0.12] bg-[#1e2227] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xs bg-[#14171a]">
                    <Image
                      src="/images/hero.jpg"
                      alt="Auditorium VII amphitheater perched above the Mediterranean sea"
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      priority
                      sizes="(max-width: 768px) 100vw, 420px"
                    />

                    {/* Subtle warm vignette overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14171a]/80 via-transparent to-black/20 pointer-events-none" />

                    {/* Badge over photo */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded bg-[#181b1f]/85 px-3 py-2 backdrop-blur-md border border-white/10 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#e5a93c] animate-pulse" />
                        <span className="font-telemetry text-[11px] text-[#f4f1eb]">
                          LIVE ACOUSTIC MATRIX
                        </span>
                      </div>
                      <span className="font-telemetry text-[10px] text-[#e5a93c]">
                        48kHz / 99.4% ACC
                      </span>
                    </div>
                  </div>

                  {/* Photo Caption */}
                  <div className="mt-3 px-1 pb-1 flex items-center justify-between text-[11px] text-[#8e959e] font-editorial italic">
                    <span>Fig. 1 — Auditorium VII amphitheater acoustics</span>
                    <span className="font-telemetry text-[10px] not-italic text-[#b3b8c0]">
                      REF #AUD-007
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
