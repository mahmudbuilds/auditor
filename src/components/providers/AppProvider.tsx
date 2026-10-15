"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { MOCK_RECORDINGS } from "@/data/mockRecordings";
import type { RecordingItem } from "@/types/recording";

export interface Settings {
  noiseReduction: boolean;
  voiceEnhance: boolean;
  autoMarkSilence: boolean;
  keepScreenAwake: boolean;
  recordingQuality: "standard" | "high" | "lossless";
  autoTranscribe: boolean;
  speakerLabels: boolean;
  language: string;
  autoSummary: boolean;
  autoFlashcards: boolean;
  summaryLength: "short" | "balanced" | "detailed";
  cloudBackup: boolean;
  wifiOnly: boolean;
  keepAudioDays: "30" | "90" | "forever";
  shareAnalytics: boolean;
  reduceMotion: boolean;
  largeText: boolean;
  highContrast: boolean;
  displayName: string;
  email: string;
}

export const DEFAULT_SETTINGS: Settings = {
  noiseReduction: true,
  voiceEnhance: true,
  autoMarkSilence: false,
  keepScreenAwake: true,
  recordingQuality: "high",
  autoTranscribe: true,
  speakerLabels: true,
  language: "English (US)",
  autoSummary: true,
  autoFlashcards: true,
  summaryLength: "balanced",
  cloudBackup: false,
  wifiOnly: true,
  keepAudioDays: "forever",
  shareAnalytics: false,
  reduceMotion: false,
  largeText: false,
  highContrast: false,
  displayName: "Maya",
  email: "maya@example.com",
};

export interface Note {
  id: string;
  text: string;
}

interface AppContextValue {
  /** True once persisted state has been read on the client. */
  hydrated: boolean;
  recordings: RecordingItem[];
  getRecording: (id: string) => RecordingItem | undefined;
  addRecording: (rec: RecordingItem) => void;
  updateRecording: (id: string, patch: Partial<RecordingItem>) => void;
  deleteRecording: (id: string) => void;
  toggleStar: (id: string) => void;
  notes: Note[];
  addNote: (text: string) => void;
  removeNote: (id: string) => void;
  doneActions: Record<string, boolean>;
  toggleAction: (key: string) => void;
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  resetData: () => void;
  toast: (msg: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORE_KEY = "audiotap:v1";

interface Persisted {
  recordings: RecordingItem[];
  notes: Note[];
  doneActions: Record<string, boolean>;
  settings: Settings;
}

const PLACEHOLDER_LINE =
  "Transcription isn't connected yet. Connect a speech-to-text provider and the words from this recording will appear here.";

/** Fills in an empty transcript/summary when simulated processing finishes. */
function finalize(rec: RecordingItem): RecordingItem {
  if (rec.transcript.length > 0) return { ...rec, status: "ready" };
  return {
    ...rec,
    status: "ready",
    transcript: [
      {
        id: `${rec.id}-t0`,
        speaker: "AUDIOTAP",
        timestamp: "00:00",
        seconds: 0,
        text: PLACEHOLDER_LINE,
      },
    ],
    summary: {
      overview:
        "An AI summary will appear here once transcription is connected.",
      keyTakeaways: [],
      studyQuestions: [],
    },
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [recordings, setRecordings] =
    useState<RecordingItem[]>(MOCK_RECORDINGS);
  const [notes, setNotes] = useState<Note[]>([]);
  const [doneActions, setDoneActions] = useState<Record<string, boolean>>({});
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load persisted state once on the client.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as Partial<Persisted>;
        if (data.recordings) setRecordings(data.recordings);
        if (data.notes) setNotes(data.notes);
        if (data.doneActions) setDoneActions(data.doneActions);
        if (data.settings)
          setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
      }
    } catch {
      // Corrupt storage: fall back to the seeded data.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      const data: Persisted = { recordings, notes, doneActions, settings };
      window.localStorage.setItem(STORE_KEY, JSON.stringify(data));
    } catch {
      // Storage full or unavailable; state still works for this session.
    }
  }, [loaded, recordings, notes, doneActions, settings]);

  // Reflect accessibility preferences on <html>.
  useEffect(() => {
    const el = document.documentElement;
    el.dataset.reduceMotion = String(settings.reduceMotion);
    el.dataset.largeText = String(settings.largeText);
    el.dataset.highContrast = String(settings.highContrast);
  }, [settings.reduceMotion, settings.largeText, settings.highContrast]);

  // Simulated processing: moves "processing" recordings to "ready".
  const hasProcessing = recordings.some((r) => r.status === "processing");
  useEffect(() => {
    if (!hasProcessing) return;
    const tick = () => {
      const now = Date.now();
      setRecordings((prev) => {
        let changed = false;
        const next = prev.map((r) => {
          if (r.status !== "processing") return r;
          if (!r.readyAt) {
            changed = true;
            return { ...r, startedAt: now, readyAt: now + 60_000 };
          }
          if (now >= r.readyAt) {
            changed = true;
            return finalize(r);
          }
          return r;
        });
        return changed ? next : prev;
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [hasProcessing]);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2800);
  }, []);

  const value: AppContextValue = {
    hydrated: loaded,
    recordings,
    getRecording: (id) => recordings.find((r) => r.id === id),
    addRecording: (rec) => setRecordings((p) => [rec, ...p]),
    updateRecording: (id, patch) =>
      setRecordings((p) =>
        p.map((r) => (r.id === id ? { ...r, ...patch } : r)),
      ),
    deleteRecording: (id) => setRecordings((p) => p.filter((r) => r.id !== id)),
    toggleStar: (id) =>
      setRecordings((p) =>
        p.map((r) => (r.id === id ? { ...r, isStarred: !r.isStarred } : r)),
      ),
    notes,
    addNote: (text) =>
      setNotes((p) => [
        { id: `note-${p.length}-${text.length}-${Date.now()}`, text },
        ...p,
      ]),
    removeNote: (id) => setNotes((p) => p.filter((n) => n.id !== id)),
    doneActions,
    toggleAction: (key) => setDoneActions((p) => ({ ...p, [key]: !p[key] })),
    settings,
    updateSettings: (patch) => setSettings((p) => ({ ...p, ...patch })),
    resetData: () => {
      setRecordings(MOCK_RECORDINGS);
      setNotes([]);
      setDoneActions({});
      setSettings(DEFAULT_SETTINGS);
    },
    toast,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex justify-center px-4 lg:bottom-6"
      >
        {toastMsg && (
          <div className="animate-fade-in flex items-center gap-2.5 rounded-[5px] border border-[#f6ad3c] bg-[#161616] px-4 py-2.5 text-[13px] text-[#f3efe6] shadow-2xl">
            <span className="h-2 w-2 rounded-full bg-[#f6ad3c]" />
            {toastMsg}
          </div>
        )}
      </div>
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
