"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggle: (originX?: number, originY?: number) => void;
}>({
  theme: "light",
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [wipeBg, setWipeBg] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const originRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<[number, number]>([0, 0]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current[0]);
      cancelAnimationFrame(rafRef.current[1]);
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    const initial = saved ?? "light";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggle = (originX?: number, originY?: number) => {
    if (isAnimating) return;
    const next = theme === "light" ? "dark" : "light";
    originRef.current = {
      x: originX ?? window.innerWidth / 2,
      y: originY ?? window.innerHeight / 2,
    };
    // Overlay color = old theme bg
    setWipeBg(theme === "light" ? "#ffffff" : "#0a0a0a");
    setIsAnimating(true);

    // Apply new theme via double-RAF so it lands in the same paint
    // frame as the overlay — user never sees an intermediate state
    rafRef.current[0] = requestAnimationFrame(() => {
      rafRef.current[1] = requestAnimationFrame(() => {
        localStorage.setItem("theme", next);
        document.documentElement.classList.toggle("dark", next === "dark");
        setTheme(next);
      });
    });
  };

  const { x, y } = originRef.current;
  const at = `${x}px ${y}px`;

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
      {isAnimating && (
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-none"
          style={{ backgroundColor: wipeBg ?? "#ffffff" }}
          // Starts at full coverage, contracts toward the button point
          initial={{ clipPath: `circle(150% at ${at})` }}
          animate={{ clipPath: `circle(0% at ${at})` }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          onAnimationComplete={() => {
            setIsAnimating(false);
            setWipeBg(null);
          }}
        />
      )}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
