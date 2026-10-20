// src/app/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
// Tambahkan 2 baris ini:
import { useParams, usePathname, useRouter } from "next/navigation";
import { getDictionary } from "@/dictionaries";
import {
  personalInfo,
  experiences,
  featuredProjects,
  otherProjects,
  OtherProject,
} from "@/data/portfolio";
import ProjectModal from "@/components/ProjectModal";
import CertificateSlider from "@/components/CertificateSlider";

// Komponen pembungkus untuk animasi Fade-Up saat elemen masuk ke viewport
function RevealOnScroll({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-[cubic-bezier(0.645,0.045,0.355,1)] ${isVisible
        ? "translate-y-0 opacity-100"
        : "translate-y-[30px] opacity-0"
        } ${className}`}
    >
      {children}
    </div>
  );
}

function ProjectSlider({ images = [], altText, isOdd = false }: { images: string[]; altText: string; isOdd?: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Fungsi Navigasi
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goToSlide = (index: number) => setCurrentIndex(index);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    if (isHovered) return;

    const slideInterval = setInterval(nextSlide, 4000);
    return () => clearInterval(slideInterval);
  }, [images?.length, isHovered]);

  // Menentukan posisi aman untuk indikator agar menjauhi area tumpukan Text Box
  const alignSafeSide = isOdd ? "md:justify-end md:pr-6" : "md:justify-start md:pl-6";

  return (
    <div
      className="relative h-full w-full group bg-transparent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[4px] bg-transparent">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
          >
            <Image
              src={img}
              alt={`${altText} - Slide ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 700px"
              className="object-cover md:object-contain transition-all duration-500 ease-in-out
                opacity-10 grayscale brightness-50 mix-blend-screen
                md:opacity-100 md:grayscale md:brightness-90 md:mix-blend-multiply
                md:group-hover:grayscale-0 md:group-hover:brightness-100 md:group-hover:mix-blend-normal"
            />
          </div>
        ))}
      </div>

      {/* Indikator Angka (Selalu aktif agar seragam untuk semua project) */}
      {images.length > 1 && (
        <div className={`absolute bottom-5 left-0 right-0 z-30 hidden md:flex w-full items-center justify-center ${alignSafeSide}`}>
          <div className="flex items-center gap-4 bg-[#0a192f]/95 border border-[#64ffda]/30 px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.8)] backdrop-blur-sm">
            <button
              onClick={(e) => { e.preventDefault(); prevSlide(); }}
              className="text-[#a8b2d1] hover:text-[#64ffda] transition-colors p-1"
              aria-label="Previous Slide"
            >
              {/* Icon Arrow Left */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>

            <span className="font-mono text-[13px] text-[#64ffda] tracking-widest select-none">
              {String(currentIndex + 1).padStart(2, '0')} <span className="text-[#a8b2d1] mx-1">/</span> {String(images.length).padStart(2, '0')}
            </span>

            <button
              onClick={(e) => { e.preventDefault(); nextSlide(); }}
              className="text-[#a8b2d1] hover:text-[#64ffda] transition-colors p-1"
              aria-label="Next Slide"
            >
              {/* Icon Arrow Right */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BrittanyV4Portfolio() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const [scrolledToTop, setScrolledToTop] = useState(true);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<OtherProject | null>(null);

  // 1. Tambahkan ref untuk area dropdown mobile
  const langMenuRef = useRef<HTMLDivElement>(null);

  // 2. Tambahkan pendeteksi outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Jika klik terjadi di luar elemen referensi, tutup dropdown
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setMobileLangOpen(false);
      }
    }
    // Pasang event listener saat komponen dimuat
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Bersihkan event listener saat komponen dilepas
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // === TAMBAHKAN LOGIKA MULTI-LANGUAGE DI SINI ===
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  // Ambil bahasa saat ini (default 'en')
  const lang = (params?.lang as "en" | "id" | "ja") || "en";
  const dict = getDictionary(lang); // Panggil kamus

  // Fungsi untuk mengganti bahasa tanpa mereload halaman
  const switchLanguage = (newLang: string) => {
    if (!pathname) return;
    const pathWithoutLang = pathname.replace(`/${lang}`, "");
    const newPath = `/${newLang}${pathWithoutLang}`;
    router.push(newPath);
  };
  // ===============================================

  // Siklus Loading Screen saat Reload Halaman
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2200);

    const finishTimer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = "unset";
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
      document.body.style.overflow = "unset";
    };
  }, []);

  // Deteksi posisi scroll untuk mengubah tinggi & shadow Navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolledToTop(window.scrollY < 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Gradient spotlight yang mengikuti posisi cursor (ala brittanychiang.com)
  useEffect(() => {
    let hasMoved = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!hasMoved) {
        hasMoved = true;
        setCursorVisible(true);
      }
      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(29, 78, 216, 0.15), transparent 80%)`;
      }
    };

    const handleMouseLeave = () => {
      setCursorVisible(false);
      hasMoved = false;
    };

    const handleMouseEnter = () => {
      setCursorVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  // Update navLinks menggunakan teks dari kamus
  const navLinks = [
    { num: "01.", name: dict.nav.about, href: "#about" },
    { num: "02.", name: dict.nav.experience, href: "#jobs" },
    { num: "03.", name: dict.nav.work, href: "#projects" },
    { num: "04.", name: dict.nav.contact, href: "#contact" },
  ];

  const displayedOtherProjects = showMore
    ? otherProjects
    : otherProjects.slice(0, 6);

  // Tampilkan Splash Screen Loader
  if (isLoading) {
    return (
      <div
        className={`fixed inset-0 z-[99] flex h-screen w-screen items-center justify-center bg-[#020c1b] transition-opacity duration-300 ${isFadingOut ? "opacity-0" : "opacity-100"
          }`}
      >
        <div className="animate-logo-Wrapper relative flex w-[100px] max-w-[100px] items-center justify-center">
          <svg
            id="logo"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className="block h-full w-full fill-none"
          >
            <title>Loader Logo</title>
            <g>
              <polygon
                stroke="#64ffda"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="50,5 11,27 11,72 50,95 89,73 89,28"
                pathLength="1"
                className="animate-hexagon-draw"
              />
              <text
                x="50"
                y="62"
                textAnchor="middle"
                fill="#64ffda"
                className="animate-letter-fade font-mono text-[38px] font-bold"
              >
                {personalInfo.logoLetter}
              </text>
            </g>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a192f] text-[#8892b0] selection:bg-[#233554] selection:text-[#ccd6f6] overflow-x-hidden">
      {/* ================= CURSOR SPOTLIGHT GRADIENT (ala brittanychiang.com) ================= */}
      <div
        ref={spotlightRef}
        className={`pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 hidden md:block ${cursorVisible ? "opacity-100" : "opacity-0"
          }`}
        style={{
          background: "radial-gradient(600px circle at -600px -600px, rgba(29, 78, 216, 0.15), transparent 80%)",
        }}
      />

      {/* ================= HEADER / NAVBAR ================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex w-full items-center justify-between px-6 transition-all duration-300 md:px-12 ${scrolledToTop
          ? "h-[80px] md:h-[100px] bg-[#0a192f]/90"
          : "h-[70px] bg-[#0a192f]/85 shadow-[0_10px_30px_-10px_rgba(2,12,27,0.7)] backdrop-blur-[10px]"
          }`}
      >
        {/* Logo */}
        <div
          className="animate-fade-down flex items-center"
          style={{ animationDelay: "50ms" }}
        >
          <a
            href="/"
            aria-label="home"
            className="group relative z-10 block h-[38px] w-[38px] md:h-[42px] md:w-[42px]"
          >
            <div className="absolute inset-0 z-0">
              <svg
                viewBox="0 0 84 96"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full fill-[#64ffda]"
              >
                <polygon
                  stroke="#64ffda"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="39 0 0 22 0 67 39 90 78 68 78 23"
                  transform="translate(3, 3)"
                />
              </svg>
            </div>
            <div className="relative z-10 flex h-full w-full items-center justify-center transition-transform duration-200 ease-out group-hover:-translate-x-[4px] group-hover:-translate-y-[4px]">
              <svg
                viewBox="0 0 84 96"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full fill-[#0a192f]"
              >
                <polygon
                  stroke="#64ffda"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="39 0 0 22 0 67 39 90 78 68 78 23"
                  transform="translate(3, 3)"
                />
              </svg>
              <span className="absolute font-mono text-sm md:text-base font-bold text-[#64ffda]">
                {personalInfo.logoLetter}
              </span>
            </div>
          </a>
        </div>

        {/* Desktop Nav */}
        <div className="hidden items-center md:flex">
          <ol className="flex items-center gap-1 list-none m-0 p-0">
            {navLinks.map((link, i) => (
              <li
                key={link.name}
                style={{ animationDelay: `${(i + 1) * 100}ms` }}
                className="animate-fade-down mx-[5px] font-mono text-[13px]"
              >
                <a
                  href={link.href}
                  className="p-[10px] text-[#ccd6f6] transition-colors hover:text-[#64ffda]"
                >
                  <span className="mr-[5px] text-[12px] text-[#64ffda]">
                    {link.num}
                  </span>
                  {link.name}
                </a>
              </li>
            ))}
          </ol>
          <div
            className="animate-fade-down ml-[15px]"
            style={{ animationDelay: "500ms" }}
          >
            <a
              href={personalInfo.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-[4px] border border-[#64ffda] bg-transparent px-[16px] py-[12px] font-mono text-[13px] leading-none text-[#64ffda] transition-all duration-200 hover:-translate-x-[4px] hover:-translate-y-[4px] hover:shadow-[3px_3px_0_0_#64ffda]"
            >
              {dict.nav.resume}
            </a>
          </div>
          {/* === LANGUAGE SWITCHER DESKTOP === */}
          <div className="group relative animate-fade-down ml-4" style={{ animationDelay: "600ms" }}>
            <button className="flex items-center gap-1.5 font-mono text-[13px] text-[#a8b2d1] transition-colors group-hover:text-[#64ffda] py-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              {lang.toUpperCase()}
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className="absolute right-0 top-[90%] w-[150px] rounded-[4px] bg-[#112240] border border-[#233554] shadow-[0_10px_30px_-15px_rgba(2,12,27,0.7)] opacity-0 invisible translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
              <ul className="py-2 font-mono text-[13px] text-[#a8b2d1]">
                <li>
                  <button onClick={() => switchLanguage('en')} className={`flex items-center gap-3 w-full text-left px-4 py-2.5 hover:bg-[#233554] hover:text-[#64ffda] transition-colors ${lang === 'en' ? 'text-[#64ffda] bg-[#233554]/50' : ''}`}>
                    <img src="https://flagcdn.com/w20/gb.png" srcSet="https://flagcdn.com/w40/gb.png 2x" width="20" alt="UK" className="rounded-sm" />
                    English
                  </button>
                </li>
                <li>
                  <button onClick={() => switchLanguage('id')} className={`flex items-center gap-3 w-full text-left px-4 py-2.5 hover:bg-[#233554] hover:text-[#64ffda] transition-colors ${lang === 'id' ? 'text-[#64ffda] bg-[#233554]/50' : ''}`}>
                    <img src="https://flagcdn.com/w20/id.png" srcSet="https://flagcdn.com/w40/id.png 2x" width="20" alt="ID" className="rounded-sm" />
                    Indonesia
                  </button>
                </li>
                <li>
                  <button onClick={() => switchLanguage('ja')} className={`flex items-center gap-3 w-full text-left px-4 py-2.5 hover:bg-[#233554] hover:text-[#64ffda] transition-colors ${lang === 'ja' ? 'text-[#64ffda] bg-[#233554]/50' : ''}`}>
                    <img src="https://flagcdn.com/w20/jp.png" srcSet="https://flagcdn.com/w40/jp.png 2x" width="20" alt="JP" className="rounded-sm" />
                    Japan
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Hamburger Menu Mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
          className="relative z-50 flex h-10 w-10 flex-col items-end justify-center gap-1.5 md:hidden"
        >
          <span
            className={`h-[2px] bg-[#64ffda] transition-all duration-300 ${mobileMenuOpen ? "w-7 translate-y-2 rotate-45" : "w-8"
              }`}
          />
          <span
            className={`h-[2px] bg-[#64ffda] transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : "w-6"
              }`}
          />
          <span
            className={`h-[2px] bg-[#64ffda] transition-all duration-300 ${mobileMenuOpen ? "w-7 -translate-y-2 -rotate-45" : "w-5"
              }`}
          />
        </button>

        {/* Mobile Sidebar Drawer */}
        <aside
          className={`fixed top-0 bottom-0 right-0 z-40 flex h-screen w-[min(75vw,400px)] flex-col items-center justify-center bg-[#112240] p-12 shadow-[-10px_0px_30px_-15px_rgba(2,12,27,0.7)] transition-transform duration-300 md:hidden ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <nav className="flex w-full flex-col items-center justify-between text-center font-mono text-[#ccd6f6]">
            <ol className="w-full space-y-6 p-0 list-none">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2.5 py-2 text-[16px] text-[#ccd6f6] hover:text-[#64ffda] transition-colors"
                  >
                    <span className="text-xs text-[#64ffda]">
                      {link.num}
                    </span>
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ol>
            <a
              href={personalInfo.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center justify-center w-[160px] rounded-[4px] border border-[#64ffda] py-3.5 font-mono text-xs tracking-wide text-[#64ffda] transition-all duration-200 hover:bg-[#64ffda]/10 active:scale-[0.98]"
            >
              Resume
            </a>
          </nav>
          {/* === LANGUAGE SWITCHER MOBILE === */}
          <div className="mt-10 w-[160px] relative" ref={langMenuRef}>
            {/* Tombol Utama Mobile */}
            <button
              onClick={() => setMobileLangOpen(!mobileLangOpen)}
              className="flex w-full items-center justify-between rounded-[4px] border border-[#233554] bg-[#112240] px-4 py-3 font-mono text-[13px] text-[#a8b2d1] transition-colors hover:border-[#64ffda] hover:text-[#64ffda]"
            >
              <div className="flex items-center gap-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                <div className="flex items-center gap-2">
                  {/* Menampilkan bendera sesuai bahasa terpilih di tombol Mobile */}
                  {lang === 'en' && <><img src="https://flagcdn.com/w20/gb.png" width="16" alt="UK" className="rounded-sm" /> EN</>}
                  {lang === 'id' && <><img src="https://flagcdn.com/w20/id.png" width="16" alt="ID" className="rounded-sm" /> ID</>}
                  {lang === 'ja' && <><img src="https://flagcdn.com/w20/jp.png" width="16" alt="JP" className="rounded-sm" /> JA</>}
                </div>
              </div>
              <svg className={`w-4 h-4 transition-transform duration-300 ${mobileLangOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>

            {/* List Opsi Mobile */}
            <div className={`absolute bottom-full left-0 mb-2 w-full overflow-hidden rounded-[4px] bg-[#0a192f] border border-[#233554] shadow-xl transition-all duration-300 ${mobileLangOpen ? 'max-h-[160px] opacity-100' : 'max-h-0 opacity-0 border-transparent'}`}>
              <ul className="flex flex-col font-mono text-[13px] text-[#a8b2d1] py-1">
                <li>
                  <button onClick={() => { switchLanguage('en'); setMobileLangOpen(false); setMobileMenuOpen(false); }} className={`flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-[#112240] hover:text-[#64ffda] transition-colors ${lang === 'en' ? 'text-[#64ffda]' : ''}`}>
                    <img src="https://flagcdn.com/w20/gb.png" width="20" alt="UK" className="rounded-sm" /> English
                  </button>
                </li>
                <li>
                  <button onClick={() => { switchLanguage('id'); setMobileLangOpen(false); setMobileMenuOpen(false); }} className={`flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-[#112240] hover:text-[#64ffda] transition-colors ${lang === 'id' ? 'text-[#64ffda]' : ''}`}>
                    <img src="https://flagcdn.com/w20/id.png" width="20" alt="ID" className="rounded-sm" /> Indonesia
                  </button>
                </li>
                <li>
                  <button onClick={() => { switchLanguage('ja'); setMobileLangOpen(false); setMobileMenuOpen(false); }} className={`flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-[#112240] hover:text-[#64ffda] transition-colors ${lang === 'ja' ? 'text-[#64ffda]' : ''}`}>
                    <img src="https://flagcdn.com/w20/jp.png" width="20" alt="JP" className="rounded-sm" /> Japan
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </header>

      {/* ================= LEFT FIXED SOCIAL SIDEBAR ================= */}
      <div
        style={{ animationDelay: "1100ms" }}
        className="animate-fade-up fixed bottom-0 left-[20px] z-10 hidden w-[40px] text-[#a8b2d1] md:block lg:left-[40px]"
      >
        <ul className="m-0 flex flex-col items-center p-0 list-none after:mx-auto after:mt-[20px] after:block after:h-[90px] after:w-[1px] after:bg-[#a8b2d1] after:content-['']">
          <li>
            <a
              href={personalInfo.github}
              aria-label="GitHub"
              target="_blank"
              rel="noreferrer"
              className="inline-block p-[10px] transition-all duration-200 hover:-translate-y-[3px] hover:text-[#64ffda]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-[20px] w-[20px]"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
          </li>
          <li>
            <a
              href={personalInfo.instagram}
              aria-label="Instagram"
              target="_blank"
              rel="noreferrer"
              className="inline-block p-[10px] transition-all duration-200 hover:-translate-y-[3px] hover:text-[#64ffda]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-[20px] w-[20px]"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </li>
          <li className="mb-[10px]">
            <a
              href={personalInfo.linkedin}
              aria-label="Linkedin"
              target="_blank"
              rel="noreferrer"
              className="inline-block p-[10px] transition-all duration-200 hover:-translate-y-[3px] hover:text-[#64ffda]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-[20px] w-[20px]"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </li>
        </ul>
      </div>

      {/* ================= RIGHT FIXED EMAIL SIDEBAR ================= */}
      <div
        style={{ animationDelay: "1100ms" }}
        className="animate-fade-up fixed bottom-0 right-[20px] z-10 hidden w-[40px] text-[#a8b2d1] md:block lg:right-[40px]"
      >
        <div className="flex flex-col items-center relative after:mx-auto after:mt-[20px] after:block after:h-[90px] after:w-[1px] after:bg-[#a8b2d1] after:content-['']">
          <a
            href={`mailto:${personalInfo.email}`}
            style={{ writingMode: "vertical-rl" }}
            className="my-[20px] mx-auto p-[10px] font-mono text-[12px] tracking-[0.1em] leading-[18px] transition-all duration-200 hover:-translate-y-[3px] hover:text-[#64ffda]"
          >
            {personalInfo.email}
          </a>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="mx-auto w-full max-w-[1400px] min-h-screen px-6 sm:px-12 md:px-24 lg:px-[150px]">
        {/* 1. HERO SECTION */}
        <section className="mx-auto flex min-h-screen max-w-[1000px] flex-col items-start justify-center pt-24 pb-16">
          <h1
            style={{ animationDelay: "600ms" }}
            className="animate-fade-up mb-4 ml-1 font-mono text-sm sm:text-base font-normal text-[#64ffda]"
          >
            {dict.hero.greeting}
          </h1>
          <h2
            style={{ animationDelay: "700ms" }}
            className="animate-fade-up m-0 text-3xl sm:text-5xl md:text-6xl lg:text-[72px] font-semibold leading-[1.1] tracking-tight text-[#ccd6f6]"
          >
            {dict.hero.name}
          </h2>
          <h3
            style={{ animationDelay: "800ms" }}
            className="animate-fade-up mt-1 text-3xl sm:text-5xl md:text-6xl lg:text-[72px] font-semibold leading-[1.1] tracking-tight text-[#8892b0]"
          >
            {dict.hero.tagline}
          </h3>
          <p
            style={{ animationDelay: "900ms" }}
            className="animate-fade-up mt-5 max-w-[540px] text-base sm:text-lg leading-relaxed text-[#8892b0]"
          >
            {dict.hero.shortBio}
          </p>
          <div
            style={{ animationDelay: "1000ms" }}
            className="animate-fade-up mt-10"
          >
            <a
              href={personalInfo.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-[4px] border border-[#64ffda] bg-transparent px-6 py-4 sm:px-7 sm:py-5 font-mono text-xs sm:text-sm leading-none text-[#64ffda] transition-all duration-200 hover:-translate-x-[4px] hover:-translate-y-[4px] hover:shadow-[4px_4px_0_0_#64ffda]"
            >
              {dict.hero.cta}
            </a>
          </div>
        </section>

        {/* 2. ABOUT SECTION */}
        <section
          id="about"
          className="mx-auto max-w-[900px] scroll-mt-[100px] py-20"
        >
          <RevealOnScroll>
            <h2 className="relative mt-2 mb-8 flex w-full items-center whitespace-nowrap text-2xl sm:text-[32px] font-semibold text-[#ccd6f6] after:relative after:top-[1px] after:ml-4 after:block after:h-[1px] after:w-full after:max-w-[200px] sm:after:max-w-[300px] after:bg-[#233554] after:content-['']">
              <span className="mr-2.5 font-mono text-base sm:text-xl font-normal text-[#64ffda]">
                01.
              </span>
              About Me
            </h2>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-[3fr_2fr]">
              <div className="space-y-4 text-base sm:text-lg leading-relaxed text-[#8892b0]">
                <p>
                  Hello! My name is Demo Susanto and I enjoy creating things
                  that live on the internet. My journey in Information
                  Technology spans over 8 years, including 7 years
                  as a{" "}
                  <span className="text-[#64ffda]">Frontend Developer</span> and
                  hands-on experience as a{" "}
                  <span className="text-[#64ffda]">UI/UX Designer</span> &amp;{" "}
                  <span className="text-[#64ffda]">Data Engineer</span>.
                </p>
                <p>
                  Fast-forward to today, and I’ve had the privilege of building
                  and designing digital products ranging from{" "}
                  <a
                    href="https://catatuang.sikluswaktu.my.id/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#64ffda] hover:underline"
                  >
                    a personal finance application (Catat Uang)
                  </a>
                  ,{" "}
                  <a
                    href={personalInfo.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#64ffda] hover:underline"
                  >
                    enterprise telco projects under Telkomsel
                  </a>
                  , and{" "}
                  <a
                    href={personalInfo.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#64ffda] hover:underline"
                  >
                    Data Management & Analytics (DMA) division at (BNI)
                  </a>
                  . I hold a Bachelor&apos;s Degree in Informatics Engineering
                  from Pamulang University (2018–2022) and a BNSP Programmer
                  Certification.
                </p>
                <p>
                  Here are a few technologies I’ve been working with recently:
                </p>

                <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-2 p-0 list-none font-mono text-xs sm:text-sm">
                  {personalInfo.recentSkills.map((skill, index) => (
                    <li
                      key={index}
                      className="relative pl-[20px] before:absolute before:left-0 before:text-[14px] before:leading-[12px] before:text-[#64ffda] before:content-['▹']"
                      dangerouslySetInnerHTML={{ __html: skill }}
                    />
                  ))}
                </ul>
              </div>

              <div className="relative mx-auto w-3/4 max-w-[280px] md:w-full">
                <div className="group relative block w-full rounded-[4px] bg-[#64ffda] shadow-[0_10px_30px_-15px_rgba(2,12,27,0.7)] transition-all duration-250 hover:-translate-x-[4px] hover:-translate-y-[4px] hover:shadow-[0_20px_30px_-15px_rgba(2,12,27,0.7)] after:absolute after:top-3.5 after:left-3.5 after:-z-10 after:h-full after:w-full after:rounded-[4px] after:border-2 after:border-[#64ffda] after:transition-all after:duration-250 after:content-[''] hover:after:translate-x-2 hover:after:translate-y-2">
                  <div className="relative aspect-square w-full overflow-hidden rounded-[4px] mix-blend-multiply grayscale contrast-100 transition-all duration-250 group-hover:mix-blend-normal group-hover:filter-none">
                    <Image
                      src={personalInfo.avatar}
                      alt={personalInfo.name}
                      fill
                      sizes="300px"
                      className="object-cover object-top"
                    />
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </section>

        {/* 3. EXPERIENCE SECTION */}
        <section
          id="jobs"
          className="mx-auto max-w-[700px] scroll-mt-[100px] py-20"
        >
          <RevealOnScroll>
            <h2 className="relative mt-2 mb-8 flex w-full items-center whitespace-nowrap text-2xl sm:text-[32px] font-semibold text-[#ccd6f6] after:relative after:top-[1px] after:ml-4 after:block after:h-[1px] after:w-full after:max-w-[200px] sm:after:max-w-[300px] after:bg-[#233554] after:content-['']">
              <span className="mr-2.5 font-mono text-base sm:text-xl font-normal text-[#64ffda]">
                02.
              </span>
              Where I’ve Worked
            </h2>

            <div className="flex flex-col md:flex-row min-h-[340px]">
              <div
                role="tablist"
                aria-label="Job tabs"
                className="relative z-10 mb-6 flex w-full overflow-x-auto no-scrollbar shrink-0 md:mb-0 md:w-max md:flex-col md:overflow-visible"
              >
                {experiences.map((exp, idx) => (
                  <button
                    key={exp.companyTab}
                    onClick={() => setActiveTab(idx)}
                    className={`flex h-[42px] items-center whitespace-nowrap px-5 text-left font-mono text-xs sm:text-sm transition-all duration-200 hover:bg-[#112240] hover:text-[#64ffda] border-b-2 md:border-b-0 md:border-l-2 ${activeTab === idx
                      ? "bg-[#112240] text-[#64ffda] border-[#64ffda]"
                      : "bg-transparent text-[#8892b0] border-[#233554] hover:border-[#64ffda]/40"
                      }`}
                  >
                    <span>{exp.companyTab}</span>
                  </button>
                ))}
              </div>

              <div className="w-full min-w-0 md:ml-6 py-1 px-1">
                <h3 className="mb-1 text-lg sm:text-xl font-medium leading-[1.3] text-[#ccd6f6]">
                  <span>{experiences[activeTab].role}</span>
                  <span className="text-[#64ffda]">
                    {" "}
                    @{" "}
                    <a
                      href={experiences[activeTab].url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block hover:underline"
                    >
                      {experiences[activeTab].companyFull}
                    </a>
                  </span>
                </h3>

                <p className="mb-6 font-mono text-xs sm:text-sm text-[#a8b2d1]">
                  {experiences[activeTab].period}
                </p>

                <ul className="m-0 p-0 list-none space-y-3 text-base sm:text-lg leading-relaxed">
                  {experiences[activeTab].duties.map((duty, i) => (
                    <li
                      key={i}
                      className="relative pl-7 before:absolute before:left-0 before:text-[#64ffda] before:content-['▹']"
                    >
                      {duty}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </RevealOnScroll>
        </section>

        {/* 4. FEATURED PROJECTS SECTION (03. Some Things I've Built - Responsive Mobile Fix) */}
        <section
          id="projects"
          className="mx-auto max-w-[1000px] scroll-mt-[100px] py-20"
        >
          <RevealOnScroll>
            <h2 className="relative mt-2 mb-10 flex w-full items-center whitespace-nowrap text-2xl sm:text-[32px] font-semibold text-[#ccd6f6] after:relative after:top-[1px] after:ml-4 after:block after:h-[1px] after:flex-1 after:max-w-[120px] sm:after:max-w-[300px] after:bg-[#233554] after:content-['']">
              <span className="mr-2.5 font-mono text-base sm:text-xl font-normal text-[#64ffda]">
                03.
              </span>
              Some Things I’ve Built
            </h2>
          </RevealOnScroll>

          <ul className="m-0 p-0 list-none space-y-12 sm:space-y-16 md:space-y-24">
            {featuredProjects.map((project, idx) => {
              const isOdd = idx % 2 !== 0;
              return (
                <li key={project.title}>
                  <RevealOnScroll className="group relative rounded-[4px] bg-[#112240] p-6 sm:p-8 shadow-[0_10px_30px_-15px_rgba(2,12,27,0.7)] overflow-hidden md:bg-transparent md:p-0 md:shadow-none md:overflow-visible md:grid md:grid-cols-12 md:items-center">

                    {/* Project Image: 
                        - Mobile: bg-[#112240] (Navy)
                        - Desktop: bg-[#64ffda] (Hijau Teal), lalu saat di hover berubah jadi transparent
                    */}
                    <div
                      className={`absolute inset-0 z-0 h-full w-full overflow-hidden rounded-[4px] pointer-events-none md:pointer-events-auto md:relative md:inset-auto md:z-auto md:col-span-7 md:row-start-1 md:aspect-video md:shadow-[0_10px_30px_-15px_rgba(2,12,27,0.7)] transition-colors duration-300 
                      bg-[#112240] md:bg-[#64ffda] md:group-hover:bg-transparent ${isOdd ? "md:col-start-6" : "md:col-start-1"
                        }`}
                    >
                      <ProjectSlider images={project.images} altText={project.title} isOdd={isOdd} />
                    </div>

                    {/* Project Content (Tetap sama seperti sebelumnya) */}
                    <div
                      className={`relative z-10 flex flex-col justify-center w-full text-left items-start md:col-span-7 md:row-start-1 md:z-20 md:p-0 ${isOdd
                        ? "md:col-start-1 md:items-start md:text-left"
                        : "md:col-start-6 md:items-end md:text-right"
                        }`}
                    >
                      <p className="mb-2 font-mono text-xs sm:text-sm font-normal text-[#64ffda]">
                        {project.overline}
                      </p>
                      <h3 className="mb-4 text-xl sm:text-2xl font-semibold text-[#ccd6f6] transition-colors md:hover:text-[#64ffda]">
                        {project.external ? (
                          <a
                            href={project.external}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {project.title}
                          </a>
                        ) : (
                          project.title
                        )}
                      </h3>

                      <div className="relative z-20 text-sm leading-relaxed text-[#a8b2d1] md:rounded-[4px] md:bg-[#112240] md:p-6 md:text-base md:shadow-[0_10px_30px_-15px_rgba(2,12,27,0.7)]">
                        <p>{project.description}</p>
                      </div>

                      <ul
                        className={`mt-4 mb-2 flex flex-wrap gap-x-3.5 gap-y-1.5 p-0 list-none font-mono text-xs sm:text-sm text-[#ccd6f6] md:text-[#a8b2d1] justify-start ${isOdd ? "md:justify-start" : "md:justify-end"
                          }`}
                      >
                        {project.tech.map((t) => (
                          <li key={t} className="whitespace-nowrap">
                            {t}
                          </li>
                        ))}
                      </ul>

                      <div
                        className={`mt-2 flex items-center gap-3 text-[#ccd6f6] justify-start ${isOdd ? "md:justify-start" : "md:justify-end"
                          }`}
                      >
                        {project.github && (
                          <a
                            href={project.github}
                            aria-label="GitHub Repository"
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 hover:text-[#64ffda] transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              role="img"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-5 w-5"
                            >
                              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                            </svg>
                          </a>
                        )}
                        {project.external && (
                          <a
                            href={project.external}
                            aria-label="External Link"
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 hover:text-[#64ffda] transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              role="img"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-5 w-5"
                            >
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </RevealOnScroll>
                </li>
              );
            })}
          </ul>
        </section>

        {/* 5. OTHER NOTEWORTHY PROJECTS */}
        <section className="mx-auto max-w-[1000px] py-20 flex flex-col items-center">
          <RevealOnScroll className="flex flex-col items-center">
            <h2 className="mb-2 text-center text-2xl sm:text-[32px] font-semibold text-[#ccd6f6]">
              Other Noteworthy Projects
            </h2>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noreferrer"
              className="mb-10 font-mono text-xs sm:text-sm text-[#64ffda] hover:underline"
            >
              view the archive
            </a>
          </RevealOnScroll>

          <ul className="grid w-full grid-cols-1 gap-4 p-0 list-none sm:grid-cols-2 lg:grid-cols-3">
            {displayedOtherProjects.map((project, index) => (
              <li key={project.title} className="h-full">
                <RevealOnScroll
                  delay={(index % 3) * 100}
                  className="group relative flex h-full flex-col justify-between rounded-[4px] bg-[#112240] px-6 py-8 shadow-[0_10px_30px_-15px_rgba(2,12,27,0.7)] transition-all duration-250 hover:-translate-y-[7px] cursor-pointer hover:bg-[#13284c] border border-transparent hover:border-[#64ffda]/30"
                >
                  <div
                    onClick={() => setSelectedProject(project)}
                    className="flex flex-col justify-between h-full w-full"
                  >
                    <header>
                      <div className="mb-8 flex items-center justify-between">
                        <div className="text-[#64ffda] transition-transform duration-200 group-hover:scale-110">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            role="img"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-10 w-10"
                          >
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                          </svg>
                        </div>
                        {project.external && (
                          <div className="flex items-center text-[#a8b2d1]">
                            <a
                              href={project.external}
                              aria-label="External Link"
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 hover:text-[#64ffda] transition-colors"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                role="img"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                              >
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                              </svg>
                            </a>
                          </div>
                        )}
                      </div>

                      <h3 className="mb-2.5 text-lg sm:text-xl font-semibold leading-[1.3] text-[#ccd6f6] transition-colors group-hover:text-[#64ffda]">
                        {project.title}
                      </h3>

                      <div className="text-sm sm:text-base leading-relaxed text-[#a8b2d1]">
                        <p>{project.description}</p>
                      </div>
                    </header>

                    <footer>
                      <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-1 p-0 list-none font-mono text-xs text-[#8892b0]">
                        {project.tech.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </footer>
                  </div>
                </RevealOnScroll>
              </li>
            ))}
          </ul>

          {otherProjects.length > 6 && (
            <RevealOnScroll>
              <button
                onClick={() => setShowMore(!showMore)}
                className="mt-12 rounded-[4px] border border-[#64ffda] bg-transparent px-7 py-4 font-mono text-xs sm:text-sm leading-none text-[#64ffda] transition-all duration-200 hover:-translate-x-[4px] hover:-translate-y-[4px] hover:shadow-[4px_4px_0_0_#64ffda]"
              >
                Show {showMore ? "Less" : "More"}
              </button>
            </RevealOnScroll>
          )}

          {/* Modal Pop Up saat Box Project diklik (Screenshot 3) */}
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        </section>

        {/* 6. CONTACT SECTION & CERTIFICATE SLIDER (Screenshot 4) */}
        <section
          id="contact"
          className="mx-auto mb-20 max-w-[850px] scroll-mt-[100px] py-20 text-center"
        >
          <RevealOnScroll>
            <h2 className="mb-4 block font-mono text-sm sm:text-base font-normal text-[#64ffda]">
              04. What’s Next?
            </h2>

            {/* Slider Sertifikat / Credentials Carousel (Screenshot 4) */}
            <CertificateSlider />

            <h2 className="mt-12 sm:mt-16 mb-4 text-3xl sm:text-5xl md:text-[60px] font-semibold text-[#ccd6f6]">
              Get In Touch
            </h2>
            <p className="mx-auto max-w-[550px] text-base sm:text-lg leading-relaxed text-[#8892b0]">
              Whether you have a question or just want to say hi, I’ll try my
              best to get back to you!
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
              {/* Email CTA */}
              <a
                href={`mailto:${personalInfo.email}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-[4px] border border-[#64ffda] bg-transparent px-7 py-4 sm:py-5 font-mono text-xs sm:text-sm leading-none text-[#64ffda] transition-all duration-200 hover:-translate-x-[4px] hover:-translate-y-[4px] hover:shadow-[4px_4px_0_0_#64ffda]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                Say Hello
              </a>

              {/* WhatsApp CTA */}
              <a
                href={personalInfo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-[4px] border border-[#25D366] bg-[#25D366]/10 px-7 py-4 sm:py-5 font-mono text-xs sm:text-sm leading-none text-[#25D366] transition-all duration-200 hover:-translate-x-[4px] hover:-translate-y-[4px] hover:bg-[#25D366]/20 hover:shadow-[4px_4px_0_0_#25D366]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </RevealOnScroll>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="flex min-h-[70px] flex-col items-center justify-center p-4 text-center font-mono text-xs text-[#a8b2d1]">
        <div className="mb-4 block md:hidden">
          <ul className="flex items-center justify-center gap-4 p-0 list-none text-[#a8b2d1]">
            <li>
              <a
                href={personalInfo.github}
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block p-2 text-[#a8b2d1] transition-all duration-200 hover:-translate-y-1 hover:text-[#64ffda] active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <title>GitHub</title>
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>
            </li>
            <li>
              <a
                href={personalInfo.linkedin}
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block p-2 text-[#a8b2d1] transition-all duration-200 hover:-translate-y-1 hover:text-[#64ffda] active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <title>LinkedIn</title>
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </li>
            <li>
              <a
                href={personalInfo.whatsappUrl}
                aria-label="WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block p-2 text-[#a8b2d1] transition-all duration-200 hover:-translate-y-1 hover:text-[#25D366] active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <title>WhatsApp</title>
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${personalInfo.email}`}
                aria-label="Email"
                className="inline-block p-2 text-[#a8b2d1] transition-all duration-200 hover:-translate-y-1 hover:text-[#64ffda] active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <title>Email</title>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
        <div className="leading-relaxed">
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block transition-colors hover:text-[#64ffda]"
          >
            © 2026 Demo Susanto. All rights reserved.
          </a>
        </div>
      </footer>
    </div>
  );
}