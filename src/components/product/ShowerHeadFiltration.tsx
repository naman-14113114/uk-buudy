"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowDown, CheckCircle2, ShieldCheck, Sparkles, Droplets, Award } from "lucide-react";
import { showerHeadAsset } from "@/data/buudyShowerHead";

interface FilterStageInfo {
  first: number;
  last: number;
  name: string;
  badge: string;
  colour: string;
  removes: string[];
  description: string;
}

const filterGroups: FilterStageInfo[] = [
  {
    first: 1,
    last: 5,
    name: "Mechanical Pre-Filtration",
    badge: "Stages 1–5",
    colour: "bg-[#bdb3c5]",
    removes: ["Rust flakes", "Sand & silt", "Pipe scale", "Sediment > 5µm"],
    description:
      "Water hits a surgical-grade stainless mesh and ultra-dense PP cotton screens first. Rust flakes, sand, and pipe scale stop here before they can enter the active media or settle onto your scalp and hair cuticles.",
  },
  {
    first: 6,
    last: 10,
    name: "KDF-55 & Redox Media",
    badge: "Stages 6–10",
    colour: "bg-[#9c83a2]",
    removes: ["Free chlorine", "Lead & mercury", "Heavy metals", "Hydrogen sulfide"],
    description:
      "High-purity copper-zinc granules swap electrons with dissolved heavy metals and free chlorine, converting them into harmless soluble compounds. Calcium sulfite keeps working at full efficiency in hot water, where standard carbon gives up.",
  },
  {
    first: 11,
    last: 15,
    name: "Vitamin C & Alkaline Core",
    badge: "Stages 11–15",
    colour: "bg-[#a67f75]",
    removes: ["Chloramines", "Acidic tap pH", "Residual oxidants", "Scalp tightness"],
    description:
      "Ascorbic acid neutralizes persistent chloramines on contact. Tourmaline, Maifan stone, and alkaline ceramic beads balance pH toward skin-neutral (pH 6.5–7.2) and release negative ions so conditioner and natural hair oils can do their job.",
  },
  {
    first: 16,
    last: 20,
    name: "Carbon Polish & Mineral Softening",
    badge: "Stages 16–20",
    colour: "bg-[#c5a987]",
    removes: ["Odors & VOCs", "Hard mineral crust", "Chemical residues", "Final fines"],
    description:
      "Coconut shell activated carbon and microporous cotton remove chemical odors and volatile organic compounds. Magnetic softening ceramic balls condition calcium and magnesium ions so water feels silky and rinses completely clean from the strand.",
  },
];

export function ShowerHeadFiltration() {
  const [activeGroupIndex, setActiveGroupIndex] = useState<number>(0);
  const activeGroup = filterGroups[activeGroupIndex];

  return (
    <section
      id="filtration"
      aria-labelledby="shower-filtration-title"
      className="scroll-mt-28 bg-[#261c2b] py-14 text-[var(--cream)] md:py-24"
    >
      <div className="buudy-wrap">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-[var(--gold)]">
            Inside the Cartridge
          </p>
          <h2
            id="shower-filtration-title"
            className="buudy-display mt-2 text-[2.15rem] leading-[1.08] md:text-5xl"
          >
            Follow a drop of water through <em className="buudy-italic">20 stages.</em>
          </h2>
          <p className="buudy-copy mt-4 text-[var(--cream)]/85">
            Tap any section of the multi-layer cartridge below to explore how each stage purifies,
            neutralizes, and softens your shower water.
          </p>
        </div>

        <div className="grid min-w-0 items-start gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-12 xl:gap-16">
          {/* Cartridge Interactive Selector */}
          <div className="rounded-[2rem] border border-white/20 bg-[#1d1621] p-5 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/15 pb-4 text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
              <span>Water Inlet (From Arm)</span>
              <span className="flex items-center gap-1.5 text-[var(--cream)]/60 font-normal">
                <ArrowDown size={14} className="animate-bounce" /> Downward flow
              </span>
            </div>

            <div className="my-4 space-y-3">
              {filterGroups.map((group, index) => {
                const isSelected = activeGroupIndex === index;
                return (
                  <button
                    key={group.first}
                    type="button"
                    onClick={() => setActiveGroupIndex(index)}
                    aria-pressed={isSelected}
                    className={`group w-full rounded-2xl border p-4 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)] ${
                      isSelected
                        ? "border-[var(--gold)] bg-white/10 shadow-lg shadow-black/40 ring-1 ring-[var(--gold)]/50"
                        : "border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/8"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2">
                        <span
                          className={`h-3 w-3 rounded-full ${group.colour} ${
                            isSelected ? "ring-2 ring-[var(--gold)]" : "opacity-75"
                          }`}
                        />
                        <span className="font-playfair text-lg font-medium text-[var(--cream)] sm:text-xl">
                          {group.name}
                        </span>
                      </span>
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-[var(--gold)]">
                        {group.badge}
                      </span>
                    </div>

                    {/* Band preview */}
                    <div className="mt-3 flex gap-1.5" aria-hidden="true">
                      {Array.from({ length: 5 }, (_, b) => (
                        <span
                          key={b}
                          className={`h-2 flex-1 rounded-full ${group.colour} transition-opacity ${
                            isSelected ? "opacity-100" : "opacity-40"
                          }`}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-white/15 pt-4 text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
              <span>Pure Water Outlet</span>
              <span className="text-[var(--cream)]/60 font-normal">To 152 mm Spray Face</span>
            </div>
          </div>

          {/* Active Detail Card */}
          <div className="flex flex-col justify-between rounded-[2rem] border border-white/15 bg-white/5 p-6 sm:p-8 backdrop-blur-sm lg:p-9 shadow-xl">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--gold)]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--gold)] border border-[var(--gold)]/30">
                  <Sparkles size={13} />
                  {activeGroup.badge}
                </span>
                <span className="text-xs text-[var(--cream)]/60">
                  Replaceable Cartridge System
                </span>
              </div>

              <h3 className="buudy-display mt-4 text-2xl sm:text-3xl lg:text-4xl">
                {activeGroup.name}
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-[var(--cream)]/85 sm:text-base">
                {activeGroup.description}
              </p>

              {/* What it removes */}
              <div className="mt-6 border-t border-white/15 pt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                  Targeted Impurities Removed:
                </p>
                <ul className="mt-3 grid grid-cols-2 gap-2.5 sm:gap-3">
                  {activeGroup.removes.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs sm:text-sm text-[var(--cream)]/90"
                    >
                      <CheckCircle2 size={16} className="shrink-0 text-[var(--gold)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Cutaway thumbnail callout */}
            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-white/5">
                <Image
                  src={showerHeadAsset("14-filtration-cutaway.webp")}
                  alt="Cutaway of the 20-stage filter cartridge"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-xs leading-relaxed text-[var(--cream)]/75">
                <p className="font-semibold text-[var(--cream)]">High-Efficiency 20-Stage Core</p>
                <p className="mt-0.5">
                  Pre-installed and easy to swap every 90 days. Keeps water pressure high while
                  clearing harsh chlorine.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
