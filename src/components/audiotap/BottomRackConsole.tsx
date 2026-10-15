"use client";

import React from "react";
import { ScrewHead } from "./ScrewHead";
import { RotaryKnob } from "./RotaryKnob";
import { ToggleSwitch } from "./ToggleSwitch";
import { VuMeters } from "./VuMeters";

interface BottomRackConsoleProps {
  source: "MIC" | "FILE" | "SYSTEM";
  onSourceChange: (src: "MIC" | "FILE" | "SYSTEM") => void;
  noiseReduction: boolean;
  onNoiseReductionChange: (val: boolean) => void;
  voiceEnhance: boolean;
  onVoiceEnhanceChange: (val: boolean) => void;
  speechToText: boolean;
  onSpeechToTextChange: (val: boolean) => void;
  isPlaying: boolean;
  isRecording: boolean;
  inputGain: number;
  outputLevel: number;
  onOutputLevelChange: (val: number) => void;
  isPowerOn: boolean;
  onTogglePower: () => void;
  className?: string;
}

export function BottomRackConsole({
  source,
  onSourceChange,
  noiseReduction,
  onNoiseReductionChange,
  voiceEnhance,
  onVoiceEnhanceChange,
  speechToText,
  onSpeechToTextChange,
  isPlaying,
  isRecording,
  inputGain,
  outputLevel,
  onOutputLevelChange,
  isPowerOn,
  onTogglePower,
  className = "",
}: BottomRackConsoleProps) {
  const sources: ("MIC" | "FILE" | "SYSTEM")[] = ["MIC", "FILE", "SYSTEM"];
  const currentSourceIndex = sources.indexOf(source);

  const handleNextSource = () => {
    const nextIdx = (currentSourceIndex + 1) % sources.length;
    onSourceChange(sources[nextIdx]);
  };

  return (
    <div
      className={`audiotap-panel rounded-[4px] px-6 py-3 relative flex items-center justify-between select-none ${className}`}
    >
      {/* 4 Corner Screws */}
      <ScrewHead className="absolute top-2.5 left-2.5" rotation={42} />
      <ScrewHead className="absolute top-2.5 right-2.5" rotation={18} />
      <ScrewHead className="absolute bottom-2.5 left-2.5" rotation={68} />
      <ScrewHead className="absolute bottom-2.5 right-2.5" rotation={25} />

      {/* SECTION 1: SOURCE SELECTOR */}
      <div className="flex flex-col items-start pr-4 border-r border-[#c2b8a7]">
        <span className="text-[8.5px] font-extrabold tracking-[0.16em] uppercase text-[#3a352b] mb-1">
          SOURCE
        </span>
        <div className="flex items-center gap-3">
          <div
            onClick={handleNextSource}
            className="cursor-pointer"
            title="Click to cycle input source"
          >
            <RotaryKnob
              label=""
              showMinMax={false}
              value={
                currentSourceIndex === 0
                  ? 15
                  : currentSourceIndex === 1
                    ? 50
                    : 85
              }
              size="sm"
            />
          </div>

          {/* 3 Source LED Indicators */}
          <div className="flex flex-col justify-center gap-1.5 text-[8px] font-extrabold text-[#474135] tracking-wider">
            <div
              onClick={() => onSourceChange("MIC")}
              className="flex items-center gap-2 cursor-pointer hover:text-black"
            >
              <span
                className={`w-2 h-2 rounded-full transition-all shrink-0 ${
                  source === "MIC" && isPowerOn
                    ? "bg-[#ef4444] shadow-[0_0_6px_#ef4444,0_0_10px_rgba(239,68,68,0.7)]"
                    : "bg-[#712222]"
                }`}
              />
              <span>MIC</span>
            </div>

            <div
              onClick={() => onSourceChange("FILE")}
              className="flex items-center gap-2 cursor-pointer hover:text-black"
            >
              <span
                className={`w-2 h-2 rounded-full transition-all shrink-0 ${
                  source === "FILE" && isPowerOn
                    ? "bg-[#ef4444] shadow-[0_0_6px_#ef4444]"
                    : "bg-[#712222]"
                }`}
              />
              <span>FILE</span>
            </div>

            <div
              onClick={() => onSourceChange("SYSTEM")}
              className="flex items-center gap-2 cursor-pointer hover:text-black"
            >
              <span
                className={`w-2 h-2 rounded-full transition-all shrink-0 ${
                  source === "SYSTEM" && isPowerOn
                    ? "bg-[#ef4444] shadow-[0_0_6px_#ef4444]"
                    : "bg-[#712222]"
                }`}
              />
              <span>SYSTEM</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: EFFECTS TOGGLES */}
      <div className="flex flex-col items-center px-4 border-r border-[#c2b8a7]">
        <span className="text-[8.5px] font-extrabold tracking-[0.16em] uppercase text-[#3a352b] mb-1">
          EFFECTS
        </span>
        <div className="flex items-center gap-4">
          <ToggleSwitch
            label="NOISE REDUCTION"
            checked={noiseReduction}
            onChange={onNoiseReductionChange}
          />
          <ToggleSwitch
            label="VOICE ENHANCE"
            checked={voiceEnhance}
            onChange={onVoiceEnhanceChange}
          />
          <ToggleSwitch
            label="SPEECH TO TEXT"
            checked={speechToText}
            onChange={onSpeechToTextChange}
          />
        </div>
      </div>

      {/* SECTION 3: CENTER DUAL ANALOG VU METERS */}
      <div className="flex justify-center px-2">
        <VuMeters
          isPlaying={isPlaying && isPowerOn}
          isRecording={isRecording && isPowerOn}
          gain={inputGain}
        />
      </div>

      {/* SECTION 4: OUTPUT KNOB */}
      <div className="flex flex-col items-center px-4 border-l border-[#c2b8a7]">
        <span className="text-[8.5px] font-extrabold tracking-[0.16em] uppercase text-[#3a352b] mb-1">
          OUTPUT
        </span>
        <RotaryKnob
          label=""
          minLabel="MIN"
          maxLabel="MAX"
          value={outputLevel}
          onChange={onOutputLevelChange}
          size="sm"
        />
      </div>

      {/* SECTION 5: PHONES 1/4" JACK */}
      <div className="flex flex-col items-center px-3 border-l border-[#c2b8a7]">
        {/* Lathe-Milled 1/4" Jack Collar */}
        <div
          className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ded7ca] via-[#a89f90] to-[#6a6254] p-[2.5px] shadow-[0_2px_4px_rgba(0,0,0,0.35),_inset_0_1px_1px_rgba(255,255,255,0.95)] flex items-center justify-center cursor-pointer mt-1"
          title="1/4' Stereo Headphone Out"
        >
          {/* Dark Aperture Socket */}
          <div className="w-4 h-4 rounded-full bg-[#0a0a0c] border border-[#2e2b24] shadow-[inset_0_2px_5px_rgba(0,0,0,0.99)] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#1b1c20]" />
          </div>
        </div>
        <span className="text-[7.5px] font-extrabold text-[#474135] tracking-widest uppercase mt-2">
          PHONES
        </span>
      </div>

      {/* SECTION 6: POWER */}
      <div className="flex flex-col items-center pl-4 border-l border-[#c2b8a7]">
        <span className="text-[8.5px] font-extrabold tracking-[0.16em] uppercase text-[#3a352b] mb-1">
          POWER
        </span>

        {/* Red Power Indicator Jewel LED */}
        <div className="flex items-center justify-center mb-1.5">
          <span
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              isPowerOn
                ? "bg-[#ef4444] shadow-[0_0_8px_#ef4444,0_0_12px_rgba(239,68,68,0.8)] animate-pulse"
                : "bg-[#451616]"
            }`}
          />
        </div>

        {/* Heavy-duty Tactile Rocker Switch */}
        <button
          type="button"
          onClick={onTogglePower}
          className={`w-6 h-5 rounded-[2px] transition-all cursor-pointer focus:outline-none shadow-[0_2px_4px_rgba(0,0,0,0.4)] ${
            isPowerOn
              ? "bg-[#181a1d] border-t-2 border-[#3e4249]"
              : "bg-[#25282d] border-b-2 border-[#3e4249]"
          }`}
          title={isPowerOn ? "Turn Console OFF" : "Turn Console ON"}
        >
          <div
            className={`w-full h-full rounded-[1px] flex items-center justify-center text-[7px] font-black tracking-wider transition-all ${
              isPowerOn
                ? "bg-gradient-to-b from-[#1b1d20] to-[#2d3138] text-[#ef4444] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]"
                : "bg-gradient-to-b from-[#3a3f47] to-[#1f2227] text-[#8e8a82]"
            }`}
          >
            {isPowerOn ? "ON" : "OFF"}
          </div>
        </button>
      </div>
    </div>
  );
}
