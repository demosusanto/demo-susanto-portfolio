"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { OtherProject } from "@/data/portfolio";

interface ProjectModalProps {
  project: OtherProject | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Touch swipe handling for mobile
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Ambil daftar gambar (fallback ke project.image jika project.images kosong)
  const images = project?.images && project.images.length > 0
    ? project.images
    : project?.image
    ? [project.image]
    : [];

  const totalSlides = images.length;
  const hasMultipleSlides = totalSlides > 1;

  // Reset slide saat project berubah
  useEffect(() => {
    setCurrentSlide(0);
  }, [project]);

  const goToNextSlide = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrevSlide = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Lock background scroll dan tangani tombol Escape & Arrow keys
  useEffect(() => {
    if (!project) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && hasMultipleSlides) {
        goToPrevSlide();
      } else if (e.key === "ArrowRight" && hasMultipleSlides) {
        goToNextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose, hasMultipleSlides, goToNextSlide, goToPrevSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!hasMultipleSlides) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 40; // minimum swipe distance

    if (diff > threshold) {
      goToNextSlide();
    } else if (diff < -threshold) {
      goToPrevSlide();
    }
  };

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-[#020c1b]/80 backdrop-blur-sm animate-fade-in"
    >
      {/* Modal Content Box */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col w-full max-w-[760px] max-h-[92vh] overflow-hidden rounded-xl bg-white shadow-2xl animate-modal-pop"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-2 sm:px-8 sm:pt-7">
          <div className="pr-4">
            <h3
              id="modal-headline"
              className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800"
            >
              {project.modalTitle || project.title}
            </h3>
            <p className="mt-1 text-sm sm:text-base text-slate-600">
              {project.modalSubtitle || project.description}
            </p>
          </div>

          {/* Close 'X' Button on Top Right */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body / Image Slider & Details */}
        <div className="overflow-y-auto px-6 py-4 sm:px-8 sm:py-5 space-y-4 no-scrollbar">
          {/* ================= IMAGE SLIDER CONTAINER ================= */}
          <div
            className="relative w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-inner select-none group"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Sliding Track */}
            <div
              className="flex w-full transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {images.map((imgSrc, idx) => (
                <div
                  key={idx}
                  className="relative w-full flex-shrink-0 flex items-center justify-center bg-slate-100/40"
                >
                  <Image
                    src={imgSrc}
                    alt={`${project.modalTitle || project.title} - Slide ${idx + 1}`}
                    width={920}
                    height={540}
                    priority={idx === 0}
                    className="h-auto w-full object-contain"
                  />
                </div>
              ))}
            </div>

            {/* Slide Navigation Controls (hanya muncul jika terdapat lebih dari 1 gambar) */}
            {hasMultipleSlides && (
              <>
                {/* Previous Button (Left Arrow) */}
                <button
                  type="button"
                  onClick={goToPrevSlide}
                  aria-label="Previous slide"
                  className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-slate-900 hover:scale-105 active:scale-95 focus:outline-none"
                >
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Next Button (Right Arrow) */}
                <button
                  type="button"
                  onClick={goToNextSlide}
                  aria-label="Next slide"
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-slate-900 hover:scale-105 active:scale-95 focus:outline-none"
                >
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Slide Counter Badge (Top Right) */}
                <div className="absolute top-2.5 right-2.5 z-20 rounded-md bg-slate-900/60 px-2 py-0.5 font-mono text-[11px] text-white backdrop-blur-sm">
                  {currentSlide + 1} / {totalSlides}
                </div>

                {/* Pagination Dots (Bottom Center) */}
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 rounded-full bg-slate-900/50 px-2.5 py-1 backdrop-blur-sm">
                  {images.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSlide(dotIdx);
                      }}
                      aria-label={`Jump to slide ${dotIdx + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-200 ${
                        dotIdx === currentSlide
                          ? "w-5 bg-white shadow-sm"
                          : "w-1.5 bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Additional Description & Tech Stack Pills */}
          <div className="pt-2">
            <p className="text-sm leading-relaxed text-slate-600">
              {project.description}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-slate-100 px-3 py-1 font-mono text-xs font-medium text-slate-700"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer with Blue Close Button matching Screenshot 3 */}
        <div className="flex items-center justify-end px-6 py-4 sm:px-8 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-[#0070f3] hover:bg-blue-600 active:bg-blue-700 px-6 py-2 text-sm font-medium text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
