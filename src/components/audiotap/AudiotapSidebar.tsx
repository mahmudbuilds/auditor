"use client";

import React from "react";
import { ScrewHead } from "./ScrewHead";
import {
  FileText,
  AlignLeft,
  ListTodo,
  Layers,
  MessageSquare,
  Settings as SettingsIcon,
} from "lucide-react";

export type SidebarView =
  | "recordings"
  | "transcripts"
  | "summaries"
  | "flashcards"
  | "chat"
  | "settings";

interface AudiotapSidebarProps {
  activeView: SidebarView;
  onSelectView: (view: SidebarView) => void;
  onOpenNewRecording: () => void;
  className?: string;
}

export function AudiotapSidebar({
  activeView,
  onSelectView,
  onOpenNewRecording,
  className = "",
}: AudiotapSidebarProps) {
  const menuItems: { id: SidebarView; label: string; icon: React.ReactNode }[] =
    [
      {
        id: "recordings",
        label: "My Recordings",
        icon: <FileText className="w-4 h-4 stroke-[1.8]" />,
      },
      {
        id: "transcripts",
        label: "Transcripts",
        icon: <AlignLeft className="w-4 h-4 stroke-[1.8]" />,
      },
      {
        id: "summaries",
        label: "Summaries",
        icon: <ListTodo className="w-4 h-4 stroke-[1.8]" />,
      },
      {
        id: "flashcards",
        label: "Flashcards",
        icon: <Layers className="w-4 h-4 stroke-[1.8]" />,
      },
      {
        id: "chat",
        label: "AI Chat",
        icon: <MessageSquare className="w-4 h-4 stroke-[1.8]" />,
      },
      {
        id: "settings",
        label: "Settings",
        icon: <SettingsIcon className="w-4 h-4 stroke-[1.8]" />,
      },
    ];

  return (
    <div
      className={`audiotap-panel rounded-[4px] p-3.5 relative flex flex-col select-none ${className}`}
    >
      {/* 2 Structural Screws at the outer left corner edges */}
      <ScrewHead className="absolute top-2.5 left-2.5" rotation={22} />
      <ScrewHead className="absolute bottom-2.5 left-2.5" rotation={68} />

      <div className="pt-2 px-1">
        {/* Top Button: "New Recording" (Dark Recessed Pill with Glowing Red LED Jewel) */}
        <button
          type="button"
          onClick={onOpenNewRecording}
          className="w-full h-11 px-3.5 rounded-lg bg-gradient-to-b from-[#24262a] via-[#1a1c1f] to-[#121316] text-white border border-[#3b3f46] shadow-[0_2px_5px_rgba(0,0,0,0.4),_inset_0_1px_1px_rgba(255,255,255,0.2)] hover:from-[#2e3136] hover:to-[#17191c] active:translate-y-[1px] flex items-center gap-3 transition-all cursor-pointer group mb-6"
        >
          {/* Glowing Red LED Jewel */}
          <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] shadow-[0_0_8px_#ef4444,0_0_14px_rgba(239,68,68,0.7)] shrink-0 animate-pulse" />
          <span className="text-xs font-semibold tracking-wide text-[#f5f2eb]">
            New Recording
          </span>
        </button>

        {/* Sidebar Nav Items */}
        <nav className="space-y-3.5">
          {menuItems.map((item) => {
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectView(item.id)}
                className={`w-full px-2 py-1.5 rounded flex items-center gap-3 text-xs font-medium transition-colors cursor-pointer text-left ${
                  isActive
                    ? "text-[#161411] font-bold"
                    : "text-[#3f3b33] hover:text-[#161411]"
                }`}
              >
                <span
                  className={isActive ? "text-[#161411]" : "text-[#524c41]"}
                >
                  {item.icon}
                </span>
                <span className="tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
