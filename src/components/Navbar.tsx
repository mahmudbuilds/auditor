"use client";

import React from "react";

interface NavbarProps {
  onOpenRecord: () => void;
  recordingActive?: boolean;
}

export function Navbar({ onOpenRecord, recordingActive = false }: NavbarProps) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.07] bg-[#181b1f]/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-8">
        {/* Brand / Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-[#e5a93c] text-xs font-bold text-[#14171a]">
              A
            </span>
            <div className="flex flex-col">
              <span className="font-roman text-sm tracking-[0.2em] text-[#f4f1eb] group-hover:text-[#e5a93c] transition-colors">
                AUDITOR
              </span>
              <span className="font-telemetry text-[10px] tracking-widest text-[#8e959e] uppercase">
                Archival Edition · 01
              </span>
            </div>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] tracking-wider uppercase text-[#8e959e]">
          <button
            type="button"
            onClick={() => scrollTo("telemetry")}
            className="hover:text-[#f4f1eb] transition-colors"
          >
            Telemetry
          </button>
          <button
            type="button"
            onClick={() => scrollTo("sessions")}
            className="hover:text-[#f4f1eb] transition-colors"
          >
            Sessions
          </button>
          <button
            type="button"
            onClick={() => scrollTo("engines")}
            className="hover:text-[#f4f1eb] transition-colors"
          >
            AI Engines
          </button>
          <button
            type="button"
            onClick={() => scrollTo("trail")}
            className="hover:text-[#f4f1eb] transition-colors"
          >
            Knowledge Trail
          </button>
          <button
            type="button"
            onClick={() => scrollTo("audit-console")}
            className="hover:text-[#f4f1eb] transition-colors"
          >
            Capture
          </button>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenRecord}
            className={`group relative flex items-center gap-2 rounded px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
              recordingActive
                ? "bg-red-500 text-white pulse-recording"
                : "bg-[#e5a93c] text-[#14171a] hover:bg-[#f3b74b] shadow-[0_2px_12px_rgba(229,169,60,0.25)]"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                recordingActive ? "bg-white animate-ping" : "bg-[#14171a]"
              }`}
            />
            <span>{recordingActive ? "Recording Active" : "Record Now"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
