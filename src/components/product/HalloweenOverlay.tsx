"use client";

import Image from "next/image";

/**
 * HalloweenOverlay – visual decorative elements:
 * - Bat & Pumpkin displayed on desktop only (hidden on mobile phones).
 * - Cobwebs removed per user directive.
 */
export function HalloweenOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 -top-[64px] lg:-top-[72px] h-[380px] z-50 overflow-hidden select-none"
    >
      {/* ── Bat (Upper hero right side, desktop only - hidden on phone) ── */}
      <div
        className="hidden md:block absolute top-[160px] sm:top-[175px] right-[80px] sm:right-[130px] md:right-[160px] z-20"
        style={{ animation: "halloween-bat-float-2 6s ease-in-out infinite" }}
      >
        <Image
          src="/images/halloween-bat.png"
          alt="Halloween Bat"
          width={40}
          height={20}
          className="w-[28px] sm:w-[32px] h-auto object-contain rotate-[10deg]"
          priority
        />
      </div>

      {/* ── Pumpkin (Upper hero right side, desktop only - hidden on phone) ── */}
      <div
        className="hidden md:block absolute top-[225px] sm:top-[240px] right-[14px] sm:right-[28px] md:right-[38px] z-20"
        style={{ animation: "halloween-pumpkin-glow 3.5s ease-in-out infinite" }}
      >
        <Image
          src="/images/halloween-pumpkin.png"
          alt="Halloween Pumpkin"
          width={34}
          height={34}
          className="w-[28px] sm:w-[32px] h-auto object-contain"
          priority
        />
      </div>
    </div>
  );
}

/**
 * HalloweenSaleBadge – clean luxury discount badge.
 */
export function HalloweenSaleBadge() {
  return (
    <span className="buudy-mono inline-flex items-center rounded-full bg-[rgba(184,149,86,.26)] px-3.5 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--plum)]">
      60% OFF
    </span>
  );
}
