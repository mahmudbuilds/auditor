"use client";

import Image from "next/image";
import React, { useState } from "react";

interface KnowledgeTrailSectionProps {
  onSelectNodeTimestamp?: (seconds: number) => void;
}

export function KnowledgeTrailSection({
  onSelectNodeTimestamp,
}: KnowledgeTrailSectionProps) {
  const [activeNode, setActiveNode] = useState(2);

  const trailNodes = [
    {
      id: 0,
      step: "01",
      timestamp: "00:00",
      seconds: 0,
      title: "Opening Axioms & The Two-Stage Model",
      description:
        "Why single-trace memory stores suffer catastrophic forgetting.",
    },
    {
      id: 1,
      step: "48",
      timestamp: "14:22",
      seconds: 862,
      title: "Hippocampal Scratchpad Dynamics",
      description:
        "Rapid synaptic plasticity and high-capacity temporary encoding.",
    },
    {
      id: 2,
      step: "112",
      timestamp: "28:45",
      seconds: 1725,
      title: "Sharp-Wave Ripples & Non-REM Replay",
      description:
        "Time-compressed replay during slow-wave sleep gates external sensory noise.",
    },
    {
      id: 3,
      step: "174",
      timestamp: "44:12",
      seconds: 2652,
      title: "Neocortical Distribution & Independence",
      description:
        "Slow progressive remodeling of cortical connections over months.",
    },
    {
      id: 4,
      step: "212",
      timestamp: "58:40",
      seconds: 3520,
      title: "Cove of Synthesis: Clinical Paradigms",
      description:
        "Patient H.M., retrograde amnesia gradients, and open research questions.",
    },
  ];

  return (
    <section
      id="trail"
      className="w-full py-16 md:py-24 border-b border-white/[0.06]"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="mb-12">
          <h2 className="font-roman text-2xl sm:text-3xl tracking-[0.16em] text-[#f4f1eb]">
            212 STEPS DOWN TO THE ARCHIVE
          </h2>
          <p className="font-editorial italic text-base text-[#8e959e] mt-2 max-w-2xl">
            A winding intellectual descent: follow the progression of the
            lecture as it moves from introductory axioms down to deep empirical
            discovery.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left/Center Column: Winding Trail Diagram */}
          <div className="lg:col-span-7">
            <div className="rounded-sm border border-white/[0.08] bg-[#16181d] p-6 sm:p-8">
              {/* Zigzag SVG Trail Diagram */}
              <div className="relative">
                {/* Visual SVG Zigzag Path */}
                <div className="space-y-6 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-[#e5a93c] before:via-[#e5a93c]/50 before:to-[#e5a93c]">
                  {trailNodes.map((node) => {
                    const isSelected = activeNode === node.id;
                    return (
                      <div
                        key={node.id}
                        onClick={() => {
                          setActiveNode(node.id);
                          if (onSelectNodeTimestamp) {
                            onSelectNodeTimestamp(node.seconds);
                          }
                        }}
                        className={`relative flex items-start gap-4 p-3.5 rounded transition-all cursor-pointer group ${
                          isSelected
                            ? "bg-[#22272f] border-l-2 border-[#e5a93c] translate-x-1"
                            : "hover:bg-white/[0.03]"
                        }`}
                      >
                        {/* Waypoint Marker Pin */}
                        <div
                          className={`z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-telemetry transition-all ${
                            isSelected
                              ? "bg-[#e5a93c] text-[#14171a] border-[#e5a93c] font-bold shadow-[0_0_12px_rgba(229,169,60,0.5)] scale-110"
                              : "bg-[#181b1f] text-[#8e959e] border-white/20 group-hover:border-[#e5a93c]"
                          }`}
                        >
                          {node.step}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span
                              className={`font-roman text-xs tracking-wider ${
                                isSelected
                                  ? "text-[#f4f1eb] font-semibold"
                                  : "text-[#b8bdc5]"
                              }`}
                            >
                              {node.title}
                            </span>
                            <span className="font-telemetry text-[11px] text-[#e5a93c]">
                              [{node.timestamp}]
                            </span>
                          </div>
                          <p className="font-editorial text-xs sm:text-sm text-[#8e959e] leading-relaxed">
                            {node.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Trail Legend / Caption */}
              <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#8e959e] font-editorial italic">
                <span>Click any step marker to cue audio &amp; transcript</span>
                <span className="font-telemetry text-[11px] not-italic text-[#e5a93c]">
                  STEP 212 / 212 REACHED
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Framed Crystal Cove Photo */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="tape-top">
                <div className="rounded-sm border border-white/[0.12] bg-[#1e2227] p-2 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xs bg-[#14171a]">
                    <Image
                      src="/images/cove.jpg"
                      alt="Crystalline turquoise cove and limestone cliffs at the bottom of 212 steps"
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 360px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14171a]/50 via-transparent to-transparent pointer-events-none" />
                  </div>
                  <div className="mt-2.5 px-1 pb-1 flex justify-between text-[11px] text-[#8e959e] font-editorial italic">
                    <span>
                      Fig. 5 — Cala della Conoscenza · Emerald waters below
                    </span>
                    <span className="font-telemetry text-[10px] not-italic text-[#a2a8b0]">
                      212 STEPS
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
