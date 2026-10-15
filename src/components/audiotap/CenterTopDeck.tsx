"use client";

import React from "react";
import { ScrewHead } from "./ScrewHead";
import { RotaryKnob } from "./RotaryKnob";
import { SpectrographDisplay } from "./SpectrographDisplay";

interface CenterTopDeckProps {
  isRecording: boolean;
  isPlaying: boolean;
  timerString: string;
  title: string;
  inputGain: number;
  onInputGainChange: (val: number) => void;
  micLevel: number;
  onMicLevelChange: (val: number) => void;
  onRecord: () => void;
  onStop: () => void;
  onPause: () => void;
  onMark: () => void;
  className?: string;
}

export function CenterTopDeck({
  isRecording,
  isPlaying,
  timerString,
  title,
  inputGain,
  onInputGainChange,
  micLevel,
  onMicLevelChange,
  onRecord,
  onStop,
  onPause,
  onMark,
  className = "",
}: CenterTopDeckProps) {
  return (
    <div
      className={`audiotap-panel rounded-[4px] p-3.5 relative flex flex-col justify-between select-none ${className}`}
    >
      {/* 4 Corner Screws */}
      <ScrewHead className="absolute top-2.5 left-2.5" rotation={18} />
      <ScrewHead className="absolute top-2.5 right-2.5" rotation={54} />
      <ScrewHead className="absolute bottom-2.5 left-2.5" rotation={82} />
      <ScrewHead className="absolute bottom-2.5 right-2.5" rotation={36} />

      {/* Recessed Dark Digital Display Window (VFD / Spectrograph) */}
      <div className="w-full mb-3">
        <SpectrographDisplay
          isRecording={isRecording}
          isPlaying={isPlaying}
          timerString={timerString}
          title={title}
        />
      </div>

      {/* Lower Hardware Controls Deck */}
      <div className="flex items-center justify-between px-3 pt-1">
        {/* Left Rotary Knob: INPUT GAIN */}
        <RotaryKnob
          label="INPUT GAIN"
          minLabel="MIN"
          maxLabel="MAX"
          value={inputGain}
          onChange={onInputGainChange}
          size="lg"
        />

        {/* Center Hardware Transport Buttons Block */}
        <div className="flex flex-col items-center">
          {/* Raised Beveled Metal Housing */}
          <div className="p-1 rounded-[4px] bg-gradient-to-b from-[#e8e2d7] via-[#ded7ca] to-[#c9c1b3] border border-[#a89e8e] shadow-[0_2px_4px_rgba(0,0,0,0.18),_inset_0_1px_0_rgba(255,255,255,0.95)] flex items-center gap-2">
            {/* RECORD Button */}
            <button
              type="button"
              onClick={onRecord}
              className={`audiotap-btn-tactile w-11 h-10 rounded-[2px] flex items-center justify-center transition-all cursor-pointer ${
                isRecording ? "is-pressed border-[#ef4444]" : ""
              }`}
              title="Record Session"
            >
              <span
                className={`w-3 h-3 rounded-full bg-[#ef4444] shadow-[0_1px_1px_rgba(0,0,0,0.35)] ${
                  isRecording ? "shadow-[0_0_8px_#ef4444] animate-pulse" : ""
                }`}
              />
            </button>

            {/* STOP Button */}
            <button
              type="button"
              onClick={onStop}
              className="audiotap-btn-tactile w-11 h-10 rounded-[2px] flex items-center justify-center transition-all cursor-pointer"
              title="Stop"
            >
              <span className="w-3 h-3 bg-[#1e1c19] rounded-[1px] shadow-[0_0.5px_0_rgba(255,255,255,0.4)]" />
            </button>

            {/* PAUSE Button */}
            <button
              type="button"
              onClick={onPause}
              className="audiotap-btn-tactile w-11 h-10 rounded-[2px] flex items-center justify-center gap-[3px] transition-all cursor-pointer"
              title="Pause"
            >
              <span className="w-[3px] h-3 bg-[#1e1c19] rounded-[0.5px]" />
              <span className="w-[3px] h-3 bg-[#1e1c19] rounded-[0.5px]" />
            </button>

            {/* MARK Button */}
            <button
              type="button"
              onClick={onMark}
              className="audiotap-btn-tactile w-11 h-10 rounded-[2px] flex items-center justify-center transition-all cursor-pointer"
              title="Place Marker"
            >
              <span className="w-2.5 h-2.5 bg-[#1e1c19] rounded-[1px]" />
            </button>
          </div>

          {/* Silkscreened Labels below buttons matching target image */}
          <div className="w-full flex justify-between px-1 mt-1.5 text-[8.5px] font-extrabold tracking-[0.14em] uppercase text-[#3a352c]">
            <span className="w-11 text-center">RECORD</span>
            <span className="w-11 text-center">STOP</span>
            <span className="w-11 text-center">PAUSE</span>
            <span className="w-11 text-center">MARK</span>
          </div>
        </div>

        {/* Right Rotary Knob: MIC LEVEL */}
        <RotaryKnob
          label="MIC LEVEL"
          minLabel="MIN"
          maxLabel="MAX"
          value={micLevel}
          onChange={onMicLevelChange}
          size="lg"
        />
      </div>
    </div>
  );
}
