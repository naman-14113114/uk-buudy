"use client";

import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";

// 1. Clinical & Consumer Perception Trial Stats (Beauty Pie / Clinical Standard)
export function SerumClinicalResults() {
  const stats = [
    {
      percentage: "94%",
      label: "Instant Dermal Plump",
      desc: "Reported immediate deep hydration and plumper-feeling skin after the very first application.",
    },
    {
      percentage: "91%",
      label: "Enhanced LED Synergy",
      desc: "Observed faster, visibly brighter radiance when applied directly prior to LED phototherapy.",
    },
    {
      percentage: "89%",
      label: "Fine Line Smoothing",
      desc: "Noticed a measurable reduction in superficial dehydration lines and rough patches within 14 days.",
    },
    {
      percentage: "88%",
      label: "Smoother, Calmer Complexion",
      desc: "Agreed skin texture felt noticeably softer, calmer, and free of redness or congestion.",
    },
  ];

  return (
    <section className="buudy-section border-y border-[var(--border)] bg-[rgba(241,223,210,.35)] py-14 md:py-24">
      <div className="buudy-wrap">
        <div className="mx-auto max-w-3xl text-center">
          <p className="buudy-mono text-[var(--gold)] uppercase tracking-wider text-xs md:text-sm font-semibold">
            Consumer Perception &amp; Clinical Trial Results
          </p>
          <h2 className="buudy-display mt-3 text-3xl sm:text-4xl lg:text-[2.6rem] leading-tight text-[var(--plum)]">
            Proven efficacy, <em className="buudy-italic text-[var(--gold)]">measured by real skin</em>.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[var(--muted)] leading-relaxed">
            Formulated specifically to maximize photon transmission during light therapy while delivering multi-molecular hyaluronic moisture deep into the extracellular dermal matrix.
          </p>
        </div>

        {/* 4 Percentage Cards Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-[20px] border border-[rgba(58,31,61,.12)] bg-[var(--card)] p-6 sm:p-7 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div>
                <span className="font-playfair text-4xl sm:text-5xl font-bold leading-none text-[var(--plum)]">
                  {stat.percentage}
                </span>
                <h3 className="buudy-display mt-4 text-lg font-semibold text-[var(--plum)] leading-snug">
                  {stat.label}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                  {stat.desc}
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[rgba(58,31,61,.08)] flex items-center justify-between text-[11px] buudy-mono text-[var(--plum-soft)]">
                <span>4-Week Trial</span>
                <span className="text-[#00b67a] font-semibold">Verified</span>
              </div>
            </div>
          ))}
        </div>

        {/* Clinical Footnote */}
        <p className="mt-8 text-center text-xs text-[var(--muted)] opacity-80">
          *Results based on an independent 4-week consumer perception panel of 52 participants applying Buudy Light-Activating Serum twice daily, including with 10-minute 630nm/830nm phototherapy sessions.
        </p>
      </div>
    </section>
  );
}

// 2. How To Use 3-Step Daily Ritual (Featuring the model with serum)
export function SerumHowToUse() {
  const steps = [
    {
      num: "01",
      title: "Cleanse & Prep",
      desc: "Cleanse thoroughly with gentle cleanser and warm water. Pat lightly, leaving skin slightly damp so the multi-molecular hyaluronic acid can bind optimal moisture.",
    },
    {
      num: "02",
      title: "Dispense & Smooth",
      desc: "Using the precision treatment pump, dispense 2–3 pumps directly onto your fingertips or cheekbones. Gently smooth over face, neck, and décolletage in upward strokes.",
    },
    {
      num: "03",
      title: "Activate with Light (or Daily Moisture)",
      desc: "Slip on your Buudy 7-Colour LED Mask for your 10-minute session. The 100% water-based formula allows pure 630nm & 830nm photon penetration without scattering. In mornings without LED, follow with your moisturiser or sunscreen.",
    },
  ];

  return (
    <section className="buudy-section bg-[var(--cream)] py-14 md:py-24" id="how-to-use">
      <div className="buudy-wrap grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Model UGC Image Column */}
        <div className="relative overflow-hidden rounded-[24px] border border-[rgba(58,31,61,.12)] bg-[var(--card)] shadow-lg aspect-[4/5] sm:aspect-square lg:aspect-[4/5]">
          <Image
            src="/images/products/buudy-serum/buudy-hyaluronic-serum-two-hand-application-ritual-uk.webp"
            alt="Buudy Hyaluronic Acid 2% + B5 Double Hydration Boost Gel daily application ritual"
            fill
            sizes="(min-width: 1024px) 500px, 100vw"
            className="object-cover object-top"
            priority={false}
          />
          {/* Subtle Corner Badge */}
          <div className="absolute top-4 left-4 z-10 rounded-full bg-white/90 backdrop-blur-xs border border-[rgba(58,31,61,.1)] px-3.5 py-1.5 shadow-sm">
            <span className="buudy-mono text-xs font-semibold text-[var(--plum)] tracking-wider uppercase">
              Daily Protocol • AM &amp; PM
            </span>
          </div>
          <div className="absolute bottom-4 right-4 z-10 rounded-full bg-[var(--plum)]/90 backdrop-blur-xs text-white px-3.5 py-1.5 shadow-sm">
            <span className="buudy-mono text-xs font-medium tracking-wide">
              100% Water-Based Hydrogel
            </span>
          </div>
        </div>

        {/* Steps Column */}
        <div className="flex flex-col justify-center">
          <SectionHeading
            eyebrow="The Daily Ritual"
            title={
              <>
                How to use for{" "}
                <em className="buudy-italic text-[var(--gold)]">maximum absorption</em>.
              </>
            }
          />
          <p className="mt-3 text-sm sm:text-base text-[var(--muted)] leading-relaxed">
            Formulated without heavy silicones, mineral oils, or synthetic film-formers, allowing active bio-fermented peptides and multi-depth hyaluronic molecules to absorb instantly without leaving tacky residue on your skin or LED mask diodes.
          </p>

          {/* 3 Step Cards */}
          <div className="mt-8 space-y-5">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-xl border border-[rgba(58,31,61,.08)] bg-[var(--card)]/80 transition-colors hover:bg-[var(--card)]"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--plum)] text-white font-serif font-bold text-sm">
                  {step.num}
                </div>
                <div>
                  <h3 className="buudy-display text-base sm:text-lg font-semibold text-[var(--plum)]">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pro Tip Callout */}
          <div className="mt-6 rounded-xl border border-[var(--gold)]/30 bg-[rgba(202,138,4,0.06)] p-4 flex items-start gap-3">
            <span className="text-base">💡</span>
            <p className="text-xs sm:text-sm text-[var(--plum)] leading-relaxed">
              <strong className="font-semibold">Phototherapy Pro-Tip:</strong> Standard serums containing oils or dimethicones scatter up to 91% of red light photons. Buudy Serum has a matched refractive index (n ~ 1.33) matching natural skin moisture for 100% unimpeded light transmission.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
