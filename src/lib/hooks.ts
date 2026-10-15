"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Simulated audio playback (the app has no real audio files yet): a position
 * that advances once per second at the chosen speed.
 */
export function usePlayer(durationSeconds: number, startAt = 0) {
  const [pos, setPos] = useState(startAt);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setPos((p) => {
        const next = p + speed;
        if (next >= durationSeconds) {
          setPlaying(false);
          return durationSeconds;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [playing, speed, durationSeconds]);

  const seek = useCallback(
    (s: number) => setPos(Math.min(Math.max(0, s), durationSeconds)),
    [durationSeconds],
  );
  const toggle = useCallback(() => {
    setPlaying((p) => {
      if (!p && pos >= durationSeconds) setPos(0);
      return !p;
    });
  }, [pos, durationSeconds]);
  const cycleSpeed = useCallback(
    () => setSpeed((s) => (s === 1 ? 1.5 : s === 1.5 ? 2 : s === 2 ? 0.75 : 1)),
    [],
  );

  return { pos, playing, speed, seek, toggle, cycleSpeed };
}

/** Epoch ms that ticks while mounted. 0 until the first client tick. */
export function useNow(intervalMs = 500) {
  const [now, setNow] = useState(0);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

/**
 * Live input level (0..1 per bar). Uses the real microphone when permission is
 * granted, otherwise falls back to a gentle simulated signal so the screen
 * still communicates state.
 */
export function useMicLevels(active: boolean, barCount: number) {
  const [levels, setLevels] = useState<number[]>(() =>
    Array.from({ length: barCount }, () => 0.04),
  );
  const [micState, setMicState] = useState<"pending" | "live" | "demo">(
    "pending",
  );

  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    let cancelled = false;
    let raf = 0;
    let stream: MediaStream | null = null;
    let ctx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let data: Uint8Array<ArrayBuffer> | null = null;
    let t = 0;

    async function init() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelled) {
          for (const tr of stream.getTracks()) tr.stop();
          return;
        }
        ctx = new AudioContext();
        analyser = ctx.createAnalyser();
        analyser.fftSize = 128;
        ctx.createMediaStreamSource(stream).connect(analyser);
        data = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
        setMicState("live");
      } catch {
        if (!cancelled) setMicState("demo");
      }
    }
    init();

    function frame() {
      t += 1;
      if (t % 3 === 0) {
        if (!activeRef.current) {
          setLevels(Array.from({ length: barCount }, () => 0.04));
        } else if (analyser && data) {
          analyser.getByteFrequencyData(data);
          const step = Math.max(1, Math.floor(data.length / barCount));
          setLevels(
            Array.from({ length: barCount }, (_, i) =>
              Math.min(
                1,
                Math.max(0.04, ((data?.[i * step] ?? 0) / 255) * 1.5),
              ),
            ),
          );
        } else {
          setLevels(
            Array.from({ length: barCount }, (_, i) =>
              Math.max(
                0.06,
                0.5 +
                  0.35 * Math.sin(t / 9 + i * 0.7) * Math.sin(t / 23 + i * 0.3),
              ),
            ),
          );
        }
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (stream) for (const tr of stream.getTracks()) tr.stop();
      if (ctx) ctx.close().catch(() => {});
    };
  }, [barCount]);

  return { levels, micState };
}
