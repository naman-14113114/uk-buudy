"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { products, productsById, type Product } from "@/data/products";
import type { CartLine } from "@/lib/cart";

type KlaviyoCommand = [string, ...unknown[]];

declare global {
  interface Window {
    klaviyo?: KlaviyoCommand[];
    _klOnsite?: KlaviyoCommand[];
  }
}

type CheckoutEventDetail = {
  lines?: CartLine[];
  totals?: {
    totalCents?: number;
  };
};

const KLAVIYO_COMPANY_ID =
  process.env.NEXT_PUBLIC_KLAVIYO_COMPANY_ID || "Tp323F";
const KLAVIYO_US_POPUP_FORM_ID = "UBEgb8";
const productBySlug = new Map(products.map((product) => [product.slug, product]));

function isEnabledHost() {
  if (typeof window === "undefined") {
    return false;
  }

  const host = window.location.hostname;
  return (
    host === "us.buudy.com" ||
    host.endsWith(".vercel.app") ||
    host === "localhost" ||
    host === "127.0.0.1"
  );
}

function toAbsoluteUrl(url: string) {
  if (typeof window === "undefined") {
    return url;
  }

  return new URL(url, window.location.origin).href;
}

function productPayload(product: Product) {
  return {
    ProductName: product.name,
    ProductID: product.id,
    SKU: product.sku,
    Categories: ["Light Therapy", product.template === "mask" ? "LED Mask" : "Red Light Torch"],
    ImageURL: toAbsoluteUrl(product.cartImage),
    URL: toAbsoluteUrl(`/products/${product.slug}`),
    Brand: "Buudy",
    Price: product.priceCents / 100,
    CompareAtPrice: product.compareAtCents / 100,
    Market: "US",
    SourceSite: "us.buudy.com",
  };
}

function cartLinePayload(line: CartLine) {
  const product = productsById[line.productId];

  return {
    ProductID: line.productId,
    SKU: product?.sku ?? line.id,
    ProductName: line.title,
    Quantity: line.quantity,
    ItemPrice: line.unitPriceCents / 100,
    RowTotal: (line.unitPriceCents * line.quantity) / 100,
    ProductURL: product ? toAbsoluteUrl(`/products/${product.slug}`) : undefined,
    ImageURL: toAbsoluteUrl(line.image),
    ProductCategories: [
      "Light Therapy",
      product?.template === "torch" ? "Red Light Torch" : "LED Mask",
    ],
  };
}

function pushKlaviyo(command: KlaviyoCommand) {
  window.klaviyo = window.klaviyo || [];
  window.klaviyo.push(command);
}

function guardKlaviyoScrollLock() {
  let raf = 0;

  const removeUkPopupNodes = () => {
    document
      .querySelectorAll<HTMLElement>(
        '[aria-modal="true"], [data-testid="POPUP"], div[class*="kl-private-reset-css"], .needsclick[class*="kl-private-reset-css"]',
      )
      .forEach((node) => {
        const text = node.textContent || "";

        if (!text.includes("£10") || text.includes("$10")) {
          return;
        }

        const popup =
          node.closest<HTMLElement>('[aria-modal="true"], [data-testid="POPUP"]') ??
          node;
        const popupText = popup.textContent || "";

        if (!popupText.includes("$10")) {
          popup.remove();
        }
      });
  };

  const removeVisibleOfferPopups = () => {
    document
      .querySelectorAll<HTMLElement>(
        '[aria-modal="true"], [data-testid="POPUP"], div[class*="kl-private-reset-css"], .needsclick[class*="kl-private-reset-css"]',
      )
      .forEach((node) => {
        const text = node.textContent || "";

        if (!text.includes("$10 WELCOME") && !text.includes("£10 WELCOME")) {
          return;
        }

        const popup =
          node.closest<HTMLElement>('[aria-modal="true"], [data-testid="POPUP"]') ??
          node;
        popup.remove();
      });
  };

  const hasVisibleKlaviyoForm = () =>
    Array.from(
      document.querySelectorAll<HTMLElement>(
        'div[class*="kl-private-reset-css"], .needsclick[class*="kl-private-reset-css"]',
      ),
    ).some((node) => {
      const style = window.getComputedStyle(node);
      const rect = node.getBoundingClientRect();

      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity) > 0 &&
        rect.width > 10 &&
        rect.height > 10
      );
    });

  const unlockScroll = () => {
    window.cancelAnimationFrame(raf);
    raf = window.requestAnimationFrame(() => {
      removeUkPopupNodes();

      if (hasVisibleKlaviyoForm()) {
        return;
      }

      document.documentElement.style.overflow = "";
      document.documentElement.style.position = "";
      document.documentElement.classList.remove("klaviyo-prevent-body-scrolling");
      document.body.classList.remove("klaviyo-prevent-body-scrolling");
      document.body.style.overflow = "";
      document.body.style.overflowX = "";
      document.body.style.overflowY = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    });
  };

  unlockScroll();

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "attributes") {
        unlockScroll();
        continue;
      }

      if (mutation.addedNodes.length || mutation.removedNodes.length) {
        unlockScroll();
      }
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "style"],
    childList: true,
    subtree: true,
  });

  const handleDismissClick = (event: MouseEvent) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const clickedClose = Boolean(
      target.closest('[aria-label="Close dialog"], .klaviyo-close-form'),
    );
    const clickedNoThanks = (target.textContent || "")
      .trim()
      .toUpperCase()
      .includes("NO, THANKS");

    if (!clickedClose && !clickedNoThanks) {
      return;
    }

    window.setTimeout(() => {
      removeVisibleOfferPopups();
      unlockScroll();
    }, 50);
  };

  document.addEventListener("click", handleDismissClick, { capture: true });

  return () => {
    observer.disconnect();
    document.removeEventListener("click", handleDismissClick, { capture: true });
    window.cancelAnimationFrame(raf);
  };
}

export function KlaviyoAnalytics() {
  const pathname = usePathname();
  const trackedProductSlugs = useRef(new Set<string>());

  useEffect(() => {
    if (!KLAVIYO_COMPANY_ID || !isEnabledHost()) {
      return;
    }

    window.klaviyo = window.klaviyo || [];
    const cleanupScrollGuard = guardKlaviyoScrollLock();

    if (!document.querySelector("script[data-buudy-klaviyo='true']")) {
      const script = document.createElement("script");
      script.async = true;
      script.dataset.buudyKlaviyo = "true";
      script.src = `https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${encodeURIComponent(
        KLAVIYO_COMPANY_ID,
      )}`;
      document.head.appendChild(script);
    }

    return cleanupScrollGuard;
  }, []);

  useEffect(() => {
    if (!KLAVIYO_COMPANY_ID || !isEnabledHost()) {
      return;
    }

    let hasTriggered = false;

    const openUsPopup = (event: MouseEvent) => {
      if (hasTriggered || event.clientY > 12) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();
      hasTriggered = true;
      window._klOnsite = window._klOnsite || [];
      window._klOnsite.push(["openForm", KLAVIYO_US_POPUP_FORM_ID]);
    };

    document.addEventListener("mouseleave", openUsPopup, { capture: true });

    return () => {
      document.removeEventListener("mouseleave", openUsPopup, { capture: true });
    };
  }, []);

  useEffect(() => {
    if (!KLAVIYO_COMPANY_ID || !isEnabledHost()) {
      return;
    }

    pushKlaviyo([
      "track",
      "Viewed Page",
      {
        PageName: document.title,
        URL: window.location.href,
        Path: pathname,
        Market: "US",
        SourceSite: "us.buudy.com",
      },
    ]);

    const slug = pathname?.match(/^\/products\/([^/]+)/)?.[1];
    if (!slug || trackedProductSlugs.current.has(slug)) {
      return;
    }

    const product = productBySlug.get(slug);
    if (!product) {
      return;
    }

    const payload = productPayload(product);
    trackedProductSlugs.current.add(slug);

    pushKlaviyo(["track", "Viewed Product", payload]);
    pushKlaviyo([
      "trackViewedItem",
      {
        Title: payload.ProductName,
        ItemId: payload.ProductID,
        Categories: payload.Categories,
        ImageUrl: payload.ImageURL,
        Url: payload.URL,
        Metadata: {
          Brand: payload.Brand,
          Price: payload.Price,
          CompareAtPrice: payload.CompareAtPrice,
          Market: payload.Market,
        },
      },
    ]);
  }, [pathname]);

  useEffect(() => {
    if (!KLAVIYO_COMPANY_ID || !isEnabledHost()) {
      return;
    }

    function handleAddToCart(event: Event) {
      const detail = (event as CustomEvent<{ product?: Product }>).detail;
      const product = detail?.product;

      if (!product) {
        return;
      }

      const payload = productPayload(product);

      pushKlaviyo([
        "track",
        "Added to Cart",
        {
          $value: payload.Price,
          AddedItemProductName: payload.ProductName,
          AddedItemProductID: payload.ProductID,
          AddedItemSKU: payload.SKU,
          AddedItemCategories: payload.Categories,
          AddedItemImageURL: payload.ImageURL,
          AddedItemURL: payload.URL,
          AddedItemPrice: payload.Price,
          AddedItemQuantity: 1,
          ItemNames: [payload.ProductName],
          CheckoutURL: toAbsoluteUrl("/cart"),
          Items: [
            {
              ProductID: payload.ProductID,
              SKU: payload.SKU,
              ProductName: payload.ProductName,
              Quantity: 1,
              ItemPrice: payload.Price,
              RowTotal: payload.Price,
              ProductURL: payload.URL,
              ImageURL: payload.ImageURL,
              ProductCategories: payload.Categories,
            },
          ],
          Market: "US",
          SourceSite: "us.buudy.com",
        },
      ]);
    }

    function handleStartedCheckout(event: Event) {
      const detail = (event as CustomEvent<CheckoutEventDetail>).detail;
      const lines = detail?.lines ?? [];
      const productLines = lines.filter((line) => line.type === "product");
      const items = productLines.map(cartLinePayload);

      if (!items.length) {
        return;
      }

      pushKlaviyo([
        "track",
        "Started Checkout",
        {
          $event_id: `us-buudy-${Date.now()}`,
          $value:
            typeof detail?.totals?.totalCents === "number"
              ? detail.totals.totalCents / 100
              : items.reduce((total, item) => total + item.RowTotal, 0),
          ItemNames: items.map((item) => item.ProductName),
          CheckoutURL: toAbsoluteUrl("/cart"),
          Categories: Array.from(
            new Set(items.flatMap((item) => item.ProductCategories)),
          ),
          Items: items,
          Market: "US",
          SourceSite: "us.buudy.com",
        },
      ]);
    }

    window.addEventListener("buudy:add-to-cart", handleAddToCart);
    window.addEventListener("buudy:started-checkout", handleStartedCheckout);

    return () => {
      window.removeEventListener("buudy:add-to-cart", handleAddToCart);
      window.removeEventListener("buudy:started-checkout", handleStartedCheckout);
    };
  }, []);

  return null;
}
