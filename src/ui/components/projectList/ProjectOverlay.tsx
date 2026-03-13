"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import Lenis from "lenis";
import { playTick, playClick, playWhooshUp, playWhooshDown, playPage } from "@/lib/audio";
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

const EASE = [0.16, 1, 0.3, 1] as const;
const STRIP_W = 64;

export const ProjectOverlay = ({
  project,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: ProjectOverlayProps) => {
  const images = project.images?.length ? project.images : [project.mediaUrl];
  const [activeImg, setActiveImg] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const filmstripRef = useRef<HTMLDivElement>(null);

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

  // Track active image via IntersectionObserver
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = imgRefs.current.indexOf(e.target as HTMLDivElement);
            if (i !== -1) setActiveImg(i);
          }
        });
      },
      { root, threshold: 0.5 }
    );
    imgRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [images.length]);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    playPage();
    const thumb = filmstripRef.current?.children[activeImg] as HTMLElement | undefined;
    thumb?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeImg]);

  useEffect(() => {
    const wrapper = scrollRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    const lenis = new Lenis({
      wrapper,
      content,
      lerp: 0.12,
      orientation: "vertical",
      gestureOrientation: "vertical",
      wheelMultiplier: 1,
      smoothTouch: false,
    });
    lenisRef.current = lenis;

    let rafId: number;
    const raf = (time: number) => { lenis.raf(time); rafId = requestAnimationFrame(raf); };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollToImage = useCallback((i: number) => {
    const el = imgRefs.current[i];
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: 0 });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const noScrollbar = { scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties;

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-black overflow-hidden"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.68, ease: EASE }}
    >
      {/* ── Top scrim ────────────────────────────────────── */}
      <div
        className="absolute top-0 left-0 right-0 h-[120px] pointer-events-none z-[200]"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, transparent 100%)" }}
      />

      {/* ── Back breadcrumb ──────────────────────────────── */}
      <motion.button
        onClick={() => { playWhooshDown(); onClose(); }}
        className="absolute top-0 left-0 z-[201] px-20 lg:px-28 h-40 flex items-center font-sans text-10 uppercase tracking-widest text-white/60 hover:text-white transition-colors duration-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        ← Projects
      </motion.button>

      {/* ── Image scroll ─────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="absolute inset-0 overflow-y-scroll"
        data-lenis-prevent
        style={noScrollbar}
      >
<div ref={contentRef}>
        {images.map((src, i) => (
          <div
            key={i}
            ref={(el) => { imgRefs.current[i] = el; }}
            className="relative w-full h-screen"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${project.title} ${i + 1}`}
              className="w-full h-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
        </div>
      </div>

      {/* ── Bottom scrim ─────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[280px] pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 100%)" }}
      />

      {/* ── Bottom bar ───────────────────────────────────── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 px-20 lg:px-28 pb-20 pointer-events-none"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.48, duration: 0.5, ease: EASE }}
      >
        {images.length > 1 && (
          <div className="flex gap-6 mb-14 pointer-events-auto">
            {images.map((_, i) => (
              <button key={i} onClick={() => scrollToImage(i)} className="py-6 group">
                <div className={`h-[2px] transition-all duration-300 ${
                  i === activeImg ? "w-28 bg-white" : "w-16 bg-white/30 group-hover:bg-white/55"
                }`} />
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-4">
            <span className="font-sans text-10 uppercase tracking-widest text-white/55">
              {project.techStack.join("  ·  ")}
            </span>
            <div className="flex items-baseline gap-14">
              <h2 className="font-serif text-22 lg:text-28 uppercase leading-none text-white">
                {project.title}
              </h2>
              {project.link && project.link !== "#" && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-10 uppercase tracking-widest text-white/60 hover:text-white transition-colors duration-200 pointer-events-auto"
                >
                  Visit ↗
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-16 pointer-events-auto">
            <button
              onClick={() => { playTick(); onPrev(); }}
              disabled={index === 0}
              className="font-sans text-10 uppercase tracking-widest text-white/55 hover:text-white transition-colors duration-200 disabled:opacity-20"
            >
              ← Prev
            </button>
            <button
              onClick={() => { playTick(); onNext(); }}
              disabled={index === total - 1}
              className="font-sans text-10 uppercase tracking-widest text-white/55 hover:text-white transition-colors duration-200 disabled:opacity-20"
            >
              Next →
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Filmstrip ────────────────────────────────────── */}
      <motion.div
        className="absolute top-0 right-0 bottom-0 flex flex-col"
        style={{
          width: STRIP_W,
          ...noScrollbar,
          background: "linear-gradient(to left, rgba(0,0,0,0.35) 0%, transparent 100%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.4 }}
      >
        <div
          ref={filmstripRef}
          className="flex-1 overflow-y-scroll flex flex-col"
          style={noScrollbar}
        >
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => { playTick(); scrollToImage(i); }}
              className={`relative flex-shrink-0 w-full transition-all duration-300 ${
                activeImg === i ? "opacity-70" : "opacity-15 hover:opacity-35"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full aspect-[3/4] object-cover" loading="lazy" />
              {activeImg === i && (
                <div className="absolute inset-y-0 left-0 w-[2px] bg-white" />
              )}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
