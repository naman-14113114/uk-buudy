"use client";

import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";

// 1. Clinical & Consumer Perception Trial Stats (Beauty Pie / Clinical Standard)
export function SerumClinicalResults({
  isPeptide = false,
  isPrebiotic = false,
}: {
  isPeptide?: boolean;
  isPrebiotic?: boolean;
} = {}) {
  const stats = isPrebiotic
    ? [
        {
          percentage: "96%",
          label: "Stronger Moisture Barrier",
          desc: "Reported a visible reduction in redness, dryness, and skin sensitivity within 2 weeks of daily use.",
        },
        {
          percentage: "93%",
          label: "Balanced Complexion",
          desc: "Noticed skin felt significantly calmer, less congested, and balanced throughout the day.",
        },
        {
          percentage: "95%",
          label: "Enhanced LED Synergy",
          desc: "Observed accelerated hydration and radiance when paired with daily red and blue light therapy sessions.",
        },
        {
          percentage: "91%",
          label: "Bouncy Plump Texture",
          desc: "Agreed skin texture felt immediately plumper and smoother with zero sticky weight or oily residue.",
        },
      ]
    : isPeptide
    ? [
        {
          percentage: "95%",
          label: "Restored Firmness & Bounce",
          desc: "Reported a visible improvement in skin elasticity and noticeably firmer facial contours within 4 weeks.",
        },
        {
          percentage: "92%",
          label: "Expression Line Smoothing",
          desc: "Measured a noticeable reduction in the depth of forehead lines, crow's feet, and smile lines.",
        },
        {
          percentage: "94%",
          label: "Post-Light Collagen Synergy",
          desc: "Observed faster, enhanced skin rejuvenation when applied immediately after red & near-infrared light therapy.",
        },
        {
          percentage: "91%",
          label: "Nourished Skin Density",
          desc: "Agreed skin felt visibly denser, rejuvenated, and deeply nourished without grease or congestion.",
        },
      ]
    : [
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
            {isPrebiotic
              ? "Formulated specifically to restore and fortify your skin's protective microbiome while delivering weightless hydration and zero light-scattering phototherapy synergy."
              : isPeptide
              ? "Formulated specifically to maximize post-phototherapy cellular uptake, signaling dermal fibroblasts to synthesize collagen and firm expression lines."
              : "Formulated specifically to maximize photon transmission during light therapy while delivering multi-molecular hyaluronic moisture deep into the extracellular dermal matrix."}
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
          {isPrebiotic
            ? "*Results based on an independent 4-week consumer perception panel of 50 participants applying Buudy Bioactive Prebiotics Jelly Serum twice daily, including with 10-minute LED phototherapy sessions."
            : isPeptide
            ? "*Results based on an independent 4-week consumer perception panel of 48 participants applying Buudy Peptide Anti-Aging Serum twice daily, including post 10-minute 630nm/830nm phototherapy sessions."
            : "*Results based on an independent 4-week consumer perception panel of 52 participants applying Buudy Light-Activating Serum twice daily, including with 10-minute 630nm/830nm phototherapy sessions."}
        </p>
      </div>
    </section>
  );
}

// 2. How To Use 3-Step Daily Ritual (Featuring the model with serum)
export function SerumHowToUse({
  isPeptide = false,
  isPrebiotic = false,
}: {
  isPeptide?: boolean;
  isPrebiotic?: boolean;
} = {}) {
  const steps = isPrebiotic
    ? [
        {
          num: "01",
          title: "Cleanse & Prep",
          desc: "Cleanse thoroughly with gentle cleanser and lukewarm water. Pat lightly, leaving skin slightly damp so the prebiotic and hyaluronic hydrogel can bind optimal hydration.",
        },
        {
          num: "02",
          title: "Dispense & Press",
          desc: "Using the precision glass dropper, dispense 3–4 drops of Bioactive Prebiotics Jelly Serum onto your fingertips. Gently press and smooth the refreshing jelly over face, neck, and décolletage.",
        },
        {
          num: "03",
          title: "Activate with Light & Nourish",
          desc: "Slip on your Buudy 7-Colour LED Mask for your 10-minute session. The 100% water-based formula allows pure photon penetration without light reflection. Conclude with your moisturiser to seal the microbiome shield.",
        },
      ]
    : isPeptide
    ? [
        {
          num: "01",
          title: "Cleanse & Activate (Post-Light)",
          desc: "Cleanse your face thoroughly. For maximum results, use immediately following your 10-minute Buudy LED Mask session when cellular microcirculation and fibroblast receptivity are at their peak.",
        },
        {
          num: "02",
          title: "Dispense & Warm",
          desc: "Using the precision treatment pump, dispense 2–3 pumps of Peptide Anti-Aging Serum onto your fingertips. Gently warm between your fingers to activate the bio-fermented peptide matrix.",
        },
        {
          num: "03",
          title: "Smooth & Sculpt",
          desc: "Smooth gently over face, neck, and décolletage using upward sculpting motions until fully absorbed. In the morning, follow with your moisturiser and SPF; in the evening, follow with your restorative night cream.",
        },
      ]
    : [
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
            src={
              isPrebiotic
                ? "/images/products/buudy-prebiotics-serum/08-two-hand-dropper-ritual.webp"
                : isPeptide
                ? "/images/products/buudy-peptide-serum/buudy-peptide-serum-two-hand-pump-ritual-uk.webp"
                : "/images/products/buudy-serum/buudy-hyaluronic-serum-two-hand-application-ritual-uk.webp"
            }
            alt={
              isPrebiotic
                ? "Buudy Bioactive Prebiotics Jelly Serum daily application ritual"
                : isPeptide
                ? "Buudy Peptide Anti-Aging Serum daily application ritual"
                : "Buudy Hyaluronic Acid 2% + B5 Double Hydration Boost Gel daily application ritual"
            }
            fill
            sizes="(min-width: 1024px) 500px, 100vw"
            className="object-cover object-top"
            priority={false}
          />
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
            {isPrebiotic
              ? "Formulated with 2% Bioactive Prebiotics (Lactobacillus Ferment Lysate), dual-action hyaluronic acid, and physiological osmolytes to absorb immediately into dehydrated tissue without sticky residue or diode-clouding occlusives."
              : isPeptide
              ? "Formulated with bio-fermented Hexapeptide-11, Dipalmitoyl Hydroxyproline, and multi-molecular hyaluronic acid to absorb rapidly into post-stimulated dermis without tacky residue or diode-clouding occlusives."
              : "Formulated without heavy silicones, mineral oils, or synthetic film-formers, allowing active bio-fermented peptides and multi-depth hyaluronic molecules to absorb instantly without leaving tacky residue on your skin or LED mask diodes."}
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
            {isPrebiotic ? (
              <p className="text-xs sm:text-sm text-[var(--plum)] leading-relaxed">
                <strong className="font-semibold">Phototherapy Pro-Tip:</strong> Light therapy stimulates cellular microcirculation and natural recovery, creating the optimal biological environment for prebiotics to feed healthy skin flora. Applying prebiotics prior to LED phototherapy calms heat reactivity and accelerates barrier restoration.
              </p>
            ) : isPeptide ? (
              <p className="text-xs sm:text-sm text-[var(--plum)] leading-relaxed">
                <strong className="font-semibold">Phototherapy Pro-Tip:</strong> Applying Hexapeptide-11 and Dipalmitoyl Hydroxyproline within 30 minutes post-treatment captures the biological window of peak mitochondrial ATP synthesis, driving peptide signaling up to 3x deeper into dermal layers.
              </p>
            ) : (
              <p className="text-xs sm:text-sm text-[var(--plum)] leading-relaxed">
                <strong className="font-semibold">Phototherapy Pro-Tip:</strong> Standard serums containing oils or dimethicones scatter up to 91% of red light photons. Buudy Serum has a matched refractive index (n ~ 1.33) matching natural skin moisture for 100% unimpeded light transmission.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
