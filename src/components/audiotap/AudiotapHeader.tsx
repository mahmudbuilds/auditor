"use client";

import React from "react";

export type NavPage = "home" | "library" | "features" | "settings";

interface AudiotapHeaderProps {
  currentPage: NavPage;
  onSelectPage: (page: NavPage) => void;
  className?: string;
}

export function AudiotapHeader({
  currentPage,
  onSelectPage,
  className = "",
}: AudiotapHeaderProps) {
  const navTabs: { id: NavPage; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "library", label: "Library" },
    { id: "features", label: "Features" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <header
      className={`relative w-full px-5 py-3.5 flex items-center justify-between select-none ${className}`}
    >
      {/* Brand & Subtitle */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Waveform Logo Icon */}
        <div
          className="flex items-center gap-[2.5px] h-5 cursor-pointer"
          onClick={() => onSelectPage("home")}
          title="AUDIOTAP Home"
        >
          <span className="w-[3px] h-2 bg-[#1b1916] rounded-full" />
          <span className="w-[3px] h-3.5 bg-[#1b1916] rounded-full" />
          <span className="w-[3px] h-5 bg-[#1b1916] rounded-full" />
          <span className="w-[3px] h-3 bg-[#1b1916] rounded-full" />
          <span className="w-[3px] h-4 bg-[#1b1916] rounded-full" />
          <span className="w-[3px] h-2 bg-[#1b1916] rounded-full" />
        </div>

        {/* Logotype */}
        <div
          className="text-base sm:text-lg font-black tracking-[0.24em] uppercase text-[#1b1916] cursor-pointer"
          onClick={() => onSelectPage("home")}
        >
          AUDIOTAP
        </div>

        {/* Subtitle */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] font-medium tracking-[0.16em] text-[#635c4f] border-l border-[#c4baa9] pl-3.5">
          <span>Record</span>
          <span className="text-[#8c8270]">•</span>
          <span>Transcribe</span>
          <span className="text-[#8c8270]">•</span>
          <span>Learn</span>
        </div>
      </div>

      {/* Nav Tabs */}
      <nav className="flex items-center gap-5 sm:gap-7">
        {navTabs.map((tab) => {
          const isActive = currentPage === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectPage(tab.id)}
              className={`relative py-1 text-xs font-semibold tracking-wider transition-colors cursor-pointer ${
                isActive
                  ? "text-[#181613] font-bold"
                  : "text-[#686153] hover:text-[#181613]"
              }`}
            >
              {tab.label}

              {/* Active Underline Bar matching target design */}
              {isActive && (
                <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-[#1b1916] rounded-full" />
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
