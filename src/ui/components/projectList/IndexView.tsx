"use client";

import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { playTick, playClick } from "@/lib/audio";
import type { Project } from "@/types/project";

const IMAGE_W = 240;
const IMAGE_H = Math.round(IMAGE_W * (5 / 4));

export const IndexView = ({ projects, onSelect }: { projects: Project[]; onSelect: (index: number) => void }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered !== null ? projects[hovered] : null;

  // Spring-lagged cursor following
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { damping: 30, stiffness: 150, mass: 0.5 });
  const y = useSpring(rawY, { damping: 30, stiffness: 150, mass: 0.5 });
  const offsetX = useTransform(x, (v) => v - IMAGE_W / 2);
  const offsetY = useTransform(y, (v) => v - IMAGE_H / 2);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [rawX, rawY]);

  return (
    <div
      className="relative w-full min-h-[calc(100vh-40px)]"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 15% 85%, #ece8e1 0%, #f5f3ef 35%, #fafaf8 70%, #ffffff 100%)",
      }}
    >
      {/* Cursor-following preview */}
      <AnimatePresence>
        {hovered !== null && active?.mediaUrl && (
          <motion.div
            key={hovered}
            className="fixed top-0 left-0 pointer-events-none z-40 overflow-hidden"
            style={{ x: offsetX, y: offsetY, width: IMAGE_W, height: IMAGE_H }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {active.mediaType === "video" ? (
              <video
                src={active.mediaUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={active.mediaUrl}
                alt={active.title}
                className="w-full h-full object-cover"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Index list — full-width rows */}
      <div className="w-full pt-48 pb-64">
        {projects.map((project, i) => {
          const isActive = hovered === i;
          const isDimmed = hovered !== null && !isActive;

          return (
            <button
              key={project._id}
              onClick={() => { playClick(); onSelect(i); }}
              onMouseEnter={() => { playTick(); setHovered(i); }}
              onMouseLeave={() => setHovered(null)}
              className={`w-full flex justify-between items-baseline px-16 lg:px-24 py-[9px] transition-opacity duration-150 text-left ${
                isDimmed ? "opacity-[0.22]" : "opacity-100"
              }`}
            >
              <span className="font-sans text-13 lg:text-14 leading-none">
                {project.title}
              </span>
              <span className="font-sans text-13 lg:text-14 leading-none text-right">
                {project.techStack[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
