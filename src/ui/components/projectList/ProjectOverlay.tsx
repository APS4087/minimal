"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import Lenis from "lenis";
import { playTick, playWhooshUp, playWhooshDown, playPage } from "@/lib/audio";
import type { Project } from "@/types/project";
export type { Project };

interface ProjectOverlayProps {
  project: Project;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const EASE    = [0.16, 1, 0.3, 1] as const;
const STRIP_W = 64;
const BAR_H   = 40; // px — top bar height
const noScrollbar = { scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties;

export const ProjectOverlay = ({
  project, index, total, onClose, onPrev, onNext,
}: ProjectOverlayProps) => {
  const gallery = project.gallery?.length
    ? project.gallery
    : [{ mediaType: (project.mediaType || "image") as "image" | "video", url: project.mediaUrl }];

  const [activeImg, setActiveImg] = useState(0);

  const scrollRef    = useRef<HTMLDivElement>(null);
  const contentRef   = useRef<HTMLDivElement>(null);
  const lenisRef     = useRef<Lenis | null>(null);
  const imgRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const filmstripRef = useRef<HTMLDivElement>(null);

  // Reset scroll + active image when project changes
  useEffect(() => {
    setActiveImg(0);
    scrollRef.current?.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [project._id]);

  useEffect(() => {
    playWhooshUp();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Track active image for filmstrip
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          const i = imgRefs.current.indexOf(e.target as HTMLDivElement);
          if (i !== -1) setActiveImg(i);
        }
      }),
      { root, threshold: 0.4 }
    );
    imgRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [gallery.length]);

  // Sync filmstrip + audio on image change
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    playPage();
    const thumb = filmstripRef.current?.children[activeImg] as HTMLElement | undefined;
    thumb?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeImg]);

  // Lenis smooth scroll
  useEffect(() => {
    const wrapper = scrollRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;
    const lenis = new Lenis({
      wrapper, content, lerp: 0.12,
      orientation: "vertical", gestureOrientation: "vertical",
      wheelMultiplier: 1, smoothTouch: false,
    });
    lenisRef.current = lenis;
    let rafId: number;
    const raf = (t: number) => { lenis.raf(t); rafId = requestAnimationFrame(raf); };
    rafId = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(rafId); lenis.destroy(); lenisRef.current = null; };
  }, []);

  const scrollToImage = useCallback((i: number) => {
    const el = imgRefs.current[i];
    if (el && lenisRef.current) lenisRef.current.scrollTo(el, { offset: -BAR_H });
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-white dark:bg-[#0a0a0a] overflow-hidden"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.68, ease: EASE }}
    >
      {/* ── Top bar ───────────────────────────────────────── */}
      <div
        className="absolute top-0 left-0 right-0 z-[201] flex items-center px-16 lg:px-28 border-b border-black/8 dark:border-white/8"
        style={{ height: BAR_H }}
      >
        <motion.button
          onClick={() => { playWhooshDown(); onClose(); }}
          className="font-sans text-10 uppercase tracking-widest opacity-35 dark:opacity-55 hover:opacity-80 transition-opacity duration-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          ← Projects
        </motion.button>

        <motion.div
          className="ml-auto flex items-center gap-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <button
            onClick={() => { playTick(); onPrev(); }}
            disabled={index === 0}
            className="font-sans text-10 uppercase tracking-widest opacity-35 hover:opacity-80 transition-opacity duration-200 disabled:opacity-15 dark:disabled:opacity-25"
          >
            ← Prev
          </button>
          <span className="font-sans text-10 uppercase tracking-widest opacity-20 dark:opacity-40 tabular-nums">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <button
            onClick={() => { playTick(); onNext(); }}
            disabled={index === total - 1}
            className="font-sans text-10 uppercase tracking-widest opacity-35 hover:opacity-80 transition-opacity duration-200 disabled:opacity-15 dark:disabled:opacity-25"
          >
            Next →
          </button>
        </motion.div>
      </div>

      {/* ── Main scroll ───────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="absolute inset-0 overflow-y-scroll"
        style={{
          top: BAR_H,
          paddingRight: undefined, // set below per breakpoint via class
          ...noScrollbar,
        }}
        data-lenis-prevent
      >
        <div
          ref={contentRef}
          // On desktop, leave room for filmstrip on the right
          className="lg:pr-[64px]"
        >
          {/* ── Project header ──────────────────────────── */}
          <motion.div
            className="px-16 lg:px-28 pt-20 lg:pt-28 pb-16 lg:pb-24 grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-20 lg:gap-40 border-b border-black/8 dark:border-white/8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
          >
            {/* Left: title + description */}
            <div className="flex flex-col gap-12">
              <h2 className="font-serif text-28 lg:text-40 uppercase leading-[0.94] tracking-tight">
                {project.title}
              </h2>
              {project.description && (
                <p className="font-sans text-12 leading-relaxed opacity-45 dark:opacity-60 max-w-[44ch] mt-2">
                  {project.description}
                </p>
              )}
            </div>

            {/* Right: meta */}
            <div className="flex flex-col gap-16 lg:pt-1">
              {project.layout && (
                <div className="flex flex-col gap-6">
                  <span className="font-sans text-10 uppercase tracking-widest opacity-25 dark:opacity-40">Discipline</span>
                  <span className="font-sans text-10 uppercase tracking-widest opacity-50">{project.layout}</span>
                </div>
              )}
              <div className="flex flex-col gap-6">
                <span className="font-sans text-10 uppercase tracking-widest opacity-25 dark:opacity-40">Stack</span>
                <span className="font-sans text-10 uppercase tracking-widest opacity-50 leading-loose">
                  {project.techStack.join("  ·  ")}
                </span>
              </div>
              {project.link && project.link !== "#" && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-10 uppercase tracking-widest opacity-35 hover:opacity-80 transition-opacity duration-200 mt-auto"
                >
                  Visit ↗
                </a>
              )}
            </div>
          </motion.div>

          {/* ── Images ──────────────────────────────────── */}
          <div className="flex flex-col">
            {gallery.map((item, i) => (
              <div
                key={i}
                ref={(el) => { imgRefs.current[i] = el; }}
                className="relative w-full border-b border-black/8 dark:border-white/8"
              >
                {item.mediaType === "video" ? (
                  <video
                    src={item.url}
                    autoPlay loop muted playsInline
                    className="w-full block"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url}
                    alt={`${project.title} ${i + 1}`}
                    className="w-full block"
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="h-20 lg:h-28" />
        </div>
      </div>

      {/* ── Filmstrip — desktop only ─────────────────────── */}
      <motion.div
        className="absolute right-0 bottom-0 hidden lg:flex flex-col border-l border-black/8 dark:border-white/8"
        style={{ top: BAR_H, width: STRIP_W, ...noScrollbar }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.4 }}
      >
        <div
          ref={filmstripRef}
          className="flex-1 overflow-y-scroll flex flex-col"
          style={noScrollbar}
        >
          {gallery.map((item, i) => (
            <button
              key={i}
              onClick={() => { playTick(); scrollToImage(i); }}
              className={`relative flex-shrink-0 w-full transition-all duration-300 ${
                activeImg === i ? "opacity-90" : "opacity-20 dark:opacity-35 hover:opacity-45 dark:hover:opacity-60"
              }`}
            >
              {item.mediaType === "video" ? (
                <video
                  src={item.url}
                  muted preload="none"
                  className="w-full aspect-[3/4] object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.url}
                  alt=""
                  className="w-full aspect-[3/4] object-cover"
                  loading="lazy"
                />
              )}
              {activeImg === i && (
                <div className="absolute inset-y-0 left-0 w-[2px] bg-black dark:bg-white" />
              )}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
