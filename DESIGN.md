# Design System: Auditor Dashboard

<!-- impeccable:design-schema 1 -->

## Purpose & Identity

Auditor is an audio note-taking and lecture intelligence workspace built for scholars, students, researchers, and professionals. It provides friction-free audio capture, synchronized transcripts, plain-English structured summaries, and interactive grounded study intelligence.

## Palette

- **Base Canvas:** `#14171a` (deep midnight slate chalkboard backdrop with fine radial warm vignette and 48px grid)
- **Elevated Surfaces:**
  - Card base: `#1a1e24`
  - Elevated hover/active: `#1f242b` to `#262c35`
  - Subtle borders: `rgba(255, 255, 255, 0.08)` and `#2d343d`
- **Primary Accent:** Warm Tuscan sun / antique gold (`#e5a93c`, hover `#f3b74b`, deep gold `#c59235`)
- **Accent Soft Glow:** `rgba(229, 169, 60, 0.15)`
- **Typography Colors:**
  - Primary text: Warm cream paper (`#f5f2eb`)
  - Secondary/Muted text: Muted slate (`#9ba1a8` to `#8b919a`)
  - Tracked small-caps labels: Muted antique gold (`#c59e5e`)
- **Status Semantics:**
  - Microphone active / Recording ready: `emerald-400`
  - Active audio scrubber & star markers: `#e5a93c`
  - Live recording dot: `red-500` pulse

## Typography

- **Editorial Mastheads & Hero Display:** `Cormorant Garamond` serif (`font-editorial`) reserved for top-level brand marks, the page title ("Overview Dashboard"), the centerpiece banner ("Tap to Record"), and high-level section titles, preserving Auditor's distinguished scholarly identity without creating body friction.
- **Card Titles & Functional UI:** `Geist Sans` (`font-sans font-semibold tracking-tight`) for card titles, library rows, docked player track labels, flashcard questions, and workspace panels for rapid optical scanning and razor-sharp contrast on dark surfaces.
- **Tracked Small-Caps Metadata:** `uppercase tracking-[0.16em] text-[10px] to text-xs font-semibold` (referencing classical bookbinding and catalog entries).
- **UI & Data Body:** `Geist Sans` / modern sans-serif for dashboard metrics, table data, buttons, and transcript text for maximum legibility and zero visual fatigue.
- **Numeric & Timestamps:** `Geist Mono` with tabular numerals (`tabular-nums`) for audio timestamps, duration indicators, and audio timers.

## Layout & Architecture

- **App Shell Structure:**
  - Fixed / collapsible left sidebar (`w-64`) with brand identity, focused navigation tabs (Overview, All Recordings, AI Study Assistant, Starred Notes), course folders, and user profile badge.
  - Sticky top header (`h-16`) with contextual breadcrumb, global search input (`⌘K`), course filter dropdown, and live microphone status indicator.
  - Main workspace with dynamic tab routing:
    - **Overview (Distilled & Focused):** 
      - **Hero Record Centerpiece:** Large, prominent, tactile 100px record button with ambient acoustic ripple glow, mode selection (Lecture vs Voice Memo), and course tagger.
      - **Recent Lectures & Notes:** Clean, spacious feed with 1-click play/pause, live animated soundwave indicator, 1-line AI summary preview, and direct workspace link.
    - **All Recordings (Library):** Comprehensive searchable directory with filter tabs (All, Lectures, Voice Memos, Starred), and list/grid switchers.
    - **Interactive Workspace (Deep Dive):** Split-view workspace pairing the full synchronized transcript (clickable timestamps) with AI study intelligence (overview, takeaways, interactive quiz accordion, action items, and grounded chat).
    - **AI Study Assistant (Study Hub):** Cross-lecture knowledge synthesizer with interactive revision flashcards and global Q&A.
    - **Docked Audio Player:** Sleek, non-intrusive floating audio bar at the bottom of the screen with waveform progress, speed controls, jump buttons, and full workspace launcher.
    - **Live Recording Studio Modal:** Real microphone capture via `MediaRecorder` API, glowing animated canvas waveform, live timer, and live transcript streaming.

## Tone & UX Copy Principles

- **No Alienating Jargon:** Avoid dense academic or theoretical buzzwords. Summaries, questions, and takeaways are written in clear, natural, everyday human language.
- **Relatable Real-World Topics:** Covers practical subjects including Economics, Cognitive Psychology, World History, Product Strategy, Biology, and spontaneous voice notes.
- **Grounded Intelligence:** AI synthesis and Q&A answers remain faithful to the spoken audio, eliminating hallucinations.
