import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowDown, Droplets, Ruler, Wrench } from "lucide-react";
import { FAQSection } from "@/components/product/FAQSection";
import { OmniluxProductGallery } from "@/components/product/OmniluxProductGallery";
import { buudyShowerHead, showerHeadAsset } from "@/data/buudyShowerHead";

const { description, gallery, hero, href, name, status } = buudyShowerHead;

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

const waterPath = [
  { title: "Inlet", description: "Water enters through the fixed shower arm." },
  { title: "Cartridge", description: "It passes through the filter inside the chrome housing." },
  { title: "Spray face", description: "Water flows out through the round spray face." },
];

const measurements = [
  { label: "Spray face diameter", value: "152 mm" },
  { label: "Overall depth", value: "131 mm" },
  { label: "Threaded connection", value: "G 1/2" },
];

const faqs = [
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
        <Link
          href="/collections/all"
          className="mb-5 inline-flex items-center gap-2 text-sm text-[var(--muted)] transition-colors hover:text-[var(--plum)]"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          All products
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:items-start lg:gap-12">
          <OmniluxProductGallery images={gallery} hasGifts={false} isMask={false} />
          <div className="pb-2 lg:pt-6">
            <h1 id="shower-head-title" className="buudy-heading !text-[clamp(2.45rem,5.2vw,4.4rem)]">
              {name}
            </h1>
            <p className="buudy-copy mt-4 max-w-md text-base sm:text-lg">{description}</p>

            <ul className="mt-7 space-y-4 border-y border-[var(--border)] py-5 text-sm sm:text-base">
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

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <a
                href="#fit"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--plum)] px-6 text-sm font-semibold text-[var(--cream)] transition-colors hover:bg-[var(--plum-soft)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--plum)]"
              >
                Check your fit
                <ArrowDown size={16} aria-hidden="true" />
              </a>
              <p className="text-sm font-medium text-[var(--muted)]">{status}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="filtration" className="border-y border-[var(--border)]/60 bg-white py-12 md:py-20" aria-labelledby="shower-filtration-title">
        <div className="buudy-wrap grid grid-cols-1 items-center gap-8 md:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] md:gap-11 lg:gap-16">
          <Image
            src={showerHeadAsset("07-filtration.webp")}
            alt="Off-white replaceable filter cartridge with a segmented grille"
            width={1536}
            height={1024}
            sizes={sectionImageSizes}
            className="w-full rounded-2xl"
          />
          <div>
            <h2 id="shower-filtration-title" className="buudy-display text-[2.15rem] leading-[1.08] md:text-5xl">
              The filter <em className="buudy-italic">behind the spray.</em>
            </h2>
            <p className="buudy-copy mt-4">The 20-stage cartridge sits inside the head and can be replaced separately.</p>
            <ol aria-label="Water path through the shower head" className="mt-6 divide-y divide-[var(--border)]/65 border-t border-[var(--border)]/65">
              {waterPath.map((step, index) => (
                <li key={step.title} className="grid grid-cols-[1.75rem_1fr] gap-3 py-3.5">
                  <span className="buudy-mono pt-1 text-[var(--plum-soft)]" aria-hidden="true">0{index + 1}</span>
                  <div>
                    <p className="font-medium">{step.title}</p>
                    <p className="mt-1 text-sm leading-5 text-[var(--muted)]">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="buudy-wrap py-12 md:py-20" aria-labelledby="shower-routine-title">
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl bg-[var(--plum)] text-[var(--cream)] md:grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)]">
          <div className="self-center px-6 py-8 sm:px-9 md:px-8 lg:px-12">
            <h2 id="shower-routine-title" className="buudy-display text-[2.15rem] leading-[1.08] md:text-[2.75rem]">
              Your daily <em className="buudy-italic">rinse.</em>
            </h2>
            <p className="mt-4 max-w-xs text-sm leading-6 text-[var(--cream)]/85 sm:text-base">
              The round spray face gives you a fixed overhead rinse for washing your hair and showering as usual.
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

      <FAQSection faqs={faqs} />
    </article>
  );
}
