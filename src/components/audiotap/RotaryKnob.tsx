"use client";

import React, { useRef, useState, useEffect } from "react";

interface RotaryKnobProps {
  label: string;
  minLabel?: string;
  maxLabel?: string;
  value: number; // 0 to 100
  onChange?: (val: number) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  showMinMax?: boolean;
}

export function RotaryKnob({
  label,
  minLabel = "MIN",
  maxLabel = "MAX",
  value,
  onChange,
  size = "md",
  className = "",
  showMinMax = true,
}: RotaryKnobProps) {
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const startValRef = useRef(value);

  // Map 0..100 to angle: -135deg to +135deg (270 deg rotation arc)
  const angle = -135 + (value / 100) * 270;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startYRef.current = e.clientY;
    startValRef.current = value;
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = startYRef.current - e.clientY;
      const sensitivity = 0.75;
      const nextVal = Math.min(
        100,
        Math.max(0, Math.round(startValRef.current + deltaY * sensitivity)),
      );
      onChange?.(nextVal);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, onChange]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 3 : -3;
    const nextVal = Math.min(100, Math.max(0, value + delta));
    onChange?.(nextVal);
  };

  const dimensions =
    size === "lg"
      ? { knob: "w-16 h-16", indicator: "w-[2px] h-3.5", wrap: "w-20" }
      : size === "md"
        ? { knob: "w-12 h-12", indicator: "w-[2px] h-2.5", wrap: "w-16" }
        : { knob: "w-10 h-10", indicator: "w-[1.5px] h-2", wrap: "w-14" };

  return (
    <div
      className={`flex flex-col items-center select-none ${dimensions.wrap} ${className}`}
      onWheel={handleWheel}
    >
      {/* Physical Solid Brushed Aluminum Knob */}
      <div className="relative flex items-center justify-center p-1">
        <div
          ref={knobRef}
          onMouseDown={handleMouseDown}
          className={`${dimensions.knob} rounded-full cursor-grab active:cursor-grabbing relative flex items-center justify-center transition-shadow`}
          style={{
            touchAction: "none",
            boxShadow:
              "0 5px 10px rgba(0, 0, 0, 0.38), 0 2px 4px rgba(0, 0, 0, 0.22), 0 0 1px rgba(0, 0, 0, 0.4)",
            background:
              "linear-gradient(135deg, #ded8cc 0%, #a89f90 50%, #e6e0d4 100%)",
            padding: "2px",
          }}
          title={`${label}: ${value}%`}
        >
          {/* Spun Brushed Aluminum Face with Anisotropic Conic Glare */}
          <div
            className="w-full h-full rounded-full relative flex items-start justify-center overflow-hidden transition-transform duration-75 ease-out"
            style={{
              transform: `rotate(${angle}deg)`,
              background:
                "conic-gradient(from 45deg, #dfd9ce 0deg, #b0a798 45deg, #ede7de 90deg, #999081 135deg, #f5f0e8 180deg, #b0a798 225deg, #ede7de 270deg, #999081 315deg, #dfd9ce 360deg)",
              boxShadow:
                "inset 0 1.5px 2px rgba(255, 255, 255, 0.95), inset 0 -1.5px 2px rgba(0, 0, 0, 0.35)",
            }}
          >
            {/* Fine Concentric Lathe Grooves (Micro-texture) */}
            <div
              className="absolute inset-[1px] rounded-full pointer-events-none opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 41%, transparent 42%, transparent 70%, rgba(0,0,0,0.3) 71%, transparent 72%)",
              }}
            />

            {/* Milled Radial Indicator Notch */}
            <div className="pt-1 z-10">
              <div
                className={`${dimensions.indicator} bg-[#1f1d19] rounded-full shadow-[0_0.5px_0_rgba(255,255,255,0.7)]`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MIN / MAX Labels */}
      {showMinMax && (
        <div className="w-full flex justify-between items-center px-0.5 text-[8.5px] font-bold text-[#554f43] tracking-wider select-none mt-0.5">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}

      {/* Parameter Label */}
      {label && (
        <div className="text-[9px] font-extrabold tracking-[0.15em] uppercase text-[#2c2821] text-center select-none mt-0.5 leading-tight">
          {label}
        </div>
      )}
    </div>
  );
}
