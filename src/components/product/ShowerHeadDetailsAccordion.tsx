"use client";

import { useState } from "react";
import {
  ChevronDown,
  Droplets,
  Ruler,
  Wrench,
  ShieldCheck,
  Sparkles,
  Layers,
  Package,
  Scale,
  CheckCircle2,
} from "lucide-react";

interface AccordionItem {
  id: string;
  eyebrow: string;
  title: string;
  content: React.ReactNode;
}

const items: AccordionItem[] = [
  {
    id: "bundle",
    eyebrow: "In the Box",
    title: "Everything you need",
    content: (
      <ul className="grid gap-2">
        {[
          { quantity: "1", label: "Buudy Filtered Showerhead (polished chrome, 152 mm face)" },
          { quantity: "1", label: "20-Stage Filter Cartridge (pre-installed inside head)" },
          { quantity: "2", label: "Extra Replacement Filter Cartridges (3 filters total)" },
          { quantity: "1", label: "Roll of Teflon Thread-Seal Tape" },
          { quantity: "1", label: "Rubber O-Ring Flow Seal" },
          { quantity: "1", label: "Step-by-Step Quick Installation Guide" },
        ].map((item) => (
          <li
            key={item.label}
            className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[rgba(247,241,232,.55)] px-4 py-3"
          >
            <span className="flex items-center gap-3">
              <span className="buudy-mono text-[var(--gold)] font-bold">{item.quantity}</span>
              <span className="text-xs sm:text-sm font-semibold text-[var(--plum)]">
                {item.label}
              </span>
            </span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "specs",
    eyebrow: "Specifications",
    title: "The numbers, in detail",
    content: (
      <dl className="grid gap-2.5">
        {[
          { label: "Spray face diameter", value: "152 mm", icon: Ruler },
          { label: "Overall depth", value: "131 mm", icon: Ruler },
          { label: "Thread connection", value: "G 1/2 universal (fixed arm)", icon: Wrench },
          { label: "Filter cartridge lifespan", value: "90 days / ~10,000 gallons", icon: Droplets },
          { label: "Included cartridges", value: "3 filters (pre-installed + 2 spares)", icon: Package },
          { label: "Hardware finish", value: "Mirror-polished chrome", icon: Sparkles },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[rgba(247,241,232,.35)] px-4 py-2.5"
          >
            <dt className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center text-[var(--gold)]">
                <Icon size={15} strokeWidth={2} />
              </span>
              <span className="text-xs sm:text-sm font-medium text-[var(--muted)]">{label}</span>
            </dt>
            <dd className="text-xs sm:text-sm font-semibold text-[var(--plum)] text-right">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    ),
  },
  {
    id: "features",
    eyebrow: "Features",
    title: "What makes our filtered showerhead unique?",
    content: (
      <ul className="grid gap-3">
        {[
          {
            title: "20-Stage Comprehensive Filtration",
            kicker: "Surpasses NSF-177 standards",
            body: "A high-efficiency multi-stage core that removes chlorine, heavy metals, rust, and dissolved minerals.",
            icon: ShieldCheck,
          },
          {
            title: "Laser Micro-Nozzle Array",
            kicker: "High velocity without pressure loss",
            body: "Precision-drilled micro-nozzles create a dense, satisfying rain spray while conditioning hard water.",
            icon: Droplets,
          },
          {
            title: "Vitamin C & Alkaline Mineral Core",
            kicker: "Neutralizes chloramines and restores pH",
            body: "Neutralizes stubborn chloramines that carbon filters miss, bringing water closer to skin-neutral pH.",
            icon: Sparkles,
          },
          {
            title: "Tool-Free Universal Fit",
            kicker: "Ready in 2 minutes on any fixed arm",
            body: "Standard G 1/2 thread fits standard shower arms without plumbing tools or modifications.",
            icon: Wrench,
          },
        ].map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <li
              key={feature.title}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-xs"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-[rgba(184,149,86,.12)] text-[var(--gold)]">
                    <Icon size={18} strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className="font-sans text-xs sm:text-sm font-bold text-[var(--plum)]">
                      {feature.title}
                    </p>
                    <p className="font-sans text-[11px] sm:text-xs italic font-semibold text-[var(--gold)]">
                      {feature.kicker}
                    </p>
                  </div>
                </div>
                <span className="buudy-display text-xs text-[var(--gold)] font-medium self-start mt-0.5">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-[var(--muted)] pl-12">
                {feature.body}
              </p>
            </li>
          );
        })}
      </ul>
    ),
  },
  {
    id: "installation",
    eyebrow: "Installation",
    title: "4 simple setup steps",
    content: (
      <ul className="grid gap-2.5">
        {[
          { step: "1", title: "Remove existing head", desc: "Twist off your old shower head by hand and clean the exposed arm threads." },
          { step: "2", title: "Apply Teflon tape", desc: "Wrap the included thread-seal tape 2–3 turns clockwise around the threads." },
          { step: "3", title: "Fit seal and screw on", desc: "Seat the rubber O-ring into the inlet, align, and turn clockwise until snug." },
          { step: "4", title: "Run for 60 seconds", desc: "Turn on the shower for 60 seconds to prime the filter media, then shower normally." },
        ].map((step) => (
          <li
            key={step.step}
            className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[rgba(247,241,232,.4)] p-3"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--plum)] text-xs font-bold text-white">
              {step.step}
            </span>
            <div>
              <p className="text-xs sm:text-sm font-bold text-[var(--plum)]">{step.title}</p>
              <p className="text-xs text-[var(--muted)] mt-0.5">{step.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    ),
  },
];

export function ShowerHeadDetailsAccordion() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  function toggleItem(id: string) {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="mt-6 divide-y divide-[var(--border)] border-b border-[var(--border)]">
      {items.map((item) => {
        const isOpen = openItems.has(item.id);
        const contentId = `shower-detail-${item.id}`;

        return (
          <div key={item.id} className="last:border-b-0">
            <div
              aria-controls={contentId}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-5 py-4 text-left cursor-pointer select-none"
              onClick={() => toggleItem(item.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleItem(item.id);
                }
              }}
            >
              <span>
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-[var(--gold)]">
                  {item.eyebrow}
                </span>
                <span className="font-playfair mt-1 block text-xl text-[var(--plum)]">
                  {item.title}
                </span>
              </span>
              <ChevronDown
                className={`flex-none text-[var(--plum)] transition-transform duration-300 ease-out ${
                  isOpen ? "rotate-180" : ""
                }`}
                size={19}
              />
            </div>
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
              id={contentId}
            >
              <div className="overflow-hidden">
                <div className="pb-5">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
