"use client";

import { motion } from "framer-motion";
import { HorizontalScroller } from "@/ui/components";
import { playTick, playClick } from "@/lib/audio";
import type { Project } from "@/types/project";
export type { Project };

interface ProjectListProps {
  projects: Project[];
  onSelect: (index: number) => void;
}

const STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const LINE = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export const ProjectList = ({ projects, onSelect }: ProjectListProps) => {
  return (
    <HorizontalScroller>
      {projects.map((project, i) => (
        <button
          key={project._id}
          onClick={() => { playClick(); onSelect(i); }}
          onMouseEnter={() => playTick()}
          // Mobile: full-width card, stacked vertically. Desktop: side-by-side, full viewport height.
          className="flex flex-col lg:flex-row w-screen flex-shrink-0 group text-left lg:h-[calc(100vh-40px)]"
        >
          {/* ── Image ───────────────────────────────────────── */}
          <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:w-[58vw] lg:h-full overflow-hidden bg-black/5">
            {project.mediaUrl ? (
              project.mediaType === "video" ? (
                <video
                  src={project.mediaUrl}
                  autoPlay loop muted playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.mediaUrl}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              )
            ) : (
              <div className="w-full h-full bg-black/[0.04]" />
            )}

            <span className="absolute bottom-14 left-14 lg:bottom-20 lg:left-20 font-sans text-10 uppercase tracking-widest text-white/50 mix-blend-difference">
              {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </span>
          </div>

          {/* ── Text ────────────────────────────────────────── */}
          <motion.div
            className="flex flex-col justify-between w-full lg:w-[42vw] lg:h-full px-16 py-24 lg:px-40 xl:px-56 lg:py-40 border-t lg:border-t-0 lg:border-l border-black/10 dark:border-white/10"
            variants={STAGGER}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={LINE} className="flex justify-between items-start">
              <span className="font-sans text-10 uppercase tracking-widest opacity-30 dark:opacity-45">
                Selected work
              </span>
              <span className="font-sans text-10 uppercase tracking-widest opacity-20 dark:opacity-35">
                {project.layout}
              </span>
            </motion.div>

            <motion.div variants={LINE} className="py-20 lg:py-0">
              <h2 className="font-serif text-36 lg:text-48 xl:text-64 uppercase leading-[0.92] tracking-tight">
                {project.title}
              </h2>
            </motion.div>

            <motion.div variants={LINE} className="flex flex-col gap-14 lg:gap-20">
              <p className="font-sans text-12 leading-relaxed opacity-50 dark:opacity-65 max-w-[32ch]">
                {project.description}
              </p>
              <p className="font-sans text-10 uppercase tracking-widest opacity-30 dark:opacity-45 leading-loose">
                {project.techStack.join("  ·  ")}
              </p>
              <span className="font-sans text-10 uppercase tracking-widest opacity-30 dark:opacity-45 group-hover:opacity-80 transition-opacity duration-300">
                View Project →
              </span>
            </motion.div>
          </motion.div>
        </button>
      ))}
    </HorizontalScroller>
  );
};
