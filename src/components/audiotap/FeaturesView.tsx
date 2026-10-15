"use client";

import React from "react";
import { ScrewHead } from "./ScrewHead";

export function FeaturesView() {
  const specs = [
    {
      label: "Transcription Accuracy",
      value: "99.2% (Dual Whisper V2 Neural Model)",
    },
    {
      label: "Audio Sampling Resolution",
      value: "24-bit / 48kHz & 96kHz Lossless PCM",
    },
    {
      label: "DSP Noise Reduction",
      value: "Active Adaptive Spectral Subtraction (-24dB noise floor)",
    },
    {
      label: "Voice Frequency Enhancer",
      value: "3-Band Harmonic Exciter (300Hz - 3.4kHz vocal boost)",
    },
    {
      label: "Equalizer Frequency Spectrum",
      value: "52-Band Real-Time Fast Fourier Transform (FFT)",
    },
    {
      label: "VU Meter Ballistics",
      value: "ANSI C16.5 Standard (300ms rise time, 1.5% overshoot)",
    },
    {
      label: "AI Study Synthesizer",
      value: "Direct Context Extraction: Summaries, Flashcards, Mind Maps",
    },
    {
      label: "Cassette Transport",
      value: "Precision Micro-Stepped High-Bias Chrome Emulation",
    },
  ];

  return (
    <div className="audiotap-panel rounded-[3px] p-6 relative flex flex-col select-none">
      {/* 4 Corner Screws */}
      <ScrewHead className="absolute top-2 left-2" rotation={20} />
      <ScrewHead className="absolute top-2 right-2" rotation={50} />
      <ScrewHead className="absolute bottom-2 left-2" rotation={75} />
      <ScrewHead className="absolute bottom-2 right-2" rotation={12} />

      {/* Header */}
      <div className="pb-4 border-b border-[#baa791]">
        <h2 className="audiotap-label text-sm text-[#22201c] font-black">
          AUDIOTAP MODEL AT-480 // TECHNICAL SPECIFICATIONS & HARDWARE
          ARCHITECTURE
        </h2>
        <p className="text-xs text-[#6e685c] mt-1">
          Precision analog ergonomics paired with next-generation neural speech
          intelligence.
        </p>
      </div>

      {/* Feature Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
        {/* Module 1: Spectral Display */}
        <div className="rounded-[3px] bg-[#101215] border border-[#2b2f36] p-4 text-[#f5f2eb] shadow-[inset_0_3px_8px_rgba(0,0,0,0.9)]">
          <div className="text-[10px] font-mono font-bold text-[#f59e0b] tracking-widest uppercase mb-1">
            MODULE 01 // SPECTRAL VISUALIZATION
          </div>
          <h3 className="text-sm font-bold text-white mb-2">
            52-Band Real-Time VFD Spectrograph
          </h3>
          <p className="text-xs text-[#a8a396] leading-relaxed font-mono">
            Direct Fast Fourier Transform (FFT) analysis maps speech formants in
            real-time onto an amber vacuum-fluorescent display array, revealing
            acoustic clarity and vocal resonance.
          </p>
        </div>

        {/* Module 2: Cassette Deck */}
        <div className="rounded-[3px] bg-[#101215] border border-[#2b2f36] p-4 text-[#f5f2eb] shadow-[inset_0_3px_8px_rgba(0,0,0,0.9)]">
          <div className="text-[10px] font-mono font-bold text-[#f59e0b] tracking-widest uppercase mb-1">
            MODULE 02 // TAPE TRANSPORT
          </div>
          <h3 className="text-sm font-bold text-white mb-2">
            Dual-Reel Magnetic Cassette Emulation
          </h3>
          <p className="text-xs text-[#a8a396] leading-relaxed font-mono">
            Synchronized reel mechanics, auto-stop detection, and realistic tape
            heads offer tactile spatial awareness for audio lecture archives
            with full backward and forward seek.
          </p>
        </div>

        {/* Module 3: Dual VU Meters */}
        <div className="rounded-[3px] bg-[#101215] border border-[#2b2f36] p-4 text-[#f5f2eb] shadow-[inset_0_3px_8px_rgba(0,0,0,0.9)]">
          <div className="text-[10px] font-mono font-bold text-[#f59e0b] tracking-widest uppercase mb-1">
            MODULE 03 // ANALOG GAIN STAGING
          </div>
          <h3 className="text-sm font-bold text-white mb-2">
            Calibrated Dual Analog VU Meters
          </h3>
          <p className="text-xs text-[#a8a396] leading-relaxed font-mono">
            Backlit curved scale dials calibrated from -20dB to +3dB monitor
            left and right audio channels with realistic physical needle inertia
            and peak distortion warnings.
          </p>
        </div>

        {/* Module 4: Neural Study Hub */}
        <div className="rounded-[3px] bg-[#101215] border border-[#2b2f36] p-4 text-[#f5f2eb] shadow-[inset_0_3px_8px_rgba(0,0,0,0.9)]">
          <div className="text-[10px] font-mono font-bold text-[#f59e0b] tracking-widest uppercase mb-1">
            MODULE 04 // AI STUDY SYNTHESIS
          </div>
          <h3 className="text-sm font-bold text-white mb-2">
            Autonomous Study Material Generation
          </h3>
          <p className="text-xs text-[#a8a396] leading-relaxed font-mono">
            Instantly transforms spoken lectures into searchable timestamped
            transcripts, bulleted executive summaries, interactive study
            flashcards, and conceptual mind maps.
          </p>
        </div>
      </div>

      {/* Technical Spec Sheet Table */}
      <div className="pt-4 border-t border-[#baa791]">
        <h4 className="audiotap-label text-xs text-[#3b362c] mb-3">
          ENGINEERING SPECIFICATION MATRIX
        </h4>
        <div className="rounded-[3px] border border-[#b8af9e] overflow-hidden">
          <table className="w-full text-left text-xs font-mono">
            <tbody>
              {specs.map((s, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-[#c8bea9] ${
                    idx % 2 === 0 ? "bg-[#eae3d5]" : "bg-[#ded6c7]"
                  }`}
                >
                  <td className="py-2 px-3 font-bold text-[#2d2a24] w-1/3">
                    {s.label}
                  </td>
                  <td className="py-2 px-3 text-[#524b3f]">{s.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
