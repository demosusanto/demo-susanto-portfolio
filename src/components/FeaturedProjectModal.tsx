"use client";

import React, { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { featuredProjects } from "@/data/portfolio";

export type FeaturedProject = (typeof featuredProjects)[number];
type Lang = "en" | "id" | "ja";

/** Slug URL-friendly dari judul (bahasa Inggris), misal "Catat Uang - Keuangan & Budget" -> "catat-uang-keuangan-budget" */
export function getProjectSlug(project: FeaturedProject): string {
  return project.title.en
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const LABELS: Record<Lang, Record<string, string>> = {
  en: { close: "Close", prev: "Previous slide", next: "Next slide", visit: "Visit site" },
  id: { close: "Tutup", prev: "Slide sebelumnya", next: "Slide berikutnya", visit: "Kunjungi situs" },
  ja: { close: "閉じる", prev: "前のスライド", next: "次のスライド", visit: "サイトを見る" },
};

interface FeaturedProjectModalProps {
  project: FeaturedProject | null;
  slide: number;
  lang: Lang;
  onSlideChange: (index: number) => void;
  onClose: () => void;
}

export default function FeaturedProjectModal({
  project,
  slide,
  lang,
  onSlideChange,
  onClose,
}: FeaturedProjectModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchDelta = useRef({ x: 0, y: 0 });

  const images = project?.images ?? [];
  const total = images.length;
  const current = Math.min(Math.max(slide, 0), Math.max(total - 1, 0));
  const hasMultiple = total > 1;
  const t = LABELS[lang];

  const goNext = useCallback(() => {
    if (total > 1) onSlideChange((current + 1) % total);
  }, [current, total, onSlideChange]);

  const goPrev = useCallback(() => {
    if (total > 1) onSlideChange((current - 1 + total) % total);
  }, [current, total, onSlideChange]);

  // Lock scroll background, Escape & arrow keys
  useEffect(() => {
    if (!project) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [project, onClose, goNext, goPrev]);

  if (!project) return null;

  const title = project.title[lang] || project.title.en;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    touchDelta.current = { x: 0, y: 0 };
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    touchDelta.current = {
      x: e.touches[0].clientX - touchStart.current.x,
      y: e.touches[0].clientY - touchStart.current.y,
    };
  };
  const handleTouchEnd = () => {
    const { x, y } = touchDelta.current;
    touchStart.current = null;
    if (Math.abs(x) > 40 && Math.abs(x) > Math.abs(y)) {
      if (x < 0) goNext();
      else goPrev();
    }
  };

  const arrowBtn =
    "absolute top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#64ffda]/30 bg-[#0a192f]/80 text-[#ccd6f6] backdrop-blur-sm transition-all hover:border-[#64ffda] hover:text-[#64ffda] active:scale-95 sm:h-11 sm:w-11";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="featured-modal-title"
      onClick={onClose}
      className="animate-fade-in fixed inset-0 z-[100] flex items-center justify-center bg-[#020c1b]/90 p-0 backdrop-blur-sm sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-modal-pop no-scrollbar relative flex h-full w-full max-w-[1100px] flex-col overflow-y-auto bg-[#0a192f] shadow-2xl sm:h-auto sm:max-h-[94dvh] sm:rounded-lg sm:border sm:border-[#233554]"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-[#233554] px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="font-mono text-[11px] leading-none text-[#64ffda] sm:text-xs">{project.overline[lang]}</p>
            <h3 id="featured-modal-title" className="mt-1.5 truncate text-lg font-semibold leading-tight text-[#ccd6f6] sm:text-2xl sm:leading-tight">
              {title}
            </h3>
          </div>
          <div className="flex shrink-0 items-center gap-1 text-[#a8b2d1]">
            {project.external && (
              <a
                href={project.external}
                target="_blank"
                rel="noreferrer"
                aria-label={t.visit}
                title={t.visit}
                className="flex h-9 w-9 items-center justify-center rounded transition-colors hover:text-[#64ffda]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            )}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label={t.close}
              className="flex h-9 w-9 items-center justify-center rounded transition-colors hover:text-[#64ffda] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#64ffda]"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Slider */}
        <div
          className="relative aspect-[4/3] max-h-[62dvh] w-full shrink-0 select-none overflow-hidden bg-[#020c1b] sm:aspect-video"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex h-full w-full transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {images.map((src, idx) => (
              <div key={src} className="relative h-full w-full shrink-0">
                {/* Hanya render gambar aktif + tetangganya agar tidak memuat puluhan gambar sekaligus */}
                {Math.abs(idx - current) <= 1 && (
                  <Image
                    src={src}
                    alt={`${title} - ${idx + 1}/${total}`}
                    fill
                    sizes="(max-width: 1100px) 100vw, 1100px"
                    priority={idx === current}
                    draggable={false}
                    className="object-contain"
                  />
                )}
              </div>
            ))}
          </div>

          {hasMultiple && (
            <>
              <button type="button" onClick={goPrev} aria-label={t.prev} className={`${arrowBtn} left-2 sm:left-4`}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button type="button" onClick={goNext} aria-label={t.next} className={`${arrowBtn} right-2 sm:right-4`}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div className="absolute right-3 top-3 z-20 rounded-full border border-[#64ffda]/30 bg-[#0a192f]/85 px-3 py-1 font-mono text-xs tracking-widest text-[#64ffda] backdrop-blur-sm">
                {String(current + 1).padStart(2, "0")} <span className="text-[#a8b2d1]">/</span> {String(total).padStart(2, "0")}
              </div>
            </>
          )}
        </div>

        {/* Details */}
        <div className="border-t border-[#233554] px-4 py-4 sm:px-6 sm:py-5">
          <p className="text-sm leading-relaxed text-[#a8b2d1] sm:text-base">{project.description[lang]}</p>
          <ul className="mt-4 flex list-none flex-wrap gap-x-4 gap-y-1.5 p-0 font-mono text-xs text-[#64ffda]">
            {project.tech.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
