import type { Metadata } from "next";
import Image from "next/image";
import {
  Droplets,
  Ruler,
  Wrench,
  ShieldCheck,
  Sparkles,
  Star,
  CheckCircle2,
  Truck,
  Layers,
  Heart,
  Zap,
} from "lucide-react";
import { EarlyBlackFridaySaleBadge } from "@/components/product/EarlyBlackFridayElements";
import { FAQSection } from "@/components/product/FAQSection";
import { OmniluxProductGallery } from "@/components/product/OmniluxProductGallery";
import { ProductReviewsSection } from "@/components/product/ProductReviewsSection";
import { ShowerHeadAddToCart } from "@/components/product/ShowerHeadAddToCart";
import { ShowerHeadDetailsAccordion } from "@/components/product/ShowerHeadDetailsAccordion";
import { ShowerHeadFiltration } from "@/components/product/ShowerHeadFiltration";
import { Price } from "@/components/ui/Price";
import {
  buudyShowerHead,
  showerHeadAsset,
  showerHeadBundleDescription,
} from "@/data/buudyShowerHead";
import { percentOff } from "@/lib/money";

const { compareAtCents, description, gallery, hero, href, name, priceCents } =
  buudyShowerHead;

export const metadata: Metadata = {
  title: `${name} | 20-Stage Filtered Showerhead for Healthier Hair & Skin`,
  description,
  alternates: { canonical: href },
  openGraph: {
    title: name,
    description,
    url: href,
    type: "website",
    images: [{ url: hero.src, alt: hero.alt, width: 1254, height: 1254 }],
  },
  twitter: {
    card: "summary_large_image",
    title: name,
    description,
    images: [hero.src],
  },
};

const perceptionResults = [
  {
    percentage: "90%",
    title: "Felt Better Water Pressure",
    description:
      "High-velocity micro-nozzles boost spray pressure while removing pipe scale and sediment.",
  },
  {
    percentage: "91%",
    title: "Reduced Skin Acne & Irritation",
    description:
      "Eliminating chlorine prevents pores from clogging and calms reactive redness and body acne.",
  },
  {
    percentage: "82%",
    title: "Noticed Less Dryness & Breakage",
    description:
      "Shields the natural lipid barrier so hair bends instead of snapping at the brush.",
  },
  {
    percentage: "87%",
    title: "Experienced Less Hair Frizz & Shedding",
    description:
      "Purified water rinses clean without mineral residue, sealing cuticles silky smooth.",
  },
];

const hardwareHighlights = [
  { value: "20", unit: "", label: "Stages of advanced filtration in each cartridge" },
  { value: "152", unit: "mm", label: "Diameter of the wide circular spray face" },
  { value: "G 1/2", unit: "", label: "Universal thread fits standard shower arms" },
  { value: "90", unit: "Days", label: "Consistent filtration performance per filter" },
];

const waterProblems = [
  {
    icon: Droplets,
    title: "Chlorine Strips Your Lipid Barrier",
    description:
      "Tap water chlorine oxidizes the protective natural oils on your skin and scalp — causing the tight, flaky skin, post-shower itch, and scalp redness people mistakenly blame on shampoo.",
  },
  {
    icon: Layers,
    title: "Hard Minerals Coat Every Strand",
    description:
      "Heavy metals and limescale form an invisible crust over hair cuticles. This buildup dulls natural shine, causes blondes to turn brassy, and makes hair brittle and prone to snapping.",
  },
  {
    icon: Sparkles,
    title: "Unfiltered Impurities Clog Pores",
    description:
      "Pipe rust and sediment settle into open pores during hot showers, triggering back acne and facial breakouts, while chronic scalp inflammation accelerates hair shedding.",
  },
];

const featureGridItems = [
  {
    icon: ShieldCheck,
    title: "Cutting-Edge Filtration",
    description:
      "Utilizes a proprietary 20-stage blend surpassing NSF-177 standards to capture heavy metals, chlorine, and sediment.",
  },
  {
    icon: Wrench,
    title: "Effortless Installation",
    description:
      "Sleekly crafted in polished chrome to seamlessly fit any standard fixed shower arm without tools or plumbing.",
  },
  {
    icon: Zap,
    title: "90 Days of Peak Comfort",
    description:
      "Robust high-capacity cartridge guarantees three full months of consistent, high-pressure performance before replacement.",
  },
  {
    icon: CheckCircle2,
    title: "Fast & Simple Setup",
    description:
      "Ready in minutes with the first 20-stage filter pre-installed inside the housing right out of the box.",
  },
];

const installationSteps = [
  {
    image: "16-install-prepare.webp",
    alt: "Hands wrapping white thread-seal Teflon tape around the existing shower arm",
    title: "Prepare the shower arm",
    description:
      "Turn off the shower, twist off the existing head, and clean the exposed threads. Wrap the included Teflon tape around the threads for a leak-proof fit.",
  },
  {
    image: "17-install-fit.webp",
    alt: "A hand lining up the chrome shower head with the fitting",
    title: "Fit the seal and screw on",
    description:
      "Insert the rubber O-ring into the inlet. Align the head with the shower arm and turn clockwise until snug. Hand-tight is enough — no wrench needed.",
  },
  {
    image: "18-install-check.webp",
    alt: "Water running through the fitted chrome shower head",
    title: "Run for 60 seconds",
    description:
      "Turn on the shower for 60 seconds to prime the 20-stage filter media. Check the connection for any drips, then enjoy your filtered shower.",
  },
];

const measurements = [
  { label: "Spray face diameter", value: "152 mm" },
  { label: "Overall depth", value: "131 mm" },
  { label: "Threaded connection", value: "G 1/2 universal" },
  { label: "Included cartridges", value: "3 filters (pre-installed + 2 spares)" },
  { label: "Finish", value: "Mirror-polished chrome" },
];

const customerQuotes = [
  {
    quote: "Less hair in the drain by week three. I was not expecting that. My scalp feels calm and clean.",
    author: "Maya R.",
    badge: "Verified Buyer",
  },
  {
    quote: "Finally, a filter that doesn't kill pressure! This one feels stronger than my original head.",
    author: "Lauren M.",
    badge: "Verified Buyer",
  },
  {
    quote: "My colourist asked what I changed. Colour stays vibrant and scalp stopped flaking completely.",
    author: "Elena V.",
    badge: "Verified Buyer",
  },
  {
    quote: "Two minutes, no tools. Easiest upgrade I've made to my bathroom. Noticeably softer water.",
    author: "Tom W.",
    badge: "Verified Buyer",
  },
];

const faqs = [
  {
    question: "Will it lower my water pressure?",
    answer:
      "No — most customers report it feels stronger. The 152 mm spray face features laser-engineered micro-nozzles, and the 20-stage media bed is optimized so water flows freely at high velocity without having to squeeze through a single dense block.",
  },
  {
    question: "How often do I replace the filter?",
    answer:
      "Every 90 days (roughly 10,000 gallons or 3 months of daily use). The Black Friday bundle includes the filtered showerhead with its pre-installed filter plus 2 extra cartridges, providing 9 full months of filtered water before needing refills. Cartridge swaps take under 30 seconds.",
  },
  {
    question: "Will it fit my shower?",
    answer:
      "Yes. The head uses a standard universal G 1/2 thread, which fits standard fixed shower arms in the UK and internationally. Check your existing shower arm and allow clearance for the 152 mm face and 131 mm depth.",
  },
  {
    question: "Does it soften hard water?",
    answer:
      "Yes. While not an electric whole-house softener, our 20-stage cartridge uses alkaline mineral spheres and magnetic ceramic balls to neutralize hardness minerals and reduce limescale buildup. The result is noticeably softer water, fewer skin breakouts, and hair that feels light and smooth even in very hard water areas.",
  },
  {
    question: "Is it safe for colour-treated or bleached hair?",
    answer:
      "It is significantly better for it. Chlorine and dissolved copper in municipal tap water are the primary culprits behind colour fade, brassy blonde tones, and brittle texture. Removing them protects hair dye and preserves salon colour between visits.",
  },
  {
    question: "Can I replace the filter without replacing the showerhead?",
    answer:
      "Yes. The 20-stage cartridge sits inside the polished chrome housing. Simply twist open the housing by hand, insert a fresh cartridge, and screw it back together.",
  },
  {
    question: "What is included in the Black Friday bundle?",
    answer:
      "One polished-chrome Buudy Filtered Showerhead with a pre-installed 20-stage filter cartridge, two additional replacement filter cartridges (three filters total), a roll of Teflon sealing tape, a custom rubber O-ring seal, and a step-by-step installation guide.",
  },
];

const sectionImageSizes =
  "(min-width: 1280px) 590px, (min-width: 768px) 48vw, calc(100vw - 32px)";

export default function BuudyShowerHeadPage() {
  return (
    <article className="bg-[var(--cream)]">
      {/* Product Hero Section - Matching Mask Page Sticky Gallery & Scrolling Product Details */}
      <section
        id="product-hero"
        className="buudy-section bg-[var(--cream)] [overflow-anchor:none] pt-2 pb-10 sm:pt-4 sm:pb-16 lg:pb-20"
        style={{ overflowX: "clip", overflowY: "visible" }}
        aria-labelledby="shower-head-title"
      >
        <div className="buudy-glow -left-20 -top-24 h-[500px] w-[500px] bg-[#f4a17b] pointer-events-none" />
        <div className="buudy-glow -right-24 top-52 h-[560px] w-[560px] bg-[#a05080] pointer-events-none" />

        <div className="buudy-wrap relative z-10 grid gap-8 [overflow-anchor:none] lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1fr)] lg:items-start lg:gap-8 xl:grid-cols-[1.02fr_1fr] xl:gap-12">
          {/* Sticky Gallery Column */}
          <div className="lg:sticky lg:top-6 lg:self-start w-full">
            <OmniluxProductGallery images={gallery} hasGifts={false} isMask={false} />
          </div>

          {/* Scrolling Product Details Column */}
          <div className="w-full [overflow-anchor:none] pb-2 lg:pt-2">
            {/* Social Proof & Rating Bar */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <div className="flex items-center gap-1 text-[var(--gold)]" aria-label="Rated 4.8 out of 5 stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={15} fill="currentColor" stroke="none" />
                ))}
              </div>
              <span className="font-bold text-[var(--plum)]">4.8</span>
              <span className="text-[var(--muted)]">|</span>
              <a
                href="#reviews"
                className="font-medium text-[var(--plum)] hover:underline focus-visible:outline-2 focus-visible:outline-[var(--plum)]"
              >
                2,643 verified reviews
              </a>
              <span className="text-[var(--muted)] hidden sm:inline">·</span>
              <span className="rounded-full bg-[var(--plum-soft)]/10 px-2.5 py-0.5 text-xs font-semibold text-[var(--plum)]">
                🔥 18 sold in last 24h
              </span>
            </div>

            <h1
              id="shower-head-title"
              className="buudy-heading mt-3 !text-[clamp(2.45rem,5.2vw,4.2rem)]"
            >
              {name}
            </h1>

            <p className="buudy-copy mt-3 max-w-lg text-base sm:text-lg leading-relaxed">
              Healthier hair and skin starts with cleaner water. 20-stage filtration with a
              replaceable cartridge eliminates chlorine, rust, and heavy minerals that dry out your
              scalp and irritate your skin.
            </p>

            {/* Price & Early Black Friday Discount */}
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <Price priceCents={priceCents} compareAtCents={compareAtCents} hideDiscount />
              <EarlyBlackFridaySaleBadge
                discountText={`${percentOff(priceCents, compareAtCents)}% OFF`}
              />
            </div>

            {/* Black Friday Bundle Presentation Card */}
            <div className="mt-5 flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3.5 sm:p-4 shadow-sm">
              <Image
                src={showerHeadAsset("13-black-friday-bundle.webp")}
                alt="Buudy Filtered Showerhead and two spare filter cartridges"
                width={112}
                height={112}
                className="h-20 w-20 shrink-0 rounded-xl object-cover sm:h-24 sm:w-24 border border-[var(--border)]"
              />
              <div>
                <p className="buudy-display text-lg leading-tight sm:text-xl text-[var(--plum)]">
                  Black Friday Bundle Included
                </p>
                <p className="mt-1 text-sm leading-5 text-[var(--muted)]">
                  {showerHeadBundleDescription} (3 cartridges in total — 9 months of pure water).
                </p>
              </div>
            </div>

            {/* Feature Bullets */}
            <ul className="mt-5 space-y-3.5 border-y border-[var(--border)] py-4 text-sm sm:text-base">
              <li className="flex items-center gap-3">
                <Droplets size={19} className="shrink-0 text-[var(--plum-soft)]" aria-hidden="true" />
                <span>20-stage filtration with a replaceable cartridge</span>
              </li>
              <li className="flex items-center gap-3">
                <Ruler size={19} className="shrink-0 text-[var(--plum-soft)]" aria-hidden="true" />
                <span>152 mm spray face with pressure-boosting micro-nozzles</span>
              </li>
              <li className="flex items-center gap-3">
                <Wrench size={19} className="shrink-0 text-[var(--plum-soft)]" aria-hidden="true" />
                <span>Universal G 1/2 connection fits standard fixed shower arms</span>
              </li>
              <li className="flex items-center gap-3">
                <Sparkles size={19} className="shrink-0 text-[var(--plum-soft)]" aria-hidden="true" />
                <span>Includes Teflon tape, rubber O-ring seal, and pre-installed filter</span>
              </li>
            </ul>

            {/* CTA Button */}
            <div className="mt-5">
              <ShowerHeadAddToCart />
            </div>

            {/* Delivery & Dispatch Note */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-[var(--muted)]">
              <span className="flex items-center gap-1.5 font-medium text-[var(--plum)]">
                <Truck size={16} className="text-[var(--gold)]" /> Free UK Tracked Delivery
              </span>
              <span>Dispatched within 24h · 30-Day Money-Back Guarantee</span>
            </div>

            {/* Product Details Accordion - Matching Mask Page Points & Icons */}
            <ShowerHeadDetailsAccordion />
          </div>
        </div>
      </section>

      {/* Result Percentages / In Numbers Section */}
      <section
        id="results-in-numbers"
        className="border-y border-[var(--border)]/60 bg-white py-14 md:py-24"
        aria-labelledby="shower-results-title"
      >
        <div className="buudy-wrap">
          <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-[var(--gold)]">
              Clinical & Consumer Study
            </p>
            <h2
              id="shower-results-title"
              className="buudy-display mt-2 text-[2.15rem] leading-[1.08] md:text-5xl"
            >
              Proven results <em className="buudy-italic">in numbers.</em>
            </h2>
            <p className="buudy-copy mt-4 text-base sm:text-lg">
              Clearer skin. Healthier hair. Users swapped their showerhead and changed nothing
              else about their routine. Here is what they noticed after 4 weeks:
            </p>
          </div>

          {/* 4 Percentage Cards + Product Visual (Kiierr Style Clean Image & Number Cards) */}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center lg:gap-8">
            {/* Clean Product Visual (No overlays or text boxes over image) */}
            <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--cream)] shadow-md">
              <Image
                src={showerHeadAsset("04-spray-face.webp")}
                alt="Buudy Filtered Showerhead circular spray face with precision micro-nozzles"
                fill
                sizes={sectionImageSizes}
                className="object-cover"
              />
            </div>

            {/* 4 Percentage Result Boxes */}
            <div className="flex flex-col justify-between gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {perceptionResults.map(({ percentage, title, description }, idx) => (
                  <div
                    key={title}
                    className={`flex flex-col justify-between rounded-2xl p-5 sm:p-6 transition-transform hover:-translate-y-1 duration-200 border ${
                      idx === 0
                        ? "border-[var(--plum)] bg-[var(--plum)] text-[var(--cream)] shadow-md"
                        : "border-[var(--border)] bg-[var(--cream)] text-[var(--plum)]"
                    }`}
                  >
                    <div>
                      <span className="buudy-display text-4xl sm:text-5xl font-bold tracking-tight">
                        {percentage}
                      </span>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-playfair text-lg font-bold sm:text-xl leading-snug">
                        {title}
                      </h4>
                      <p
                        className={`mt-2 text-xs sm:text-sm leading-relaxed ${
                          idx === 0 ? "text-[var(--cream)]/85" : "text-[var(--muted)]"
                        }`}
                      >
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[var(--muted)] italic pt-1">
                *After 4 Weeks · Results from a consumer perception study conducted across all hair and skin types.
              </p>
            </div>
          </div>

          {/* Specifications In Numbers Strip */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {hardwareHighlights.map(({ value, unit, label }) => (
              <div
                key={label}
                className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5"
              >
                <dd className="buudy-display flex flex-wrap items-baseline gap-x-1 text-3xl sm:text-4xl text-[var(--plum)]">
                  <span>{value}</span>
                  {unit && <span className="text-base sm:text-lg">{unit}</span>}
                </dd>
                <dt className="mt-2 text-xs sm:text-sm leading-snug text-[var(--muted)]">{label}</dt>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Filter Section: Kiierr 2-Column Layout with pool-water-rinse.webp */}
      <section
        id="why-filter"
        className="buudy-wrap py-14 md:py-24"
        aria-labelledby="why-filter-title"
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center xl:gap-14">
          {/* Left Column: Pool Water Image (Matching Kiierr) */}
          <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] border border-[var(--border)] shadow-lg">
            <Image
              src={showerHeadAsset("pool-water-rinse.webp")}
              alt="Woman in swimming pool illustrating municipal water chlorine levels"
              fill
              sizes={sectionImageSizes}
              className="object-cover"
            />
          </div>

          {/* Right Column: Narrative & 3 Problem Points */}
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-[var(--gold)]">
              The Hidden Cause of Dry Skin & Brittle Hair
            </p>
            <h2
              id="why-filter-title"
              className="buudy-display mt-2 text-[2.15rem] leading-[1.1] md:text-[2.75rem]"
            >
              Most people spend 10 minutes a day{" "}
              <em className="buudy-italic">rinsing in pool water.</em>
            </h2>
            <p className="buudy-copy mt-4 text-base sm:text-lg leading-relaxed">
              Municipal water carries roughly the same chlorine as a swimming pool, plus rust, copper,
              and dissolved hard minerals. Hot water opens your skin pores and hair cuticles — letting
              all of it go straight in.
            </p>

            {/* 3 Problem Points */}
            <div className="mt-8 space-y-4">
              {waterProblems.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-2xl border border-[var(--border)] bg-white p-4 sm:p-5 shadow-sm"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--cream)] text-[var(--plum)] border border-[var(--border)]">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-playfair text-lg font-bold text-[var(--plum)] sm:text-xl leading-snug">
                      {title}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm leading-relaxed text-[var(--muted)]">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4-Column Feature Grid (Matching User Image 4) */}
      <section
        id="features"
        className="border-y border-[var(--border)]/60 bg-white py-14 md:py-24"
        aria-labelledby="shower-features-title"
      >
        <div className="buudy-wrap">
          <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-[var(--gold)]">
              Engineered for Quality
            </p>
            <h2
              id="shower-features-title"
              className="buudy-display mt-2 text-[2.15rem] leading-[1.08] md:text-5xl"
            >
              Purity and performance <em className="buudy-italic">in every detail.</em>
            </h2>
            <p className="buudy-copy mt-4 text-base sm:text-lg">
              Designed to look beautiful in any bathroom while delivering hospital-grade water
              purification.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featureGridItems.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--cream)] p-6 shadow-sm transition-transform hover:-translate-y-1 duration-200"
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--plum)] text-[var(--cream)]">
                    <Icon size={22} />
                  </div>
                  <h3 className="buudy-display mt-4 text-lg font-bold text-[var(--plum)] leading-snug">
                    {title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[var(--muted)]">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive 20-Stage Filtration Component */}
      <ShowerHeadFiltration />

      {/* Filtered Daily Rinse & Visual Showcase */}
      <section className="buudy-wrap py-14 md:py-24" aria-labelledby="shower-routine-title">
        <div className="grid grid-cols-1 overflow-hidden rounded-[2rem] bg-[var(--plum)] text-[var(--cream)] md:grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)] shadow-xl">
          <div className="self-center px-6 py-8 sm:px-9 md:px-8 lg:px-12">
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-[var(--gold)]">
              Everyday Routine
            </span>
            <h2
              id="shower-routine-title"
              className="buudy-display mt-2 text-[2.15rem] leading-[1.08] md:text-[2.75rem]"
            >
              A filtered <em className="buudy-italic">daily rinse.</em>
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--cream)]/85 sm:text-base">
              The 20-stage cartridge filters the water inside the head before it reaches the spray
              face. The wide, 152 mm head provides luxurious, overhead coverage that rinses thick
              hair cleanly while soothing sensitive skin.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-xs">
              <div className="rounded-xl border border-white/15 bg-white/5 px-3 py-2">
                <span className="font-semibold text-[var(--gold)]">152 mm</span>
                <p className="text-[var(--cream)]/75">Full Body Wrap</p>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/5 px-3 py-2">
                <span className="font-semibold text-[var(--gold)]">Micro-Nozzles</span>
                <p className="text-[var(--cream)]/75">Laser-Cut Velocity</p>
              </div>
            </div>
          </div>
          <Image
            src={showerHeadAsset("09-shower-routine.webp")}
            alt="A person rinsing their hair beneath the running filtered showerhead"
            width={1536}
            height={1024}
            sizes="(min-width: 1280px) 780px, (min-width: 768px) 65vw, calc(100vw - 32px)"
            className="aspect-3/2 h-full w-full object-cover"
          />
        </div>
      </section>

      {/* Dermatologist Verdict & Clinical Transformation (Matching Kiierr + User Image 5) */}
      <section
        id="clinical-verdict"
        className="border-y border-[var(--border)]/60 bg-white py-14 md:py-24"
        aria-labelledby="dermatologist-verdict-title"
      >
        <div className="buudy-wrap">
          <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-[var(--gold)]">
              Expert Dermatological Perspective
            </p>
            <h2
              id="dermatologist-verdict-title"
              className="buudy-display mt-2 text-[2.15rem] leading-[1.08] md:text-5xl"
            >
              Water your skin and scalp <em className="buudy-italic">can recover in.</em>
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
            {/* Quote Card */}
            <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--cream)] p-7 sm:p-10 shadow-md">
              <span className="font-serif text-5xl leading-none text-[var(--plum-soft)]" aria-hidden="true">
                “
              </span>
              <blockquote className="mt-2 text-base sm:text-xl font-playfair italic leading-relaxed text-[var(--plum)]">
                Chlorine is an oxidant. Rinsing in it every day quietly strips the delicate lipid
                barrier that keeps skin and hair healthy. For patients struggling with scalp
                tightness, eczema, or shedding, filtering shower water is the single easiest change
                I recommend — and the one they actually stick with.
              </blockquote>
              <div className="mt-6 flex items-center gap-4 border-t border-[var(--border)] pt-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--plum)] text-white font-bold text-lg">
                  DS
                </div>
                <div>
                  <p className="font-bold text-[var(--plum)]">Dr. Debra Shelby</p>
                  <p className="text-xs sm:text-sm text-[var(--muted)]">
                    Board-Certified Clinical Dermatologist
                  </p>
                </div>
              </div>
            </div>

            {/* Before / After Benefit Callouts */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                  <span>Strong, Healthy Hair</span>
                  <span>After 4 Weeks</span>
                </div>
                <h4 className="buudy-display mt-2 text-xl text-[var(--plum)]">
                  Reduced Breakage & Lasting Shine
                </h4>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[var(--muted)]">
                  Free from mineral crust and chlorine oxidation, hair strands retain natural
                  elasticity, detangle effortlessly, and maintain rich salon colour without brassiness.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                  <span>Hydrated, Calm Skin</span>
                  <span>After 4 Weeks</span>
                </div>
                <h4 className="buudy-display mt-2 text-xl text-[var(--plum)]">
                  Clear Complexion & Less Redness
                </h4>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[var(--muted)]">
                  Unclogged pores and an intact lipid barrier significantly decrease post-shower
                  redness, dry irritation patches, and back breakout flareups.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shower Fit & Measurements Section */}
      <section
        id="fit"
        className="scroll-mt-28 bg-[var(--cream)] py-14 md:py-24"
        aria-labelledby="shower-fit-title"
      >
        <div className="buudy-wrap grid grid-cols-1 items-center gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-11 lg:gap-16">
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-[var(--gold)]">
              Universal Compatibility
            </p>
            <h2
              id="shower-fit-title"
              className="buudy-display mt-2 text-[2.15rem] leading-[1.08] md:text-5xl"
            >
              Check your <em className="buudy-italic">shower fit.</em>
            </h2>
            <p className="buudy-copy mt-4 max-w-md text-base leading-relaxed">
              Designed to screw directly onto any standard fixed shower arm with a universal G 1/2
              thread. No special tools, adaptors, or plumbing modifications required.
            </p>
            <dl className="mt-6 divide-y divide-[var(--border)]/65 border-y border-[var(--border)]/65">
              {measurements.map(({ label, value }) => (
                <div key={label} className="flex items-baseline justify-between gap-4 py-3 text-sm">
                  <dt className="text-[var(--muted)]">{label}</dt>
                  <dd className="shrink-0 font-semibold text-[var(--plum)]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <Image
            src={showerHeadAsset("08-fitting.webp")}
            alt="Hand supporting the chrome filtered showerhead at the fixed arm connection"
            width={1536}
            height={1024}
            sizes={sectionImageSizes}
            className="w-full rounded-[2rem] border border-[var(--border)] shadow-md"
          />
        </div>
      </section>

      {/* Installation Steps Section (Matching Kiierr + User Image 6) */}
      <section
        id="installation"
        className="border-y border-[var(--border)]/60 bg-white scroll-mt-28 py-14 md:py-24"
        aria-labelledby="shower-install-title"
      >
        <div className="buudy-wrap">
          <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-[var(--gold)]">
              Tool-Free Setup
            </p>
            <h2
              id="shower-install-title"
              className="buudy-display mt-2 text-[2.15rem] leading-[1.08] md:text-5xl"
            >
              Installs in 2 minutes.{" "}
              <em className="buudy-italic">No plumber, no tools.</em>
            </h2>
            <p className="buudy-copy mt-4 text-base sm:text-lg">
              Fits any standard fixed shower arm. Keep your old shower head in a drawer — you will
              not need it.
            </p>
          </div>

          <ol className="grid gap-8 sm:grid-cols-3 sm:gap-6">
            {installationSteps.map(({ image, alt, title, description }, index) => (
              <li
                key={image}
                className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--cream)] p-5 shadow-sm"
              >
                <div className="relative aspect-3/2 w-full overflow-hidden rounded-xl border border-[var(--border)]">
                  <Image
                    src={showerHeadAsset(image)}
                    alt={alt}
                    fill
                    sizes="(min-width: 1280px) 376px, (min-width: 640px) 33vw, calc(100vw - 32px)"
                    className="object-cover"
                  />
                </div>
                <h3 className="buudy-display mt-4 flex items-center gap-2 text-xl leading-tight sm:text-2xl text-[var(--plum)]">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--plum)] text-xs font-bold text-white"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  {title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[var(--muted)]">
                  {description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* REVIEWS SECTION - PLACED DIRECTLY ABOVE FAQ */}
      <section
        className="bg-[var(--cream)] pt-14 pb-2 md:pt-20 md:pb-4"
        aria-label="Customer Highlights"
      >
        <div className="buudy-wrap">
          {/* Customer Reviews Header */}
          <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-[var(--gold)]">
              Verified Customer Experiences
            </p>
            <h2 className="buudy-display mt-2 text-[2.15rem] leading-[1.08] md:text-5xl">
              See how real customers use it <em className="buudy-italic">every day.</em>
            </h2>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="flex text-[var(--gold)]">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={18} fill="currentColor" stroke="none" />
                ))}
              </div>
              <span className="font-bold text-[var(--plum)]">4.8 / 5.0</span>
              <span className="text-[var(--muted)]">·</span>
              <span className="text-sm font-semibold text-[var(--muted)]">
                94% rate it 5 stars (2,600+ reviews)
              </span>
            </div>
          </div>

          {/* Quick Highlight Testimonials Strip */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {customerQuotes.map(({ quote, author, badge }) => (
              <div
                key={author}
                className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm"
              >
                <div className="flex text-[var(--gold)] mb-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={13} fill="currentColor" stroke="none" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm font-playfair italic leading-relaxed text-[var(--plum)]">
                  “{quote}”
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3 text-xs">
                  <span className="font-bold text-[var(--plum)]">{author}</span>
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 size={12} /> {badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Interactive Product Reviews Grid (Verified Zero Buudy Mentions) */}
      <ProductReviewsSection productHandle="buudy-shower-head" />

      {/* FAQ SECTION - PLACED DIRECTLY BELOW REVIEWS */}
      <FAQSection faqs={faqs} />
    </article>
  );
}
