"use client";

import { useState } from "react";
import {
  ChevronDown,
  Droplets,
  Ruler,
  Wrench,
  ShieldCheck,
  Sparkles,
  Package,
} from "lucide-react";

interface AccordionItem {
  id: string;
  eyebrow: string;
  title: string;
  content: React.ReactNode;
}

const items: AccordionItem[] = [
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
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-[rgba(184,149,86,.12)] text-[var(--gold)]">
                    <Icon size={18} strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className="font-sans text-sm font-bold text-[var(--plum)]">
                      {feature.title}
                    </p>
                    <p className="font-sans mt-0.5 text-xs italic font-semibold text-[var(--gold)]">
                      {feature.kicker}
                    </p>
                  </div>
                </div>
                <span className="buudy-display text-sm text-[var(--gold)] font-medium self-start mt-1">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="font-sans mt-1 text-xs leading-5 text-[var(--muted)] pl-13">
                {feature.body}
              </p>
            </li>
          );
        })}
      </ul>
    ),
  },
  {
    id: "specs",
    eyebrow: "Specifications",
    title: "The numbers, in detail",
    content: (
      <dl className="grid gap-3">
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
            className="grid grid-cols-[1fr_auto] gap-4 items-center"
          >
            <dt className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center text-[var(--gold)]">
                <Icon size={15} strokeWidth={2} />
              </span>
              <span className="font-sans text-sm font-medium text-[var(--muted)]">{label}</span>
            </dt>
            <dd className="font-sans text-right text-sm font-semibold leading-5 text-[var(--plum)]">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    ),
  },
  {
    id: "bundle",
    eyebrow: "In the box",
    title: "Everything you need",
    content: (
      <ul className="grid gap-2">
        {[
          { quantity: "1", label: "Buudy Filtered Showerhead (polished chrome, 152 mm face)" },
          { quantity: "1", label: "20-Stage Filter Cartridge (pre-installed inside head)" },
          { quantity: "2", label: "Extra Replacement Filter Cartridges (3 filters total)" },
          { quantity: "1", label: "Roll of Teflon Thread-Seal Tape" },
          { quantity: "1", label: "Rubber O-Ring Flow Seal" },
        ].map((item) => (
          <li
            key={item.label}
            className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[rgba(247,241,232,.55)] px-4 py-3"
          >
            <span className="flex items-center gap-3">
              <span className="buudy-mono font-bold text-[var(--gold)]">{item.quantity}</span>
              <span className="text-xs sm:text-sm font-semibold text-[var(--plum)]">
                {item.label}
              </span>
            </span>
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
    <section
      aria-label="Product details"
      className="mt-8 rounded-[18px] border border-[var(--border)] bg-[rgba(247,241,232,.64)] px-5"
    >
      {items.map((item) => {
        const isOpen = openItems.has(item.id);
        const contentId = `shower-detail-${item.id}`;

        return (
          <div key={item.id} className="border-b border-[var(--border)] last:border-b-0">
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
    </section>
  );
}
