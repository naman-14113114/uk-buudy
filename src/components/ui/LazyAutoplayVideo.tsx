"use client";

import { useEffect, useRef, useState } from "react";

type LazyAutoplayVideoProps = {
  ariaLabel?: string;
  className?: string;
  poster?: string;
  rootMargin?: string;
  src: string;
  type?: string;
};

export function LazyAutoplayVideo({
  ariaLabel,
  className,
  poster,
  rootMargin = "180px 0px",
  src,
  type = "video/mp4",
}: LazyAutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin, threshold: 0.01 },
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, [rootMargin]);

  useEffect(() => {
    if (!shouldLoad) {
      return;
    }

    videoRef.current?.play().catch(() => undefined);
  }, [shouldLoad]);

  return (
    <video
      aria-label={ariaLabel}
      autoPlay={shouldLoad}
      className={className}
      loop
      muted
      playsInline
      poster={poster}
      preload="none"
      ref={videoRef}
    >
      {shouldLoad ? <source src={src} type={type} /> : null}
    </video>
  );
}
