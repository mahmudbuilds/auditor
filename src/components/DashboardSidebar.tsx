"use client";

import { useEffect, useRef, useState } from "react";
import type { CourseItem, UserStats } from "@/types/recording";
import { CourseIcon, getCourseIconFromList } from "./CourseIcon";
import { CourseModal } from "./CourseModal";

interface DashboardSidebarProps {
  currentView: "overview" | "library" | "study-hub";
  onSelectView: (view: "overview" | "library" | "study-hub") => void;
  selectedCourse: string;
  onSelectCourse: (course: string) => void;
  courses: (CourseItem | string)[];
  stats: UserStats;
  onOpenRecord: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onAddCourse?: (name: string, icon: string) => void;
  onEditCourse?: (oldName: string, newName: string, newIcon: string) => void;
  onRenameCourse?: (oldName: string, newName: string) => void;
  onDeleteCourse?: (name: string) => void;
}

export function DashboardSidebar({
  currentView,
  onSelectView,
  selectedCourse,
  onSelectCourse,
  courses,
  stats,
  onOpenRecord,
  isMobileOpen,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
  onAddCourse,
  onEditCourse,
  onRenameCourse,
  onDeleteCourse,
}: DashboardSidebarProps) {
  const percentUsed = Math.min(
    100,
    Math.round((stats.storageUsedHours / stats.storageLimitHours) * 100),
  );

  // Normalize courses to CourseItem[]
  const normalizedCourses: CourseItem[] = courses.map((c, idx) => {
    if (typeof c === "string") {
      return {
        id: `course-${idx}`,
        name: c,
        icon: getCourseIconFromList(undefined, c),
      };
    }
    return c;
  });

  // Course management states
  const [menuOpenCourse, setMenuOpenCourse] = useState<string | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [courseModalConfig, setCourseModalConfig] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    initialName?: string;
    initialIcon?: string;
  }>({
    isOpen: false,
    mode: "add",
  });

  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenCourse(null);
      }
    };

    if (menuOpenCourse) {
      document.addEventListener("mousedown", handleOutsideClick);
      return () =>
        document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [menuOpenCourse]);

  // Global escape key handler to cancel editing or menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpenCourse(null);
        setCourseToDelete(null);
        setCourseModalConfig((prev) => ({ ...prev, isOpen: false }));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleStartAddCourse = () => {
    setMenuOpenCourse(null);
    setCourseModalConfig({
      isOpen: true,
      mode: "add",
      initialName: "",
      initialIcon: "book",
    });
  };

  const handleStartEditCourse = (course: CourseItem) => {
    setMenuOpenCourse(null);
    setCourseModalConfig({
      isOpen: true,
      mode: "edit",
      initialName: course.name,
      initialIcon: course.icon,
    });
  };

  const handleSaveCourseModal = (name: string, icon: string) => {
    if (courseModalConfig.mode === "add") {
      if (onAddCourse) {
        onAddCourse(name, icon);
      }
    } else {
      const oldName = courseModalConfig.initialName || "";
      if (onEditCourse) {
        onEditCourse(oldName, name, icon);
      } else if (onRenameCourse) {
        onRenameCourse(oldName, name);
      }
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Delete Course Confirmation Modal */}
      {courseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-[#181c22] border border-white/[0.12] shadow-2xl p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-editorial text-lg font-bold text-[#f5f2eb]">
                  Delete Course
                </h3>
                <p className="text-xs text-[#9ba1a8] mt-1 leading-relaxed">
                  Are you sure you want to delete{" "}
                  <strong className="text-[#f5f2eb] font-semibold">
                    {courseToDelete}
                  </strong>
                  ? Existing recordings will be moved to{" "}
                  <span className="text-[#e5a93c]">General Notes</span>.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={() => setCourseToDelete(null)}
                className="px-3.5 py-1.5 text-xs text-[#9ba1a8] hover:text-[#f5f2eb] rounded-lg hover:bg-[#20252b] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteCourse) onDeleteCourse(courseToDelete);
                  setCourseToDelete(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-red-500/90 hover:bg-red-500 text-white shadow-md transition-all active:scale-[0.98]"
              >
                Delete Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Modal for Adding / Editing */}
      <CourseModal
        isOpen={courseModalConfig.isOpen}
        mode={courseModalConfig.mode}
        initialName={courseModalConfig.initialName}
        initialIcon={courseModalConfig.initialIcon}
        existingCourses={normalizedCourses.map((c) => c.name)}
        onSave={handleSaveCourseModal}
        onClose={() =>
          setCourseModalConfig((prev) => ({ ...prev, isOpen: false }))
        }
      />

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#14171a] border-r border-white/[0.08] transition-all duration-300 lg:translate-x-0 ${
          isMobileOpen
            ? "translate-x-0 w-64"
            : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-[72px]" : "lg:w-64"}`}
      >
        {/* Brand / Logo Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/[0.08]">
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-[#e5a93c]/15 border border-[#e5a93c]/40 flex items-center justify-center text-[#e5a93c] flex-shrink-0">
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
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z"
                    />
                  </svg>
                </div>
                <div className="truncate">
                  <span className="font-editorial text-2xl font-bold tracking-tight text-[#f5f2eb]">
                    Auditor
                  </span>
                  <span className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c59e5e]">
                    Audio Notebook
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Desktop Collapse Toggle */}
                {onToggleCollapse && (
                  <button
                    type="button"
                    onClick={onToggleCollapse}
                    className="hidden lg:flex p-1.5 text-[#9ba1a8] hover:text-[#f5f2eb] rounded-lg hover:bg-[#1f242b] transition-colors"
                    title="Collapse sidebar (⌘B)"
                    aria-label="Collapse sidebar"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M9 3v18" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 9l-3 3 3 3"
                      />
                    </svg>
                  </button>
                )}

                {/* Close for mobile */}
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="lg:hidden p-1.5 text-[#9ba1a8] hover:text-[#f5f2eb] rounded-lg hover:bg-[#1f242b]"
                  aria-label="Close menu"
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
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
            </>
          ) : (
            /* Collapsed Brand Icon + Expand Button */
            <div className="w-full flex items-center justify-center">
              <button
                type="button"
                onClick={onToggleCollapse}
                className="group relative h-9 w-9 rounded-lg bg-[#e5a93c]/15 border border-[#e5a93c]/40 flex items-center justify-center text-[#e5a93c] hover:bg-[#e5a93c]/25 hover:border-[#e5a93c]/70 transition-all"
                title="Expand sidebar (⌘B)"
                aria-label="Expand sidebar"
              >
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 group-hover:scale-110 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 3v18" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 9l3 3-3 3"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Quick Capture Link */}
        {isMobileOpen && (
          <div className="p-3 lg:hidden">
            <button
              type="button"
              onClick={() => {
                onOpenRecord();
                onCloseMobile();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#e5a93c] text-[#14171a] font-semibold text-xs transition-all"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#14171a] animate-pulse" />
              <span>Record Audio</span>
            </button>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-6">
          {/* Main Navigation */}
          <div>
            {!isCollapsed && (
              <div className="px-3 mb-2 text-[11px] uppercase tracking-[0.18em] font-semibold text-[#8b919a]">
                Workspace
              </div>
            )}
            <nav className="space-y-1">
              {/* Dashboard Overview */}
              <button
                type="button"
                onClick={() => {
                  onSelectView("overview");
                  onCloseMobile();
                }}
                title={isCollapsed ? "Dashboard Overview" : undefined}
                className={`w-full flex items-center ${
                  isCollapsed
                    ? "justify-center px-0 py-2.5"
                    : "gap-3 px-3 py-2.5"
                } rounded-lg text-sm font-medium transition-colors ${
                  currentView === "overview"
                    ? "bg-[#1f242b] text-[#f5f2eb] border border-white/[0.08] shadow-sm"
                    : "text-[#9ba1a8] hover:bg-[#1a1e23] hover:text-[#f5f2eb]"
                }`}
              >
                <svg
                  aria-hidden="true"
                  className={`w-4 h-4 flex-shrink-0 ${
                    currentView === "overview"
                      ? "text-[#e5a93c]"
                      : "text-[#9ba1a8]"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                {!isCollapsed && <span>Dashboard Overview</span>}
              </button>

              {/* All Recordings */}
              <button
                type="button"
                onClick={() => {
                  onSelectView("library");
                  onCloseMobile();
                }}
                title={
                  isCollapsed
                    ? `All Recordings (${stats.totalRecordings})`
                    : undefined
                }
                className={`w-full flex items-center ${
                  isCollapsed
                    ? "justify-center px-0 py-2.5"
                    : "justify-between px-3 py-2.5"
                } rounded-lg text-sm font-medium transition-colors ${
                  currentView === "library"
                    ? "bg-[#1f242b] text-[#f5f2eb] border border-white/[0.08] shadow-sm"
                    : "text-[#9ba1a8] hover:bg-[#1a1e23] hover:text-[#f5f2eb]"
                }`}
              >
                <div
                  className={`flex items-center ${isCollapsed ? "justify-center relative" : "gap-3"}`}
                >
                  <svg
                    aria-hidden="true"
                    className={`w-4 h-4 flex-shrink-0 ${
                      currentView === "library"
                        ? "text-[#e5a93c]"
                        : "text-[#9ba1a8]"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  {!isCollapsed && <span>All Recordings</span>}
                  {isCollapsed && (
                    <span className="absolute -top-1.5 -right-2 h-2 w-2 rounded-full bg-[#e5a93c]" />
                  )}
                </div>
                {!isCollapsed && (
                  <span className="text-xs px-2 py-0.5 rounded bg-[#252c34] text-[#d4a34b] font-mono">
                    {stats.totalRecordings}
                  </span>
                )}
              </button>

              {/* AI Study Hub */}
              <button
                type="button"
                onClick={() => {
                  onSelectView("study-hub");
                  onCloseMobile();
                }}
                title={isCollapsed ? "AI Study Assistant" : undefined}
                className={`w-full flex items-center ${
                  isCollapsed
                    ? "justify-center px-0 py-2.5"
                    : "gap-3 px-3 py-2.5"
                } rounded-lg text-sm font-medium transition-colors ${
                  currentView === "study-hub"
                    ? "bg-[#1f242b] text-[#f5f2eb] border border-white/[0.08] shadow-sm"
                    : "text-[#9ba1a8] hover:bg-[#1a1e23] hover:text-[#f5f2eb]"
                }`}
              >
                <svg
                  aria-hidden="true"
                  className={`w-4 h-4 flex-shrink-0 ${
                    currentView === "study-hub"
                      ? "text-[#e5a93c]"
                      : "text-[#9ba1a8]"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                {!isCollapsed && <span>AI Study Assistant</span>}
              </button>
            </nav>
          </div>

          {/* Courses & Subjects */}
          <div>
            {/* Header: Title & Add Course button */}
            {!isCollapsed ? (
              <div className="flex items-center justify-between px-3 mb-2">
                <span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#8b919a]">
                  Courses & Tags
                </span>
                <button
                  type="button"
                  onClick={handleStartAddCourse}
                  className="p-1 rounded-md text-[#8b919a] hover:text-[#e5a93c] hover:bg-white/[0.06] transition-colors"
                  title="Add course"
                  aria-label="Add new course"
                >
                  <svg
                    aria-hidden="true"
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              /* Collapsed Header / Add button */
              <div className="flex flex-col items-center mb-2 pb-1 border-b border-white/[0.06]">
                <button
                  type="button"
                  onClick={handleStartAddCourse}
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-[#8b919a] hover:text-[#e5a93c] hover:bg-[#1f242b] transition-colors"
                  title="Add Course"
                  aria-label="Add Course"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Courses List */}
            <div className="space-y-0.5">
              {normalizedCourses.map((course) => {
                const isSelected = selectedCourse === course.name;
                const isAllCourses = course.name === "All Courses";

                if (isCollapsed) {
                  // Collapsed View: symbol icon button
                  return (
                    <button
                      key={course.id || course.name}
                      type="button"
                      onClick={() => {
                        onSelectCourse(course.name);
                        onCloseMobile();
                      }}
                      title={`${course.name} (${course.icon})`}
                      className={`w-full flex items-center justify-center h-9 rounded-lg text-xs font-semibold transition-all relative ${
                        isSelected
                          ? "bg-[#1f242b] text-[#e5a93c] border border-white/[0.08] shadow-sm"
                          : "text-[#9ba1a8] hover:bg-[#1a1e23] hover:text-[#f5f2eb]"
                      }`}
                    >
                      <CourseIcon
                        icon={course.icon}
                        className={`w-4 h-4 transition-colors ${
                          isSelected
                            ? "text-[#e5a93c]"
                            : "text-[#9ba1a8] group-hover:text-[#f5f2eb]"
                        }`}
                      />
                    </button>
                  );
                }

                return (
                  <div
                    key={course.id || course.name}
                    className={`group relative flex items-center justify-between rounded-lg text-xs transition-colors ${
                      isSelected
                        ? "bg-[#1f242b] text-[#e5a93c] font-medium"
                        : "text-[#9ba1a8] hover:bg-[#1a1e23] hover:text-[#f5f2eb]"
                    }`}
                  >
                    {/* Course Selection Button */}
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCourse(course.name);
                        onCloseMobile();
                      }}
                      className="flex-1 flex items-center gap-2.5 px-3 py-2 text-left truncate min-w-0"
                    >
                      <CourseIcon
                        icon={course.icon}
                        className={`w-4 h-4 flex-shrink-0 transition-colors ${
                          isSelected
                            ? "text-[#e5a93c]"
                            : "text-[#9ba1a8] group-hover:text-[#f5f2eb]"
                        }`}
                      />
                      <span className="truncate">{course.name}</span>
                    </button>

                    {/* Three Dots Button (for actual courses, not 'All Courses') */}
                    {!isAllCourses && (
                      <div className="relative flex-shrink-0 pr-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpenCourse(
                              menuOpenCourse === course.name
                                ? null
                                : course.name,
                            );
                          }}
                          className={`p-1 rounded-md text-[#8b919a] hover:text-[#f5f2eb] hover:bg-white/10 transition-all ${
                            menuOpenCourse === course.name
                              ? "text-[#f5f2eb] bg-white/10 opacity-100"
                              : "opacity-60 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                          }`}
                          title="Course options"
                          aria-label={`Options for ${course.name}`}
                        >
                          <svg
                            aria-hidden="true"
                            className="w-3.5 h-3.5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <circle cx="12" cy="5" r="1.75" />
                            <circle cx="12" cy="12" r="1.75" />
                            <circle cx="12" cy="19" r="1.75" />
                          </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {menuOpenCourse === course.name && (
                          <div
                            ref={menuRef}
                            role="menu"
                            tabIndex={-1}
                            className="absolute right-0 top-full mt-1 z-50 min-w-[130px] rounded-xl bg-[#1b2026] border border-white/10 shadow-2xl py-1 text-xs backdrop-blur-md animate-fade-in"
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                              if (e.key === "Escape") setMenuOpenCourse(null);
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => handleStartEditCourse(course)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-left text-[#cfd4dc] hover:text-[#f5f2eb] hover:bg-white/[0.06] transition-colors"
                            >
                              <svg
                                aria-hidden="true"
                                className="w-3.5 h-3.5 text-[#e5a93c]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                              <span>Edit course</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setMenuOpenCourse(null);
                                setCourseToDelete(course.name);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                            >
                              <svg
                                aria-hidden="true"
                                className="w-3.5 h-3.5 text-red-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              <span>Delete course</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Add Course Button (when expanded) */}
            {!isCollapsed && (
              <button
                type="button"
                onClick={handleStartAddCourse}
                className="w-full mt-2 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#8b919a] hover:text-[#e5a93c] hover:bg-[#1a1e23] border border-dashed border-white/[0.1] hover:border-[#e5a93c]/40 transition-all"
              >
                <svg
                  aria-hidden="true"
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Add Course</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer: Storage & User Profile */}
        <div className="p-3.5 border-t border-white/[0.08] bg-[#121518]/60 space-y-3">
          {!isCollapsed ? (
            <>
              {/* Storage Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[#9ba1a8]">
                  <span>Audio Storage</span>
                  <span className="font-mono text-[#f5f2eb]">
                    {stats.storageUsedHours}h / {stats.storageLimitHours}h
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#20252b] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#e5a93c] rounded-full transition-all duration-500"
                    style={{ width: `${percentUsed}%` }}
                  />
                </div>
              </div>

              {/* User Profile */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-[#252c34] border border-[#e5a93c]/30 flex items-center justify-center text-xs font-bold text-[#e5a93c] flex-shrink-0">
                    ER
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-[#f5f2eb] leading-tight truncate">
                      Elena Rostova
                    </div>
                    <div className="text-[11px] text-[#8b919a] leading-tight truncate">
                      Scholar Account
                    </div>
                  </div>
                </div>

                <div
                  className="h-2 w-2 rounded-full bg-emerald-400 flex-shrink-0"
                  title="Connected"
                />
              </div>
            </>
          ) : (
            /* Collapsed Storage & Profile Icons */
            <div className="flex flex-col items-center gap-3">
              {/* Mini Storage Indicator */}
              <div
                className="w-8 h-1.5 bg-[#20252b] rounded-full overflow-hidden"
                title={`Storage: ${stats.storageUsedHours}h / ${stats.storageLimitHours}h (${percentUsed}%)`}
              >
                <div
                  className="h-full bg-[#e5a93c] rounded-full"
                  style={{ width: `${percentUsed}%` }}
                />
              </div>

              {/* Avatar */}
              <div className="relative">
                <div
                  className="h-8 w-8 rounded-full bg-[#252c34] border border-[#e5a93c]/30 flex items-center justify-center text-xs font-bold text-[#e5a93c]"
                  title="Elena Rostova (Scholar Account)"
                >
                  ER
                </div>
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 border border-[#14171a]" />
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
