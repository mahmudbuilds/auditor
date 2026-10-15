"use client";

import React from "react";
import { ScrewHead } from "./ScrewHead";
import { RotaryKnob } from "./RotaryKnob";

interface CassetteDeckProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStop: () => void;
  onRewind: () => void;
  onFastForward: () => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  className?: string;
}

export function CassetteDeck({
  isPlaying,
  onTogglePlay,
  onStop,
  onRewind,
  onFastForward,
  volume,
  onVolumeChange,
  className = "",
}: CassetteDeckProps) {
  return (
    <div
      className={`audiotap-panel rounded-[4px] p-3.5 relative flex flex-col justify-between select-none ${className}`}
    >
      {/* 4 Corner Chassis Screws */}
      <ScrewHead className="absolute top-2.5 left-2.5" rotation={15} />
      <ScrewHead className="absolute top-2.5 right-2.5" rotation={48} />
      <ScrewHead className="absolute bottom-2.5 left-2.5" rotation={75} />
      <ScrewHead className="absolute bottom-2.5 right-2.5" rotation={32} />

      {/* Header: PLAYBACK */}
      <div className="flex items-center justify-between px-1 mb-2">
        <h3 className="audiotap-label text-[11px] font-extrabold text-[#38332b]">
          PLAYBACK
        </h3>
      </div>

      {/* Cassette Deck Mechanism Bay */}
      <div className="mb-2">
        {/* Recessed Cassette Well Frame */}
        <div className="relative w-full h-32 sm:h-36 rounded-[3px] bg-gradient-to-b from-[#1c1e21] via-[#121316] to-[#25282c] border border-[#3f434a] shadow-[inset_0_4px_12px_rgba(0,0,0,0.95),_0_1px_0_rgba(255,255,255,0.7)] p-2.5 flex flex-col items-center justify-center overflow-hidden">
          {/* Acrylic Window Glass with Specular Diagonal Glare */}
          <div className="absolute inset-1 rounded-[2px] border border-white/10 pointer-events-none z-20 overflow-hidden">
            <div className="absolute -top-12 -left-12 w-52 h-64 bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-35 pointer-events-none" />
          </div>

          {/* Authentic Compact Cassette Shell (Transparent smoked casing) */}
          <div className="relative w-full max-w-[230px] h-[96px] rounded-[3px] bg-gradient-to-b from-[#1e2024]/90 via-[#272b31]/95 to-[#191b1f]/90 border border-[#484c54] shadow-[0_3px_10px_rgba(0,0,0,0.85),_inset_0_1px_1px_rgba(255,255,255,0.2)] flex flex-col items-center justify-between p-1.5 z-10">
            {/* Cassette Label Header */}
            <div className="w-full flex items-center justify-between px-2 py-0.5 rounded-[1px] bg-gradient-to-r from-[#cfc5b4] via-[#e5ded1] to-[#cfc5b4] border-b border-[#9f9483] text-[8px] font-bold text-[#353026] tracking-widest uppercase">
              <span>AUDIOTAP C-60</span>
              <span className="text-[7px] text-[#635b4c]">CHROME BIAS</span>
            </div>

            {/* Cassette Center Spool Window & Reels */}
            <div className="w-[92%] h-13 rounded-[2px] bg-[#0c0d0f] border border-[#2e3137] shadow-[inset_0_2px_6px_rgba(0,0,0,0.99)] flex items-center justify-around px-3 relative">
              {/* Left Tape Reel Spool with Brown Magnetic Tape */}
              <div
                className={`relative w-9 h-9 rounded-full bg-gradient-to-tr from-[#ece6dc] to-[#cfc5b4] border border-[#5a5447] shadow-[0_1px_4px_rgba(0,0,0,0.9)] flex items-center justify-center ${
                  isPlaying ? "animate-cassette-spin" : ""
                }`}
              >
                {/* 6 Gear Hub Spokes */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <span
                    key={i}
                    className="absolute w-[3px] h-8 bg-[#201d17] rounded-[0.5px]"
                    style={{ transform: `rotate(${i * 30}deg)` }}
                  />
                ))}
                {/* Center Spindle Hole */}
                <div className="w-3.5 h-3.5 rounded-full bg-[#0c0d0f] border border-[#4d4639] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)] z-10" />
              </div>

              {/* Tape Bridge & Guide Head */}
              <div className="flex-1 flex flex-col items-center justify-center px-1">
                <div className="w-full h-1.5 bg-[#422915] shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
                <div className="w-6 h-3 mt-0.5 rounded-[1px] bg-gradient-to-b from-[#8c8273] to-[#3a352d] border border-[#26221c]" />
              </div>

              {/* Right Tape Reel Spool */}
              <div
                className={`relative w-9 h-9 rounded-full bg-gradient-to-tr from-[#ece6dc] to-[#cfc5b4] border border-[#5a5447] shadow-[0_1px_4px_rgba(0,0,0,0.9)] flex items-center justify-center ${
                  isPlaying ? "animate-cassette-spin" : ""
                }`}
              >
                {/* 6 Gear Hub Spokes */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <span
                    key={i}
                    className="absolute w-[3px] h-8 bg-[#201d17] rounded-[0.5px]"
                    style={{ transform: `rotate(${i * 30}deg)` }}
                  />
                ))}
                {/* Center Spindle Hole */}
                <div className="w-3.5 h-3.5 rounded-full bg-[#0c0d0f] border border-[#4d4639] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)] z-10" />
              </div>
            </div>

            {/* Bottom Tape Opening Notch */}
            <div className="w-24 h-2.5 bg-gradient-to-b from-[#111215] to-[#1c1f24] rounded-t-[1px] border-t border-[#3e4248]" />
          </div>

          {/* AUTO STOP Silkscreen Label */}
          <div className="mt-1 text-[8.5px] font-bold tracking-[0.22em] uppercase text-[#7a7467] select-none">
            AUTO STOP
          </div>
        </div>
      </div>

      {/* Transport Controls & Volume Knob Row */}
      <div className="flex items-center justify-between px-2 pt-1">
        {/* Tape Transport Buttons Tray */}
        <div className="p-1 rounded-[3px] bg-gradient-to-b from-[#e8e2d7] via-[#ded7ca] to-[#c9c1b3] border border-[#a89e8e] shadow-[0_2px_4px_rgba(0,0,0,0.18),_inset_0_1px_0_rgba(255,255,255,0.95)] flex items-center gap-1.5">
          {/* Rewind Button */}
          <button
            type="button"
            onClick={onRewind}
            className="audiotap-btn-tactile w-8 h-8 rounded-[2px] flex items-center justify-center text-[#1d1b18] text-xs font-bold active:translate-y-[1px] cursor-pointer"
            title="Rewind 15 seconds"
          >
            ◀◀
          </button>

          {/* Play / Pause Toggle Button */}
          <button
            type="button"
            onClick={onTogglePlay}
            className={`audiotap-btn-tactile w-9 h-8 rounded-[2px] flex items-center justify-center text-xs font-bold active:translate-y-[1px] cursor-pointer ${
              isPlaying ? "is-pressed text-[#ef4444]" : "text-[#1d1b18]"
            }`}
            title={isPlaying ? "Pause playback" : "Start playback"}
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>

          {/* Fast Forward Button */}
          <button
            type="button"
            onClick={onFastForward}
            className="audiotap-btn-tactile w-8 h-8 rounded-[2px] flex items-center justify-center text-[#1d1b18] text-xs font-bold active:translate-y-[1px] cursor-pointer"
            title="Fast forward 15 seconds"
          >
            ▶▶
          </button>

          {/* Stop Button */}
          <button
            type="button"
            onClick={onStop}
            className="audiotap-btn-tactile w-8 h-8 rounded-[2px] flex items-center justify-center text-[#1d1b18] text-xs font-bold active:translate-y-[1px] cursor-pointer"
            title="Stop playback"
          >
            ■
          </button>
        </div>

        {/* Volume Rotary Knob */}
        <RotaryKnob
          label="VOLUME"
          minLabel="MIN"
          maxLabel="MAX"
          value={volume}
          onChange={onVolumeChange}
          size="md"
        />
      </div>
    </div>
  );
}
