"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Clock } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { showerHeadCartProduct } from "@/data/buudyShowerHead";
import { appendAttributionToPath, pickAttributionFromSearch } from "@/lib/attribution";

function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRemaining((current) => (current <= 0 ? seconds : current - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [seconds]);

  const minutes = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function useDeliveryDate(daysFromToday: number) {
  const [dateLabel, setDateLabel] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const date = new Date();
      date.setDate(date.getDate() + daysFromToday);

      const weekday = date.toLocaleString("en-GB", { weekday: "long" });
      const day = date.getDate();
      const month = date.toLocaleString("en-GB", { month: "long" });

      setDateLabel(`${weekday} ${day} ${month}`);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [daysFromToday]);

  return dateLabel;
}

export function ShowerHeadAddToCart() {
  const { addProduct, isHydrated } = useCart();
  const router = useRouter();
  const [isNavigating, startTransition] = useTransition();
  const timer = useCountdown(15 * 60 - 1);
  const deliveryDate = useDeliveryDate(4);
  const [showShippingInfo, setShowShippingInfo] = useState(false);
  const shippingTooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        shippingTooltipRef.current &&
        !shippingTooltipRef.current.contains(event.target as Node)
      ) {
        setShowShippingInfo(false);
      }
    }
    if (showShippingInfo) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showShippingInfo]);

  return (
    <div className="w-full">
      {/* Delivery countdown timer - matching mask page */}
      <div className="relative mb-3 flex items-center justify-between gap-2.5 rounded-xl border border-[rgba(58,31,61,.15)] bg-[rgba(247,241,232,.55)] px-3.5 py-2.5 text-xs sm:text-[13.5px] text-[var(--plum)]">
        <div className="flex items-center gap-2 min-w-0">
          <Clock className="h-4 w-4 shrink-0 text-[var(--gold)]" />
          <p className="m-0 leading-snug">
            Free delivery: Order within <span className="font-semibold text-[var(--plum)]">{timer}</span> to get as fast as <span className="font-semibold text-[var(--plum)]">{deliveryDate || "soon"}</span>
          </p>
        </div>

        <div className="relative shrink-0" ref={shippingTooltipRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowShippingInfo((prev) => !prev);
            }}
            aria-label="Shipping information"
            aria-expanded={showShippingInfo}
            className="flex h-4 w-4 items-center justify-center rounded-full border border-[var(--gold)] bg-transparent text-[9.5px] font-medium text-[var(--gold)] transition hover:opacity-80 active:scale-95 cursor-pointer"
          >
            ?
          </button>

          {showShippingInfo && (
            <div
              className="absolute right-0 bottom-full mb-2 z-40 w-64 sm:w-72 rounded-xl border border-[rgba(58,31,61,.16)] bg-[var(--card)] p-3.5 shadow-xl text-left text-xs leading-relaxed text-[var(--plum)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-semibold text-[var(--plum)] text-xs">Delivery Estimate</span>
                <button
                  type="button"
                  onClick={() => setShowShippingInfo(false)}
                  className="text-[var(--muted)] hover:text-[var(--plum)] text-sm leading-none p-0.5 cursor-pointer"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <p className="text-[11.5px] leading-relaxed text-[var(--plum)]/90 m-0">
                This is the earliest date you can receive your order, but standard UK delivery transit is 2–4 business days. For more information, please visit our shipping policy page.
              </p>
            </div>
          )}
        </div>
      </div>

      <Button
        id="hero-cta"
        className="min-h-14 w-full text-base font-bold uppercase tracking-wide sm:text-lg"
        disabled={!isHydrated || isNavigating}
        onClick={() => {
          addProduct(showerHeadCartProduct);
          startTransition(() => {
            router.push(appendAttributionToPath("/cart", pickAttributionFromSearch(window.location.search)));
          });
        }}
      >
        <ShoppingBag size={19} aria-hidden="true" />
        {isNavigating ? "Opening cart…" : "Add to Cart"}
      </Button>
    </div>
  );
}
