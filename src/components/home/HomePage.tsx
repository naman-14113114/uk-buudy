import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  homeFeatureCards,
  homeLightTherapy,
  homeMaskSpotlight,
  homeTorchSpotlight,
  homeWavelengthMap,
  homeYoungerYou,
} from "@/data/home";
import { formatMoney } from "@/lib/money";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { SectionHeading } from "@/components/ui/SectionHeading";

function ProductSpotlight({
  align = "mask",
}: {
  align?: "mask" | "torch";
}) {
  const data = align === "mask" ? homeMaskSpotlight : homeTorchSpotlight;
  const isTorch = align === "torch";

  return (
    <section
      className={`buudy-section py-24 ${
        isTorch ? "bg-[var(--plum)] text-[var(--cream)]" : "bg-[var(--blush)]"
      }`}
    >
      <div className="buudy-wrap grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className={isTorch ? "lg:order-2" : ""}>
          <SectionHeading
            eyebrow={data.eyebrow}
            title={
              isTorch ? (
                <>
                  {data.title.split(" ").slice(0, -2).join(" ")}{" "}
                  <em className="buudy-italic">
                    {data.title.split(" ").slice(-2).join(" ")}
                  </em>
                </>
              ) : (
                <>
                  The Buudy LED light therapy mask with{" "}
                  <em className="buudy-italic">7 LED Colours + NIR</em>.
                </>
              )
            }
            copy={data.copy}
            invert={isTorch}
          />
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Price
              compareAtCents={data.product.compareAtCents}
              currency={data.product.currency}
              invert={isTorch}
              priceCents={data.product.priceCents}
            />
            <span
              className={`buudy-mono rounded-full px-3 py-2 ${
                isTorch
                  ? "bg-[rgba(247,241,232,.12)] text-[var(--gold)]"
                  : "bg-[rgba(58,31,61,.08)] text-[var(--gold)]"
              }`}
            >
              {data.product.promoLabel}
            </span>
          </div>
          <Button
            asChild
            className={`mt-8 ${
              isTorch
                ? "!border-[var(--cream)] !text-[var(--cream)] hover:!bg-[var(--blush)] hover:!text-[var(--plum)]"
                : ""
            }`}
          >
            <Link href={`/products/${data.product.slug}`}>
              {isTorch ? homeTorchSpotlight.ctaLabel : "Buy Now"}
              <ArrowRight size={17} />
            </Link>
          </Button>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-[var(--cream)]">
          <Image
            alt={data.image.alt}
            className="object-cover"
            fill
            sizes="(min-width: 1024px) 45vw, 90vw"
            src={data.image.src}
          />
        </div>
      </div>
    </section>
  );
}

function HomeFeatureGrid() {
  return (
    <section className="buudy-section bg-[var(--cream)] py-24">
      <div className="buudy-wrap">
        <SectionHeading
          eyebrow="Why Buudy"
          title={
            <>
              Light therapy that covers the <em className="buudy-italic">details</em>.
            </>
          }
          copy="Dense LED coverage, flexible treatments, and built-in neck care help the daily ritual feel simple while still feeling complete."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {homeFeatureCards.map((feature) => (
            <article
              className="overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--card)]"
              key={feature.title}
            >
              <img
                alt={feature.title}
                className="block h-auto w-full bg-[var(--blush)]"
                src={feature.image}
              />
              <div className="p-5">
                <h2 className="buudy-display text-2xl text-[var(--plum)]">
                  {feature.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  {feature.copy}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LightTherapyStory() {
  return (
    <section
      className="buudy-section bg-[var(--plum)] py-24 text-[var(--cream)]"
      id="light-therapy"
    >
      <div className="buudy-wrap grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-[rgba(247,241,232,.08)]">
          <Image
            alt={homeLightTherapy.image.alt}
            className="object-cover"
            fill
            sizes="(min-width: 1024px) 42vw, 90vw"
            src={homeLightTherapy.image.src}
          />
        </div>
        <SectionHeading
          eyebrow={homeLightTherapy.eyebrow}
          title={
            <>
              What is light therapy and{" "}
              <em className="buudy-italic">where did it come from?</em>
            </>
          }
          copy={homeLightTherapy.copy}
          invert
        />
      </div>
    </section>
  );
}

function YoungerYou() {
  return (
    <section className="buudy-section bg-[var(--cream)] py-24">
      <div className="buudy-wrap grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Reveal a younger you"
            title={
              <>
                Reveal a <em className="buudy-italic">younger you</em>.
              </>
            }
            copy={homeYoungerYou.copy}
          />
          <Button asChild className="mt-8">
            <Link href="/products/buudy-led-mask">
              Shop the mask
              <ArrowRight size={17} />
            </Link>
          </Button>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-[var(--blush)]">
          <Image
            alt={homeYoungerYou.image.alt}
            className="object-cover"
            fill
            sizes="(min-width: 1024px) 40vw, 90vw"
            src={homeYoungerYou.image.src}
          />
        </div>
      </div>
    </section>
  );
}

function WavelengthMapPreview() {
  return (
    <section
      className="buudy-section bg-[var(--blush)] py-24"
      id="wavelength-map"
    >
      <div className="buudy-wrap grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
        <SectionHeading
          eyebrow={homeWavelengthMap.eyebrow}
          title={
            <>
              Your wavelength <em className="buudy-italic">map</em>.
            </>
          }
          copy={homeWavelengthMap.copy}
        />
        <div className="rounded-[18px] border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {homeWavelengthMap.zones.map((zone, index) => (
              <div
                className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--cream)] px-4 py-3"
                key={zone}
              >
                <span className="buudy-display text-xl text-[var(--plum)]">
                  {zone}
                </span>
                <span className="buudy-display text-sm font-medium text-[var(--gold)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl bg-[var(--plum)] p-5 text-[var(--cream)]">
            <div className="flex items-center gap-3">
              <Sparkles size={18} className="text-[var(--gold)]" />
              <p className="buudy-mono text-[var(--gold)]">Recommended Wavelength</p>
            </div>
            <p className="buudy-display mt-3 text-3xl">Red 633nm</p>
            <p className="mt-3 text-sm leading-6 text-[rgba(247,241,232,.76)]">
              Match each skin concern with a targeted wavelength, then build a
              routine that feels easy to repeat.
            </p>
            <Button
              asChild
              className="mt-5 !border-[var(--gold)] !text-[var(--gold)]"
            >
              <Link href="/pages/skincare-quiz">
                Take the skincare quiz
                <ArrowRight size={17} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyTryBuudy() {
  return (
    <section className="buudy-section bg-[var(--cream)] py-24">
      <div className="buudy-wrap text-center">
        <p className="buudy-eyebrow">Why try</p>
        <h2 className="buudy-heading mx-auto mt-4 max-w-3xl">
          The Buudy LED Mask?
        </h2>
        <p className="buudy-copy mx-auto mt-5 max-w-2xl">
          Tons of glowing reviews from customers, a full face plus neck ritual,
          and a one-time device that keeps the routine simple.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/products/buudy-led-mask">Shop mask</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/products/red-light-torch">
              Add targeted torch from{" "}
              {formatMoney(
                homeTorchSpotlight.product.priceCents,
                homeTorchSpotlight.product.currency,
              )}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function HomeVideoHero() {
  return (
    <section className="buudy-section relative w-full overflow-hidden bg-[var(--plum)]">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="block h-auto w-full"
        src="/media/products/buudy-led-mask/videos/buudy-goddess-bg.mp4"
      />
    </section>
  );
}

export function HomePage() {
  return (
    <>
      <HomeVideoHero />
      <ProductSpotlight />
      <HomeFeatureGrid />
      <LightTherapyStory />
      <YoungerYou />
      <ProductSpotlight align="torch" />
      <WavelengthMapPreview />
      <WhyTryBuudy />
    </>
  );
}
