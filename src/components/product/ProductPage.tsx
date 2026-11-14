import type { Product } from "@/data/products";
import { serumFeatures, serumTransformations } from "@/data/productSections";
import { SerumClinicalResults, SerumHowToUse } from "./SerumClinicalSections";
import { AppPromo, BlueLightSection, TouchTechSection } from "./AppPromo";
import { ComparisonTable } from "./ComparisonTable";
import { FAQSection } from "./FAQSection";
import { FeatureGrid } from "./FeatureGrid";
import { GuaranteeSection } from "./GuaranteeSection";
import { ProductHero } from "./ProductHero";
import { ProductReviewsSection } from "./ProductReviewsSection";
import { StickyAddToCart } from "./StickyAddToCart";
import { TorchProductPage } from "./TorchProductPage";
import { IplProductPage } from "./IplProductPage";
import { MinimalProductPage } from "./MinimalProductPage";
import {
  DeferredBeforeAfterGrid,
  DeferredExpertSection,
  DeferredHowToUseSection,
  DeferredVideoReviews,
  DeferredWavelengthSelector,
} from "./DeferredClientSections";
import { TrustBadges } from "./TrustBadges";

export function ProductPage({
  product,
  variant,
  galleryVariant = product.template === "mask" || product.template === "serum" ? "omnilux" : "default",
  comparisonPosition = product.template === "mask" ? "below-app" : "default",
  isHalloween = false,
  isEarlyBlackFriday = true,
}: {
  product: Product;
  variant?: string;
  galleryVariant?: "default" | "omnilux";
  comparisonPosition?: "default" | "below-app";
  isHalloween?: boolean;
  isEarlyBlackFriday?: boolean;
}) {
  if (product.template === "torch") {
    return <TorchProductPage product={product} isHalloween={isHalloween} />;
  }

  if (product.template === "ipl") {
    return <IplProductPage product={product} isHalloween={isHalloween} />;
  }

  if (product.template === "minimal") {
    return <MinimalProductPage product={product} />;
  }

  return (
    <div className="relative">
      <ProductHero product={product} galleryVariant={galleryVariant} isHalloween={isHalloween} isEarlyBlackFriday={isEarlyBlackFriday} />
      {product.template === "mask" && <DeferredVideoReviews />}
      <TrustBadges />
      {/* <FeatureGrid /> */}
      {product.template === "serum" && (
        <FeatureGrid
          featuresList={serumFeatures}
          eyebrow="Formulation Science"
          title={
            <>
              What makes our formula{" "}
              <em className="buudy-italic text-[var(--gold)]">unique</em>?
            </>
          }
        />
      )}
      {product.template === "serum" && <SerumClinicalResults />}
      <DeferredBeforeAfterGrid
        items={product.template === "serum" ? serumTransformations : undefined}
        title={
          product.template === "serum" ? (
            <>
              Real users, <em className="buudy-italic">visible dermal renewal</em>.
            </>
          ) : undefined
        }
        description={
          product.template === "serum"
            ? "Verified customer transformations, photographed in their own homes after consistent daily use of Buudy Light-Activating Serum."
            : undefined
        }
      />
      {product.template === "mask" && <DeferredWavelengthSelector />}
      {product.template === "mask" && <DeferredHowToUseSection />}
      {product.template === "serum" && <SerumHowToUse />}
      {product.template === "mask" && <DeferredExpertSection />}
      {product.template === "mask" && comparisonPosition === "default" && <ComparisonTable />}
      {/* <TouchTechSection /> */}
      <ProductReviewsSection productHandle={product.template === "mask" ? "buudy-led-mask" : product.slug} />
      {product.template === "mask" && <AppPromo />}
      {product.template === "mask" && comparisonPosition === "below-app" && <ComparisonTable />}
      {product.template === "mask" && <BlueLightSection />}
      <FAQSection faqs={product.faqs} />
      <GuaranteeSection />
      <StickyAddToCart product={product} isEarlyBlackFriday={isEarlyBlackFriday} />
    </div>
  );
}
