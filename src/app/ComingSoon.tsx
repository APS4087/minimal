"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";

const EASE = [0.16, 1, 0.3, 1] as const;

const item = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, delay, ease: EASE },
});

export function ComingSoon() {
  const { theme, toggle } = useTheme();

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center px-16 select-none">

      {/* Name block */}
      <div className="flex flex-col items-center gap-4 text-center">
        <motion.h1
          {...item(0.2)}
          className="font-serif text-[clamp(48px,7vw,96px)] uppercase leading-none tracking-tight"
        >
          Bill
        </motion.h1>
        <motion.span
          {...item(0.32)}
          className="font-serif text-[clamp(14px,1.6vw,20px)] uppercase leading-none tracking-tight opacity-30"
        >
          Aung Pyae Soe
        </motion.span>
      </div>

      {/* Separator */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.65, delay: 0.55, ease: EASE }}
        style={{ originX: 0.5 }}
        className="w-12 h-px bg-current opacity-15 my-10"
      />

      {/* Status line */}
      <motion.div {...item(0.7)} className="flex flex-col items-center gap-5 text-center">
        <p className="font-sans text-[11px] uppercase tracking-[0.22em] opacity-35">
          A new portfolio is in the making
        </p>
        <a
          href="mailto:hello@example.com"
          className="font-sans text-[10px] uppercase tracking-[0.2em] opacity-20 hover:opacity-55 transition-opacity duration-200"
        >
          Say hello ↗
        </a>
      </motion.div>

      {/* Bottom bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.0, ease: EASE }}
        className="absolute bottom-0 left-0 right-0 px-16 lg:px-24 pb-14 flex items-center justify-between"
      >
        <span className="font-sans text-[9px] uppercase tracking-[0.2em] opacity-20">
          Singapore · {new Date().getFullYear()}
        </span>
        <button
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            toggle(r.left + r.width / 2, r.top + r.height / 2);
          }}
          aria-label="Toggle theme"
          className="opacity-20 hover:opacity-50 transition-opacity duration-200 text-[11px]"
        >
          {theme === "light" ? "○" : "●"}
        </button>
      </motion.div>
    </div>
  );
}
