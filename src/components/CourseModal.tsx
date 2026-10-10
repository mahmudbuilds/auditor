"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { COURSE_ICON_OPTIONS, CourseIcon } from "./CourseIcon";

interface CourseModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  initialName?: string;
  initialIcon?: string;
  existingCourses: string[];
  onSave: (name: string, icon: string) => void;
  onClose: () => void;
}

export function CourseModal({
  isOpen,
  mode,
  initialName = "",
  initialIcon = "book",
  existingCourses,
  onSave,
  onClose,
}: CourseModalProps) {
  const [courseName, setCourseName] = useState(initialName);
  const [selectedIcon, setSelectedIcon] = useState(initialIcon);
  const [error, setError] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Sync state whenever modal opens or props change
  useEffect(() => {
    if (isOpen) {
      setCourseName(initialName);
      setSelectedIcon(initialIcon || "book");
      setError(null);
      setSearchFilter("");
      setTimeout(() => {
        inputRef.current?.focus();
        if (mode === "edit") {
          inputRef.current?.select();
        }
      }, 50);
    }
  }, [isOpen, initialName, initialIcon, mode]);

  // Global escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = courseName.trim();

  const handleNameChange = (val: string) => {
    setCourseName(val);
    const newTrimmed = val.trim();
    if (newTrimmed) {
      const isDuplicate = existingCourses.some(
        (c) =>
          c.toLowerCase() === newTrimmed.toLowerCase() &&
          (mode === "add" ||
            c.toLowerCase() !== initialName.trim().toLowerCase()),
      );
      if (isDuplicate) {
        setError(`A course named "${newTrimmed}" already exists.`);
      } else {
        setError(null);
      }
    } else {
      setError(null);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!trimmed) {
      setError("Please enter a course name.");
      return;
    }
    const isDuplicate = existingCourses.some(
      (c) =>
        c.toLowerCase() === trimmed.toLowerCase() &&
        (mode === "add" ||
          c.toLowerCase() !== initialName.trim().toLowerCase()),
    );
    if (isDuplicate) {
      setError(`A course named "${trimmed}" already exists.`);
      return;
    }

    onSave(trimmed, selectedIcon);
    onClose();
  };

  const filteredIcons = COURSE_ICON_OPTIONS.filter(
    (opt) =>
      opt.label.toLowerCase().includes(searchFilter.toLowerCase()) ||
      opt.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      opt.category?.toLowerCase().includes(searchFilter.toLowerCase()),
  );

  const selectedOption = COURSE_ICON_OPTIONS.find(
    (o) => o.id === selectedIcon,
  ) || {
    id: selectedIcon,
    label: selectedIcon,
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-modal-title"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl bg-[#181c22] border border-white/[0.12] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-[#14171a]/60">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-[#e5a93c]">
              <CourseIcon icon={selectedIcon} className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="course-modal-title"
                className="font-editorial text-lg font-bold text-[#f5f2eb]"
              >
                {mode === "add" ? "Add New Course" : "Edit Course"}
              </h2>
              <p className="text-xs text-[#8b919a]">
                {mode === "add"
                  ? "Assign a name and symbol for this subject"
                  : `Update symbol or rename "${initialName}"`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8b919a] hover:text-[#f5f2eb] hover:bg-white/[0.08] transition-colors"
            aria-label="Close dialog"
          >
            <svg
              aria-hidden="true"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-5 space-y-5"
        >
          {/* Course Name Input */}
          <div>
            <label
              htmlFor="course-name-input"
              className="block text-xs uppercase tracking-wider font-semibold text-[#8b919a] mb-1.5"
            >
              Course Name
            </label>
            <input
              id="course-name-input"
              ref={inputRef}
              type="text"
              value={courseName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Cognitive Psychology, Architecture 101..."
              className={`w-full px-3.5 py-2.5 rounded-xl bg-[#121518] border text-sm text-[#f5f2eb] placeholder-[#6b7280] outline-none transition-all ${
                error
                  ? "border-red-500/60 focus:border-red-500 ring-1 ring-red-500/30"
                  : "border-white/10 focus:border-[#e5a93c]/70 focus:ring-1 focus:ring-[#e5a93c]/40"
              }`}
            />
            {error && (
              <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1 animate-fade-in">
                <svg
                  aria-hidden="true"
                  className="w-3.5 h-3.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </p>
            )}
          </div>

          {/* Symbol / Icon Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#8b919a]">
                  Course Symbol
                </span>
                <span className="ml-2 text-[11px] text-[#8b919a]/80 font-normal">
                  (Choose from icon pool)
                </span>
              </div>
              <span className="text-[11px] text-[#e5a93c] font-medium font-mono">
                {selectedOption.label}
              </span>
            </div>

            {/* Quick search/filter bar for the icons */}
            <div className="relative mb-2.5">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter symbols (e.g. brain, math, chart)..."
                className="w-full px-3 py-1.5 pl-8 rounded-lg bg-[#121518] border border-white/[0.08] text-xs text-[#f5f2eb] placeholder-[#6b7280] outline-none focus:border-white/20 transition-colors"
              />
              <svg
                aria-hidden="true"
                className="w-3.5 h-3.5 text-[#6b7280] absolute left-2.5 top-2.5"
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
              {searchFilter && (
                <button
                  type="button"
                  onClick={() => setSearchFilter("")}
                  className="absolute right-2.5 top-2 text-xs text-[#8b919a] hover:text-[#f5f2eb]"
                >
                  ×
                </button>
              )}
            </div>

            {/* Icon Grid Pool */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1 rounded-xl bg-[#121518]/60 border border-white/[0.06]">
              {filteredIcons.map((opt) => {
                const isSelected = selectedIcon === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedIcon(opt.id)}
                    title={opt.label}
                    className={`group relative flex flex-col items-center justify-center py-2.5 px-1.5 rounded-xl border transition-all text-center ${
                      isSelected
                        ? "bg-[#e5a93c]/15 border-[#e5a93c] text-[#e5a93c] shadow-sm ring-1 ring-[#e5a93c]/40"
                        : "bg-[#14171a]/70 border-white/[0.08] text-[#9ba1a8] hover:border-white/20 hover:text-[#f5f2eb] hover:bg-[#1f242b]"
                    }`}
                  >
                    <CourseIcon
                      icon={opt.id}
                      className="w-5 h-5 transition-transform group-hover:scale-110"
                    />
                    <span className="text-[9px] mt-1 truncate max-w-full leading-tight font-medium opacity-80 group-hover:opacity-100">
                      {opt.id}
                    </span>
                  </button>
                );
              })}
              {filteredIcons.length === 0 && (
                <div className="col-span-full py-6 text-center text-xs text-[#8b919a]">
                  No symbols matching &ldquo;{searchFilter}&rdquo;
                </div>
              )}
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="p-3 rounded-xl bg-[#121518] border border-white/[0.06] space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8b919a]">
              Sidebar Preview
            </span>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#1f242b] border border-white/[0.08]">
              <CourseIcon
                icon={selectedIcon}
                className="w-4 h-4 text-[#e5a93c] flex-shrink-0"
              />
              <span className="text-xs font-medium text-[#f5f2eb] truncate">
                {trimmed || "Course Name"}
              </span>
              <span className="ml-auto text-[10px] text-[#8b919a] font-mono">
                Symbol: {selectedIcon}
              </span>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 border-t border-white/[0.08] bg-[#14171a]/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#9ba1a8] hover:text-[#f5f2eb] rounded-xl hover:bg-[#20252b] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={!trimmed || !!error}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#e5a93c] hover:bg-[#d4992c] text-[#14171a] shadow-md transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {mode === "add" ? "Create Course" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
