"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { showerHeadCartProduct } from "@/data/buudyShowerHead";
import { appendAttributionToPath, pickAttributionFromSearch } from "@/lib/attribution";

export function ShowerHeadAddToCart() {
  const { addProduct, isHydrated } = useCart();
  const router = useRouter();
  const [isNavigating, startTransition] = useTransition();

  return (
    <Button
      id="hero-cta"
      className="mt-5 min-h-14 w-full text-base font-bold uppercase tracking-wide sm:text-lg"
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
  );
}
