"use client";

import React, { useState } from "react";

interface AuditConsoleSectionProps {
  onStartRecordWithDetails: (
    title: string,
    speaker: string,
    mode: string,
  ) => void;
}

export function AuditConsoleSection({
  onStartRecordWithDetails,
}: AuditConsoleSectionProps) {
  const [sessionTitle, setSessionTitle] = useState("");
  const [speakerName, setSpeakerName] = useState("");
  const [synthesisMode, setSynthesisMode] = useState("academic");
  const [audioInputDevice, setAudioInputDevice] = useState("built-in");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = sessionTitle.trim() || "Spontaneous Lecture Capture";
    const speaker = speakerName.trim() || "Guest Lecturer";
    onStartRecordWithDetails(title, speaker, synthesisMode);
  };

  return (
    <section
      id="audit-console"
      className="w-full py-16 md:py-24 border-b border-white/[0.06]"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Editorial Prompt */}
          <div className="lg:col-span-5">
            <h2 className="font-roman text-2xl sm:text-3xl tracking-[0.16em] text-[#f4f1eb]">
              START AN AUDIT
            </h2>
            <div className="mt-4 space-y-3 font-editorial text-base text-[#9da4ad] leading-relaxed">
              <p>
                Have an imminent seminar or symposium? Configure the parameters
                below and initialize the ambient listening array.
              </p>
              <p>
                Auditor will adjust frequency filtering, calibrate room
                acoustics, and begin streaming transcription the moment speech
                is detected.
              </p>
            </div>
            <div className="mt-8 font-telemetry text-xs text-[#e5a93c]">
              LOCAL RECORDING BUFFER: ENCRYPTED · ZERO TELEMETRY LEAK
            </div>
          </div>

          {/* Right Column: Capture Console Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="rounded-sm border border-white/[0.1] bg-[#1a1d22] p-6 sm:p-8 space-y-5 shadow-[0_12px_36px_rgba(0,0,0,0.5)]"
            >
              {/* Session Title */}
              <div>
                <label className="block font-roman text-xs tracking-wider text-[#b8bdc5] mb-1.5">
                  SESSION TITLE / SUBJECT
                </label>
                <input
                  type="text"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  placeholder="e.g. Advanced Topology & Knot Invariants"
                  className="w-full rounded border border-white/[0.1] bg-[#14171a] px-3.5 py-2.5 text-sm text-[#f4f1eb] placeholder-[#5f6670] focus:border-[#e5a93c] focus:outline-none font-editorial transition-colors"
                />
              </div>

              {/* Speaker / Professor */}
              <div>
                <label className="block font-roman text-xs tracking-wider text-[#b8bdc5] mb-1.5">
                  LECTURER OR SYMPOSIUM LEAD
                </label>
                <input
                  type="text"
                  value={speakerName}
                  onChange={(e) => setSpeakerName(e.target.value)}
                  placeholder="e.g. Prof. Vance or Dr. Sterling"
                  className="w-full rounded border border-white/[0.1] bg-[#14171a] px-3.5 py-2.5 text-sm text-[#f4f1eb] placeholder-[#5f6670] focus:border-[#e5a93c] focus:outline-none font-editorial transition-colors"
                />
              </div>

              {/* Grid: Audio Source & AI Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-roman text-xs tracking-wider text-[#b8bdc5] mb-1.5">
                    AUDIO INPUT SOURCE
                  </label>
                  <select
                    value={audioInputDevice}
                    onChange={(e) => setAudioInputDevice(e.target.value)}
                    className="w-full rounded border border-white/[0.1] bg-[#14171a] px-3 py-2 text-xs text-[#f4f1eb] focus:border-[#e5a93c] focus:outline-none font-editorial transition-colors"
                  >
                    <option value="built-in">
                      Built-in Studio Beamforming Array
                    </option>
                    <option value="external-usb">
                      External USB Microphone
                    </option>
                    <option value="bluetooth">Bluetooth Lapel Mic</option>
                    <option value="simulated">
                      Simulated Acoustic Stream (Demo)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-roman text-xs tracking-wider text-[#b8bdc5] mb-1.5">
                    AI SYNTHESIS PROFILE
                  </label>
                  <select
                    value={synthesisMode}
                    onChange={(e) => setSynthesisMode(e.target.value)}
                    className="w-full rounded border border-white/[0.1] bg-[#14171a] px-3 py-2 text-xs text-[#f4f1eb] focus:border-[#e5a93c] focus:outline-none font-editorial transition-colors"
                  >
                    <option value="academic">
                      Academic Outline &amp; LaTeX
                    </option>
                    <option value="exam-prep">
                      Socratic Exam Prep &amp; Traps
                    </option>
                    <option value="executive">
                      Executive 3-Minute Distillation
                    </option>
                  </select>
                </div>
              </div>

              {/* Submit Golden Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded bg-[#e5a93c] py-3.5 px-6 text-xs font-bold uppercase tracking-[0.16em] text-[#14171a] hover:bg-[#f3b74b] transition-all transform active:scale-[0.99] shadow-[0_4px_20px_rgba(229,169,60,0.3)] flex items-center justify-center gap-2"
                >
                  <span className="h-2 w-2 rounded-full bg-[#14171a] animate-pulse" />
                  <span>Begin Live Recording Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
