"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { showerHeadAsset } from "@/data/buudyShowerHead";

const filterGroups = [
  { first: 1, last: 5, colour: "bg-[#bdb3c5]" },
  { first: 6, last: 10, colour: "bg-[#9c83a2]" },
  { first: 11, last: 15, colour: "bg-[#a67f75]" },
  { first: 16, last: 20, colour: "bg-[#c5a987]" },
];

export function ShowerHeadFiltration() {
  const [section, setSection] = useState<"inlet" | "outlet" | number>(0);
  const group = typeof section === "number" ? filterGroups[section] : undefined;
  const title = group
    ? `Stages ${group.first}–${group.last}`
    : section === "inlet"
    ? "From the shower arm"
    : "Out through the spray face";
  const description = group
    ? `These five bands represent stages ${group.first} to ${group.last} of the replaceable cartridge inside the chrome housing.`
    : section === "inlet"
    ? "Water enters through the G 1/2 fitting and flows into the cartridge behind the spray face."
    : "After passing through the cartridge, water leaves through the ring of outlets on the 152 mm spray face.";

  return (
    <section id="filtration" aria-labelledby="shower-filtration-title" className="scroll-mt-28 bg-[#261c2b] py-12 text-[var(--cream)] md:py-20">
      <div className="buudy-wrap grid min-w-0 items-start gap-y-6 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-x-11 lg:gap-x-16">
        <div className="md:col-start-2 md:row-start-1 md:self-end">
          <h2 id="shower-filtration-title" className="buudy-display text-[2.15rem] leading-[1.08] md:text-5xl">
            Follow the water through <em className="buudy-italic">20 stages.</em>
          </h2>
          <p className="mt-4 max-w-lg leading-7 text-[var(--cream)]/85">
            Select a group on the cartridge to explore the water path.
          </p>
        </div>

        <div className="mx-auto w-full max-w-md md:col-start-1 md:row-span-2 md:row-start-1 md:self-center">
          <div className="rounded-[1.75rem] border border-white/20 bg-[#1d1621] px-4 py-3 sm:px-5" aria-label="Diagram of the 20-stage cartridge">
            <FlowButton active={section === "inlet"} onSelect={() => setSection("inlet")}>Water in</FlowButton>
            <div className="space-y-2 border-y border-white/15 py-3">
              {filterGroups.map(({ first, last, colour }, index) => (
                <button
                  aria-pressed={section === index}
                  className={`grid min-h-14 w-full grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] items-center gap-3 rounded-xl border px-2.5 py-2 text-left text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)] sm:px-3 ${
                    section === index ? "border-[var(--gold)] bg-white/10" : "border-transparent hover:bg-white/5"
                  }`}
                  key={first}
                  type="button"
                  onClick={() => setSection(index)}
                >
                  <span className="grid gap-1" aria-hidden="true">
                    {Array.from({ length: last - first + 1 }, (_, band) => (
                      <span key={band} className={`h-1.5 rounded-full ${colour} ${section === index ? "" : "opacity-60"}`} />
                    ))}
                  </span>
                  <span className="font-medium">Stages {first}–{last}</span>
                </button>
              ))}
            </div>
            <FlowButton active={section === "outlet"} onSelect={() => setSection("outlet")}>Water out</FlowButton>
          </div>
          <p className="mt-3 text-center text-xs leading-5 text-[var(--cream)]/70">
            Schematic of the 20 stages. Colours are illustrative.
          </p>

        </div>

        <div className="rounded-2xl border border-white/15 bg-white/5 p-5 md:col-start-2 md:row-start-2 lg:p-7">
          <FilterDescription title={title} description={description} />
          <figure className="mt-5 flex items-center gap-4 border-t border-white/15 pt-4">
            <Image
              src={showerHeadAsset("14-filtration-cutaway.webp")}
              alt="Illustrative cutaway of the replaceable filter cartridge"
              width={128}
              height={88}
              className="h-16 w-24 shrink-0 rounded-lg object-cover"
            />
            <figcaption className="text-xs leading-5 text-[var(--cream)]/75">Illustration of the replaceable cartridge.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

function FilterDescription({ title, description }: { title: string; description: string }) {
  return (
    <div aria-live="polite">
      <h3 className="buudy-display text-2xl">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-[var(--cream)]/85">{description}</p>
    </div>
  );
}

function FlowButton({ active, children, onSelect }: { active: boolean; children: string; onSelect: () => void }) {
  return (
    <button
      aria-pressed={active}
      className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)] ${active ? "text-[var(--gold)]" : "hover:bg-white/5"}`}
      type="button"
      onClick={onSelect}
    >
      {children}
      <ArrowDown size={17} aria-hidden="true" />
    </button>
  );
}
