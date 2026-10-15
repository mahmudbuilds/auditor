"use client";

import React from "react";

interface ScrewHeadProps {
  className?: string;
  rotation?: number;
}

export function ScrewHead({ className = "", rotation = 32 }: ScrewHeadProps) {
  return (
    <div
      className={`w-2.5 h-2.5 rounded-full pointer-events-none select-none shrink-0 flex items-center justify-center ${className}`}
      title="Milled chassis fastener"
      style={{
        boxShadow:
          "inset 0 1px 1px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.7)",
      }}
    >
      {/* Outer beveled socket ring */}
      <div className="w-full h-full rounded-full bg-gradient-to-br from-[#7a7263] via-[#b6ad9d] to-[#ded7ca] flex items-center justify-center p-[0.75px]">
        {/* Screw head metallic face */}
        <div
          className="w-full h-full rounded-full bg-gradient-to-tr from-[#bfb7a7] via-[#d6cebe] to-[#ede7dc] flex items-center justify-center shadow-[inset_0_0.5px_0.5px_rgba(255,255,255,0.9)]"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Phillips cross slot (+) */}
          <div className="relative w-1.5 h-1.5 flex items-center justify-center">
            <span className="absolute w-[5px] h-[1px] bg-[#3a352c] rounded-[0.5px] shadow-[0_0.5px_0_rgba(255,255,255,0.4)]" />
            <span className="absolute w-[1px] h-[5px] bg-[#3a352c] rounded-[0.5px] shadow-[0_0.5px_0_rgba(255,255,255,0.4)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
