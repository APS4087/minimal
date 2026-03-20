"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

// Parent: triggers hover state + staggers children
const container = {
  rest: {},
  hover: {
    transition: { staggerChildren: 0.03, staggerDirection: 1 },
  },
};

// Per-character overflow wrapper: participates in stagger, relays to child
const charWrap = {
  rest: {},
  hover: {},
};

// Inner rolling column: slides up -50% (one character height) to reveal duplicate
const roll = {
  rest: { y: "0%",   transition: { duration: 0.38, ease: EASE } },
  hover: { y: "-50%", transition: { duration: 0.38, ease: EASE } },
};

interface Props {
  children: string;
  className?: string;
}

export function RollingText({ children, className = "" }: Props) {
  return (
    <motion.span
      className={`inline-flex ${className}`}
      variants={container}
      initial="rest"
      whileHover="hover"
      aria-label={children}
    >
      {children.split("").map((char, i) => (
        // overflow-hidden clips the top copy as it scrolls out
        <motion.span
          key={i}
          className="inline-block overflow-hidden"
          style={{ height: "1.2em" }}
          variants={charWrap}
        >
          {/* Two copies stacked — rolls up on hover */}
          <motion.span
            className="flex flex-col"
            style={{ lineHeight: 1.2 }}
            variants={roll}
          >
            <span aria-hidden style={{ lineHeight: 1.2 }}>
              {char === " " ? "\u00A0" : char}
            </span>
            <span aria-hidden style={{ lineHeight: 1.2 }}>
              {char === " " ? "\u00A0" : char}
            </span>
          </motion.span>
        </motion.span>
      ))}
    </motion.span>
  );
}
