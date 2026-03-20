"use client";

import { motion } from "framer-motion";

const STRIPS  = 7;
const EASE    = [0.76, 0, 0.24, 1] as const;
const ENTER   = [0.16, 1, 0.3,  1] as const;

// Pre-format percentages to 4dp so server and client produce identical strings
// (Framer Motion truncates to 4dp during SSR serialization)
const toP = (n: number) => `${parseFloat((n * 100).toFixed(4))}%`;

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* ── Staggered strips — cover screen on mount, peel away left→right ── */}
      {/* bg-black dark:bg-white via Tailwind — pure CSS, no JS theme reading → no hydration mismatch */}
      {Array.from({ length: STRIPS }).map((_, i) => (
        <motion.div
          key={i}
          className="fixed top-0 bottom-0 bg-black dark:bg-white z-[9000] pointer-events-none origin-top"
          style={{
            left:  toP(i / STRIPS),
            width: toP(1 / STRIPS + 0.003),
          }}
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{
            duration: 0.55,
            ease: EASE,
            delay: i * 0.055,
          }}
        />
      ))}

      {/* ── Content — fades in as strips clear ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: ENTER, delay: 0.3 }}
      >
        {children}
      </motion.div>
    </>
  );
}
