# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- General public, students, researchers, and busy professionals needing frictionless voice capture.
- Primary situations: attending lectures, seminars, or meetings; taking spontaneous thoughts and memos on-the-go.
- Primary jobs: recording audio reliably, reviewing accurate transcripts, digesting summaries, and interrogating recorded material through AI.

## Product Purpose

Auditor is an audio note-taking and lecture intelligence PWA that transforms spoken audio into searchable transcripts, structured AI summaries, and an interactive conversational knowledge base. It eliminates the friction of manual note-taking and study review by letting users record lectures and voice memos, receive instant synthesis, and ask questions directly against their recordings.

## Positioning

Unlike basic voice memo apps that store passive audio files, and unlike complex enterprise meeting bots that require meeting invites, Auditor is a personal, mobile-first ambient audio companion: open it with one tap to record anything from a 10-second thought to a 2-hour lecture, with grounded AI study assistance built right into the transcript.

## Operating Context

- Mobile on-the-go: Quick voice notes taken walking or commuting; needs immediate one-thumb capture and high tactile/visual clarity.
- Lecture halls & conference rooms: Long continuous recordings in variable acoustic settings; needs reliable background recording resilience and clear status feedback.
- Study & review desk: Deep-dive review of transcripts, reviewing AI bulleted synthesis, and chatting with AI to test comprehension or extract detailed takeaways.
- PWA deployment: Installed to mobile home screens with offline-first recording resilience.

## Capabilities and Constraints

- Capabilities:
  - Audio recording with pause/resume, timer, and audio-level feedback via the Web Audio / MediaRecorder API.
  - Speech-to-text transcription for short voice notes and long lecture recordings.
  - AI-generated structured summaries (key themes, takeaways, study outlines).
  - Interactive Q&A chat grounded in the transcript content.
  - PWA capabilities (mobile install prompt, responsive touch targets, offline safety).
- Technical Stack & Constraints:
  - Next.js 16 (App Router), React 19, Tailwind CSS v4, Bun, Biome.
  - Open technical decisions: Specific AI transcription provider (e.g. Whisper / Web Speech API / Cloud STT) and LLM backend provider for summaries and chat.

## Brand Commitments

- Project name: `auditor` (audio notebook, listener, and study auditor).
- Tone: Clean, responsive, dependable, and focused.

## Evidence on Hand

- Repository scaffolded with Next.js 16 + React 19 + Tailwind CSS v4.
- No legacy user data or recordings exist yet (greenfield build).

## Product Principles

- Instant capture over ceremony: Starting a voice note or lecture capture must take one tap with unmistakable recording indicators.
- Grounded intelligence: AI summaries and answers must stay strictly faithful to the spoken audio, never hallucinating content not present in the lecture.
- Transcript transparency: Transcripts remain first-class and readable, paired with AI summaries rather than hidden behind them.
- Mobile-first ergonomics: Built for touch and single-thumb mobile usage as an installable PWA, expanding naturally into a focused split-pane desktop workspace.

## Accessibility & Inclusion

- Visual audio status and waveforms so users with hearing impairments have clear visual confirmation of recording state.
- WCAG AA compliant contrast, scalable typography, and accessible touch target sizes (minimum 44x44px).
