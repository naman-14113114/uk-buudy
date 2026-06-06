"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";

const VideoReviews = dynamic(
  () => import("./VideoReviews").then((mod) => mod.VideoReviews),
  { ssr: false },
);

const BeforeAfterGrid = dynamic(
  () => import("./BeforeAfterGrid").then((mod) => mod.BeforeAfterGrid),
  { ssr: false },
);

const WavelengthSelector = dynamic(
  () => import("./WavelengthSelector").then((mod) => mod.WavelengthSelector),
  { ssr: false },
);

const ExpertSection = dynamic(
  () => import("./ExpertSection").then((mod) => mod.ExpertSection),
  { ssr: false },
);

type DeferredMountProps = {
  children: ReactNode;
  minHeight: string;
  rootMargin?: string;
};

function DeferredMount({
  children,
  minHeight,
  rootMargin = "0px 0px -18% 0px",
}: DeferredMountProps) {
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
      { rootMargin, threshold: 0.01 },
    );

    observer.observe(root);

    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={rootRef} style={shouldRender ? undefined : { minHeight }}>
      {shouldRender ? children : null}
    </div>
  );
}

export function DeferredVideoReviews() {
  return (
    <DeferredMount minHeight="34rem" rootMargin="0px 0px -35% 0px">
      <VideoReviews />
    </DeferredMount>
  );
}

export function DeferredBeforeAfterGrid() {
  return (
    <DeferredMount minHeight="40rem">
      <BeforeAfterGrid />
    </DeferredMount>
  );
}

export function DeferredWavelengthSelector() {
  return (
    <DeferredMount minHeight="46rem">
      <WavelengthSelector />
    </DeferredMount>
  );
}

export function DeferredExpertSection() {
  return (
    <DeferredMount minHeight="34rem">
      <ExpertSection />
    </DeferredMount>
  );
}
