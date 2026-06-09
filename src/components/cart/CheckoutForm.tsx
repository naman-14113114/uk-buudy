"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { attributionStorageKey } from "@/components/integrations/AttributionCapture";
import { buildPlusbaseCheckoutUrl } from "@/lib/site";
import { promoCode } from "@/lib/cart";
import { useCart, writeCheckoutSnapshot } from "./CartProvider";

export type CheckoutCustomer = {
  fullName: string;
  email: string;
  phone: string;
  shippingLine1: string;
  shippingLine2: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  marketingOptIn: boolean;
};

type CheckoutFormProps = {
  initialCustomer: CheckoutCustomer;
};

export function CheckoutForm({ initialCustomer }: CheckoutFormProps) {
  const { totals, lines, giftMessage, activePromoCodes } = useCart();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState("");
  const hasItems = totals.itemCount > 0;
  const maskQuantity =
    lines.find(
      (line) => line.type === "product" && line.productId === "buudy-led-mask",
    )?.quantity ?? totals.itemCount;

  function readAttribution() {
    const currentParams = new URLSearchParams(window.location.search);
    const current: Record<string, string> = {};

    [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "msclkid",
      "gclid",
      "fbclid",
      "source",
    ].forEach((key) => {
      const value = currentParams.get(key);
      if (value) {
        current[key] = value;
      }
    });

    try {
      return {
        ...((JSON.parse(
          window.localStorage.getItem(attributionStorageKey) ?? "{}",
        ) as Record<string, string>)),
        ...current,
        checkout_path: window.location.pathname,
        checkout_referrer: document.referrer,
      };
    } catch {
      return current;
    }
  }

  async function handleCheckout() {
    if (!hasItems || isRedirecting) {
      return;
    }

    const attribution = readAttribution();
    writeCheckoutSnapshot({ lines, giftMessage, promoCode });
    setError("");
    setIsRedirecting(true);
    window.dispatchEvent(
      new CustomEvent("buudy:started-checkout", {
        detail: {
          lines,
          totals,
        },
      }),
    );

    try {
      const response = await fetch("/api/checkout/prepare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerEmail: initialCustomer.email,
          quantity: maskQuantity,
          cart: {
            lines,
            giftMessage,
            promoCodes: activePromoCodes,
          },
          totals,
          attribution,
        }),
      });

      if (!response.ok) {
        throw new Error("Could not prepare checkout.");
      }

      const data = (await response.json()) as { checkoutUrl?: string };
      window.location.assign(
        data.checkoutUrl ?? buildPlusbaseCheckoutUrl({ quantity: maskQuantity }),
      );
    } catch {
      setError("Opening secure checkout...");
      window.location.assign(
        buildPlusbaseCheckoutUrl({
          quantity: maskQuantity,
          extraParams: attribution,
        }),
      );
    }
  }

  return (
    <>
      <Button
        className="proxy-bundle-btn relative overflow-hidden w-full rounded-[30px] border border-[var(--ink)] bg-[var(--ink)] py-4 text-xl font-bold uppercase tracking-wide text-[var(--cream)] shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-[var(--gold)] active:scale-[0.98] buudy-display"
        disabled={!hasItems || isRedirecting}
        onClick={handleCheckout}
        type="button"
      >
        <Lock size={17} />
        {isRedirecting ? "Opening secure checkout..." : "Checkout securely"}
      </Button>
      {error ? (
        <p className="mt-3 text-center text-xs font-semibold text-[var(--plum)]">
          {error}
        </p>
      ) : null}
    </>
  );
}
