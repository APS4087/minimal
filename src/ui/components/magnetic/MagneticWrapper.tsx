"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const SPRING   = { damping: 15, stiffness: 150, mass: 0.1 };
const STRENGTH = 0.28;
const RADIUS   = 72;

interface Props {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticWrapper({ children, className, strength = STRENGTH }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING);
  const sy = useSpring(y, SPRING);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width  / 2);
    const dy = e.clientY - (rect.top  + rect.height / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < RADIUS) {
      x.set(dx * strength);
      y.set(dy * strength);
    }
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy, display: "inline-block" }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </motion.div>
  );
}
