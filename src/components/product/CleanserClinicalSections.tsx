"use client";

import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";

// 1. Clinical & Consumer Perception Trial Stats for Blemish Purifying Face Wash
export function CleanserClinicalResults() {
  const stats = [
    {
      percentage: "96%",
      label: "Purified & Clearer Complexion",
      desc: "Reported noticeable reduction in daily surface excess sebum and clogged pore congestion without barrier irritation.",
    },
    {
      percentage: "93%",
      label: "Non-Stripping Moisture Balance",
      desc: "Confirmed skin felt calm, supple, and hydrated with zero tight or squeaky dryness after morning and evening cleansing.",
    },
    {
      percentage: "91%",
      label: "Visible Pore Refinement",
      desc: "Observed visibly cleaner, tighter pores and smoother texture within 14 days of consistent twice-daily use.",
    },
    {
      percentage: "94%",
      label: "Enhanced Blue Light Synergy",
      desc: "Noticed faster blemish resolution when cleansing immediately prior to 415nm blue light phototherapy sessions.",
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
            Gentle blemish purification, <em className="buudy-italic text-[var(--gold)]">proven on real skin</em>.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[var(--muted)] leading-relaxed">
            Formulated specifically to remove excess sebum and impurities while preserving the skin&apos;s essential moisture barrier and prepping pores for optimal LED light absorption.
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
          *Results based on an independent 4-week consumer perception panel of 58 participants with oily and blemish-prone skin applying Buudy Blemish Purifying Face Wash twice daily.
        </p>
      </div>
    </section>
  );
}

// 2. How To Use 3-Step Daily Cleansing Ritual
export function CleanserHowToUse() {
  const steps = [
    {
      num: "01",
      title: "Wet Face",
      desc: "Wet the face and neck with lukewarm water. Lukewarm water loosens surface impurities and softens sebum without triggering barrier sensitivity.",
    },
    {
      num: "02",
      title: "Massage Gently",
      desc: "Dispense 1–2 pumps onto damp hands. Gently massage in circular motions across face, neck, and T-zone for 60 seconds, allowing the plant-based foam and botanical extracts to dissolve impurities.",
    },
    {
      num: "03",
      title: "Rinse & Prep for Light",
      desc: "Rinse thoroughly with lukewarm water and pat dry with a clean towel. Skin is left calm, purified, and optimally prepped for your Buudy LED Face Mask phototherapy session.",
    },
  ];

  return (
    <section className="buudy-section bg-[var(--cream)] py-14 md:py-24" id="how-to-use">
      <div className="buudy-wrap grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Model Editorial Image Column using ONLY the provided image */}
        <div className="relative overflow-hidden rounded-[24px] border border-[rgba(58,31,61,.12)] bg-[var(--card)] shadow-lg aspect-[4/5] sm:aspect-square lg:aspect-[4/5]">
          <Image
            src="/images/products/buudy-face-wash/08-two-hand-pump-ritual.webp"
            alt="Buudy Blemish Purifying Face Wash two-hand application ritual"
            fill
            sizes="(min-width: 1024px) 500px, 100vw"
            className="object-cover object-center"
            priority={false}
          />
        </div>

        {/* Steps Column */}
        <div className="flex flex-col justify-center">
          <SectionHeading
            eyebrow="The Daily Cleansing Ritual"
            title={
              <>
                How to cleanse for{" "}
                <em className="buudy-italic text-[var(--gold)]">clear, calm skin</em>.
              </>
            }
          />
          <p className="mt-3 text-sm sm:text-base text-[var(--muted)] leading-relaxed">
            Formulated without harsh sulfates, artificial fragrances, or stripping alcohols, our gentle Coco-Glucoside surfactant base transforms into a soft micro-foam that cleanses deep into pores while preserving your moisture barrier.
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
              <strong className="font-semibold">Phototherapy Pre-Cleansing Tip:</strong> Surface oils, silicones, and physical sunscreen reflect therapeutic LED wavelengths. Cleansing with Buudy Blemish Purifying Face Wash removes all light-blocking residues so 100% of 415nm blue and 630nm red photons penetrate unhindered into active blemishes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
