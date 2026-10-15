"use client";

import React, { useEffect, useState } from "react";

interface VuMetersProps {
  isPlaying?: boolean;
  isRecording?: boolean;
  gain?: number; // 0..100
  className?: string;
}

export function VuMeters({
  isPlaying = false,
  isRecording = false,
  gain = 50,
  className = "",
}: VuMetersProps) {
  const [leftAngle, setLeftAngle] = useState(-26);
  const [rightAngle, setRightAngle] = useState(-26);

  useEffect(() => {
    if (!isPlaying && !isRecording) {
      setLeftAngle(-26);
      setRightAngle(-26);
      return;
    }

    const interval = setInterval(() => {
      const gainMultiplier = gain / 50;
      const t = Date.now() / 140;
      const baseWave = (Math.sin(t) + Math.cos(t * 1.7) * 0.5 + 1.5) / 3;
      const jitterLeft = (Math.random() - 0.4) * 0.35;
      const jitterRight = (Math.random() - 0.4) * 0.35;

      const targetLeft =
        -26 +
        Math.max(0, Math.min(1, baseWave * gainMultiplier + jitterLeft)) * 36;
      const targetRight =
        -26 +
        Math.max(
          0,
          Math.min(1, baseWave * 0.95 * gainMultiplier + jitterRight),
        ) *
          36;

      setLeftAngle(targetLeft);
      setRightAngle(targetRight);
    }, 60);

    return () => clearInterval(interval);
  }, [isPlaying, isRecording, gain]);

  return (
    <div
      className={`relative bg-[#0d0e12] border border-[#2b2e35] rounded-[3px] p-2 shadow-[inset_0_3px_12px_rgba(0,0,0,0.99),_0_1px_0_rgba(255,255,255,0.7)] ${className}`}
    >
      {/* Warm Incandescent Backlight Glow */}
      <div className="absolute inset-0 bg-radial from-[#f59e0b]/20 via-transparent to-transparent pointer-events-none rounded-[3px]" />

      {/* Dual Meter Housing */}
      <div className="flex items-center gap-2.5 relative z-10">
        {/* Left Meter */}
        <SingleMeter
          label="LEFT"
          angle={leftAngle}
          isLit={isPlaying || isRecording}
        />

        {/* Center Divider Ridge */}
        <div className="w-[1.5px] h-14 bg-gradient-to-b from-[#1c1a16] via-[#4d4538] to-[#1c1a16]" />

        {/* Right Meter */}
        <SingleMeter
          label="RIGHT"
          angle={rightAngle}
          isLit={isPlaying || isRecording}
        />
      </div>
    </div>
  );
}

function SingleMeter({
  label,
  angle,
  isLit,
}: {
  label: "LEFT" | "RIGHT";
  angle: number;
  isLit: boolean;
}) {
  return (
    <div className="relative w-32 sm:w-36 h-18 sm:h-20 bg-[#14120e] rounded-[3px] border border-[#2e281e] shadow-[inset_0_2px_6px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col items-center justify-between p-1 select-none">
      {/* Backlit Dial Face */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isLit ? "opacity-100" : "opacity-80"
        }`}
        style={{
          background:
            "radial-gradient(ellipse at 50% 95%, rgba(245, 175, 65, 0.32) 0%, rgba(18, 14, 10, 0.98) 75%)",
        }}
      />

      {/* Dial Markings SVG */}
      <svg
        className="w-full h-full absolute inset-0 select-none pointer-events-none"
        viewBox="0 0 130 75"
      >
        {/* Main Curved Scale Arc */}
        <path
          d="M 18 45 A 56 56 0 0 1 112 45"
          fill="none"
          stroke="#473f32"
          strokeWidth="1.2"
        />

        {/* Red Peak Zone Arc (0 to +3 dB) */}
        <path
          d="M 94 40 A 56 56 0 0 1 112 45"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2.2"
        />

        {/* Ticks and dB numbers matching target screenshot: -20, -10, -7, -5, -3, 0, +3 */}
        <text
          x="18"
          y="52"
          fill="#9e917d"
          fontSize="5.5"
          fontFamily="monospace"
          fontWeight="bold"
        >
          -20
        </text>
        <text
          x="35"
          y="41"
          fill="#9e917d"
          fontSize="5.5"
          fontFamily="monospace"
          fontWeight="bold"
        >
          -10
        </text>
        <text
          x="50"
          y="34"
          fill="#9e917d"
          fontSize="5.5"
          fontFamily="monospace"
          fontWeight="bold"
        >
          -7
        </text>
        <text
          x="63"
          y="32"
          fill="#9e917d"
          fontSize="5.5"
          fontFamily="monospace"
          fontWeight="bold"
        >
          -5
        </text>
        <text
          x="76"
          y="33"
          fill="#9e917d"
          fontSize="5.5"
          fontFamily="monospace"
          fontWeight="bold"
        >
          -3
        </text>
        <text
          x="92"
          y="35"
          fill="#f59e0b"
          fontSize="6"
          fontFamily="monospace"
          fontWeight="bold"
        >
          0
        </text>
        <text
          x="106"
          y="41"
          fill="#ef4444"
          fontSize="6"
          fontFamily="monospace"
          fontWeight="bold"
        >
          +3
        </text>

        {/* Scale Ticks */}
        <line
          x1="22"
          y1="45"
          x2="25"
          y2="47"
          stroke="#8c7f6d"
          strokeWidth="1"
        />
        <line
          x1="38"
          y1="36"
          x2="40"
          y2="39"
          stroke="#8c7f6d"
          strokeWidth="1"
        />
        <line
          x1="53"
          y1="31"
          x2="54"
          y2="34"
          stroke="#8c7f6d"
          strokeWidth="1"
        />
        <line
          x1="65"
          y1="29"
          x2="65"
          y2="32"
          stroke="#8c7f6d"
          strokeWidth="1"
        />
        <line
          x1="78"
          y1="29"
          x2="77"
          y2="32"
          stroke="#8c7f6d"
          strokeWidth="1"
        />
        <line
          x1="93"
          y1="31"
          x2="92"
          y2="34"
          stroke="#f59e0b"
          strokeWidth="1.2"
        />
        <line
          x1="107"
          y1="37"
          x2="105"
          y2="40"
          stroke="#ef4444"
          strokeWidth="1.4"
        />
      </svg>

      {/* Needle Pivot Assembly & Moving Needle */}
      <div
        className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-full flex items-end justify-center pointer-events-none transition-transform duration-75 ease-out"
        style={{
          transformOrigin: "50% 100%",
          transform: `translateX(-50%) rotate(${angle}deg)`,
        }}
      >
        <div
          className="w-[1.2px] h-14 bg-gradient-to-t from-[#1b1813] via-[#f59e0b] to-[#f5f2eb]"
          style={{
            boxShadow: "0 0 3px rgba(245, 158, 11, 0.4)",
          }}
        />
      </div>

      {/* Bottom Center Pivot Cap */}
      <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-gradient-to-b from-[#3a3227] to-[#120f0b] border border-[#524637] shadow-[0_1px_3px_rgba(0,0,0,0.9)] z-20" />

      {/* VU Label & Channel Name */}
      <div className="absolute bottom-1 w-full flex justify-center gap-1.5 z-20">
        <span className="text-[7.5px] font-bold text-[#8a7d6a] tracking-widest uppercase">
          VU
        </span>
        <span className="text-[8px] font-bold text-[#cfc2ae] tracking-widest uppercase">
          {label}
        </span>
      </div>
    </div>
  );
}
