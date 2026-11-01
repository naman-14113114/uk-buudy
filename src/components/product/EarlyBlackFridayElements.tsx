"use client";

import { useEffect, useState } from "react";
import { Sparkles, Tag, Check, ShieldCheck, RotateCcw, Truck, Flame } from "lucide-react";

function useUKMidnightCountdown() {
  const [timeLeft, setTimeLeft] = useState<string>("14h : 27m : 53s");

  useEffect(() => {
    function calculate() {
      try {
        const formatter = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Europe/London",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
        const parts = formatter.formatToParts(new Date());
        const hour = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
        const minute = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0", 10);
        const second = parseInt(parts.find((p) => p.type === "second")?.value ?? "0", 10);
        const elapsed = (hour % 24) * 3600 + minute * 60 + second;
        const remaining = Math.max(0, 86400 - elapsed);

        const h = Math.floor(remaining / 3600);
        const m = Math.floor((remaining % 3600) / 60);
        const s = remaining % 60;

        setTimeLeft(
          `${String(h).padStart(2, "0")}h : ${String(m).padStart(2, "0")}m : ${String(s).padStart(2, "0")}s`
        );
      } catch {
        // Fallback
      }
    }

    calculate();
    const interval = window.setInterval(calculate, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return timeLeft;
}

/**
 * Top announcement banner for Early Black Friday Sale
 */
export function EarlyBlackFridayTopBanner() {
  const timer = useUKMidnightCountdown();

  return (
    <div className="w-full bg-gradient-to-r from-[#140617] via-[#280e2d] to-[#140617] border-y border-[rgba(184,149,86,0.35)] py-2.5 px-3 sm:px-4 text-[#f7f1e8] shadow-md">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-xs sm:text-[13px]">
        {/* Left: Event & Code */}
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start text-center sm:text-left">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e5c17d] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e5c17d]"></span>
          </span>
          <span className="font-bold tracking-wider uppercase text-[#e5c17d] text-[11px] sm:text-xs">
            BLACK FRIDAY EARLY ACCESS
          </span>
          <span className="hidden sm:inline text-[rgba(247,241,232,0.4)]">|</span>
          <span className="text-[#f7f1e8]/90 font-medium">
            Save 60% + Extra £10 Off with code{" "}
            <span className="font-mono font-bold text-[#e5c17d] bg-[rgba(184,149,86,0.22)] px-1.5 py-0.5 rounded border border-[rgba(184,149,86,0.4)]">
              BLACKFRIDAY10
            </span>
          </span>
        </div>

        {/* Right: Timer & Stock indicator */}
        <div className="flex items-center gap-3 text-[11px] sm:text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-[#e5c17d] font-mono font-semibold">
            <span className="text-[10px] uppercase tracking-wider text-[#f7f1e8]/70 font-sans">
              Ends In:
            </span>
            <span>{timer}</span>
          </div>
          <span className="text-[rgba(247,241,232,0.3)]">·</span>
          <div className="flex items-center gap-1 text-[#f7f1e8]/90">
            <Flame className="w-3.5 h-3.5 text-[#e5c17d]" />
            <span className="font-medium text-[11px]">88% UK Batch Claimed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Early Black Friday Sale Badge next to the price
 */
export function EarlyBlackFridaySaleBadge() {
  return (
    <span className="buudy-mono inline-flex items-center gap-1.5 rounded-full bg-[#18081b] border border-[rgba(184,149,86,0.55)] px-3.5 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#e5c17d] shadow-sm">
      <Sparkles className="w-3.5 h-3.5 text-[#e5c17d]" />
      <span>60% OFF · BLACK FRIDAY EARLY ACCESS</span>
    </span>
  );
}

/**
 * Dedicated £10 Discount Voucher Card
 */
export function EarlyBlackFridayVoucherCallout({
  onApply,
}: {
  onApply?: () => void;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("BLACKFRIDAY10");
    }
    setCopied(true);
    if (onApply) onApply();
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="w-full mt-3 rounded-2xl border border-[rgba(184,149,86,0.38)] bg-[linear-gradient(135deg,rgba(46,16,47,0.08)_0%,rgba(184,149,86,0.14)_100%)] p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--plum)] text-[#e5c17d] shadow-sm">
          <Tag className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-xs sm:text-[13px] font-bold text-[var(--plum)] leading-tight">
              Early Black Friday Voucher: Extra £10 OFF
            </p>
            <span className="text-[10px] uppercase font-bold bg-[#18081b] text-[#e5c17d] px-1.5 py-0.2 rounded-full border border-[rgba(184,149,86,0.35)]">
              Limited Time
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-[var(--plum)]/85 leading-tight mt-1">
            Use code{" "}
            <span className="font-mono font-bold text-[var(--plum)] bg-[rgba(184,149,86,0.24)] px-1.5 py-0.5 rounded border border-[rgba(184,149,86,0.35)]">
              BLACKFRIDAY10
            </span>{" "}
            at checkout · Pay only{" "}
            <span className="font-bold text-[var(--plum)]">£169.00</span> (was £449)
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy voucher code BLACKFRIDAY10"
        className="shrink-0 flex items-center gap-1 rounded-xl border border-[rgba(184,149,86,0.6)] bg-[var(--plum)] hover:bg-[#200c23] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#e5c17d] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-[#e5c17d]" />
            <span>COPIED!</span>
          </>
        ) : (
          <span>COPY CODE</span>
        )}
      </button>
    </div>
  );
}

/**
 * Early Black Friday Peace-of-Mind Guarantees (Price Protection, Extended Holiday Returns, Express UK Delivery)
 */
export function EarlyBlackFridayGuarantees() {
  return (
    <div className="mt-5 rounded-2xl border border-[rgba(58,31,61,0.14)] bg-[var(--card)] p-3.5 sm:p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-[rgba(58,31,61,0.1)]">
        <Sparkles className="w-4 h-4 text-[var(--gold)]" />
        <h4 className="font-sans text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--plum)]">
          Early Black Friday Buyer Protection
        </h4>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 shrink-0 text-[var(--gold)] mt-0.5" />
          <div>
            <p className="text-xs font-bold text-[var(--plum)] leading-snug">
              Price Lock Guarantee
            </p>
            <p className="text-[11px] text-[var(--plum)]/80 leading-relaxed mt-0.5">
              If our price drops on Black Friday, we automatically refund the difference.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <RotateCcw className="w-4 h-4 shrink-0 text-[var(--gold)] mt-0.5" />
          <div>
            <p className="text-xs font-bold text-[var(--plum)] leading-snug">
              Extended Holiday Returns
            </p>
            <p className="text-[11px] text-[var(--plum)]/80 leading-relaxed mt-0.5">
              Stress-free holiday gifting with 90-day trial through January 31st.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Truck className="w-4 h-4 shrink-0 text-[var(--gold)] mt-0.5" />
          <div>
            <p className="text-xs font-bold text-[var(--plum)] leading-snug">
              Beat Holiday Rush
            </p>
            <p className="text-[11px] text-[var(--plum)]/80 leading-relaxed mt-0.5">
              Tracked fast UK dispatch before November & December delivery backlogs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
