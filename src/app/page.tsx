import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";
import { market } from "@/lib/market";

export const metadata: Metadata = {
  title: "Best LED Face Masks UK 2026 | Buudy",
  description:
    "Professional-grade LED light therapy from home with the Buudy LED Mask, targeted wavelengths, neck coverage, and portable Red Torch support.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Buudy Light Therapy",
    description:
      "Discover Buudy LED Mask and Red Torch light therapy devices for home skincare and targeted wellness routines.",
    url: market.siteUrl,
  },
};

export default function Page() {
  return <HomePage />;
}
