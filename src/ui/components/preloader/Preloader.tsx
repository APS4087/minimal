"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Each word: the initial letter is always visible, the rest slides in
const WORDS = [
  { initial: "A", rest: "UNG",  maxW: 72 },
  { initial: "P", rest: "YAE",  maxW: 72 },
  { initial: "S", rest: "OE",   maxW: 52 },
];

const SWIFT  = [0.76, 0, 0.24, 1] as const;
const SPRING = [0.16, 1, 0.3, 1]  as const;

export function Preloader() {
  const [visible,  setVisible]  = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setVisible(true);
    const t1 = setTimeout(() => setExpanded(true),  550);
    const t2 = setTimeout(() => setVisible(false),  2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: SWIFT }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-5 bg-white dark:bg-[#0a0a0a]"
          aria-hidden
        >
          {/* Name — all three words in one row */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: SPRING }}
            className="flex items-baseline gap-[0.35em] select-none"
          >
            {WORDS.map(({ initial, rest, maxW }, i) => (
              <div key={initial} className="flex items-baseline leading-none">
                <span className="font-serif text-[clamp(18px,2vw,26px)] uppercase tracking-tight">
                  {initial}
                </span>
                <motion.span
                  initial={{ maxWidth: 0 }}
                  animate={{ maxWidth: expanded ? maxW : 0 }}
                  transition={{ duration: 0.6, delay: i * 0.07, ease: SWIFT }}
                  style={{ display: "inline-block", overflow: "hidden", whiteSpace: "nowrap" }}
                  className="font-serif text-[clamp(18px,2vw,26px)] uppercase tracking-tight"
                >
                  {rest}
                </motion.span>
              </div>
            ))}
          </motion.div>

          {/* Small label + hairlines */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: expanded ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: SPRING }}
            className="flex items-center gap-10"
          >
            <span className="block h-px w-10 bg-black dark:bg-white opacity-20" />
            <span className="font-sans text-[9px] uppercase tracking-[0.28em] opacity-30">
              Portfolio
            </span>
            <span className="block h-px w-10 bg-black dark:bg-white opacity-20" />
          </motion.div>

          {/* Bottom progress line */}
          <motion.div
            className="absolute bottom-0 left-0 h-px bg-black dark:bg-white opacity-10"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.2, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
