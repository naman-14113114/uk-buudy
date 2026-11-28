import { productAsset, type ProductImage } from "@/lib/media";
import type { Product } from "./products";

export const SHOWER_HEAD_ID = "buudy-shower-head";
const slug = SHOWER_HEAD_ID;

export const showerHeadAsset = (filename: string) => productAsset(filename, slug);

const gallery: ProductImage[] = [
  { src: showerHeadAsset("01-chrome-hero.webp"), alt: "Buudy Shower Head in polished chrome, seen at an angle" },
  { src: showerHeadAsset("02-installed.webp"), alt: "Round Buudy Shower Head fitted to a fixed chrome wall arm" },
  { src: showerHeadAsset("10-filtration-infographic.webp"), alt: "20-stage filtration with a replaceable cartridge, shown beside the chrome shower head" },
  { src: showerHeadAsset("03-running-spray.webp"), alt: "Water flowing from the shower head against dark grey tile" },
  { src: showerHeadAsset("11-dimensions-infographic.webp"), alt: "Shower head dimensions: 152 mm diameter and 131 mm depth" },
  { src: showerHeadAsset("12-fitting-infographic.webp"), alt: "G 1/2 connection at the joint between the head and fixed shower arm" },
  { src: showerHeadAsset("04-spray-face.webp"), alt: "Straight-on view of the circular silver spray face" },
  { src: showerHeadAsset("05-side-profile.webp"), alt: "Side view of the chrome cartridge housing and stepped fitting" },
  { src: showerHeadAsset("06-head-and-cartridge.webp"), alt: "The shower head and its removable filter cartridge shown separately" },
];

export const buudyShowerHead = {
  slug,
  href: `/products/${slug}`,
  name: "Buudy Shower Head",
  status: "Black Friday bundle",
  priceCents: 14900,
  compareAtCents: 29900,
  rating: 4.8,
  reviewCount: 1214,
  description: "A fixed, polished-chrome shower head with a 152 mm spray face and a replaceable filter cartridge.",
  gallery,
  hero: gallery[0],
};

export const showerHeadBundleDescription = "Shower head with its filter, plus 2 extra filters.";

export const showerHeadCartProduct: Product = {
  ...buudyShowerHead,
  id: SHOWER_HEAD_ID,
  sku: "BUUDY-SHOWER-HEAD-BUNDLE",
  template: "minimal",
  heroTitle: buudyShowerHead.name,
  heroEmphasis: "",
  shortDescription: showerHeadBundleDescription,
  seoTitle: buudyShowerHead.name,
  seoDescription: buudyShowerHead.description,
  currency: "GBP",
  rating: 4.8,
  reviewCount: 1214,
  customerCount: "1,200+",
  promoCode: "",
  promoLabel: "",
  cartImage: showerHeadAsset("13-black-friday-bundle.webp"),
  gifts: [],
  specs: [],
  included: [
    { quantity: "1", label: "Shower head with filter" },
    { quantity: "2", label: "Replacement filters" },
  ],
  highlights: [],
  faqs: [],
  badges: [],
};
