"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Droplets,
  ShieldCheck,
  Sparkles,
  Wind,
} from "lucide-react";
import { HyaluronicRoutineSteps } from "./HyaluronicRoutineSteps";

// 1. Product In Details (9-Card Carousel for Peptide Serum from Selfnamed)
function ProductInDetailsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "left" ? -340 : 340;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const detailCards = [
    { num: "01", src: "/images/products/buudy-peptide-serum/selfnamed/detail-01.jpg", alt: "Hexapeptide-11 & bio-fermented peptide collagen boost" },
    { num: "02", src: "/images/products/buudy-peptide-serum/selfnamed/detail-02.jpg", alt: "Multi-depth fine line and wrinkle smoothing" },
    { num: "03", src: "/images/products/buudy-peptide-serum/selfnamed/detail-03.jpg", alt: "Dipalmitoyl Hydroxyproline cellular matrix reinforcement" },
    { num: "04", src: "/images/products/buudy-peptide-serum/selfnamed/detail-04.jpg", alt: "Multi-molecular hyaluronic acid and Sodium PCA moisture lock" },
    { num: "05", src: "/images/products/buudy-peptide-serum/selfnamed/detail-05.jpg", alt: "Phytosterols skin barrier lipid replenishment" },
    { num: "06", src: "/images/products/buudy-peptide-serum/selfnamed/detail-06.jpg", alt: "Blueberry and Ginkgo Biloba antioxidant defense" },
    { num: "07", src: "/images/products/buudy-peptide-serum/selfnamed/detail-07.jpg", alt: "Silky creamy emulsion with dewy non-greasy finish" },
    { num: "08", src: "/images/products/buudy-peptide-serum/selfnamed/detail-08.jpg", alt: "ECOCERT COSMOS Natural organic certification" },
    { num: "09", src: "/images/products/buudy-peptide-serum/selfnamed/detail-09.jpg", alt: "Optical transmission for post-phototherapy collagen synergy" },
  ];

  return (
    <section className="buudy-section bg-white py-12 md:py-18">
      <div className="buudy-wrap">
        {/* Header with Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="buudy-mono text-[var(--gold)] uppercase tracking-[0.2em] text-xs font-semibold">
              Formula Breakdown &amp; In-Depth Attributes
            </p>
            <h2 className="buudy-display mt-2 text-3xl sm:text-4xl lg:text-[2.6rem] leading-tight text-[var(--plum)]">
              Product in <em className="buudy-italic text-[var(--gold)]">details</em>.
            </h2>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Previous card"
              className="w-10 h-10 rounded-full border border-[rgba(46,16,47,0.15)] bg-white text-[var(--plum)] hover:bg-[var(--plum)] hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Next card"
              className="w-10 h-10 rounded-full border border-[rgba(46,16,47,0.15)] bg-white text-[var(--plum)] hover:bg-[var(--plum)] hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Carousel Reel */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pt-2 pb-6 md:pb-8 scrollbar-none snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0"
        >
          {detailCards.map((card) => (
            <div
              key={card.num}
              className="flex-none w-[260px] sm:w-[290px] md:w-[320px] aspect-[320/488] relative rounded-[20px] overflow-hidden border border-[rgba(46,16,47,0.08)] bg-white shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[rgba(184,149,86,0.35)] transition-all duration-300 snap-start"
            >
              <Image
                src={card.src}
                alt={card.alt}
                fill
                sizes="(min-width: 768px) 320px, 260px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 2. Product Features & Star Attributes (from Selfnamed Peptide Serum)
function ProductFeaturesSection() {
  return (
    <section className="buudy-section bg-[var(--cream)] py-14 md:py-20">
      <div className="buudy-wrap">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Feature Banner Image */}
          <div className="lg:col-span-6">
            <div className="relative aspect-square w-full rounded-[24px] overflow-hidden border border-[rgba(46,16,47,0.08)] bg-white shadow-md">
              <Image
                src="/images/products/buudy-peptide-serum/04-bottle-angle-plum.webp"
                alt="Buudy Peptide Anti-Aging Serum clinical features bottle and carton display"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Column: Key Attributes & Star Features */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div>
              <p className="buudy-mono text-[var(--gold)] uppercase tracking-[0.2em] text-xs font-semibold">
                Dermal Targeting &amp; Clinical Calibration
              </p>
              <h2 className="buudy-display mt-2 text-3xl sm:text-4xl leading-tight text-[var(--plum)]">
                Targeted features, <em className="buudy-italic text-[var(--gold)]">engineered for results</em>.
              </h2>
              <p className="mt-3 text-base md:text-lg text-[var(--muted)] leading-relaxed">
                Use your Buudy LED Mask as directed. After your session, smooth on the peptide serum before moisturiser. Bio-fermented Hexapeptide-11 and multi-molecular hyaluronic acid help stimulate collagen synthesis and keep skin firm, lifted, and smooth.
              </p>
              <Link
                href="/products/buudy-led-mask"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--plum)] underline underline-offset-4 hover:text-[var(--gold)] transition-colors"
              >
                Explore the Buudy LED Mask
                <ChevronRight aria-hidden="true" size={17} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Best For */}
              <div data-story-card className="p-5 rounded-2xl bg-white border border-[rgba(46,16,47,0.08)] shadow-xs">
                <div className="flex items-center gap-2 mb-2 text-[var(--gold)]">
                  <Sparkles size={16} />
                  <span className="buudy-mono text-xs uppercase tracking-wider font-bold text-[var(--plum)]">
                    Best For
                  </span>
                </div>
                <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
                  Anti-age, dehydrated skin, fine lines, loss of elasticity, and expression wrinkles.
                </p>
              </div>

              {/* Skin Type */}
              <div data-story-card className="p-5 rounded-2xl bg-white border border-[rgba(46,16,47,0.08)] shadow-xs">
                <div className="flex items-center gap-2 mb-2 text-[var(--gold)]">
                  <Droplets size={16} />
                  <span className="buudy-mono text-xs uppercase tracking-wider font-bold text-[var(--plum)]">
                    Skin Type
                  </span>
                </div>
                <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
                  Normal, dry, mature, and combination skin needing collagen matrix reinforcement.
                </p>
              </div>

              {/* Star Features */}
              <div data-story-card className="p-5 rounded-2xl bg-white border border-[rgba(46,16,47,0.08)] shadow-xs">
                <div className="flex items-center gap-2 mb-2 text-[var(--gold)]">
                  <ShieldCheck size={16} />
                  <span className="buudy-mono text-xs uppercase tracking-wider font-bold text-[var(--plum)]">
                    Star Features
                  </span>
                </div>
                <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
                  Smooths, reduces fine lines, supports skin firmness, and enhances dermal elasticity.
                </p>
              </div>

              {/* Aroma */}
              <div data-story-card className="p-5 rounded-2xl bg-white border border-[rgba(46,16,47,0.08)] shadow-xs">
                <div className="flex items-center gap-2 mb-2 text-[var(--gold)]">
                  <Wind size={16} />
                  <span className="buudy-mono text-xs uppercase tracking-wider font-bold text-[var(--plum)]">
                    Aroma
                  </span>
                </div>
                <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
                  Delicate floral fantasy aroma with notes of amber on sweet, powdery background.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 3. Curated For (Exact Roles from Selfnamed Peptide Serum Page)
function CuratedForSection() {
  const roles = [
    {
      title: "Estheticians",
      subtitle: "Daily Anti-Aging Support",
      desc: "Retail as a daily anti-aging serum clients use at home to support the look of firmness and plumpness between treatments.",
      img: "/images/products/buudy-peptide-serum/selfnamed/curated-estheticians.jpg",
    },
    {
      title: "Cosmetologists",
      subtitle: "Visible Smoothing & Firming",
      desc: "Recommend to clients wanting visible smoothing from a peptide-and-hyaluronic-acid serum, sold as take-home care.",
      img: "/images/products/buudy-peptide-serum/selfnamed/curated-cosmetologists.jpg",
    },
    {
      title: "Makeup Artists",
      subtitle: "Skin Prep & Smooth Canvas",
      desc: "A plumping, smoothing serum that preps mature skin before makeup, applied in the client's own routine with zero pilling.",
      img: "/images/products/buudy-peptide-serum/selfnamed/curated-makeup-artists.jpg",
    },
    {
      title: "Bridal MUAs",
      subtitle: "Pre-Wedding Firming Ritual",
      desc: "A pre-wedding smoothing serum for brides building firmer, plumper-looking skin and radiant bounce at home.",
      img: "/images/products/buudy-peptide-serum/selfnamed/curated-bridal-muas.jpg",
    },
  ];

  return (
    <section className="buudy-section bg-[var(--cream)] py-14 md:py-20">
      <div className="buudy-wrap">
        <div className="max-w-2xl text-center mx-auto mb-12">
          <p className="buudy-mono text-[var(--gold)] uppercase tracking-[0.2em] text-xs font-semibold">
            Professional Grade Formulation
          </p>
          <h2 className="buudy-display mt-2 text-3xl sm:text-4xl leading-tight text-[var(--plum)]">
            Curated for <em className="buudy-italic text-[var(--gold)]">clinical specialists</em>.
          </h2>
          <p className="mt-3 text-base md:text-lg text-[var(--muted)] leading-relaxed">
            Engineered to professional salon standards — trusted by estheticians, cosmetologists, and makeup artists worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-4 pb-6">
          {roles.map((role) => (
            <div
              key={role.title}
              data-story-card
              className="flex flex-col rounded-2xl bg-white border border-[rgba(46,16,47,0.08)] overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 hover:border-[rgba(184,149,86,0.35)] transition-all duration-300"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--cream)]">
                <Image
                  src={role.img}
                  alt={role.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5 pb-7 flex flex-col flex-1">
                <span className="buudy-mono text-xs text-[var(--gold)] font-bold uppercase tracking-wider mb-1.5">
                  {role.subtitle}
                </span>
                <h3 className="buudy-display text-lg font-semibold text-[var(--plum)] mb-2">
                  {role.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--muted)]">
                  {role.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 4. Product Formula & Physical Calibration (from Selfnamed Peptide Serum Page)
function ProductFormulaSection() {
  return (
    <section className="buudy-section bg-[var(--cream)] py-14 md:py-20">
      <div className="buudy-wrap">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Texture Image */}
          <div className="lg:col-span-6">
            <div className="relative aspect-square w-full rounded-[24px] overflow-hidden border border-[rgba(46,16,47,0.08)] bg-white shadow-md">
              <Image
                src="/images/products/buudy-peptide-serum/03-serum-on-hand-editorial.webp"
                alt="Buudy Peptide Anti-Aging Serum silky formulation texture on hand"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Column: Physical Sliders & Attributes */}
          <div className="lg:col-span-6 flex flex-col gap-7">
            <div>
              <p className="buudy-mono text-[var(--gold)] uppercase tracking-[0.2em] text-xs font-semibold">
                Dermal Calibration &amp; Sensory Profile
              </p>
              <h2 className="buudy-display mt-2 text-3xl sm:text-4xl leading-tight text-[var(--plum)]">
                Product <em className="buudy-italic text-[var(--gold)]">formula</em>.
              </h2>
              <p className="mt-3 text-base md:text-lg text-[var(--muted)] leading-relaxed">
                Bio-compatible emulsion matrix designed with micro-peptides, multi-depth humectants, and botanical seed oils to maximize daily absorption, cellular collagen synthesis, and red light wavelength synergy.
              </p>
            </div>

            <div className="space-y-6">
              {/* Texture Slider */}
              <div data-story-card className="p-5 rounded-2xl bg-white border border-[rgba(46,16,47,0.08)] shadow-xs">
                <div className="flex justify-between items-center mb-2">
                  <span className="buudy-mono text-xs font-bold text-[var(--plum)] uppercase tracking-wider">
                    Texture
                  </span>
                  <span className="text-xs font-semibold text-[var(--gold)] buudy-mono">
                    Creamy Fluid
                  </span>
                </div>
                <div className="relative h-2 w-full bg-[rgba(46,16,47,0.08)] rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-[45%] bg-[var(--plum)] rounded-full" />
                </div>
                <div className="flex justify-between text-xs text-[var(--muted)] mt-2 buudy-mono uppercase tracking-wider">
                  <span>Light</span>
                  <span>Creamy</span>
                  <span>Rich</span>
                </div>
              </div>

              {/* Finish Slider */}
              <div data-story-card className="p-5 rounded-2xl bg-white border border-[rgba(46,16,47,0.08)] shadow-xs">
                <div className="flex justify-between items-center mb-2">
                  <span className="buudy-mono text-xs font-bold text-[var(--plum)] uppercase tracking-wider">
                    Finish
                  </span>
                  <span className="text-xs font-semibold text-[var(--gold)] buudy-mono">
                    Dewy &amp; Hydrated
                  </span>
                </div>
                <div className="relative h-2 w-full bg-[rgba(46,16,47,0.08)] rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-[40%] bg-[var(--plum)] rounded-full" />
                </div>
                <div className="flex justify-between text-xs text-[var(--muted)] mt-2 buudy-mono uppercase tracking-wider">
                  <span>Weightless</span>
                  <span>Dewy</span>
                  <span>Occlusive</span>
                </div>
              </div>

              {/* pH Level & Optical Transmission */}
              <div className="grid grid-cols-2 gap-4">
                <div data-story-card className="p-5 rounded-2xl bg-white border border-[rgba(46,16,47,0.08)] shadow-xs">
                  <span className="buudy-mono text-xs text-[var(--gold)] uppercase font-bold tracking-wider">
                    pH Level
                  </span>
                  <p className="buudy-display text-2xl font-bold text-[var(--plum)] mt-1">
                    5.15 – 5.25
                  </p>
                  <p className="text-sm text-[var(--muted)] mt-1 leading-relaxed">
                    Physiological acid mantle harmony.
                  </p>
                </div>

                <div data-story-card className="p-5 rounded-2xl bg-white border border-[rgba(46,16,47,0.08)] shadow-xs">
                  <span className="buudy-mono text-xs text-[var(--gold)] uppercase font-bold tracking-wider">
                    Light Synergy
                  </span>
                  <p className="buudy-display text-2xl font-bold text-[var(--plum)] mt-1">
                    100% Optical
                  </p>
                  <p className="text-sm text-[var(--muted)] mt-1 leading-relaxed">
                    Zero light scattering / Post-phototherapy booster.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 5. Key Ingredients Deep Dive (with Exact Card Sizing as Hyaluronic + Left/Right Arrow Navigation + Touch/Trackpad Scrolling)
function KeyIngredientsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "left" ? -280 : 280;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const ingredients = [
    {
      name: "Hexapeptide-11",
      role: "2% Bio-Fermented Actives",
      desc: "A powerhouse peptide that stimulates collagen synthesis, improves skin elasticity, and visibly softens fine lines and wrinkles.",
      img: "/images/products/buudy-peptide-serum/selfnamed/ingredient-peptides.jpg",
    },
    {
      name: "Phytosterols",
      role: "Cellular Lipid Shield",
      desc: "Plant-derived lipids that replenish the epidermal barrier, lock in moisture, and restore suppleness to dry and mature skin.",
      img: "/images/products/buudy-peptide-serum/selfnamed/ingredient-phytosterols.jpg",
    },
    {
      name: "Aloe Leaf Juice",
      role: "Organic Soothing Matrix",
      desc: "Replaces plain water base with organic botanical hydration rich in polysaccharides, enzymes, and calming antioxidants.",
      img: "/images/products/buudy-peptide-serum/selfnamed/ingredient-aloe-juice.jpg",
    },
    {
      name: "Sodium PCA",
      role: "Physiological Humectant",
      desc: "Natural skin-identical humectant that binds moisture directly to epidermal tissue, keeping skin plump and refreshed.",
      img: "/images/products/buudy-peptide-serum/selfnamed/ingredient-sodium-pca.jpg",
    },
    {
      name: "Hyaluronic Acid",
      role: "Multi-Molecular Complex",
      desc: "Multi-depth hydration that plumps dehydration lines on the surface while delivering deep moisture to cellular layers.",
      img: "/images/products/buudy-peptide-serum/selfnamed/ingredient-hyaluronic-acid.jpg",
    },
    {
      name: "Superfruit Seed Oils",
      role: "Strawberry & Blueberry Oils",
      desc: "Cold-pressed superfruit oils rich in Omega-3, Omega-6, and vitamins to nourish, soften, and protect against environmental stress.",
      img: "/images/products/buudy-peptide-serum/selfnamed/ingredient-strawberry-seed-oil.jpg",
    },
    {
      name: "Ginkgo Leaf Extract",
      role: "1% Polyphenol Defense",
      desc: "Potent botanical antioxidant that defends collagen networks against free radicals and supports radiant microcirculation.",
      img: "/images/products/buudy-peptide-serum/selfnamed/ingredient-ginkgo-leaf-extract.jpg",
    },
  ];

  return (
    <section className="buudy-section bg-[var(--cream)] py-14 md:py-20">
      <div className="buudy-wrap">
        {/* Header with Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="buudy-mono text-[var(--gold)] uppercase tracking-[0.2em] text-xs font-semibold">
              Pure Active Chemistry
            </p>
            <h2 className="buudy-display mt-2 text-3xl sm:text-4xl leading-tight text-[var(--plum)]">
              Key <em className="buudy-italic text-[var(--gold)]">bioactive ingredients</em>.
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[var(--muted)] max-w-2xl leading-relaxed">
              Formulated according to strict European ECOCERT COSMOS Natural standards. Zero synthetic dyes, parabens, phthalates, or microplastics.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Previous ingredient"
              className="w-10 h-10 rounded-full border border-[rgba(46,16,47,0.15)] bg-white text-[var(--plum)] hover:bg-[var(--plum)] hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Next ingredient"
              className="w-10 h-10 rounded-full border border-[rgba(46,16,47,0.15)] bg-white text-[var(--plum)] hover:bg-[var(--plum)] hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Reel with Touch, Trackpad & Arrow Navigation */}
        <div
          ref={scrollRef}
          className="flex gap-5 sm:gap-6 overflow-x-auto pt-2 pb-6 md:pb-8 scrollbar-none snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 touch-pan-x"
        >
          {ingredients.map((ing) => (
            <div
              key={ing.name}
              data-story-card
              className="flex-none w-[220px] sm:w-[240px] flex flex-col rounded-2xl bg-white border border-[rgba(46,16,47,0.08)] p-5 pb-7 text-center shadow-xs hover:shadow-lg hover:-translate-y-1 hover:border-[rgba(184,149,86,0.35)] transition-all duration-300 snap-start"
            >
              <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden bg-[var(--cream)] border border-[rgba(46,16,47,0.08)] mb-4 shrink-0">
                <Image
                  src={ing.img}
                  alt={ing.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <h3 className="buudy-display text-base font-semibold text-[var(--plum)]">
                {ing.name}
              </h3>
              <span className="buudy-mono text-[11px] text-[var(--gold)] font-bold uppercase tracking-wider mt-1 mb-2">
                {ing.role}
              </span>
              <p className="text-xs sm:text-sm leading-relaxed text-[var(--muted)]">
                {ing.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 6. How To Use Section (from Selfnamed Peptide Serum Page)
function PeptideHowToUseSection({ editorial = false }: { editorial?: boolean }) {
  const steps = [
    {
      num: 1,
      title: "Cleanse Your Skin",
      desc: "Start with a clean face and neck, morning and evening.",
    },
    {
      num: 2,
      title: "Apply the Peptide Serum",
      desc: "Dispense 1–2 drops and gently press into face, neck, and décolletage.",
    },
    {
      num: 3,
      title: "Massage & Absorb",
      desc: "Gently massage in upward circular motions until fully absorbed. Suitable for AM and/or PM use.",
    },
    {
      num: 4,
      title: "Follow with Moisturiser & SPF",
      desc: "Layer your ageless moisturiser on top to lock in peptides. Always apply SPF in the morning.",
    },
  ];

  if (editorial) {
    return (
      <section
        aria-labelledby="peptide-how-to-use"
        className="buudy-section scroll-mt-24"
        id="how-to-use"
      >
        <div className="buudy-wrap grid items-center gap-7 md:grid-cols-2 md:gap-10 lg:gap-16">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl md:order-last md:aspect-[4/3]">
            <Image
              src="/images/products/buudy-peptide-serum/02-neck-collarbone-beauty.webp"
              alt="Model neck and collarbone beauty portrait demonstrating firm, radiant skin after peptide care"
              fill
              sizes="(min-width: 1260px) 560px, (min-width: 768px) 46vw, calc(100vw - 32px)"
              className="object-cover"
            />
          </div>
          <div>
            <h2 id="peptide-how-to-use" className="buudy-display text-[var(--plum)]">
              How to Use
            </h2>
            <p className="mt-3 text-sm text-[var(--muted)] sm:text-base">
              Follow these simple steps to get the best results
            </p>
            <HyaluronicRoutineSteps>
              {steps.map(({ num, title, desc }) => (
                <li className="flex items-baseline gap-3 sm:gap-4" key={num}>
                  <span aria-hidden="true" className="buudy-mono shrink-0 text-[var(--plum-soft)]">
                    {String(num).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="buudy-display text-xl leading-tight text-[var(--plum)]">
                      {title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                      {desc}
                    </p>
                  </div>
                </li>
              ))}
            </HyaluronicRoutineSteps>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="buudy-section bg-[var(--cream)] py-14 md:py-20" id="how-to-use">
      <div className="buudy-wrap">
        {/* Centered Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="buudy-display text-3xl sm:text-4xl lg:text-[2.6rem] text-[var(--plum)]">
            How to Use
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[var(--muted)]">
            Follow these simple steps to get the best results
          </p>
        </div>

        {/* Horizontal Stepper Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line on desktop */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] h-[1.5px] bg-[#d5cfc5] z-0"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 relative z-10">
            {steps.map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center">
                {/* Number Badge */}
                <div className="w-14 h-14 rounded-full bg-white border border-[#d5cfc5] shadow-xs text-[var(--plum)] font-serif font-bold text-lg flex items-center justify-center mb-4 md:mb-6 shrink-0 transition-transform hover:scale-105">
                  {step.num}
                </div>

                {/* Title */}
                <h3 className="buudy-display font-semibold text-base sm:text-lg text-[var(--plum)] mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed max-w-[240px]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Master Wrapper for all Selfnamed Sections on Peptide Serum Page
export function PeptideSerumSelfnamedSections({ routineFirstGrid = false }: { routineFirstGrid?: boolean }) {
  return (
    <>
      <ProductInDetailsCarousel />
      {routineFirstGrid && <PeptideHowToUseSection editorial />}
      <ProductFeaturesSection />
      <CuratedForSection />
      <ProductFormulaSection />
      <KeyIngredientsSection />
      {!routineFirstGrid && <PeptideHowToUseSection />}
    </>
  );
}
