"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useTheme } from "@/lib/theme";

const SeaCanvas = dynamic(
  () => import("@/ui/components/sea/SeaCanvas").then(m => ({ default: m.SeaCanvas })),
  { ssr: false, loading: () => <div className="absolute inset-0" /> }
);

const EASE = [0.16, 1, 0.3, 1] as const;

// Preloader fades out starting at 2400ms over 600ms (fully gone at 3.0s).
// Content begins entering at 2.3s — staggered rise so each element leads the next.
// Small y-drift (10→0px) gives a sense of arrival without fighting the preloader fade.
const fade = (delay: number, duration = 0.9, y = 10) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration, delay, ease: EASE },
});

/* ── Scramble ────────────────────────────────────────────────── */
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ·-_.";

function useScramble(text: string, trigger: boolean) {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    if (!trigger) { setDisplay(text); return; }
    const resolved = new Array(text.length).fill(false);
    let frame = 0, raf: number;
    const tick = () => {
      frame++;
      if (frame % 3 === 0) {
        const next = resolved.findIndex(r => !r);
        if (next !== -1) resolved[next] = true;
      }
      setDisplay(text.split("").map((ch, i) =>
        resolved[i] ? ch : CHARS[Math.floor(Math.random() * CHARS.length)]
      ).join(""));
      if (resolved.some(r => !r)) raf = requestAnimationFrame(tick);
      else setDisplay(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger, text]);
  return display;
}

/* ── Page ────────────────────────────────────────────────────── */
const STATUS = "A new portfolio is in the making.";

export function ComingSoon() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  const [hovered, setHovered] = useState(false);
  const scrambled = useScramble(STATUS, hovered);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center px-16 select-none">

      {/* Sea — anchored to bottom half, fades to nothing toward center */}
      <motion.div
        {...fade(2.0, 1.4, 0)}
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: "52%", touchAction: "pan-y" }}
      >
        <SeaCanvas isDark={isDark} />
        {/* Extra fade so sea dissolves cleanly into the page above */}
        <div
          className="absolute inset-x-0 top-0 h-[75%] pointer-events-none"
          style={{ background: `linear-gradient(to bottom, ${isDark ? "#0a0a0a" : "#ffffff"} 0%, ${isDark ? "#0a0a0a" : "#ffffff"} 20%, transparent 100%)` }}
        />
      </motion.div>

      {/* ── Name ──────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-4 text-center z-10">
        {/* BILL rises up from below as the preloader dissolves */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 2.35, ease: EASE }}
          className="font-serif uppercase leading-none tracking-tight"
          style={{ fontSize: "clamp(48px, 7vw, 96px)" }}
        >
          Bill
        </motion.h1>
        {/* Subtitle condenses from the preloader name — scales down while fading in */}
        <motion.span
          initial={{ opacity: 0, scale: 1.45 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 1.0, delay: 2.4, ease: EASE }}
          className="font-serif text-[clamp(13px,1.5vw,18px)] uppercase leading-none tracking-tight"
        >
          Aung Pyae Soe
        </motion.span>
      </div>

      {/* ── Separator ─────────────────────────────────────────── */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 2.7, ease: EASE }}
        style={{ originX: 0.5 }}
        className="w-10 h-px bg-current opacity-15 my-10 z-10"
      />

      {/* ── Status + CTA ──────────────────────────────────────── */}
      <motion.div {...fade(2.9, 0.8, 6)} className="flex flex-col items-center gap-5 text-center z-10">
        <p
          className="font-sans text-[11px] uppercase tracking-[0.22em] opacity-40 cursor-default"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {scrambled}
        </p>
        <a
          href="mailto:aungpyaesoe.bgs@gmail.com"
          className="font-sans text-[10px] uppercase tracking-[0.18em] opacity-20 hover:opacity-60 transition-opacity duration-200"
        >
          Say hello ↗
        </a>
      </motion.div>

      {/* ── Top-right theme toggle ─────────────────────────────── */}
      <motion.button
        {...fade(3.0, 0.8, 0)}
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          toggle(r.left + r.width / 2, r.top + r.height / 2);
        }}
        aria-label="Toggle theme"
        className="absolute top-0 right-0 px-16 lg:px-24 pt-14 z-10 flex items-center gap-2 opacity-30 hover:opacity-70 transition-opacity duration-200"
      >
        <span className="font-sans text-[9px] uppercase tracking-[0.2em]">
          {theme === "light" ? "Light" : "Dark"}
        </span>
        <span className="text-[11px]">{theme === "light" ? "○" : "●"}</span>
      </motion.button>

      {/* ── Bottom bar ────────────────────────────────────────── */}
      <motion.div
        {...fade(3.0, 0.8, 0)}
        className="absolute bottom-0 left-0 right-0 px-16 lg:px-24 pb-14 flex items-center z-10"
      >
        <span className="font-sans text-[9px] uppercase tracking-[0.2em] opacity-20">
          Singapore · {new Date().getFullYear()}
        </span>
      </motion.div>
    </div>
  );
}
