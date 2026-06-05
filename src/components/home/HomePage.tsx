import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Gem,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import {
  homeFeatureCards,
  homeLightTherapy,
  homeMaskSpotlight,
  homeTorchSpotlight,
  homeWavelengthMap,
  homeYoungerYou,
} from "@/data/home";
import { buudyMask } from "@/data/products";
import { formatMoney } from "@/lib/money";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";

const trustItems = [
  "4.9 stars from 16,000+ customers",
  "Free tracked shipping",
  "90-day money back guarantee",
  "Made for UK routines",
];

const heroHighlights = [
  "192 high-density LEDs",
  "8 targeted light modes",
  "Face and neck coverage",
  "Cordless tap control",
];

const modeRows = [
  ["Red", "633nm", "Fine lines and visible firmness"],
  ["Blue", "415nm", "Breakout-prone skin days"],
  ["Green", "520nm", "Uneven tone and dullness"],
  ["Yellow", "590nm", "Calm, fresh-looking skin"],
  ["Purple", "415nm + 633nm", "Balanced blemish support"],
  ["Cyan", "463nm + 520nm", "Oil balance and reset days"],
  ["White", "Full spectrum", "Before-event radiance"],
  ["Near infrared", "830nm", "Deeper skin support"],
] as const;

const ritualSteps = [
  {
    title: "Cleanse",
    copy: "Start with clean, dry skin so the light can reach the surface evenly.",
    icon: Sparkles,
  },
  {
    title: "Choose mode",
    copy: "Tap between 8 light settings depending on your skin concern.",
    icon: Zap,
  },
  {
    title: "Relax",
    copy: "Wear it hands-free while reading, resting, or winding down.",
    icon: Clock,
  },
  {
    title: "Repeat",
    copy: "Keep the ritual simple enough to use consistently through the week.",
    icon: CheckCircle2,
  },
];

function Eyebrow({ children, invert }: { children: string; invert?: boolean }) {
  return (
    <p
      className={`buudy-mono ${
        invert ? "text-[var(--gold)]" : "text-[var(--plum)]/60"
      }`}
    >
      {children}
    </p>
  );
}

function StarRating() {
  return (
    <div className="flex items-center gap-1 text-[var(--gold)]">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star fill="currentColor" key={index} size={15} />
      ))}
    </div>
  );
}

function HeroSection() {
  return (
    <section className="buudy-section relative isolate min-h-[calc(100svh-112px)] overflow-hidden bg-[var(--plum)] text-[var(--cream)]">
      <video
        autoPlay
        className="absolute inset-0 h-full w-full object-cover"
        loop
        muted
        playsInline
        poster="/images/products/buudy-led-mask/09-buudy-led-mask-home-spa.webp"
        src="/media/products/buudy-led-mask/videos/buudy-goddess-bg.mp4"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(39,20,42,.9)_0%,rgba(39,20,42,.68)_34%,rgba(39,20,42,.2)_64%,rgba(39,20,42,.52)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(180deg,transparent,rgba(39,20,42,.82))]" />

      <div className="buudy-wrap relative z-10 flex min-h-[calc(100svh-112px)] flex-col justify-end py-10 md:py-12">
        <div className="max-w-4xl">
          <p className="buudy-mono text-[var(--gold)]">Buudy LED Mask, UK launch</p>
          <h1 className="buudy-display mt-5 max-w-4xl text-5xl leading-[.98] text-[var(--cream)] sm:text-6xl md:text-7xl xl:text-[5.4rem]">
            Salon-grade light therapy, made simple at home.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[rgba(247,241,232,.78)] md:text-lg">
            A cordless LED face and neck mask with 8 light modes, 192 LEDs, and
            a free glow kit included while the launch offer is live.
          </p>
        </div>

        <div className="mt-8 grid gap-5 rounded-[28px] border border-[rgba(247,241,232,.2)] bg-[rgba(247,241,232,.1)] p-4 backdrop-blur-md md:grid-cols-[1fr_auto] md:items-end md:p-5">
          <div className="grid gap-5 md:grid-cols-[auto_1fr] md:items-center">
            <Price
              compareAtCents={buudyMask.compareAtCents}
              currency={buudyMask.currency}
              invert
              priceCents={buudyMask.priceCents}
            />
            <div className="grid gap-2 sm:grid-cols-2">
              {heroHighlights.map((item) => (
                <div
                  className="flex items-center gap-2 text-sm text-[rgba(247,241,232,.78)]"
                  key={item}
                >
                  <CheckCircle2 className="text-[var(--gold)]" size={17} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[var(--cream)] px-8 text-sm font-semibold text-[var(--plum)] shadow-[0_18px_40px_-24px_rgba(0,0,0,.62)] transition hover:bg-[var(--blush)]"
              href="/products/buudy-led-mask"
            >
              Shop the LED mask
              <ArrowRight size={17} />
            </Link>
            <Link
              className="inline-flex min-h-14 items-center justify-center rounded-full border border-[rgba(247,241,232,.42)] px-8 text-sm font-semibold text-[var(--cream)] transition hover:bg-[rgba(247,241,232,.1)]"
              href="/pages/skincare-quiz"
            >
              Find your light mode
            </Link>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 text-sm text-[rgba(247,241,232,.76)] sm:flex-row sm:flex-wrap sm:items-center">
          <div className="flex items-center gap-2">
            <StarRating />
            <span>4.9 stars from 16,000+ routines</span>
          </div>
          <span className="hidden h-1 w-1 rounded-full bg-[rgba(247,241,232,.46)] sm:block" />
          <span>Free tracked shipping</span>
          <span className="hidden h-1 w-1 rounded-full bg-[rgba(247,241,232,.46)] sm:block" />
          <span>90-day money back guarantee</span>
        </div>
      </div>
    </section>
  );
}

function TrustRail() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--card)]">
      <div className="buudy-wrap grid gap-3 py-4 sm:grid-cols-2 lg:grid-cols-4">
        {trustItems.map((item) => (
          <div className="flex items-center gap-2 text-sm text-[var(--plum)]" key={item}>
            <ShieldCheck className="text-[var(--gold)]" size={17} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductStory() {
  return (
    <section className="buudy-section bg-[var(--cream)] py-20 md:py-28">
      <div className="buudy-wrap grid gap-10 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
        <div className="grid gap-4 sm:grid-cols-[.86fr_1.14fr]">
          <figure className="home-soft-lift overflow-hidden rounded-[30px] border border-[var(--border)] bg-[var(--blush)]">
            <Image
              alt="Buudy LED Mask front view"
              className="h-full min-h-[430px] w-full object-cover"
              height={900}
              src="/images/products/buudy-led-mask/01-buudy-led-mask-front.webp"
              width={720}
            />
          </figure>
          <div className="grid gap-4">
            <figure className="overflow-hidden rounded-[30px] border border-[var(--border)] bg-[var(--card)]">
              <Image
                alt="Buudy LED Mask home spa"
                className="h-full min-h-[255px] w-full object-cover"
                height={620}
                src="/images/products/buudy-led-mask/09-buudy-led-mask-home-spa.webp"
                width={760}
              />
            </figure>
            <div className="rounded-[30px] bg-[var(--plum)] p-7 text-[var(--cream)]">
              <Gem className="text-[var(--gold)]" size={25} />
              <p className="buudy-display mt-5 text-4xl">Face plus neck</p>
              <p className="mt-3 text-sm leading-6 text-[rgba(247,241,232,.72)]">
                The neck is built into the ritual, because it is often where
                signs of ageing show first.
              </p>
            </div>
          </div>
        </div>

        <div>
          <Eyebrow>{homeMaskSpotlight.eyebrow}</Eyebrow>
          <h2 className="buudy-display mt-4 text-4xl leading-none text-[var(--plum)] md:text-6xl">
            A beauty device that does not feel like homework.
          </h2>
          <p className="mt-6 text-base leading-8 text-[var(--muted)] md:text-lg">
            {homeMaskSpotlight.copy}
          </p>
          <div className="mt-7 grid gap-3">
            {homeFeatureCards.map((feature) => (
              <div
                className="rounded-[22px] border border-[var(--border)] bg-[var(--card)] px-5 py-4"
                key={feature.title}
              >
                <p className="buudy-display text-2xl text-[var(--plum)]">{feature.title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{feature.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LightModes() {
  return (
    <section className="buudy-section bg-[var(--plum)] py-20 text-[var(--cream)] md:py-28">
      <div className="buudy-wrap">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            <Eyebrow invert>{homeWavelengthMap.eyebrow}</Eyebrow>
            <h2 className="buudy-display mt-4 text-4xl leading-none md:text-6xl">
              Choose the light your skin is asking for.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-[rgba(247,241,232,.72)] md:text-lg">
            Each mode gives the ritual a job. Keep it simple: pick your concern,
            tap the mask, and let the session run.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[30px] border border-[rgba(247,241,232,.18)] bg-[rgba(247,241,232,.06)]">
          <div className="home-light-scan relative">
            {modeRows.map(([mode, wavelength, use]) => (
              <div
                className="grid gap-3 border-b border-[rgba(247,241,232,.12)] px-5 py-5 last:border-b-0 md:grid-cols-[170px_150px_1fr] md:items-center md:px-8"
                key={mode}
              >
                <p className="buudy-display text-3xl text-[var(--cream)]">{mode}</p>
                <p className="buudy-mono text-[var(--gold)]">{wavelength}</p>
                <p className="text-sm leading-6 text-[rgba(247,241,232,.72)] md:text-base">
                  {use}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RitualSection() {
  return (
    <section className="buudy-section bg-[var(--cream)] py-20 md:py-28">
      <div className="buudy-wrap">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Daily use</Eyebrow>
          <h2 className="buudy-display mt-4 text-4xl leading-none text-[var(--plum)] md:text-6xl">
            A skincare ritual you can actually keep.
          </h2>
          <p className="mt-5 text-base leading-8 text-[var(--muted)] md:text-lg">
            No cords across the sofa. No complicated setup. Just light, comfort,
            and a repeatable routine.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-4">
          {ritualSteps.map(({ title, copy, icon: Icon }, index) => (
            <article
              className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-6"
              key={title}
            >
              <div className="flex items-center justify-between">
                <Icon className="text-[var(--gold)]" size={24} />
                <span className="buudy-display text-3xl text-[var(--plum)]/30">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="buudy-display mt-8 text-3xl text-[var(--plum)]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GlowKit() {
  return (
    <section className="buudy-section bg-[oklch(91%_0.025_56)] py-20 md:py-28">
      <div className="buudy-wrap grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
        <div>
          <Eyebrow>Launch bundle</Eyebrow>
          <h2 className="buudy-display mt-4 text-4xl leading-none text-[var(--plum)] md:text-6xl">
            The glow kit is included with your mask.
          </h2>
          <p className="mt-5 text-base leading-8 text-[var(--muted)] md:text-lg">
            Buy the mask while the offer is live and receive the red torch,
            travel box, and skincare guide as part of the bundle.
          </p>
          <Button asChild className="mt-8">
            <Link href="/products/buudy-led-mask">
              Claim the bundle
              <ArrowRight size={17} />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {buudyMask.gifts.map((gift) => (
            <Link
              className="group overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--card)]"
              href={gift.href}
              key={gift.id}
            >
              <div className="relative aspect-square bg-[var(--cream)]">
                <Image
                  alt={gift.name}
                  className="object-cover transition duration-500 group-hover:scale-105"
                  fill
                  sizes="(min-width: 1024px) 22vw, 33vw"
                  src={gift.image}
                />
              </div>
              <div className="p-5">
                <p className="buudy-mono text-[var(--gold)]">
                  Free, {formatMoney(gift.valueCents)}
                </p>
                <h3 className="buudy-display mt-2 text-2xl text-[var(--plum)]">
                  {gift.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function TherapyStory() {
  return (
    <section className="buudy-section bg-[var(--cream)] py-20 md:py-28">
      <div className="buudy-wrap grid gap-10 lg:grid-cols-[.92fr_1.08fr] lg:items-center">
        <figure className="overflow-hidden rounded-[34px] border border-[var(--border)] bg-[var(--blush)]">
          <Image
            alt={homeLightTherapy.image.alt}
            className="h-full min-h-[520px] w-full object-cover"
            height={900}
            src={homeLightTherapy.image.src}
            width={900}
          />
        </figure>
        <div>
          <Eyebrow>{homeLightTherapy.eyebrow}</Eyebrow>
          <h2 className="buudy-display mt-4 text-4xl leading-none text-[var(--plum)] md:text-6xl">
            Serious light therapy, softened for everyday use.
          </h2>
          <p className="mt-6 text-base leading-8 text-[var(--muted)] md:text-lg">
            {homeLightTherapy.copy}
          </p>
          <div className="mt-8 grid gap-3">
            {[
              "Ingredient-free and non-invasive",
              "Reusable device for repeat routines",
              "Designed for calm evenings at home",
            ].map((item) => (
              <div className="flex items-center gap-3" key={item}>
                <ShieldCheck className="text-[var(--gold)]" size={19} />
                <span className="text-[var(--plum)]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TorchAndQuiz() {
  return (
    <section className="buudy-section bg-[var(--cream)] pb-20 md:pb-28">
      <div className="buudy-wrap grid gap-5 lg:grid-cols-2">
        <article className="overflow-hidden rounded-[32px] bg-[var(--plum)] text-[var(--cream)]">
          <div className="relative aspect-[16/11]">
            <Image
              alt={homeTorchSpotlight.image.alt}
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              src={homeTorchSpotlight.image.src}
            />
          </div>
          <div className="p-7 md:p-9">
            <Eyebrow invert>{homeTorchSpotlight.eyebrow}</Eyebrow>
            <h3 className="buudy-display mt-3 text-4xl md:text-5xl">
              Targeted care comes with the mask.
            </h3>
            <p className="mt-4 text-base leading-7 text-[rgba(247,241,232,.72)]">
              The red torch supports smaller zones, body care, and focused
              treatment days.
            </p>
          </div>
        </article>

        <article className="flex min-h-[520px] flex-col justify-between rounded-[32px] bg-[var(--blush)] p-7 md:p-9">
          <div>
            <Eyebrow>Personalized guide</Eyebrow>
            <h3 className="buudy-display mt-4 text-5xl leading-none text-[var(--plum)] md:text-6xl">
              Not sure where to start?
            </h3>
            <p className="mt-5 max-w-xl text-base leading-7 text-[var(--muted)]">
              Take the quiz and match your main concern with the best LED mode
              before your first session.
            </p>
          </div>
          <Button asChild className="mt-8 w-max">
            <Link href="/pages/skincare-quiz">
              Take the skincare quiz
              <ArrowRight size={17} />
            </Link>
          </Button>
        </article>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="buudy-section bg-[var(--cream)] pb-20 md:pb-28">
      <div className="buudy-wrap overflow-hidden rounded-[34px] bg-[var(--plum)] text-[var(--cream)]">
        <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div className="p-8 md:p-12">
            <Eyebrow invert>Ready when you are</Eyebrow>
            <h2 className="buudy-display mt-4 text-4xl leading-none md:text-6xl">
              Bring the light home tonight.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-[rgba(247,241,232,.72)]">
              Get the Buudy LED Mask for {formatMoney(buudyMask.priceCents)} with
              the free glow kit included while the launch offer is live.
            </p>
            <Button
              asChild
              className="mt-8 bg-[var(--cream)] text-[var(--plum)] hover:bg-[var(--blush)]"
            >
              <Link href="/products/buudy-led-mask">
                Shop the mask
                <ArrowRight size={17} />
              </Link>
            </Button>
          </div>
          <figure className="relative min-h-[420px]">
            <Image
              alt={homeYoungerYou.image.alt}
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              src={homeYoungerYou.image.src}
            />
          </figure>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustRail />
      <ProductStory />
      <LightModes />
      <RitualSection />
      <GlowKit />
      <TherapyStory />
      <TorchAndQuiz />
      <FinalCta />
    </>
  );
}
