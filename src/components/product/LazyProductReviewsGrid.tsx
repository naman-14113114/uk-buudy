"use client";

import { useEffect, useRef, useState } from "react";
import { ProductReviewsGrid } from "./ProductReviewsGrid";
import type { ProductReview } from "@/types/reviews";

type LazyProductReviewsGridProps = {
  averageRating: number;
  productHandle: string;
  initialReviews: ProductReview[];
  pageSize: number;
  ratingDistribution: Record<string, number>;
  total: number;
};

export function LazyProductReviewsGrid(props: LazyProductReviewsGridProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setShouldRender(true);
        observer.disconnect();
      },
      { rootMargin: "520px 0px", threshold: 0.01 },
    );

    observer.observe(root);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef}>
      {shouldRender ? (
        <ProductReviewsGrid {...props} />
      ) : (
        <div className="min-h-[36rem] rounded-[24px] border border-[rgba(58,31,61,.12)] bg-[rgba(255,252,245,.64)] shadow-[0_22px_56px_-44px_rgba(58,31,61,.45)]" />
      )}
    </div>
  );
}
