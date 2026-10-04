"use client";

import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, X } from "lucide-react";
import type { ProductImage } from "@/lib/media";
import { transformations } from "@/data/productSections";

// Video playing on product page just above footer (GuaranteeSection)
const PRODUCT_FOOTER_VIDEO_SRC = "/media/products/buudy-led-mask/videos/buudy-goddess-bg.mp4";

type MediaItem =
  | {
      type: "gallery";
      src: string;
      alt: string;
      badge?: ProductImage["badge"];
    }
  | {
      type: "before-after";
      src: string;
      alt: string;
      concern: string;
    }
  | {
      type: "video";
      src: string;
      alt: string;
    };

export function OmniluxProductGallery({
  images,
  hasGifts = true,
}: {
  images: ProductImage[];
  hasGifts?: boolean;
}) {
  // Build unified continuous array: 15 Gallery + 8 Before & After + 1 Video = 24 items in sequence
  const allMediaItems: MediaItem[] = useMemo(() => {
    const galleryItems: MediaItem[] = images.map((img) => ({
      type: "gallery",
      src: img.src,
      alt: img.alt,
      badge: img.badge,
    }));

    const beforeAfterItems: MediaItem[] = transformations.map((item) => ({
      type: "before-after",
      src: item.image,
      alt: `${item.concern} before and after result`,
      concern: item.concern,
    }));

    const videoItem: MediaItem = {
      type: "video",
      src: PRODUCT_FOOTER_VIDEO_SRC,
      alt: "Buudy LED Mask Product Video",
    };

    return [...galleryItems, ...beforeAfterItems, videoItem];
  }, [images]);

  const galleryStartIndex = 0;
  const beforeAfterStartIndex = images.length; // e.g. 15
  const videoStartIndex = images.length + transformations.length; // e.g. 23

  // Current global media index (0..23). By default always starts on first gallery image (0)
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  const thumbsTrackRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Derive active tab from currentIndex in the continuous line
  const activeTab = useMemo(() => {
    if (currentIndex >= videoStartIndex) return "video";
    if (currentIndex >= beforeAfterStartIndex) return "before-after";
    return "gallery";
  }, [currentIndex, beforeAfterStartIndex, videoStartIndex]);

  // Tab click jumps directly to the start of that section
  const handleTabClick = (tab: "gallery" | "before-after" | "video") => {
    if (tab === "gallery") setCurrentIndex(galleryStartIndex);
    else if (tab === "before-after") setCurrentIndex(beforeAfterStartIndex);
    else if (tab === "video") setCurrentIndex(videoStartIndex);
  };

  // Continuous linear navigation across all items (Gallery -> Before & After -> Video)
  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % allMediaItems.length);
  }, [allMediaItems.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + allMediaItems.length) % allMediaItems.length);
  }, [allMediaItems.length]);

  // Scroll active thumbnail smoothly to center
  useEffect(() => {
    const track = thumbsTrackRef.current;
    if (!track) return;
    const activeThumb = track.children[currentIndex] as HTMLElement | undefined;
    if (activeThumb) {
      const scrollPos =
        activeThumb.offsetLeft -
        track.offsetWidth / 2 +
        activeThumb.offsetWidth / 2;
      track.scrollTo({ left: scrollPos, behavior: "smooth" });
    }
  }, [currentIndex]);

  // Autoplay video when navigating to video item, pause when leaving
  useEffect(() => {
    const currentItem = allMediaItems[currentIndex];
    if (currentItem?.type === "video") {
      videoPlayerRef.current?.play().then(() => setIsVideoPlaying(true)).catch(() => {});
    } else {
      setIsVideoPlaying(false);
      videoPlayerRef.current?.pause();
    }
  }, [currentIndex, allMediaItems]);

  const toggleVideoPlay = useCallback(() => {
    const video = videoPlayerRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsVideoPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsVideoPlaying(false);
    }
  }, []);

  const toggleVideoMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoPlayerRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsVideoMuted(video.muted);
  }, []);

  // Lightbox opening (for images)
  const openLightbox = useCallback(() => {
    const currentItem = allMediaItems[currentIndex];
    if (currentItem?.type === "video") return;
    setIsLightboxOpen(true);
  }, [currentIndex, allMediaItems]);

  // Lightbox keyboard & scroll lock
  useEffect(() => {
    if (!isLightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    previousActiveElementRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") setIsLightboxOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousActiveElementRef.current?.focus();
    };
  }, [goNext, goPrev, isLightboxOpen]);

  // Mobile swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].screenX;
    const swipeThreshold = 45;
    if (touchEndX < touchStartXRef.current - swipeThreshold) {
      goNext();
    } else if (touchEndX > touchStartXRef.current + swipeThreshold) {
      goPrev();
    }
  };

  const currentItem = allMediaItems[currentIndex] || allMediaItems[0];

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* --- OMNILUX STYLE GALLERY CSS --- */
        .omni-gallery-container {
          max-width: 480px;
          margin: 0 auto;
          box-sizing: border-box;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        /* 1. MAIN DISPLAY CARD WITH COMPLETELY OUTSIDE NAVIGATION ARROWS */
        .omni-stage-row {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .omni-stage-arrow {
          position: static;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1c1917;
          cursor: pointer;
          flex-shrink: 0;
          transition: background-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
          z-index: 5;
        }
        .omni-stage-arrow:hover {
          background-color: #f5f5f4;
          transform: scale(1.08);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .omni-main-stage {
          position: relative;
          width: 100%;
          max-width: 400px;
          aspect-ratio: 1 / 1;
          max-height: 400px;
          background-color: #f7f4ee;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
          box-sizing: border-box;
          user-select: none;
          flex: 0 1 400px;
        }
        .omni-main-stage--zoomable {
          cursor: url("/cursor-zoom-in.svg") 20 20, zoom-in;
        }
        .omni-main-img-wrap {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .omni-main-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        /* 2. TABS SELECTOR ROW */
        .omni-tabs-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 22px;
          margin-top: 12px;
          margin-bottom: 10px;
          padding-bottom: 6px;
          border-bottom: 1px solid rgba(58, 31, 61, 0.1);
          width: 100%;
          max-width: 400px;
        }
        .omni-tab-btn {
          position: relative;
          background: none;
          border: none;
          padding: 2px 2px;
          font-family: var(--font-inter), 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #78716c;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: color 0.2s ease;
        }
        .omni-tab-btn:hover {
          color: #1c1917;
        }
        .omni-tab-btn.omni-tab-btn--active {
          color: #1c1917;
          font-weight: 800;
        }
        /* BEIGE / GOLD STAR COLOR DOT */
        .omni-tab-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--gold, #b89556);
          display: inline-block;
          animation: omniDotPop 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .omni-tab-btn--active::after {
          content: "";
          position: absolute;
          bottom: -7px;
          left: 0;
          right: 0;
          height: 2px;
          background-color: #1c1917;
          border-radius: 2px;
        }
        @keyframes omniDotPop {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        /* 3. THUMBNAILS CAROUSEL BAR WITH OUTSIDE NAVIGATION ARROWS */
        .omni-thumbs-section {
          position: relative;
          width: 100%;
          max-width: 400px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .omni-thumbs-nav-btn {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.08);
          color: #292524;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
          transition: background-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
          flex-shrink: 0;
        }
        .omni-thumbs-nav-btn:hover {
          background-color: #f5f5f4;
          transform: scale(1.08);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
        }
        .omni-thumbs-track {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow-x: auto;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 2px 1px;
          width: 100%;
        }
        .omni-thumbs-track::-webkit-scrollbar {
          display: none;
        }
        .omni-thumb-item {
          position: relative;
          flex: 0 0 56px;
          height: 56px;
          border-radius: 10px;
          overflow: hidden;
          background-color: #f5f5f4;
          cursor: pointer;
          border: 1px solid rgba(0, 0, 0, 0.08);
          padding: 0;
          box-shadow: inset 0 0 0 2px transparent;
          transition: box-shadow 0.2s ease, transform 0.2s ease, opacity 0.2s ease;
        }
        .omni-thumb-item:hover {
          opacity: 1;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
        }
        .omni-thumb-item.omni-thumb-item--active {
          box-shadow: inset 0 0 0 2px #1c1917, 0 2px 8px rgba(0,0,0,0.12);
          opacity: 1;
        }
        .omni-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .omni-video-thumb-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
        }

        /* 4. VIDEO STAGE CONTROLS */
        .omni-video-wrapper {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .omni-video-element {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .omni-video-play-btn {
          position: absolute;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.94);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2e102f;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
          transition: transform 0.2s ease, background-color 0.2s ease;
          z-index: 10;
        }
        .omni-video-play-btn:hover {
          transform: scale(1.1);
          background: #ffffff;
        }
        .omni-video-mute-btn {
          position: absolute;
          bottom: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          cursor: pointer;
          z-index: 11;
          transition: background-color 0.2s ease;
        }
        .omni-video-mute-btn:hover {
          background: rgba(0, 0, 0, 0.85);
        }

        /* 5. EDITORIAL INFOGRAPHIC BADGES (PROPORTIONALLY SCALED DOWN) */
        .buudy-gallery-badge {
          position: absolute;
          z-index: 6;
          pointer-events: none;
          user-select: none;
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 0 !important;
          background: transparent !important;
          background-color: transparent !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          border: none !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          box-sizing: border-box;
          max-width: 175px;
          will-change: opacity, transform;
        }
        .buudy-gallery-badge--top-left {
          top: 14px;
          left: 14px;
          align-items: flex-start;
          text-align: left;
          animation: buudyBadgeSlideInLeft 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.08s both;
        }
        .buudy-gallery-badge--bottom-left {
          bottom: 14px;
          left: 14px;
          align-items: flex-start;
          text-align: left;
          animation: buudyBadgeSlideInLeft 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.08s both;
        }
        .buudy-gallery-badge--top-right {
          top: 14px;
          right: 14px;
          align-items: flex-end;
          text-align: right;
          animation: buudyBadgeSlideInRight 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.08s both;
        }
        .buudy-gallery-badge--bottom-right {
          bottom: 14px;
          right: 14px;
          align-items: flex-end;
          text-align: right;
          animation: buudyBadgeSlideInRight 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.08s both;
        }
        .buudy-gallery-badge__title {
          font-family: var(--font-inter), 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 12.5px;
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: 0.01em;
          text-transform: uppercase;
          color: #111111;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.95), 0 0 10px rgba(255, 255, 255, 0.85);
          margin: 0;
          display: block;
        }
        .buudy-gallery-badge__sub {
          font-family: var(--font-inter), 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 9.5px;
          font-weight: 500;
          line-height: 1.25;
          letter-spacing: -0.01em;
          color: #374151;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.9);
          margin: 0;
          margin-top: 1px;
          display: block;
        }
        .buudy-gallery-badge--white .buudy-gallery-badge__title {
          color: #ffffff !important;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.85), 0 0 14px rgba(0, 0, 0, 0.75) !important;
        }
        .buudy-gallery-badge--white .buudy-gallery-badge__sub {
          color: rgba(255, 255, 255, 0.92) !important;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.85) !important;
        }

        @keyframes buudyBadgeSlideInLeft {
          0% { opacity: 0; transform: translate3d(-28px, 0, 0); }
          100% { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes buudyBadgeSlideInRight {
          0% { opacity: 0; transform: translate3d(28px, 0, 0); }
          100% { opacity: 1; transform: translate3d(0, 0, 0); }
        }

        /* 6. LIGHTBOX OVERLAY */
        .omni-lightbox {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          z-index: 99999999;
          pointer-events: auto;
        }
        .omni-lightbox-content {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
        .omni-lightbox-stage {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          max-width: 90vw;
          max-height: 85vh;
          border-radius: 25px;
          overflow: hidden;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
        }
        .omni-lightbox-img {
          max-width: 90vw;
          max-height: 85vh;
          border-radius: 25px;
          user-select: none;
          object-fit: contain;
        }
        .omni-lightbox-close {
          position: absolute;
          top: 20px;
          right: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: rgba(247, 241, 232, 0.96);
          border: 1px solid rgba(58, 31, 61, 0.18);
          color: var(--plum);
          cursor: pointer;
          z-index: 100000001;
          transition: transform 0.2s ease, background-color 0.2s ease;
        }
        .omni-lightbox-close:hover {
          background: var(--cream);
          transform: scale(1.08);
        }
        .omni-lightbox-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(58, 31, 61, 0.15);
          width: 54px;
          height: 54px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--plum);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 100000001;
          transition: transform 0.2s ease, background-color 0.2s ease;
        }
        .omni-lightbox-arrow:hover {
          background: #ffffff;
          transform: translateY(-50%) scale(1.08);
        }
        .omni-lightbox-arrow--prev {
          left: 20px;
        }
        .omni-lightbox-arrow--next {
          right: 20px;
        }

        /* 7. MOBILE RESPONSIVENESS */
        @media screen and (max-width: 640px) {
          .omni-gallery-container {
            max-width: 100%;
          }
          .omni-stage-row {
            gap: 6px;
          }
          .omni-stage-arrow {
            width: 30px;
            height: 30px;
          }
          .omni-main-stage {
            max-width: calc(100% - 72px);
          }
          .omni-tabs-row {
            gap: 14px;
            margin-top: 8px;
            margin-bottom: 6px;
          }
          .omni-tab-btn {
            font-size: 11px;
            letter-spacing: 0.04em;
          }
          .omni-thumb-item {
            flex: 0 0 46px;
            height: 46px;
            border-radius: 8px;
          }
          .buudy-gallery-badge {
            max-width: 140px !important;
          }
          .buudy-gallery-badge__title {
            font-size: 11px !important;
          }
          .buudy-gallery-badge__sub {
            font-size: 8.5px !important;
          }
        }
      `,
        }}
      />

      <div className="omni-gallery-container" id="buudyOmniluxGallery">
        {/* TOP MAIN DISPLAY STAGE ROW WITH COMPLETELY OUTSIDE NAVIGATION ARROWS */}
        <div className="omni-stage-row">
          {/* Outside Left Navigation Arrow */}
          <button
            type="button"
            aria-label="Previous item"
            className="omni-stage-arrow omni-stage-arrow--prev"
            onClick={goPrev}
          >
            <ChevronLeft size={20} />
          </button>

          {/* MAIN DISPLAY STAGE */}
          <div
            className={`omni-main-stage ${
              currentItem.type !== "video" ? "omni-main-stage--zoomable" : ""
            }`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={() => {
              if (currentItem.type !== "video") openLightbox();
            }}
          >
            {/* 1. GALLERY IMAGE DISPLAY */}
            {currentItem.type === "gallery" && (
              <div className="omni-main-img-wrap">
                <img
                  src={currentItem.src}
                  alt={currentItem.alt}
                  className="omni-main-img"
                  decoding="async"
                  fetchPriority={currentIndex === 0 ? "high" : "low"}
                  loading={currentIndex === 0 ? "eager" : "lazy"}
                />
                {currentItem.badge && (
                  <div key={`badge-${currentIndex}-${currentItem.src}`}>
                    <GalleryImageBadge badge={currentItem.badge} />
                  </div>
                )}
              </div>
            )}

            {/* 2. BEFORE & AFTER DISPLAY (Completely Clean Image - No Text at Bottom) */}
            {currentItem.type === "before-after" && (
              <div className="omni-main-img-wrap">
                <img
                  src={currentItem.src}
                  alt={currentItem.alt}
                  className="omni-main-img"
                  decoding="async"
                  loading="eager"
                />
              </div>
            )}

            {/* 3. FOOTER GUARANTEE VIDEO DISPLAY */}
            {currentItem.type === "video" && (
              <div className="omni-video-wrapper">
                <video
                  className="omni-video-element"
                  playsInline
                  loop
                  muted={isVideoMuted}
                  preload="auto"
                  ref={videoPlayerRef}
                  src={currentItem.src}
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                  onClick={toggleVideoPlay}
                />

                {/* Centered Play / Pause Button Overlay */}
                <button
                  type="button"
                  aria-label={isVideoPlaying ? "Pause video" : "Play video"}
                  className={`omni-video-play-btn ${
                    isVideoPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVideoPlay();
                  }}
                >
                  {isVideoPlaying ? (
                    <Pause size={26} fill="currentColor" />
                  ) : (
                    <Play size={26} fill="currentColor" className="translate-x-0.5" />
                  )}
                </button>

                {/* Mute / Unmute Toggle Button */}
                <button
                  type="button"
                  aria-label={isVideoMuted ? "Unmute video" : "Mute video"}
                  className="omni-video-mute-btn"
                  onClick={toggleVideoMute}
                >
                  {isVideoMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
                </button>
              </div>
            )}
          </div>

          {/* Outside Right Navigation Arrow */}
          <button
            type="button"
            aria-label="Next item"
            className="omni-stage-arrow omni-stage-arrow--next"
            onClick={goNext}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* 3 OPTIONS / TABS SELECTOR ROW DIRECTLY BELOW MAIN IMAGE (Beige/Gold Star Dot) */}
        <div className="omni-tabs-row" role="tablist" aria-label="Product Media Options">
          {/* TAB 1: GALLERY */}
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "gallery"}
            className={`omni-tab-btn ${
              activeTab === "gallery" ? "omni-tab-btn--active" : ""
            }`}
            onClick={() => handleTabClick("gallery")}
          >
            {activeTab === "gallery" && <span className="omni-tab-indicator" />}
            Gallery
          </button>

          {/* TAB 2: BEFORE & AFTER */}
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "before-after"}
            className={`omni-tab-btn ${
              activeTab === "before-after" ? "omni-tab-btn--active" : ""
            }`}
            onClick={() => handleTabClick("before-after")}
          >
            {activeTab === "before-after" && <span className="omni-tab-indicator" />}
            Before & After
          </button>

          {/* TAB 3: VIDEO */}
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "video"}
            className={`omni-tab-btn ${
              activeTab === "video" ? "omni-tab-btn--active" : ""
            }`}
            onClick={() => handleTabClick("video")}
          >
            {activeTab === "video" && <span className="omni-tab-indicator" />}
            Video
          </button>
        </div>

        {/* ONE CONTINUOUS THUMBNAIL TRACK WITH OUTSIDE NAVIGATION ARROWS */}
        <div className="omni-thumbs-section">
          {/* Outside Left Navigation Arrow */}
          <button
            type="button"
            aria-label="Previous item"
            className="omni-thumbs-nav-btn"
            onClick={goPrev}
          >
            <ChevronLeft size={18} />
          </button>

          {/* All 24 items in ONE unified continuous line (Gallery -> Before & After -> Video) */}
          <div className="omni-thumbs-track" ref={thumbsTrackRef}>
            {allMediaItems.map((item, idx) => (
              <button
                type="button"
                key={`thumb-${item.type}-${item.src}-${idx}`}
                aria-label={`Select item ${idx + 1}`}
                className={`omni-thumb-item ${
                  idx === currentIndex ? "omni-thumb-item--active" : ""
                }`}
                onClick={() => setCurrentIndex(idx)}
              >
                {item.type === "video" ? (
                  <>
                    <video
                      src={item.src}
                      className="omni-thumb-img"
                      muted
                      playsInline
                      preload="metadata"
                    />
                    <div className="omni-video-thumb-overlay">
                      <Play size={15} fill="currentColor" />
                    </div>
                  </>
                ) : (
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="omni-thumb-img"
                    decoding="async"
                    loading="lazy"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Outside Right Navigation Arrow */}
          <button
            type="button"
            aria-label="Next item"
            className="omni-thumbs-nav-btn"
            onClick={goNext}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && typeof document !== "undefined"
        ? createPortal(
            <div
              aria-label="Expanded product gallery modal"
              aria-modal="true"
              className="omni-lightbox"
              ref={lightboxRef}
              role="dialog"
              onClick={(e) => {
                if (e.target === e.currentTarget) setIsLightboxOpen(false);
              }}
            >
              <div
                className="omni-lightbox-content"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setIsLightboxOpen(false);
                }}
              >
                <button
                  className="omni-lightbox-close"
                  aria-label="Close View"
                  onClick={() => setIsLightboxOpen(false)}
                  ref={closeButtonRef}
                  type="button"
                >
                  <X size={24} />
                </button>

                <button
                  className="omni-lightbox-arrow omni-lightbox-arrow--prev"
                  aria-label="Previous item"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                >
                  <ChevronLeft size={28} />
                </button>

                <div className="omni-lightbox-stage">
                  {currentItem.type !== "video" && (
                    <img
                      className="omni-lightbox-img"
                      src={currentItem.src}
                      alt={currentItem.alt}
                      decoding="async"
                    />
                  )}
                  {currentItem.type === "gallery" && currentItem.badge && (
                    <div key={`modal-badge-${currentIndex}-${currentItem.src}`}>
                      <GalleryImageBadge badge={currentItem.badge} />
                    </div>
                  )}
                </div>

                <button
                  className="omni-lightbox-arrow omni-lightbox-arrow--next"
                  aria-label="Next item"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                >
                  <ChevronRight size={28} />
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function GalleryImageBadge({
  badge,
}: {
  badge: NonNullable<ProductImage["badge"]>;
}) {
  const positionClass = badge.position
    ? `buudy-gallery-badge--${badge.position}`
    : "buudy-gallery-badge--top-left";
  const themeClass = badge.theme === "white" ? "buudy-gallery-badge--white" : "";

  return (
    <div className={`buudy-gallery-badge ${positionClass} ${themeClass}`}>
      <span className="buudy-gallery-badge__title">
        {badge.title.split("\n").map((line, idx, arr) => (
          <span key={idx}>
            {line}
            {idx < arr.length - 1 && <br />}
          </span>
        ))}
      </span>
      {badge.sub && <span className="buudy-gallery-badge__sub">{badge.sub}</span>}
    </div>
  );
}
