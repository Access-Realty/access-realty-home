// ABOUTME: Interactive before/after image comparison slider
// ABOUTME: Draggable vertical divider reveals before image over after image

"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  /** Aspect ratio as height/width (default: 0.667 for 3:2) */
  aspectRatio?: number;
  /** Fallback image if before/after fail to load */
  fallbackSrc?: string;
}

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = "Before renovation",
  afterAlt = "After renovation",
  aspectRatio = 0.667,
  fallbackSrc,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  // Track which srcs have errored to swap in fallback without re-render loops
  const [failedSrcs, setFailedSrcs] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const displayBefore = failedSrcs.has(beforeSrc) && fallbackSrc ? fallbackSrc : beforeSrc;
  const displayAfter = failedSrcs.has(afterSrc) && fallbackSrc ? fallbackSrc : afterSrc;

  const handleImageError = useCallback((src: string) => {
    setFailedSrcs((prev) => {
      if (prev.has(src)) return prev;
      const next = new Set(prev);
      next.add(src);
      return next;
    });
  }, []);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true;
      containerRef.current?.setPointerCapture(e.pointerId);
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setPosition((p) => Math.max(0, p - 5));
    } else if (e.key === "ArrowRight") {
      setPosition((p) => Math.min(100, p + 5));
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-lg select-none touch-none cursor-col-resize"
      style={{ paddingBottom: `${aspectRatio * 100}%` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <Image
        src={displayAfter}
        alt={afterAlt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 65vw"
        onError={() => handleImageError(afterSrc)}
      />

      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={displayBefore}
          alt={beforeAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 65vw"
          onError={() => handleImageError(beforeSrc)}
        />
      </div>

      <span className="absolute top-3 left-3 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded pointer-events-none">
        Before
      </span>
      <span className="absolute top-3 right-3 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded pointer-events-none">
        After
      </span>

      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      />

      <div
        className="absolute top-1/2 -translate-y-1/2 z-10"
        style={{ left: `${position}%`, transform: "translate(-50%, -50%)" }}
        tabIndex={0}
        role="slider"
        aria-valuenow={Math.round(position)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Before and after comparison"
        onKeyDown={handleKeyDown}
      >
        <div className="h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 3L2 8L5 13" stroke="#284b70" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 3L14 8L11 13" stroke="#284b70" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
