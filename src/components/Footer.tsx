"use client";

import React from "react";

export function Footer() {
  return (
    <footer className="w-full py-12 border-t border-white/[0.08] bg-[#14161a] text-[#8e959e]">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs font-editorial">
          {/* Col 1 */}
          <div>
            <div className="font-roman text-[#f4f1eb] tracking-widest text-xs mb-2">
              AUDITOR
            </div>
            <p className="text-[#8e959e] leading-relaxed">
              Archival lecture intelligence and continuous acoustic
              transcription. Designed for scholars, researchers, and rigorous
              listeners.
            </p>
            <p className="font-telemetry text-[10px] text-[#6b7280] mt-2">
              BUILD: v2.4.0-ARCHIVAL · 48KHZ SPATIAL
            </p>
          </div>

          {/* Col 2 */}
          <div className="md:text-center">
            <div className="font-roman text-[#f4f1eb] tracking-widest text-xs mb-2">
              SANCTUARY
            </div>
            <p className="text-[#8e959e] leading-relaxed">
              Villa delle Scienze, 14 <br />
              50125 Firenze, Italia
            </p>
            <p className="text-[#8e959e] mt-2">
              studio@auditor.archive · +39 055 249 8812
            </p>
          </div>

          {/* Col 3 */}
          <div className="md:text-right">
            <div className="font-roman text-[#f4f1eb] tracking-widest text-xs mb-2">
              PRIVACY &amp; CITATION
            </div>
            <p className="text-[#8e959e] leading-relaxed">
              Local-first encryption. Audio processing occurs on-device without
              cloud ingestion unless requested.
            </p>
            <p className="text-[#e5a93c] font-telemetry text-[11px] mt-2">
              © 2026 AUDITOR. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
