"use client";

import React from "react";

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export function ToggleSwitch({
  label,
  checked,
  onChange,
  className = "",
}: ToggleSwitchProps) {
  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Parameter Label */}
      <span className="text-[7.5px] font-bold tracking-[0.14em] uppercase text-[#3e3930] text-center mb-1 leading-tight h-5 flex items-center justify-center max-w-[68px]">
        {label}
      </span>

      {/* Switch assembly with ON / OFF text */}
      <div className="flex items-center gap-1.5">
        <div
          role="switch"
          aria-checked={checked}
          tabIndex={0}
          onClick={() => onChange(!checked)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onChange(!checked);
            }
          }}
          className="relative w-5 h-9 rounded-[3px] bg-gradient-to-b from-[#8c8374] via-[#b6ad9d] to-[#ded7ca] p-[1.5px] cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.25),_inset_0_1px_1px_rgba(255,255,255,0.7)] group focus:outline-none"
          title={`${label}: ${checked ? "ON" : "OFF"}`}
        >
          {/* Recessed dark vertical slot */}
          <div className="w-full h-full rounded-[2px] bg-[#121316] shadow-[inset_0_2px_5px_rgba(0,0,0,0.95)] relative flex items-center justify-center overflow-hidden">
            {/* The Metal Lever Paddle */}
            <div
              className={`w-3.5 h-4.5 rounded-sm shadow-[0_2px_4px_rgba(0,0,0,0.45),_inset_0_1px_1px_rgba(255,255,255,0.9)] transition-all duration-150 ease-out flex items-center justify-center ${
                checked
                  ? "translate-y-[-7px] bg-gradient-to-b from-[#ffffff] via-[#e2dbce] to-[#9c9383]"
                  : "translate-y-[7px] bg-gradient-to-b from-[#9c9383] via-[#c2baa9] to-[#6e6657]"
              }`}
            >
              {/* Center knurled groove on the lever */}
              <div className="w-2.5 h-[1.5px] bg-[#3a352c] rounded-full shadow-[0_0.5px_0_rgba(255,255,255,0.6)]" />
            </div>
          </div>
        </div>

        {/* ON / OFF Vertical indicators */}
        <div className="flex flex-col justify-between h-8 text-[7.5px] font-bold tracking-wider leading-none">
          <span
            className={`transition-colors ${
              checked ? "text-[#181613] font-black" : "text-[#7f786a]"
            }`}
          >
            ON
          </span>
          <span
            className={`transition-colors ${
              !checked ? "text-[#181613] font-black" : "text-[#7f786a]"
            }`}
          >
            OFF
          </span>
        </div>
      </div>
    </div>
  );
}
