"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

const SPRING = { damping: 32, stiffness: 260, mass: 0.6 };
const EASE   = [0.16, 1, 0.3, 1] as const;

export function Cursor() {
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const x = useSpring(mouseX, SPRING);
  const y = useSpring(mouseY, SPRING);
  const isFirstMove = useRef(true);

  const [mounted,  setMounted]  = useState(false);
  const [visible,  setVisible]  = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed,  setPressed]  = useState(false);
  const [label,    setLabel]    = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (window.matchMedia("(hover: none)").matches) return;

    const onMove = (e: MouseEvent) => {
      if (isFirstMove.current) {
        x.jump(e.clientX);
        y.jump(e.clientY);
        isFirstMove.current = false;
      }
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const labelEl    = el.closest("[data-cursor]") as HTMLElement | null;
      const interactive = el.closest('a, button, [role="button"], [data-cursor]');
      setLabel(labelEl?.dataset.cursor ?? null);
      setHovering(!!interactive);
    };

    const onDown  = () => setPressed(true);
    const onUp    = () => setPressed(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove",  onMove);
    window.addEventListener("mouseover",  onOver);
    window.addEventListener("mousedown",  onDown);
    window.addEventListener("mouseup",    onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mouseover",  onOver);
      window.removeEventListener("mousedown",  onDown);
      window.removeEventListener("mouseup",    onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* ── Horizontal crosshair line ─────────────────────── */}
      {/* mix-blend-mode: difference → black on white bg, white on dark bg */}
      <motion.div
        className="pointer-events-none fixed left-0 right-0 h-px bg-white z-[9998]"
        style={{ top: y, translateY: "-0.5px", mixBlendMode: "difference" }}
        animate={{ opacity: visible ? (hovering ? 0.9 : 0.5) : 0 }}
        transition={{ duration: 0.25 }}
      />

      {/* ── Vertical crosshair line ───────────────────────── */}
      <motion.div
        className="pointer-events-none fixed top-0 bottom-0 w-px bg-white z-[9998]"
        style={{ left: x, translateX: "-0.5px", mixBlendMode: "difference" }}
        animate={{ opacity: visible ? (hovering ? 0.9 : 0.5) : 0 }}
        transition={{ duration: 0.25 }}
      />

      {/* ── Dot + label ───────────────────────────────────── */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[10000]"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Center dot — always white + dark shadow, visible on any bg */}
        <motion.div
          className="rounded-full bg-white"
          style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.2), 0 1px 6px rgba(0,0,0,0.18)" }}
          animate={{
            width:  hovering || label ? 6 : 4,
            height: hovering || label ? 6 : 4,
            scale:  pressed ? 0.55 : 1,
          }}
          transition={{ duration: 0.18, ease: EASE }}
        />

        {/* Label — slides in to the right */}
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              className="absolute top-1/2 font-sans uppercase whitespace-nowrap"
              style={{
                left: "calc(100% + 10px)",
                translateY: "-50%",
                fontSize: 9,
                letterSpacing: "0.12em",
                color: "white",
                textShadow: "0 1px 5px rgba(0,0,0,0.55)",
              }}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              transition={{ duration: 0.16, ease: EASE }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
