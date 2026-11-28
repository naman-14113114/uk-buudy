"use client";

import { useState } from "react";

interface FilterStage {
  id: string;
  stageNumbers: string;
  shortName: string;
  watermarkNumber: string;
  title: string;
  description: string;
  removes: string[];
  discCount: number;
  textureImage: string;
  glowClass: string;
}

const filterStages: FilterStage[] = [
  {
    id: "stage-1-5",
    stageNumbers: "1–5",
    shortName: "Mesh pre-filter",
    watermarkNumber: "1",
    title: "The grit never gets in.",
    description:
      "Water hits a surgical-grade stainless mesh and ultra-dense PP cotton screens first. Rust flakes, sand, and pipe scale stop here before they can reach the active media — or settle onto fine hair and leave it feeling gritty and dull.",
    removes: ["Rust flakes", "Sand & silt", "Pipe scale", "Sediment"],
    discCount: 4,
    textureImage: "/images/products/shower-head/stages/mesh.webp",
    glowClass: "ring-1 ring-white/60 shadow-[0_0_12px_rgba(255,255,255,0.4)]",
  },
  {
    id: "stage-6-10",
    stageNumbers: "6–10",
    shortName: "KDF-55",
    watermarkNumber: "2",
    title: "Metals and chlorine, out by chemistry.",
    description:
      "High-purity KDF-55 copper-zinc granules swap electrons with lead, mercury, and free chlorine, turning them into harmless compounds. Calcium sulfite keeps working at full efficiency in steaming hot water, where carbon alone gives up.",
    removes: ["Free chlorine", "Lead & mercury", "Heavy metals", "Hydrogen sulfide"],
    discCount: 4,
    textureImage: "/images/products/shower-head/stages/kdf.webp",
    glowClass: "ring-1 ring-[#e09858]/60 shadow-[0_0_12px_rgba(217,140,80,0.5)]",
  },
  {
    id: "stage-11-13",
    stageNumbers: "11–13",
    shortName: "Vitamin C core",
    watermarkNumber: "3",
    title: "The Vitamin C core.",
    description:
      "An ascorbic acid cartridge neutralizes chlorine and chloramine on contact — including the chloramines standard carbon filters let straight through. It is the stage you feel first: less scalp tightness, less redness, and restored skin-neutral pH.",
    removes: ["Chloramines", "Residual oxidants", "Scalp itch & redness"],
    discCount: 3,
    textureImage: "/images/products/shower-head/stages/vitaminc.webp",
    glowClass: "ring-1 ring-[#f0b040]/60 shadow-[0_0_12px_rgba(235,175,60,0.5)]",
  },
  {
    id: "stage-14-17",
    stageNumbers: "14–17",
    shortName: "Alkaline ion core",
    watermarkNumber: "4",
    title: "The Alkaline Ion core.",
    description:
      "Tourmaline, maifan stone and alkaline ceramic nudge pH toward skin-neutral and release negative ions. Water feels softer on the scalp and rinses cleaner from the strand, so conditioner can do its job.",
    removes: ["Harsh pH", "Mineral residue", "Hard water dryness"],
    discCount: 4,
    textureImage: "/images/products/shower-head/stages/alkaline.webp",
    glowClass: "ring-1 ring-[#f05c48]/70 shadow-[0_0_14px_rgba(235,80,60,0.6)]",
  },
  {
    id: "stage-18-20",
    stageNumbers: "18–20",
    shortName: "Carbon polish",
    watermarkNumber: "5",
    title: "A final polish.",
    description:
      "Activated coconut shell carbon and microporous cotton remove chemical odors and volatile organic compounds. Magnetic softening ceramic balls condition calcium and magnesium ions so water feels silky and rinses completely clean from the strand.",
    removes: ["Chemical odors", "Limescale crust", "Volatile organics", "Final fines"],
    discCount: 3,
    textureImage: "/images/products/shower-head/stages/carbon.webp",
    glowClass: "ring-1 ring-white/60 shadow-[0_0_12px_rgba(180,185,195,0.5)]",
  },
  {
    id: "what-reaches-you",
    stageNumbers: "↓",
    shortName: "What reaches you",
    watermarkNumber: "✓",
    title: "Water your skin and scalp can recover in.",
    description:
      "Chlorine-free, pH-balanced, metal-free — every rinse, for 90 days per cartridge. Pure, high-pressure water that protects your skin barrier, keeps blondes from turning brassy, and lets your hair shine naturally.",
    removes: ["99% of tap impurities", "Chlorine & heavy metals", "Hard water dryness"],
    discCount: 0,
    textureImage: "",
    glowClass: "ring-1 ring-[#d4af5f]/80 shadow-[0_0_15px_rgba(212,175,95,0.65)]",
  },
];

export function ShowerHeadFiltration() {
  const [activeIndex, setActiveIndex] = useState<number>(3); // Default to Alkaline Ion Core matching reference screenshot
  const activeStage = filterStages[activeIndex];

  return (
    <section
      id="filtration"
      aria-labelledby="shower-filtration-title"
      className="scroll-mt-28 bg-[#141215] text-[#F3F1EC] py-14 md:py-24 overflow-hidden relative"
    >
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(68,30,72,0.3)_0%,transparent_70%)] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 bottom-10 h-[450px] w-[450px] rounded-full bg-[radial-gradient(circle,rgba(212,175,95,0.08)_0%,transparent_70%)] blur-3xl"
        aria-hidden="true"
      />

      <div className="buudy-wrap relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 lg:gap-14 xl:gap-20 items-center">
          
          {/* Left Column: Interactive Capsule & Connector Triggers */}
          <div className="flex items-center justify-center sm:justify-start gap-5 sm:gap-8 mx-auto lg:mx-0">
            
            {/* The Vertical Cartridge Capsule */}
            <div
              className="w-[105px] sm:w-[132px] h-[390px] sm:h-[440px] rounded-[70px] sm:rounded-[92px] p-2.5 sm:p-3 flex flex-col justify-between relative shadow-[0_30px_70px_rgba(0,0,0,0.75)] shrink-0"
              style={{
                background: "linear-gradient(0deg, #1E2225 0%, #34393D 30%, #1A1D20 65%, #1A1D20 100%)",
                boxShadow: "0px 30px 70px rgba(0,0,0,0.7), inset 0px 0px 0px 1px rgba(255,255,255,0.12)",
              }}
            >
              {/* Inner capsule liner */}
              <div className="w-full h-full rounded-[55px] sm:rounded-[74px] bg-[#0E1012] overflow-hidden flex flex-col justify-between p-1.5 sm:p-2 border border-white/5">
                
                {/* Top cap inlet indicator */}
                <div className="h-2.5 sm:h-3 w-full bg-[#181B1E] rounded-full mb-1 shrink-0 opacity-80" />

                {/* Stack of discs corresponding to the 5 physical filter groups */}
                <div className="flex flex-col gap-[3px] sm:gap-1 flex-1 justify-between">
                  {filterStages.slice(0, 5).map((stage, groupIdx) => {
                    const isGroupActive = activeIndex === groupIdx || activeIndex === 5;
                    const discs = Array.from({ length: stage.discCount });

                    return (
                      <div
                        key={stage.id}
                        onClick={() => setActiveIndex(groupIdx)}
                        title={`Stage ${stage.stageNumbers}: ${stage.shortName}`}
                        className={`flex flex-col gap-[3px] cursor-pointer transition-all duration-300 ${
                          isGroupActive
                            ? "opacity-100 scale-[1.01]"
                            : "opacity-25 hover:opacity-50 grayscale-[25%]"
                        }`}
                      >
                        {discs.map((_, dIdx) => (
                          <div
                            key={dIdx}
                            className={`h-[13px] sm:h-[15px] w-full rounded-[3px] sm:rounded-[4px] bg-cover bg-center transition-all duration-300 ${
                              isGroupActive ? stage.glowClass : ""
                            }`}
                            style={{
                              backgroundImage: `url('${stage.textureImage}')`,
                              backgroundSize: "cover",
                            }}
                          />
                        ))}
                      </div>
                    );
                  })}
                </div>

                {/* Bottom outlet indicator */}
                <div className="h-2.5 sm:h-3 w-full bg-[#181B1E] rounded-full mt-1 shrink-0 opacity-80" />
              </div>
            </div>

            {/* Triggers list with connecting lines — */}
            <div
              role="tablist"
              aria-label="Filter stages breakdown"
              className="flex flex-col justify-between h-[390px] sm:h-[440px] py-2"
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
                    className="group flex items-center gap-2.5 sm:gap-3 text-left py-1 transition-all duration-200 cursor-pointer focus:outline-none"
                  >
                    {/* Connecting line — */}
                    <span
                      className={`h-[1.5px] transition-all duration-300 shrink-0 ${
                        isSelected
                          ? "w-7 sm:w-9 bg-[#F3F1EC]"
                          : "w-5 sm:w-6 bg-white/20 group-hover:bg-white/45"
                      }`}
                      aria-hidden="true"
                    />

                    {/* Stage Numbers (e.g. 1–5 or ↓) */}
                    <span
                      className={`text-xs sm:text-sm font-mono tracking-tight shrink-0 transition-colors duration-200 ${
                        isSelected
                          ? "text-[#F3F1EC] font-semibold"
                          : "text-white/40 group-hover:text-white/70"
                      }`}
                    >
                      {stage.stageNumbers}
                    </span>

                    {/* Stage Short Name */}
                    <span
                      className={`text-xs sm:text-[14px] transition-colors duration-200 truncate ${
                        isSelected
                          ? "text-[#F3F1EC] font-medium"
                          : "text-white/50 group-hover:text-white/85"
                      }`}
                    >
                      {stage.shortName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Section Header & Active Detail Card */}
          <div className="flex flex-col justify-center">
            
            {/* Header matching Kiierr styling */}
            <div>
              <h2
                id="shower-filtration-title"
                className="font-playfair text-3xl sm:text-4xl lg:text-[2.65rem] leading-[1.12] text-[#F3F1EC] tracking-tight"
              >
                Follow a drop of water through all <em className="italic font-normal">20 stages.</em>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#A8A29E] font-sans">
                Tap a layer of the cartridge to see what it does.
              </p>
            </div>

            {/* Detail Card matching Kiierr */}
            <div
              role="tabpanel"
              key={activeStage.id}
              className="mt-8 rounded-[20px] border border-white/10 p-6 sm:p-8 lg:p-9 relative overflow-hidden backdrop-blur-md shadow-2xl transition-all duration-300"
              style={{
                backgroundImage: "linear-gradient(0deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%)",
              }}
            >
              {/* Large Watermark Numeral in top-right corner */}
              <span
                className="absolute right-5 sm:right-7 top-1 sm:top-2 text-[115px] sm:text-[145px] font-serif font-light text-white/[0.06] select-none pointer-events-none leading-none z-0"
                aria-hidden="true"
              >
                {activeStage.watermarkNumber}
              </span>

              {/* Card Content */}
              <div className="relative z-10 flex flex-col justify-between min-h-[190px]">
                <div>
                  <h3 className="font-playfair text-2xl sm:text-[28px] font-normal text-[#F3F1EC] leading-snug">
                    {activeStage.title}
                  </h3>

                  <p className="mt-3.5 text-sm sm:text-[15px] leading-relaxed text-[#B9BEC3] max-w-xl font-sans">
                    {activeStage.description}
                  </p>
                </div>

                {/* Removes Row at Bottom */}
                <div className="mt-7 pt-5 border-t border-white/10 flex flex-wrap items-center gap-2 sm:gap-2.5">
                  <span className="text-[13px] text-[#8A9196] font-sans mr-1">
                    Removes
                  </span>
                  {activeStage.removes.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-white/[0.07] border border-white/10 px-3.5 py-1 text-xs sm:text-[13px] text-[#F3F1EC] font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
