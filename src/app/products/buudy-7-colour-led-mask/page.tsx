import type { Metadata } from "next";
import { ProductPage } from "@/components/product/ProductPage";
import { buudyMask } from "@/data/products";
import { productAsset } from "@/lib/media";
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

const pagePath = "/products/buudy-7-colour-led-mask";
const pageProduct = {
  ...buudyMask,
  slug: "buudy-7-colour-led-mask",
  gallery: [
    {
      src: productAsset("buudy-7-colour-led-mask-lifestyle-red-light-therapy-uk.webp"),
      alt: "Buudy 7 Colour LED Face Mask worn at home in red light therapy mode for anti-ageing in the UK",
    },
    {
      src: productAsset("buudy-7-colour-led-mask-with-free-red-light-torch-uk.webp"),
      alt: "Buudy 7 Colour LED Face Mask with included complimentary Red Light Torch treatment UK",
    },
    {
      src: productAsset("buudy-7-colour-led-mask-uk-anti-ageing-red-light-therapy.webp"),
      alt: "Buudy 7 Colour LED Mask for anti-ageing and skin rejuvenation in the UK",
    },
    {
      src: productAsset("buudy-7-colour-led-mask-skin-rejuvenation-uk.webp"),
      alt: "Buudy 7 Colour LED Face Mask clinical light therapy device with neck coverage",
    },
    {
      src: productAsset("buudy-7-colour-led-mask-red-light-therapy-studio-uk.webp"),
      alt: "Buudy 7 Colour LED Face Mask glowing in red light therapy mode studio shot UK",
    },
    ...buudyMask.gallery.slice(2),
  ],
};

export const revalidate = 86400;

export const metadata: Metadata = {
  title: buudyMask.seoTitle,
  description: buudyMask.seoDescription,
  keywords: [
    "best LED face mask UK",
    "LED face mask UK",
    "red light therapy mask UK",
    "LED face mask for acne UK",
    "anti ageing LED mask",
    "LED mask with neck coverage",
    "near infrared LED face mask",
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
    title: buudyMask.seoTitle,
    description: buudyMask.description,
    url: absoluteUrl(pagePath),
    type: "website",
    images: [
      {
        url: pageProduct.gallery[0].src,
        width: 1200,
        height: 1500,
        alt: pageProduct.gallery[0].alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: buudyMask.seoTitle,
    description: buudyMask.seoDescription,
    images: [pageProduct.gallery[0].src],
  },
};

export default function Buudy7ColourLedMaskProductRoute() {
  const productFaqs = [...ledMaskSeoFaqs, ...buudyMask.faqs];

  return (
    <>
      {[
        organizationJsonLd(),
        websiteJsonLd(),
        productWebPageJsonLd(pageProduct),
        productJsonLd(pageProduct),
        breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: buudyMask.name, url: pagePath },
        ]),
        faqJsonLd(productFaqs),
      ].map((schema, index) => (
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          key={index}
          type="application/ld+json"
        />
      ))}
      <ProductPage product={pageProduct} galleryVariant="omnilux" />
    </>
  );
}
