import type { Metadata } from "next";
import Image from "next/image";
import { ChevronDown, Droplets, Ruler, Wrench } from "lucide-react";
import { EarlyBlackFridaySaleBadge } from "@/components/product/EarlyBlackFridayElements";
import { FAQSection } from "@/components/product/FAQSection";
import { OmniluxProductGallery } from "@/components/product/OmniluxProductGallery";
import { ShowerHeadAddToCart } from "@/components/product/ShowerHeadAddToCart";
import { ShowerHeadFiltration } from "@/components/product/ShowerHeadFiltration";
import { Price } from "@/components/ui/Price";
import { buudyShowerHead, showerHeadAsset, showerHeadBundleDescription } from "@/data/buudyShowerHead";
import { percentOff } from "@/lib/money";

const { compareAtCents, description, gallery, hero, href, name, priceCents } = buudyShowerHead;

export const metadata: Metadata = {
  title: name,
  description,
  alternates: { canonical: href },
  openGraph: {
    title: name,
    description,
    url: href,
    type: "website",
    images: [{ url: hero.src, alt: hero.alt, width: 1254, height: 1254 }],
  },
  twitter: { card: "summary_large_image", title: name, description, images: [hero.src] },
};

const sideDetails = [
  {
    eyebrow: "Bundle",
    title: "What’s in the box",
    description: "One polished-chrome shower head with its filter, plus two extra replacement filters.",
  },
  {
    eyebrow: "Specifications",
    title: "Fit and dimensions",
    description: "152 mm spray face, 131 mm overall depth and a G 1/2 thread for a compatible fixed shower arm.",
    href: "#fit",
    link: "Check your fit",
  },
  {
    eyebrow: "Filter",
    title: "20-stage filtration",
    description: "Water passes through the replaceable cartridge inside the head before it reaches the spray face.",
    href: "#filtration",
    link: "Explore the 20 stages",
  },
  {
    eyebrow: "Installation",
    title: "Fitting your shower head",
    description: "Prepare the shower arm, fit the seal and shower head, then run the water and check the connection.",
    href: "#installation",
    link: "See installation steps",
  },
];

const productHighlights = [
  { value: "20", unit: "", label: "Filtration stages in each cartridge" },
  { value: "152", unit: "mm", label: "Diameter of the round spray face" },
  { value: "G 1/2", unit: "", label: "Thread for a compatible fixed shower arm" },
  { value: "3", unit: "", label: "Filter cartridges in the Black Friday bundle" },
];

const installationSteps = [
  {
    image: "16-install-prepare.webp",
    alt: "Hands wrapping white thread-seal tape around the existing shower arm",
    title: "Prepare the shower arm",
    description: "Turn off the shower, remove the existing head and clean the exposed threads. Apply PTFE tape as shown in the fitting instructions.",
  },
  {
    image: "17-install-fit.webp",
    alt: "A hand lining up the chrome Buudy Shower Head with the fitting",
    title: "Fit the seal and head",
    description: "Seat the rubber seal in the inlet. Align the head with the shower arm and turn clockwise until snug.",
  },
  {
    image: "18-install-check.webp",
    alt: "Water running through the fitted chrome shower head",
    title: "Run and check",
    description: "Turn on the shower and check the connection for drips before use.",
  },
];

const measurements = [
  { label: "Spray face diameter", value: "152 mm" },
  { label: "Overall depth", value: "131 mm" },
  { label: "Threaded connection", value: "G 1/2" },
];

const faqs = [
  {
    question: "What comes in the Black Friday bundle?",
    answer: "One Buudy Shower Head with its filter, plus two replacement filters. That is three cartridges in total.",
  },
  {
    question: "Will it fit my shower?",
    answer: "The head is designed for a fixed shower arm with a matching G 1/2 thread. Check your existing arm and allow room for the 152 mm face and 131 mm depth.",
  },
  {
    question: "Can I replace the filter without replacing the head?",
    answer: "Yes. The cartridge sits inside the chrome housing and is designed to be replaced separately.",
  },
  {
    question: "Can I use it as a handheld shower head?",
    answer: "It is a fixed head designed to attach to a compatible shower arm.",
  },
];

const sectionImageSizes = "(min-width: 1280px) 590px, (min-width: 768px) 48vw, calc(100vw - 32px)";

export default function BuudyShowerHeadPage() {
  return (
    <article className="bg-[var(--cream)]">
      <section className="buudy-wrap pb-14 pt-5 sm:pt-7 lg:pb-20" aria-labelledby="shower-head-title">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:items-start lg:gap-12">
          <OmniluxProductGallery images={gallery} hasGifts={false} isMask={false} />
          <div className="pb-2 lg:pt-6">
            <h1 id="shower-head-title" className="buudy-heading !text-[clamp(2.45rem,5.2vw,4.4rem)]">
              {name}
            </h1>
            <p className="buudy-copy mt-4 max-w-md text-base sm:text-lg">{description}</p>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <Price priceCents={priceCents} compareAtCents={compareAtCents} hideDiscount />
              <EarlyBlackFridaySaleBadge discountText={`${percentOff(priceCents, compareAtCents)}% OFF`} />
            </div>

            <div className="mt-5 flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3.5 sm:p-4">
              <Image
                src={showerHeadAsset("13-black-friday-bundle.webp")}
                alt="One Buudy Shower Head and two spare filter cartridges"
                width={112}
                height={112}
                className="h-20 w-20 shrink-0 rounded-xl object-cover sm:h-24 sm:w-24"
              />
              <div>
                <p className="buudy-display text-lg leading-tight sm:text-xl">Black Friday bundle</p>
                <p className="mt-1 text-sm leading-5 text-[var(--muted)]">{showerHeadBundleDescription}</p>
              </div>
            </div>

            <ul className="mt-5 space-y-4 border-y border-[var(--border)] py-5 text-sm sm:text-base">
              <li className="flex items-center gap-3">
                <Droplets size={20} className="shrink-0 text-[var(--plum-soft)]" aria-hidden="true" />
                20-stage filtration with a replaceable cartridge
              </li>
              <li className="flex items-center gap-3">
                <Ruler size={20} className="shrink-0 text-[var(--plum-soft)]" aria-hidden="true" />
                152 mm diameter and 131 mm overall depth
              </li>
              <li className="flex items-center gap-3">
                <Wrench size={20} className="shrink-0 text-[var(--plum-soft)]" aria-hidden="true" />
                G 1/2 connection for a compatible fixed arm
              </li>
            </ul>

            <ShowerHeadAddToCart />

            <div className="mt-4 divide-y divide-[var(--border)] border-b border-[var(--border)]">
              {sideDetails.map(({ eyebrow, title, description: detail, href: target, link }) => (
                <details key={title} name="buudy-shower-product-details" className="group">
                  <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-5 rounded-sm py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--plum)] [&::-webkit-details-marker]:hidden">
                    <span>
                      <span className="font-sans text-xs font-bold uppercase tracking-widest text-[var(--gold)]">{eyebrow}</span>
                      <span className="font-playfair mt-1 block text-xl text-[var(--plum)]">{title}</span>
                    </span>
                    <ChevronDown size={19} aria-hidden="true" className="shrink-0 text-[var(--plum)] transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="buudy-copy pb-4 pr-5 text-sm">
                    {detail}
                    {target && <a href={target} className="mt-2 block w-fit font-semibold text-[var(--plum)] underline underline-offset-4">{link}</a>}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="shower-details" className="border-y border-[var(--border)]/60 bg-white py-12 md:py-20" aria-labelledby="shower-details-title">
        <div className="buudy-wrap">
          <div className="mx-auto mb-8 max-w-2xl text-center md:mb-11">
            <h2 id="shower-details-title" className="buudy-display text-[2.15rem] leading-[1.08] md:text-5xl">
              The shower head <em className="buudy-italic">in numbers.</em>
            </h2>
            <p className="buudy-copy mt-4">From the filter inside the chrome housing to the fitting on your wall.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] md:gap-5">
            <div className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-[#e8eaec] md:aspect-auto">
              <Image
                src={showerHeadAsset("15-shower-detail.webp")}
                alt="A close view of the polished chrome shower head with the water running"
                fill
                sizes={sectionImageSizes}
                className="object-cover object-center"
              />
            </div>
            <dl className="grid grid-cols-2 gap-3 sm:gap-4">
              {productHighlights.map(({ value, unit, label }, index) => (
                <div
                  key={label}
                  className={`flex min-h-36 flex-col justify-between gap-4 rounded-2xl p-4 sm:p-6 lg:min-h-48 lg:p-7 ${
                    index === 0 ? "bg-[var(--plum)] text-[var(--cream)]" : "bg-[var(--cream)] text-[var(--plum)]"
                  }`}
                >
                  <dd className="buudy-display flex flex-wrap items-baseline gap-x-1 leading-none">
                    <span className="text-[clamp(1.9rem,4.6vw,4.2rem)]">{value}</span>
                    {unit && <span className="text-sm sm:text-lg">{unit}</span>}
                  </dd>
                  <dt className="text-sm leading-5 sm:text-base">{label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <ShowerHeadFiltration />

      <section className="buudy-wrap py-12 md:py-20" aria-labelledby="shower-routine-title">
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl bg-[var(--plum)] text-[var(--cream)] md:grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)]">
          <div className="self-center px-6 py-8 sm:px-9 md:px-8 lg:px-12">
            <h2 id="shower-routine-title" className="buudy-display text-[2.15rem] leading-[1.08] md:text-[2.75rem]">
              A filtered <em className="buudy-italic">daily rinse.</em>
            </h2>
            <p className="mt-4 max-w-xs text-sm leading-6 text-[var(--cream)]/85 sm:text-base">
              The cartridge filters the water inside the head before it reaches the spray face. The wide, fixed head gives you an overhead rinse for washing your hair or showering.
            </p>
          </div>
          <Image
            src={showerHeadAsset("09-shower-routine.webp")}
            alt="A person rinsing their hair beneath the running Buudy Shower Head"
            width={1536}
            height={1024}
            sizes="(min-width: 1280px) 780px, (min-width: 768px) 65vw, calc(100vw - 32px)"
            className="aspect-3/2 h-full w-full object-cover"
          />
        </div>
      </section>

      <section id="fit" className="scroll-mt-28 border-y border-[var(--border)]/60 bg-white py-12 md:py-20" aria-labelledby="shower-fit-title">
        <div className="buudy-wrap grid grid-cols-1 items-center gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-11 lg:gap-16">
          <div>
            <h2 id="shower-fit-title" className="buudy-display text-[2.15rem] leading-[1.08] md:text-5xl">
              Check your <em className="buudy-italic">shower fit.</em>
            </h2>
            <p className="buudy-copy mt-4 max-w-md">
              Check the thread on your existing fixed shower arm and measure the space around it before fitting the head.
            </p>
            <dl className="mt-6 divide-y divide-[var(--border)]/65 border-y border-[var(--border)]/65">
              {measurements.map(({ label, value }) => (
                <div key={label} className="flex items-baseline justify-between gap-4 py-3.5 text-sm">
                  <dt className="text-[var(--muted)]">{label}</dt>
                  <dd className="shrink-0 font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <Image
            src={showerHeadAsset("08-fitting.webp")}
            alt="A hand supporting the chrome shower head at the fixed arm connection"
            width={1536}
            height={1024}
            sizes={sectionImageSizes}
            className="w-full rounded-2xl"
          />
        </div>
      </section>

      <section id="installation" className="buudy-wrap scroll-mt-28 py-12 md:py-20" aria-labelledby="shower-install-title">
        <div className="mx-auto mb-8 max-w-2xl text-center md:mb-11">
          <h2 id="shower-install-title" className="buudy-display text-[2.15rem] leading-[1.08] md:text-5xl">
            How to <em className="buudy-italic">install.</em>
          </h2>
          <p className="buudy-copy mt-4">For a fixed shower arm with a matching G 1/2 thread. Follow the fitting instructions supplied with your shower head.</p>
        </div>
        <ol className="grid gap-8 sm:grid-cols-3 sm:gap-4 lg:gap-6">
          {installationSteps.map(({ image, alt, title, description }, index) => (
            <li key={image}>
              <Image
                src={showerHeadAsset(image)}
                alt={alt}
                width={1536}
                height={1024}
                sizes="(min-width: 1280px) 376px, (min-width: 640px) 33vw, calc(100vw - 32px)"
                className="aspect-3/2 w-full rounded-2xl object-cover"
              />
              <h3 className="buudy-display mt-4 flex gap-2 text-xl leading-tight sm:text-2xl">
                <span className="font-sans text-base font-medium text-[var(--plum-soft)]" aria-hidden="true">{index + 1}.</span>
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>
            </li>
          ))}
        </ol>
      </section>

      <FAQSection faqs={faqs} />
    </article>
  );
}
