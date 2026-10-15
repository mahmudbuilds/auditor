"use client";

import React, { useState } from "react";
import { ScrewHead } from "./ScrewHead";

export function SettingsView() {
  const [inputDevice, setInputDevice] = useState(
    "Studio Microphone (Default USB)",
  );
  const [sampleRate, setSampleRate] = useState("48000");
  const [modelEngine, setModelEngine] = useState("whisper-pro");
  const [preampMode, setPreampMode] = useState("warm-analog");
  const [glowBrightness, setGlowBrightness] = useState(85);
  const [needleSensitivity, setNeedleSensitivity] = useState(70);
  const [saveToast, setSaveToast] = useState(false);

  const handleSave = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="audiotap-panel rounded-[3px] p-6 relative flex flex-col select-none">
      {/* 4 Corner Screws */}
      <ScrewHead className="absolute top-2 left-2" rotation={30} />
      <ScrewHead className="absolute top-2 right-2" rotation={60} />
      <ScrewHead className="absolute bottom-2 left-2" rotation={85} />
      <ScrewHead className="absolute bottom-2 right-2" rotation={15} />

      {/* Header */}
      <div className="pb-4 border-b border-[#baa791] flex items-center justify-between">
        <div>
          <h2 className="audiotap-label text-sm text-[#22201c] font-black">
            HARDWARE CALIBRATION & PREFERENCES CONSOLE
          </h2>
          <p className="text-xs text-[#6e685c] mt-0.5">
            Configure DSP audio routing, neural model parameters, and optical
            display settings.
          </p>
        </div>

        {saveToast && (
          <span className="text-xs font-mono font-bold text-[#166534] bg-[#bbf7d0] px-3 py-1 rounded-[2px] border border-[#86efac]">
            ✓ CALIBRATION STORED
          </span>
        )}
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-5">
        {/* Card 1: Audio Input & Routing */}
        <div className="p-4 rounded-[3px] bg-[#dfd7ca]/50 border border-[#baa791] space-y-3">
          <h3 className="audiotap-label text-xs text-[#302c25]">
            1. AUDIO CAPTURE & CONVERSION
          </h3>

          <div>
            <label className="block text-[11px] font-bold text-[#554e42] mb-1">
              PRIMARY INPUT DEVICE
            </label>
            <select
              value={inputDevice}
              onChange={(e) => setInputDevice(e.target.value)}
              className="w-full bg-[#181a1d] text-[#f5f2eb] border border-[#3e4249] rounded-[3px] p-2 text-xs font-mono focus:outline-none focus:border-[#e5a93c]"
            >
              <option value="Studio Microphone (Default USB)">
                Studio Microphone (Default USB)
              </option>
              <option value="Built-in Laptop Array">
                Built-in Microphone Array
              </option>
              <option value="System Audio Loopback">
                System Audio Loopback (Direct Stream)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#554e42] mb-1">
              SAMPLING RATE & DEPTH
            </label>
            <select
              value={sampleRate}
              onChange={(e) => setSampleRate(e.target.value)}
              className="w-full bg-[#181a1d] text-[#f5f2eb] border border-[#3e4249] rounded-[3px] p-2 text-xs font-mono focus:outline-none focus:border-[#e5a93c]"
            >
              <option value="48000">48.0 kHz / 24-bit Lossless Studio</option>
              <option value="96000">
                96.0 kHz / 32-bit Float High-Resolution
              </option>
              <option value="44100">44.1 kHz / 16-bit Standard Audio CD</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#554e42] mb-1">
              ANALOG PREAMP PROFILING
            </label>
            <select
              value={preampMode}
              onChange={(e) => setPreampMode(e.target.value)}
              className="w-full bg-[#181a1d] text-[#f5f2eb] border border-[#3e4249] rounded-[3px] p-2 text-xs font-mono focus:outline-none focus:border-[#e5a93c]"
            >
              <option value="warm-analog">
                Warm Tube Harmonic Saturation (Recommended for Lectures)
              </option>
              <option value="clean-flat">Transparent Flat Analytical</option>
              <option value="broadcast">
                Broadcast Voice Compressor & De-Esser
              </option>
            </select>
          </div>
        </div>

        {/* Card 2: AI Neural Models & Processing */}
        <div className="p-4 rounded-[3px] bg-[#dfd7ca]/50 border border-[#baa791] space-y-3">
          <h3 className="audiotap-label text-xs text-[#302c25]">
            2. NEURAL INTELLIGENCE ENGINES
          </h3>

          <div>
            <label className="block text-[11px] font-bold text-[#554e42] mb-1">
              SPEECH-TO-TEXT MODEL
            </label>
            <select
              value={modelEngine}
              onChange={(e) => setModelEngine(e.target.value)}
              className="w-full bg-[#181a1d] text-[#f5f2eb] border border-[#3e4249] rounded-[3px] p-2 text-xs font-mono focus:outline-none focus:border-[#e5a93c]"
            >
              <option value="whisper-pro">
                Whisper Pro Neural Model (Low Latency, 99.2% Acc)
              </option>
              <option value="claude-study">
                Claude 3.7 Sonnet Academic Synthesizer
              </option>
              <option value="gemini-flash">
                Gemini 2.5 Flash Multimodal Audio Analyzer
              </option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#554e42] mb-1">
              AMBER PHOSPHOR DISPLAY BRIGHTNESS ({glowBrightness}%)
            </label>
            <input
              type="range"
              min="20"
              max="100"
              value={glowBrightness}
              onChange={(e) => setGlowBrightness(Number(e.target.value))}
              className="w-full accent-[#e5a93c] cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#554e42] mb-1">
              VU METER NEEDLE BALLISTICS SENSITIVITY ({needleSensitivity}%)
            </label>
            <input
              type="range"
              min="20"
              max="100"
              value={needleSensitivity}
              onChange={(e) => setNeedleSensitivity(Number(e.target.value))}
              className="w-full accent-[#e5a93c] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Storage & Backup Status */}
      <div className="p-4 rounded-[3px] bg-[#eae4d7] border border-[#b8af9e] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="audiotap-label text-xs text-[#22201c] block mb-1">
            TAPE STORAGE REEL STATUS
          </span>
          <span className="text-xs font-mono text-[#524b3f]">
            24.2 Hours Recorded of 60.0 Hour Tape Capacity (40.3% Used)
          </span>
          <div className="w-64 h-2 bg-[#cfc5b4] rounded-full overflow-hidden mt-1.5 border border-[#a89d8c]">
            <div className="h-full bg-[#e5a93c] w-[40.3%]" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="audiotap-btn-tactile px-4 py-2 rounded-[2px] text-xs font-bold text-[#1a1815]"
          >
            SAVE CALIBRATION
          </button>
        </div>
      </div>
    </div>
  );
}
