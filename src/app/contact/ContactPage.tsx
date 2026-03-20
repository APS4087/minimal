"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playTick, playClick } from "@/lib/audio";

// ── update these ──────────────────────────────────────────────────────────────
const EMAIL = "hello@yourname.com";
const SOCIALS = [
  { label: "GitHub",   href: "https://github.com/yourusername" },
  { label: "LinkedIn", href: "https://linkedin.com/in/yourusername" },
];
const AVAILABILITY = "Available for projects";
// ─────────────────────────────────────────────────────────────────────────────

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@._-";
const SCRAMBLE_MS = 38;
const RESOLVE_MS  = 58;
const EASE        = [0.16, 1, 0.3, 1] as const;

function randChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

function useLocalTime(timezone: string) {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, [timezone]);
  return time;
}

export function ContactPage() {
  const [displayed, setDisplayed] = useState<string[]>(() =>
    EMAIL.split("")
  );
  const [resolved, setResolved] = useState(0);
  const [loaded,   setLoaded]   = useState(false);
  const [copied,   setCopied]   = useState(false);
  const time = useLocalTime("Asia/Singapore");

  const resolvedRef = useRef(0);

  // Scramble → resolve on mount
  useEffect(() => {
    let frameId:   ReturnType<typeof setTimeout>;
    let resolveId: ReturnType<typeof setTimeout>;
    let stopped = false;

    const scramble = () => {
      if (stopped) return;
      setDisplayed(prev =>
        prev.map((_, i) => i < resolvedRef.current ? EMAIL[i] : randChar())
      );
      frameId = setTimeout(scramble, SCRAMBLE_MS);
    };

    const resolveNext = () => {
      if (stopped || resolvedRef.current >= EMAIL.length) return;
      const idx = resolvedRef.current++;
      setResolved(resolvedRef.current);
      playTick();
      if (resolvedRef.current < EMAIL.length) {
        resolveId = setTimeout(resolveNext, RESOLVE_MS);
      } else {
        clearTimeout(frameId);
      }
    };

    const startId = setTimeout(() => {
      setLoaded(true);
      scramble();
      setTimeout(resolveNext, 420);
    }, 500);

    return () => {
      stopped = true;
      clearTimeout(startId);
      clearTimeout(frameId);
      clearTimeout(resolveId);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    if (copied) return;
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
      return;
    }
    playClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }, [copied]);

  return (
    <div className="relative flex flex-col min-h-[calc(100vh-40px)] px-16 lg:px-24 py-20 select-none overflow-hidden">

      {/* ── Availability dot ─────────────────────────────── */}
      <motion.div
        className="flex items-center gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
      >
        <span className="relative flex h-[6px] w-[6px] shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-30" />
          <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-current opacity-60" />
        </span>
        <span className="font-sans text-10 uppercase tracking-widest opacity-40 dark:opacity-55">
          {AVAILABILITY}
        </span>
      </motion.div>

      {/* ── Email hero ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center gap-10">
        <motion.button
          onClick={handleCopy}
          onMouseEnter={() => !copied && playTick()}
          className="group text-left focus:outline-none"
          aria-label={`Copy email address: ${EMAIL}`}
          data-cursor={copied ? "Copied" : "Copy"}
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: EASE }}
        >
          {/* Scrambling email */}
          <p
            className="font-serif uppercase leading-none tracking-tight"
            style={{ fontSize: "clamp(28px, 6.5vw, 88px)" }}
          >
            {displayed.map((char, i) => (
              <span
                key={i}
                className={`inline-block transition-opacity duration-75 ${
                  i < resolved ? "opacity-100" : "opacity-35 dark:opacity-55"
                }`}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </p>

          {/* Copy feedback */}
          <div className="mt-10 h-[14px] relative">
            <span
              className={`absolute inset-0 font-sans text-10 uppercase tracking-widest transition-opacity duration-200 ${
                copied ? "opacity-0" : "opacity-0 group-hover:opacity-30 dark:group-hover:opacity-45"
              }`}
            >
              Click to copy
            </span>
            <AnimatePresence>
              {copied && (
                <motion.span
                  className="absolute inset-0 font-sans text-10 uppercase tracking-widest opacity-55"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 0.55, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.22 }}
                >
                  Copied ✓
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.button>

        {/* Tagline */}
        <motion.p
          className="font-sans text-10 uppercase tracking-widest opacity-25 dark:opacity-40"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: loaded ? 0.25 : 0, y: loaded ? 0 : 6 }}
          transition={{ duration: 0.7, delay: 1.9, ease: EASE }}
        >
          Reach me directly. No forms, no friction.
        </motion.p>
      </div>

      {/* ── Bottom bar: socials + time ───────────────────── */}
      <motion.div
        className="flex flex-col gap-14 lg:flex-row lg:items-center lg:justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 2.1, ease: EASE }}
      >
        <div className="flex items-center gap-20">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => playTick()}
              data-cursor="Visit"
              className="font-sans text-10 uppercase tracking-widest opacity-30 dark:opacity-45 hover:opacity-80 transition-opacity duration-200"
            >
              {s.label}
            </a>
          ))}
        </div>

        {time && (
          <span className="font-sans text-10 uppercase tracking-widest opacity-30 dark:opacity-45 tabular-nums">
            Singapore · {time}
          </span>
        )}
      </motion.div>
    </div>
  );
}
