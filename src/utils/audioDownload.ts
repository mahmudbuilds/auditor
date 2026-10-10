import type { RecordingItem } from "@/types/recording";

/**
 * Generates a valid PCM 16-bit RIFF WAV audio file in-memory.
 * Produces clean acoustic harmonic tones with smooth envelope fading.
 */
export function generateAudioWavBlob(
  recording: RecordingItem,
  secondsToGenerate = 4
): Blob {
  const sampleRate = 24000;
  const numChannels = 1;
  const bytesPerSample = 2; // 16-bit PCM
  const duration = Math.min(10, Math.max(2, secondsToGenerate));
  const totalSamples = sampleRate * duration;
  const buffer = new ArrayBuffer(44 + totalSamples * bytesPerSample);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // RIFF header
  writeString(0, "RIFF");
  view.setUint32(4, 36 + totalSamples * bytesPerSample, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
  view.setUint16(22, numChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * numChannels * bytesPerSample, true); // ByteRate
  view.setUint16(32, numChannels * bytesPerSample, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample
  writeString(36, "data");
  view.setUint32(40, totalSamples * bytesPerSample, true);

  // Generate gentle lecture acoustic harmonic chime tones with envelope
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.sin((Math.PI * i) / totalSamples);
    // Harmonic frequencies based on session
    const freq = 440 + ((recording.durationSeconds || 100) % 120);
    const wave =
      0.35 * Math.sin(2 * Math.PI * freq * t) +
      0.25 * Math.sin(2 * Math.PI * (freq * 1.25) * t) +
      0.2 * Math.sin(2 * Math.PI * (freq * 1.5) * t);
    const sample = Math.max(-1, Math.min(1, wave * envelope));
    const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    view.setInt16(44 + i * bytesPerSample, int16, true);
  }

  return new Blob([view], { type: "audio/wav" });
}

/**
 * Triggers a native browser file download for the audio recording.
 */
export function downloadRecordingAudio(recording: RecordingItem): boolean {
  try {
    const blob = generateAudioWavBlob(recording);
    const url = URL.createObjectURL(blob);
    const safeTitle = `${recording.course} - ${recording.title}`.replace(
      /[\\/:*?"<>|]/g,
      "_"
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeTitle}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch (err) {
    console.error("Failed to download recording audio:", err);
    return false;
  }
}
