"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { certificates } from "@/data/portfolio";

export default function CertificateSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch swipe handling
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const total = certificates.length;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-play interval (pauses on hover)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      goToNext();
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused, goToNext]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      goToPrev();
    } else if (e.key === "ArrowRight") {
      goToNext();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50; // min swipe distance in px

    if (diff > threshold) {
      goToNext();
    } else if (diff < -threshold) {
      goToPrev();
    }
  };

  return (
    <div
      className="relative mx-auto w-full max-w-[760px] my-8 sm:my-12 px-2 sm:px-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Certificates and Credentials Slider"
    >
      {/* Outer Card Frame with subtle outer border */}
      <div
        className="relative overflow-hidden rounded-md border-4 border-[#233554]/70 bg-[#020c1b] shadow-[0_20px_50px_-15px_rgba(2,12,27,0.9)] aspect-[16/11] sm:aspect-[16/11] flex items-center justify-center select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides Track */}
        <div
          className="flex h-full w-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {certificates.map((cert, index) => (
            <div
              key={cert.id}
              className="relative h-full w-full flex-shrink-0 overflow-hidden bg-white"
            >
              <Image
                src={cert.image}
                alt={cert.title}
                fill
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 760px"
                className="object-contain p-1 sm:p-2"
              />
            </div>
          ))}
        </div>

        {/* Left Arrow Tab (Background Cyan #64ffda & Ikon Dark Navy #0a192f) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPrev();
          }}
          aria-label="Previous Certificate"
          className="group absolute left-0 top-1/2 z-20 -translate-y-1/2 flex items-center justify-center bg-[#64ffda] hover:bg-[#52e8c2] active:bg-[#3cd4ab] text-[#0a192f] py-3 px-2 sm:py-4 sm:px-3 rounded-r-md shadow-[0_2px_12px_rgba(100,255,218,0.4)] transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none"
        >
          <svg
            className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:-translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="3"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right Arrow Tab (Background Cyan #64ffda & Ikon Dark Navy #0a192f) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          aria-label="Next Certificate"
          className="group absolute right-0 top-1/2 z-20 -translate-y-1/2 flex items-center justify-center bg-[#64ffda] hover:bg-[#52e8c2] active:bg-[#3cd4ab] text-[#0a192f] py-3 px-2 sm:py-4 sm:px-3 rounded-l-md shadow-[0_2px_12px_rgba(100,255,218,0.4)] transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none"
        >
          <svg
            className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="3"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Pagination Indicator Dots disesuaikan dengan theme (#64ffda) */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {certificates.map((cert, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={cert.id}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}: ${cert.title}`}
              className={`h-1.5 rounded-full transition-all duration-300 focus:outline-none ${
                isActive
                  ? "w-8 bg-[#64ffda] shadow-[0_0_10px_rgba(100,255,218,0.5)]"
                  : "w-2.5 bg-[#233554] hover:bg-[#8892b0]"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
