"use client";

import { useEffect, useState } from "react";
import { AiStudyHub } from "@/components/AiStudyHub";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DockedAudioPlayer } from "@/components/DockedAudioPlayer";
import { HeroRecordSection } from "@/components/HeroRecordSection";
import { LiveRecordingStudioModal } from "@/components/LiveRecordingStudioModal";
import { RecordingsTable } from "@/components/RecordingsTable";
import { RecordingWorkspace } from "@/components/RecordingWorkspace";
import {
  INITIAL_COURSES,
  INITIAL_USER_STATS,
  MOCK_RECORDINGS,
} from "@/data/mockRecordings";
import type { CourseItem, RecordingItem, UserStats } from "@/types/recording";

export default function Home() {
  const [currentView, setCurrentView] = useState<
    "overview" | "library" | "study-hub" | "workspace"
  >("overview");
  const [recordings, setRecordings] =
    useState<RecordingItem[]>(MOCK_RECORDINGS);
  const [courses, setCourses] = useState<CourseItem[]>(INITIAL_COURSES);
  const [selectedRecording, setSelectedRecording] = useState<RecordingItem>(
    MOCK_RECORDINGS[0],
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDockedPlayer, setShowDockedPlayer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState<UserStats>(INITIAL_USER_STATS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Global keyboard shortcut: Cmd/Ctrl + B toggles sidebar collapse
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        !e.altKey &&
        (e.key === "b" || e.key === "B")
      ) {
        e.preventDefault();
        setIsSidebarCollapsed((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchFocus = () => {
    if (currentView === "workspace" || currentView === "study-hub") {
      setCurrentView("overview");
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (
      query.trim() &&
      (currentView === "workspace" || currentView === "study-hub")
    ) {
      setCurrentView("overview");
    }
  };

  // New recording presets
  const [recordPresetTitle, setRecordPresetTitle] = useState(
    "New Lecture Recording",
  );
  const [recordPresetCourse, setRecordPresetCourse] = useState("Economics 101");
  const [recordPresetSpeaker, setRecordPresetSpeaker] =
    useState("Prof. David Miller");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Add a new course
  const handleAddCourse = (name: string, icon = "book") => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (courses.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      showToast(`Course "${trimmed}" already exists.`);
      return;
    }
    const newCourse: CourseItem = {
      id: `course-${Date.now()}`,
      name: trimmed,
      icon,
    };
    setCourses((prev) => [...prev, newCourse]);
    setSelectedCourse(trimmed);
    showToast(`Course "${trimmed}" created.`);
  };

  // Edit / Rename an existing course
  const handleEditCourse = (
    oldName: string,
    newName: string,
    newIcon: string,
  ) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    if (
      courses.some(
        (c) =>
          c.name.toLowerCase() === trimmed.toLowerCase() &&
          c.name.toLowerCase() !== oldName.toLowerCase(),
      )
    ) {
      showToast(`Course "${trimmed}" already exists.`);
      return;
    }

    setCourses((prev) =>
      prev.map((c) =>
        c.name === oldName ? { ...c, name: trimmed, icon: newIcon } : c,
      ),
    );
    if (selectedCourse === oldName) {
      setSelectedCourse(trimmed);
    }
    if (oldName !== trimmed) {
      setRecordings((prev) =>
        prev.map((rec) =>
          rec.course === oldName ? { ...rec, course: trimmed } : rec,
        ),
      );
      showToast(`Updated course "${trimmed}".`);
    } else {
      showToast(`Updated symbol for "${trimmed}".`);
    }
  };

  // Delete an existing course
  const handleDeleteCourse = (nameToDelete: string) => {
    if (nameToDelete === "All Courses") return;

    setCourses((prev) => {
      const next = prev.filter((c) => c.name !== nameToDelete);
      const hasRecordingsInCourse = recordings.some(
        (r) => r.course === nameToDelete,
      );
      if (
        hasRecordingsInCourse &&
        !next.some((c) => c.name === "General Notes")
      ) {
        next.push({
          id: "general-notes",
          name: "General Notes",
          icon: "folder",
        });
      }
      return next;
    });

    if (selectedCourse === nameToDelete) {
      setSelectedCourse("All Courses");
    }

    setRecordings((prev) =>
      prev.map((rec) =>
        rec.course === nameToDelete ? { ...rec, course: "General Notes" } : rec,
      ),
    );
    showToast(`Course "${nameToDelete}" deleted.`);
  };

  const handleOpenRecord = (
    title = "New Audio Session",
    course = "Economics 101",
    speaker = "Prof. David Miller",
  ) => {
    setRecordPresetTitle(title);
    setRecordPresetCourse(course);
    setRecordPresetSpeaker(speaker);
    setIsRecordingModalOpen(true);
  };

  const handleSaveNewSession = (newSession: RecordingItem) => {
    setRecordings((prev) => [newSession, ...prev]);
    setSelectedRecording(newSession);
    setShowDockedPlayer(true);
    setStats((prev) => ({
      ...prev,
      totalRecordings: prev.totalRecordings + 1,
      insightsGenerated: prev.insightsGenerated + 3,
      storageUsedHours: +(prev.storageUsedHours + 0.5).toFixed(1),
    }));
    showToast(
      `Session "${newSession.title}" saved with transcript and AI takeaways.`,
    );
  };

  const handleTogglePlay = (rec?: RecordingItem) => {
    if (rec && rec.id !== selectedRecording.id) {
      setSelectedRecording(rec);
      setIsPlaying(true);
      setShowDockedPlayer(true);
    } else {
      const nextPlaying = !isPlaying;
      setIsPlaying(nextPlaying);
      if (nextPlaying) {
        setShowDockedPlayer(true);
      }
    }
  };

  const handleToggleStar = (id: string) => {
    setRecordings((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = !r.isStarred;
          showToast(
            updated ? "Added to Starred Notes ★" : "Removed from Starred Notes",
          );
          return { ...r, isStarred: updated };
        }
        return r;
      }),
    );
  };

  const handleOpenWorkspace = (rec: RecordingItem) => {
    setSelectedRecording(rec);
    setCurrentView("workspace");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentViewTitle =
    currentView === "overview"
      ? "Overview Dashboard"
      : currentView === "library"
        ? "All Recordings"
        : currentView === "study-hub"
          ? "AI Study Assistant"
          : "Lecture Intelligence Workspace";

  return (
    <div className="min-h-screen bg-[#14171a] text-[#f5f2eb] flex pb-24">
      {/* Left Collapsible Sidebar */}
      <DashboardSidebar
        currentView={currentView === "workspace" ? "overview" : currentView}
        onSelectView={(v) => {
          setCurrentView(v);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        selectedCourse={selectedCourse}
        onSelectCourse={(course) => {
          setSelectedCourse(course);
          if (currentView === "workspace") {
            setCurrentView("overview");
          }
        }}
        courses={courses}
        stats={stats}
        onOpenRecord={() => handleOpenRecord()}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        onAddCourse={handleAddCourse}
        onEditCourse={handleEditCourse}
        onDeleteCourse={handleDeleteCourse}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-64"
        }`}
      >
        {/* Top Header */}
        <DashboardHeader
          currentViewTitle={currentViewTitle}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearchFocus={handleSearchFocus}
          selectedCourse={selectedCourse}
          onSelectCourse={setSelectedCourse}
          courses={courses}
          onOpenRecord={() => handleOpenRecord()}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebarCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        {/* Main Body Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-7">
          {/* TOAST NOTIFICATION */}
          {toastMessage && (
            <div className="fixed bottom-24 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#20262f] border border-[#e5a93c]/40 text-xs font-medium text-[#f5f2eb] shadow-xl animate-fade-in">
              <span className="h-2 w-2 rounded-full bg-[#e5a93c]" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* VIEW: WORKSPACE (DEEP DIVE SESSION VIEW) */}
          {currentView === "workspace" ? (
            <RecordingWorkspace
              recording={selectedRecording}
              onBack={() => setCurrentView("overview")}
              isPlaying={isPlaying}
              onTogglePlay={() => handleTogglePlay(selectedRecording)}
              onToggleStar={handleToggleStar}
            />
          ) : currentView === "study-hub" ? (
            /* VIEW: AI STUDY HUB (FLASHCARDS, AI TUTOR, QUIZ & STUDY GUIDE) */
            <AiStudyHub
              recordings={recordings}
              onOpenRecording={handleOpenWorkspace}
              selectedCourse={selectedCourse}
              courses={courses}
              onSelectCourse={setSelectedCourse}
            />
          ) : (
            /* VIEWS: OVERVIEW, LIBRARY, STARRED */
            <div className="space-y-7">
              {/* BIG VISIBLE HERO RECORD SECTION (Shown on Overview) */}
              {currentView === "overview" && (
                <HeroRecordSection
                  onStartRecord={(title, course, mode) =>
                    handleOpenRecord(
                      title,
                      course,
                      mode === "lecture" ? "Prof. David Miller" : "Self",
                    )
                  }
                  courses={courses.map((c) => c.name)}
                />
              )}

              {/* Clean Recordings Feed */}
              <div className="space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-editorial text-2xl font-bold text-[#f5f2eb]">
                      {currentView === "overview"
                        ? "Recent Sessions"
                        : "All Recordings"}
                    </h3>
                    <p className="text-xs text-[#8b919a] mt-0.5">
                      {currentView === "overview"
                        ? `Showing latest 3 of ${recordings.length} sessions · Tap any recording to listen or explore AI study notes`
                        : `${recordings.length} recordings saved · ${stats.totalHours} total audio · Filter by course, type, or search`}
                    </p>
                  </div>

                  {currentView === "overview" && (
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentView("library");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="text-xs text-[#e5a93c] hover:underline font-semibold self-start sm:self-auto flex items-center gap-1 cursor-pointer"
                    >
                      <span>Explore full library ({recordings.length})</span>
                      <span>→</span>
                    </button>
                  )}
                </div>

                <RecordingsTable
                  recordings={
                    currentView === "overview"
                      ? recordings.slice(0, 3)
                      : recordings
                  }
                  selectedRecording={selectedRecording}
                  onSelectRecording={(rec) => {
                    setSelectedRecording(rec);
                    setShowDockedPlayer(true);
                  }}
                  onOpenWorkspace={handleOpenWorkspace}
                  isPlaying={isPlaying}
                  onTogglePlay={(rec) => {
                    handleTogglePlay(rec);
                    setShowDockedPlayer(true);
                  }}
                  onToggleStar={handleToggleStar}
                  searchQuery={searchQuery}
                  selectedCourse={selectedCourse}
                  onSelectCourse={setSelectedCourse}
                  courses={courses}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Docked Audio Player (Smooth Bottom Bar when Active) */}
      {showDockedPlayer && (
        <DockedAudioPlayer
          recording={selectedRecording}
          isPlaying={isPlaying}
          onTogglePlay={() => handleTogglePlay(selectedRecording)}
          onOpenWorkspace={handleOpenWorkspace}
          onClose={() => {
            setIsPlaying(false);
            setShowDockedPlayer(false);
          }}
        />
      )}

      {/* Live Recording Studio Modal Overlay */}
      <LiveRecordingStudioModal
        isOpen={isRecordingModalOpen}
        onClose={() => setIsRecordingModalOpen(false)}
        initialTitle={recordPresetTitle}
        initialCourse={recordPresetCourse}
        initialSpeaker={recordPresetSpeaker}
        courses={courses.map((c) => c.name)}
        onSaveSession={handleSaveNewSession}
      />
    </div>
  );
}
