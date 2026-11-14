import type { Product } from "@/data/products";
import {
  serumFeatures,
  peptideSerumFeatures,
  prebioticSerumFeatures,
  cleanserFeatures,
  serumTransformations,
  prebioticTransformations,
  cleanserTransformations,
} from "@/data/productSections";
import { SerumClinicalResults, SerumHowToUse } from "./SerumClinicalSections";
import { CleanserClinicalResults, CleanserHowToUse } from "./CleanserClinicalSections";
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
  galleryVariant = product.template === "mask" || product.template === "serum" || product.template === "cleanser" ? "omnilux" : "default",
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

  const isPeptide =
    product.id.includes("peptide") ||
    product.slug.includes("peptide") ||
    product.slug.includes("collagen");

  const isPrebiotic =
    product.id.includes("prebiotic") ||
    product.slug.includes("prebiotic") ||
    product.slug.includes("noni");

  return (
    <div className="relative">
      <ProductHero product={product} galleryVariant={galleryVariant} isHalloween={isHalloween} isEarlyBlackFriday={isEarlyBlackFriday} />
      {product.template === "mask" && <DeferredVideoReviews />}
      <TrustBadges />
      {/* <FeatureGrid /> */}
      {product.template === "serum" && (
        <FeatureGrid
          featuresList={isPeptide ? peptideSerumFeatures : isPrebiotic ? prebioticSerumFeatures : serumFeatures}
          eyebrow="Formulation Science"
          title={
            <>
              What makes our formula{" "}
              <em className="buudy-italic text-[var(--gold)]">unique</em>?
            </>
          }
        />
      )}
      {product.template === "cleanser" && (
        <FeatureGrid
          featuresList={cleanserFeatures}
          eyebrow="Formulation Science"
          title={
            <>
              What makes our cleanser{" "}
              <em className="buudy-italic text-[var(--gold)]">unique</em>?
            </>
          }
        />
      )}
      {product.template === "serum" && <SerumClinicalResults isPeptide={isPeptide} isPrebiotic={isPrebiotic} />}
      {product.template === "cleanser" && <CleanserClinicalResults />}
      {product.template === "serum" && isPrebiotic && (
        <DeferredBeforeAfterGrid
          items={prebioticTransformations}
          title={
            <>
              Real users, <em className="buudy-italic">restored skin barrier</em>.
            </>
          }
          description="Verified customer transformations after incorporating Buudy Bioactive Prebiotics Jelly Serum into their daily barrier-repair and light therapy ritual."
        />
      )}
      {product.template === "serum" && !isPeptide && !isPrebiotic && (
        <DeferredBeforeAfterGrid
          items={serumTransformations}
          title={
            <>
              Real users, <em className="buudy-italic">visible dermal renewal</em>.
            </>
          }
          description="Verified customer transformations, photographed in their own homes after consistent daily use of Buudy Light-Activating Serum."
        />
      )}
      {product.template === "cleanser" && (
        <DeferredBeforeAfterGrid
          items={cleanserTransformations}
          title={
            <>
              Real users, <em className="buudy-italic">visibly clearer skin</em>.
            </>
          }
          description="Verified customer results after incorporating Buudy Blemish Purifying Face Wash into their daily morning and evening cleansing ritual."
        />
      )}
      {product.template === "mask" && <DeferredWavelengthSelector />}
      {product.template === "mask" && <DeferredHowToUseSection />}
      {product.template === "serum" && <SerumHowToUse isPeptide={isPeptide} isPrebiotic={isPrebiotic} />}
      {product.template === "cleanser" && <CleanserHowToUse />}
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
