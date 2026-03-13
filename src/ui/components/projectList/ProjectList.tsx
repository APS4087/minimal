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
          className="flex w-screen h-[calc(100vh-40px)] flex-shrink-0 group text-left cursor-pointer"
        >
          {/* ── Image column ───────────────────────────────── */}
          <div className="relative w-[58vw] h-full overflow-hidden bg-black/5">
            {project.mediaUrl ? (
              project.mediaType === "video" ? (
                <video
                  src={project.mediaUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
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

            <span className="absolute bottom-20 left-20 font-sans text-10 uppercase tracking-widest text-white/50 mix-blend-difference">
              {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </span>
          </div>

          {/* ── Text column ────────────────────────────────── */}
          <motion.div
            className="flex flex-col justify-between w-[42vw] h-full px-40 lg:px-56 py-40 border-l border-black/10"
            variants={STAGGER}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
          >
            <motion.div variants={LINE} className="flex justify-between items-start">
              <span className="font-sans text-10 uppercase tracking-widest opacity-30">
                Selected work
              </span>
              <span className="font-sans text-10 uppercase tracking-widest opacity-20">
                {project.layout}
              </span>
            </motion.div>

            <motion.div variants={LINE}>
              <h2 className="font-serif text-48 lg:text-64 uppercase leading-[0.92] tracking-tight">
                {project.title}
              </h2>
            </motion.div>

            <motion.div variants={LINE} className="flex flex-col gap-20">
              <p className="font-sans text-12 leading-relaxed opacity-50 max-w-[32ch]">
                {project.description}
              </p>
              <p className="font-sans text-10 uppercase tracking-widest opacity-30 leading-loose">
                {project.techStack.join("  ·  ")}
              </p>
              <span className="font-sans text-10 uppercase tracking-widest opacity-30 group-hover:opacity-80 transition-opacity duration-300">
                View Project →
              </span>
            </motion.div>
          </motion.div>
        </button>
      ))}
    </HorizontalScroller>
  );
};
