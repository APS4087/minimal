"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WORDS = [
  { initial: "A", rest: "UNG" },
  { initial: "P", rest: "YAE" },
  { initial: "S", rest: "OE"  },
];

const SWIFT  = [0.76, 0, 0.24, 1] as const;
const SPRING = [0.16, 1, 0.3, 1]  as const;

export function Preloader() {
  const [visible,  setVisible]  = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("preloader_shown")) return;
    sessionStorage.setItem("preloader_shown", "1");

    setVisible(true);

    const t1 = setTimeout(() => setExpanded(true), 650);
    const t2 = setTimeout(() => setVisible(false), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.85, ease: SWIFT }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-[#0a0a0a]"
          aria-hidden
        >
          {/* Name */}
          <div className="flex flex-col select-none">
            {WORDS.map(({ initial, rest }, i) => (
              <motion.div
                key={initial}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: i * 0.07, ease: SPRING }}
                className="flex items-baseline leading-[0.86]"
              >
                {/* Always-visible initial */}
                <span className="font-serif text-[clamp(52px,8.5vw,108px)] uppercase tracking-tight">
                  {initial}
                </span>

                {/* Sliding rest of the word */}
                <motion.span
                  initial={{ maxWidth: 0 }}
                  animate={{ maxWidth: expanded ? 420 : 0 }}
                  transition={{ duration: 0.72, delay: i * 0.09, ease: SWIFT }}
                  style={{ display: "inline-block", overflow: "hidden", whiteSpace: "nowrap" }}
                  className="font-serif text-[clamp(52px,8.5vw,108px)] uppercase tracking-tight"
                >
                  {rest}
                </motion.span>
              </motion.div>
            ))}
          </div>

          {/* Thin progress line */}
          <motion.div
            className="absolute bottom-0 left-0 h-[1px] bg-black dark:bg-white opacity-15"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.4, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
