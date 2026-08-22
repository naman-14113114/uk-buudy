import type { Metadata } from "next";
import { ProductPage } from "@/components/product/ProductPage";
import { buudy7ColourMask } from "@/data/products";
import { ledMaskSeoFaqs } from "@/data/seoFaqs";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  organizationJsonLd,
  productJsonLd,
  productWebPageJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

const pagePath = "/products/buudy-7-colour-led-face-mask";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: buudy7ColourMask.seoTitle,
  description: buudy7ColourMask.seoDescription,
  keywords: [
    "best LED face mask UK",
    "7 colour LED face mask",
    "best red light therapy mask UK",
    "LED face mask with neck coverage",
    "anti ageing LED light mask",
    "near infrared 830nm LED face mask",
    "clinical grade LED mask UK",
  ],
  alternates: {
    canonical: pagePath,
    languages: {
      "en-GB": pagePath,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: buudy7ColourMask.seoTitle,
    description: buudy7ColourMask.description,
    url: absoluteUrl(pagePath),
    type: "website",
    images: [
      {
        url: buudy7ColourMask.gallery[0].src,
        width: 1200,
        height: 1500,
        alt: buudy7ColourMask.gallery[0].alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: buudy7ColourMask.seoTitle,
    description: buudy7ColourMask.seoDescription,
    images: [buudy7ColourMask.gallery[0].src],
  },
};

export default function Buudy7ColourMaskProductRoute() {
  const productFaqs = [...ledMaskSeoFaqs, ...buudy7ColourMask.faqs];

  return (
    <>
      {[
        organizationJsonLd(),
        websiteJsonLd(),
        productWebPageJsonLd(buudy7ColourMask),
        productJsonLd(buudy7ColourMask),
        breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: buudy7ColourMask.name, url: pagePath },
        ]),
        faqJsonLd(productFaqs),
      ].map((schema, index) => (
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          key={index}
          type="application/ld+json"
        />
      ))}
      <ProductPage product={buudy7ColourMask} />
    </>
  );
}
