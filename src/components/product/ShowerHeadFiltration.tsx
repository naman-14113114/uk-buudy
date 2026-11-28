"use client";

import { useState } from "react";
import { Sparkles, CheckCircle2, ArrowDown } from "lucide-react";

interface FilterStage {
  id: string;
  tabLabel: string;
  stageNumber: string;
  title: string;
  description: string;
  removes: string[];
}

const filterStages: FilterStage[] = [
  {
    id: "stage-1-5",
    tabLabel: "1–5: Mesh Pre-Filter",
    stageNumber: "Stages 1–5",
    title: "The grit never gets in.",
    description:
      "Water hits a surgical-grade stainless mesh and ultra-dense PP cotton screens first. Rust flakes, sand, and pipe scale stop here before they can reach the active media — or settle onto fine hair and leave it feeling gritty and dull.",
    removes: ["Rust flakes", "Sand & silt", "Pipe scale", "Sediment"],
  },
  {
    id: "stage-6-10",
    tabLabel: "6–10: KDF-55 & Redox",
    stageNumber: "Stages 6–10",
    title: "Metals and chlorine, out by chemistry.",
    description:
      "High-purity KDF-55 copper-zinc granules swap electrons with lead, mercury, and free chlorine, turning them into harmless compounds. Calcium sulfite keeps working at full efficiency in steaming hot water, where carbon alone gives up.",
    removes: ["Free chlorine", "Lead & mercury", "Heavy metals", "Hydrogen sulfide"],
  },
  {
    id: "stage-11-15",
    tabLabel: "11–15: Vitamin C Core",
    stageNumber: "Stages 11–15",
    title: "The Vitamin C & alkaline core.",
    description:
      "An ascorbic acid core neutralizes chlorine and chloramine on contact — including the chloramines standard carbon filters let straight through. It is the stage you feel first: less scalp tightness, less redness, and restored skin-neutral pH.",
    removes: ["Chloramines", "Acidic tap pH", "Residual oxidants", "Scalp tightness"],
  },
  {
    id: "stage-16-20",
    tabLabel: "16–20: Carbon Polish",
    stageNumber: "Stages 16–20",
    title: "A final polish and softening.",
    description:
      "Activated coconut shell carbon and microporous cotton remove chemical odors and volatile organic compounds. Magnetic softening ceramic balls condition calcium and magnesium ions so water feels silky and rinses completely clean from the strand.",
    removes: ["Chemical odors", "Limescale crust", "Volatile organics", "Remaining fines"],
  },
  {
    id: "what-reaches-you",
    tabLabel: "↓ What reaches you",
    stageNumber: "The Result",
    title: "Water your skin and scalp can recover in.",
    description:
      "Chlorine-free, pH-balanced, heavy metal-free — every rinse, for 90 days per cartridge. Pure, high-pressure water that protects your skin barrier, keeps blondes from turning brassy, and lets your hair shine naturally.",
    removes: ["99% of tap impurities", "Chlorine & heavy metals", "Hard water dryness"],
  },
];

export function ShowerHeadFiltration() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const activeStage = filterStages[activeIndex];

  return (
    <section
      id="filtration"
      aria-labelledby="shower-filtration-title"
      className="scroll-mt-28 border-y border-[var(--border)]/60 bg-[var(--cream)] py-14 md:py-24"
    >
      <div className="buudy-wrap">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-[var(--gold)]">
            Inside The Cartridge
          </p>
          <h2
            id="shower-filtration-title"
            className="buudy-display mt-2 text-[2.15rem] leading-[1.08] md:text-5xl"
          >
            Follow a drop of water through <em className="buudy-italic">all 20 stages.</em>
          </h2>
          <p className="buudy-copy mt-4 text-base sm:text-lg">
            Tap a layer of the cartridge below to see what it does.
          </p>
        </div>

        {/* Tab Buttons Strip (Kiierr style) */}
        <div className="mx-auto max-w-4xl">
          <div
            role="tablist"
            aria-label="Filtration stages"
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
          >
            {filterStages.map((stage, idx) => {
              const isSelected = activeIndex === idx;
              return (
                <button
                  key={stage.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveIndex(idx)}
                  className={`rounded-full px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[var(--plum)] ${
                    isSelected
                      ? "bg-[var(--plum)] text-[var(--cream)] shadow-md"
                      : "bg-white text-[var(--plum)] border border-[var(--border)] hover:border-[var(--plum-soft)]/50 hover:bg-[var(--card)]"
                  }`}
                >
                  {stage.tabLabel}
                </button>
              );
            })}
          </div>

          {/* Active Stage Panel (Kiierr style) */}
          <div
            role="tabpanel"
            className="mt-8 rounded-[2rem] border border-[var(--border)] bg-white p-7 sm:p-10 shadow-sm transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--gold)]/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--plum)]">
                <Sparkles size={13} className="text-[var(--gold)]" />
                {activeStage.stageNumber}
              </span>
              <span className="text-xs text-[var(--muted)] font-medium">
                20-Stage Replaceable Cartridge System
              </span>
            </div>

            <div className="mt-6">
              <h3 className="buudy-display text-2xl sm:text-3xl lg:text-4xl text-[var(--plum)]">
                {activeStage.title}
              </h3>

              <p className="buudy-copy mt-4 text-base sm:text-lg leading-relaxed text-[var(--muted)]">
                {activeStage.description}
              </p>

              {/* Removes section */}
              <div className="mt-8 rounded-2xl bg-[var(--cream)] p-5 sm:p-6 border border-[var(--border)]">
                <p className="font-sans text-xs font-bold uppercase tracking-widest text-[var(--gold)]">
                  Removes:
                </p>
                <ul className="mt-3 flex flex-wrap gap-2.5 sm:gap-3">
                  {activeStage.removes.map((item) => (
                    <li
                      key={item}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs sm:text-sm font-semibold text-[var(--plum)] border border-[var(--border)] shadow-xs"
                    >
                      <CheckCircle2 size={15} className="text-emerald-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
