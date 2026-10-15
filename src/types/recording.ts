export interface TranscriptSegment {
  id: string;
  speaker: string;
  timestamp: string;
  seconds: number;
  text: string;
}

export interface StudyQuestion {
  question: string;
  answer: string;
}

export interface RecordingSummary {
  overview: string;
  keyTakeaways: string[];
  studyQuestions: StudyQuestion[];
  actionItems?: string[];
}

export interface RecordingItem {
  id: string;
  title: string;
  course: string;
  speaker: string;
  date: string;
  duration: string;
  durationSeconds: number;
  type: "lecture" | "meeting" | "voice_memo" | "study_review" | "other";
  status: "ready" | "processing" | "recording";
  isStarred?: boolean;
  waveform?: number[];
  summary: RecordingSummary;
  transcript: TranscriptSegment[];
  /** "imported" when the audio came from a file rather than the recorder. */
  source?: "recorded" | "imported";
  /** Moments the user flagged while recording, in seconds. */
  marks?: number[];
  /** Free-form personal notes typed in the workspace. */
  notes?: string;
  /** Epoch ms bounds of the (simulated) processing run. */
  startedAt?: number;
  readyAt?: number;
}

export interface CourseItem {
  id: string;
  name: string;
  icon: string;
}

export interface UserStats {
  totalHours: string;
  totalRecordings: number;
  insightsGenerated: number;
  transcriptionAccuracy: string;
  storageUsedHours: number;
  storageLimitHours: number;
}
