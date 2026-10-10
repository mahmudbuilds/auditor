"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { CourseItem } from "@/types/recording";
import { CourseIcon, getCourseIconFromList } from "./CourseIcon";

interface DashboardHeaderProps {
  currentViewTitle: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchFocus?: () => void;
  selectedCourse: string;
  onSelectCourse: (course: string) => void;
  courses: (CourseItem | string)[];
  onOpenRecord: () => void;
  onOpenMobileSidebar: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebarCollapse?: () => void;
}

export function DashboardHeader({
  currentViewTitle,
  searchQuery,
  onSearchChange,
  onSearchFocus,
  selectedCourse,
  onSelectCourse,
  courses,
  onOpenRecord,
  onOpenMobileSidebar,
  isSidebarCollapsed,
  onToggleSidebarCollapse,
}: DashboardHeaderProps) {
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [shortcutKey, setShortcutKey] = useState("⌘K");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Detect platform for keyboard shortcut display label (Cmd+K on Mac, Ctrl+K on Windows/Linux)
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const isMac = /(Mac|iPhone|iPod|iPad)/i.test(
        navigator.platform || navigator.userAgent,
      );
      setShortcutKey(isMac ? "⌘K" : "Ctrl+K");
    }
  }, []);

  // Global keyboard shortcut: Ctrl+K or Cmd+K focuses and selects the search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isK = e.key === "k" || e.key === "K" || e.code === "KeyK";
      if ((e.ctrlKey || e.metaKey) && !e.altKey && isK) {
        e.preventDefault();
        if (typeof window !== "undefined" && window.innerWidth < 768) {
          setIsMobileSearchOpen(true);
        }
        onSearchFocus?.();

        // Immediate focus & select
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.select();
        }
        // Fallback for mobile state toggle
        requestAnimationFrame(() => {
          searchInputRef.current?.focus();
          searchInputRef.current?.select();
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [onSearchFocus]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      if (searchQuery) {
        onSearchChange("");
      } else {
        searchInputRef.current?.blur();
        setIsMobileSearchOpen(false);
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#14171a]/90 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-6 flex items-center justify-between gap-4 relative">
      {/* Left: Mobile Toggle + Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0 max-w-[calc(50%-13rem)] xl:max-w-[calc(50%-15rem)]">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-[#9ba1a8] hover:text-[#f5f2eb] rounded-lg hover:bg-[#1f242b]"
          aria-label="Open sidebar"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Desktop Sidebar Toggle */}
        {onToggleSidebarCollapse && (
          <button
            type="button"
            onClick={onToggleSidebarCollapse}
            className="hidden lg:flex p-2 text-[#9ba1a8] hover:text-[#f5f2eb] rounded-lg hover:bg-[#1f242b] transition-colors shrink-0"
            title={
              isSidebarCollapsed
                ? "Expand sidebar (⌘B)"
                : "Collapse sidebar (⌘B)"
            }
            aria-label={
              isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
                stroke="currentColor"
              />
              <path d="M9 3v18" stroke="currentColor" />
              {isSidebarCollapsed ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 12h5m-2-3l3 3-3 3"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 12h-5m2-3l-3 3 3 3"
                />
              )}
            </svg>
          </button>
        )}

        <div className="min-w-0 overflow-hidden">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-[#8b919a] min-w-0"
          >
            <span className="font-semibold text-[#c59e5e] shrink-0">Auditor</span>
            <span className="text-white/20 shrink-0">/</span>
            <span
              className={`font-medium truncate ${
                selectedCourse === "All Courses"
                  ? "text-[#f5f2eb]"
                  : "text-[#9ba1a8]"
              }`}
            >
              {currentViewTitle}
            </span>
            {selectedCourse !== "All Courses" && (
              <>
                <span className="text-white/20 shrink-0">/</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.08] text-[#f5f2eb] border border-white/10 font-medium text-xs max-w-[160px] sm:max-w-[200px] shrink-0">
                  <CourseIcon
                    icon={getCourseIconFromList(
                      typeof courses[0] === "string" ? undefined : (courses as CourseItem[]),
                      selectedCourse,
                    )}
                    className="w-3.5 h-3.5 shrink-0 text-[#e5a93c]"
                  />
                  <span className="truncate">{selectedCourse}</span>
                  <button
                    type="button"
                    onClick={() => onSelectCourse("All Courses")}
                    className="hover:text-white transition-colors cursor-pointer text-xs leading-none shrink-0 ml-0.5"
                    title="Clear course filter"
                    aria-label={`Clear ${selectedCourse} filter`}
                  >
                    ×
                  </button>
                </span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Middle: Global Search Input */}
      <div
        className={
          isMobileSearchOpen
            ? "fixed inset-x-0 top-0 h-16 bg-[#14171a] px-4 z-40 flex items-center gap-3 border-b border-white/[0.08] md:absolute md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:h-auto md:bg-transparent md:border-none md:px-0 md:w-full md:max-w-sm xl:max-w-md md:z-10 md:pointer-events-none md:flex md:items-center md:justify-center"
            : "hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm xl:max-w-md z-10 pointer-events-none items-center justify-center px-4 md:px-0"
        }
      >
        <div className="relative flex-1 pointer-events-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8b919a]">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleInputKeyDown}
            onFocus={onSearchFocus}
            placeholder="Search transcripts, topics, or notes..."
            className="w-full pl-9 pr-16 py-2 bg-[#1b2026] hover:bg-[#1f242b] focus:bg-[#20262e] border border-white/[0.08] focus:border-[#e5a93c]/50 focus:ring-1 focus:ring-[#e5a93c]/30 rounded-lg text-xs text-[#f5f2eb] placeholder-[#8b919a] transition-colors outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => {
                onSearchChange("");
                searchInputRef.current?.focus();
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-[#8b919a] hover:text-[#f5f2eb]"
              title="Clear search"
            >
              Clear
            </button>
          ) : (
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center">
              <button
                type="button"
                onClick={() => {
                  searchInputRef.current?.focus();
                  searchInputRef.current?.select();
                }}
                className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] uppercase font-mono text-[#8b919a] hover:text-[#f5f2eb] bg-[#14171a] hover:bg-[#20252c] border border-white/[0.08] rounded transition-colors"
                title={`Press ${shortcutKey} to search`}
              >
                {shortcutKey}
              </button>
            </div>
          )}
        </div>

        {isMobileSearchOpen && (
          <button
            type="button"
            onClick={() => {
              setIsMobileSearchOpen(false);
            }}
            className="md:hidden text-xs text-[#8b919a] hover:text-[#f5f2eb] px-2 py-1 font-medium transition-colors pointer-events-auto"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Right: Controls & Actions */}
      <div className="flex items-center gap-3 ml-auto z-10 shrink-0">
        {/* Mobile Search Icon Button */}
        <button
          type="button"
          onClick={() => {
            setIsMobileSearchOpen(true);
            onSearchFocus?.();
            requestAnimationFrame(() => {
              searchInputRef.current?.focus();
              searchInputRef.current?.select();
            });
          }}
          className="md:hidden p-2 text-[#9ba1a8] hover:text-[#f5f2eb] rounded-lg hover:bg-[#1f242b]"
          aria-label={`Search (${shortcutKey})`}
          title={`Search (${shortcutKey})`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        {/* Primary Record Action Button */}
        <button
          type="button"
          onClick={onOpenRecord}
          id="header-record-btn"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#e5a93c] hover:bg-[#f3b74b] active:scale-[0.98] text-[#14171a] font-semibold text-xs shadow-sm hover:shadow-[0_0_15px_rgba(229,169,60,0.35)] transition-all cursor-pointer"
          title="Start new audio recording"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14171a] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14171a]" />
          </span>
          <span className="hidden sm:inline">Record Audio</span>
          <span className="sm:hidden">Record</span>
        </button>
      </div>
    </header>
  );
}
