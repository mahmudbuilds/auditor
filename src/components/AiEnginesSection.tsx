"use client";

import Image from "next/image";
import React from "react";

export function AiEnginesSection() {
  return (
    <section
      id="engines"
      className="w-full py-16 md:py-24 border-b border-white/[0.06]"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Framed Photo with Vintage Tape */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="tape-top">
                <div className="rounded-sm border border-white/[0.12] bg-[#1e2227] p-2 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xs bg-[#14171a]">
                    <Image
                      src="/images/family.jpg"
                      alt="Three generations gathered around an Italian kitchen table preparing fresh pasta"
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 360px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14171a]/50 via-transparent to-transparent pointer-events-none" />
                  </div>
                  <div className="mt-2.5 px-1 pb-1 flex justify-between text-[11px] text-[#8e959e] font-editorial italic">
                    <span>
                      Fig. 3 — Three generations of craft &amp; collective labor
                    </span>
                    <span className="font-telemetry text-[10px] not-italic text-[#a2a8b0]">
                      TABLE #01
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Three AI Engines Breakdown */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h2 className="font-roman text-2xl sm:text-3xl tracking-[0.16em] text-[#f4f1eb]">
              THREE ENGINES, <br />
              ONE WORKSPACE
            </h2>
            <p className="font-editorial italic text-base text-[#8e959e] mt-2 mb-8">
              Three specialized neural pipelines collaborate in real-time as the
              lecture unfolds.
            </p>

            <div className="space-y-6">
              {/* Engine 1 */}
              <div className="border-l-2 border-[#e5a93c]/50 pl-4 transition-colors hover:border-[#e5a93c]">
                <div className="font-roman text-xs tracking-wider text-[#e5a93c] mb-1">
                  01 / ACOUSTIC BEAMFORMING &amp; PHONETIC DIARIZATION
                </div>
                <p className="font-editorial text-sm sm:text-base text-[#9da4ad] leading-relaxed">
                  Isolates the professor’s primary vocal band from auditorium
                  reverberation, air conditioning rumble, and student coughing.
                  Labels distinct voices with millisecond timestamps and
                  phonetic confidence metrics.
                </p>
              </div>

              {/* Engine 2 */}
              <div className="border-l-2 border-white/[0.15] pl-4 transition-colors hover:border-[#e5a93c]">
                <div className="font-roman text-xs tracking-wider text-[#f4f1eb] mb-1">
                  02 / SOCRATIC SYNTHESIS &amp; EXAM COMPILER
                </div>
                <p className="font-editorial text-sm sm:text-base text-[#9da4ad] leading-relaxed">
                  Extracts raw verbal rambling into structured academic
                  architecture: core theses, axiomatic premises, proof steps in
                  LaTeX, and potential exam traps highlighted by the lecturer.
                </p>
              </div>

              {/* Engine 3 */}
              <div className="border-l-2 border-white/[0.15] pl-4 transition-colors hover:border-[#e5a93c]">
                <div className="font-roman text-xs tracking-wider text-[#f4f1eb] mb-1">
                  03 / GROUNDED SEMANTIC RETRIEVAL (ZERO HALLUCINATION)
                </div>
                <p className="font-editorial text-sm sm:text-base text-[#9da4ad] leading-relaxed">
                  Vectorizes the spoken audio down to exact phrases. When you
                  ask a question, answers are synthesized exclusively from the
                  audio record, with direct audio click-to-play citations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
