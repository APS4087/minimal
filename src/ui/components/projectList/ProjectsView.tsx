"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { playClick } from "@/lib/audio";
import type { Project } from "@/types/project";
import { ProjectList } from "./ProjectList";
import { IndexView } from "./IndexView";
import { ProjectOverlay } from "./ProjectOverlay";

type View = "spread" | "index";

export const ProjectsView = ({ projects }: { projects: Project[] }) => {
  const [view, setView] = useState<View>("spread");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleClose = () => setSelectedIndex(null);
  const handlePrev = () => setSelectedIndex((i) => (i !== null && i > 0 ? i - 1 : i));
  const handleNext = () =>
    setSelectedIndex((i) => (i !== null && i < projects.length - 1 ? i + 1 : i));

  return (
    <div className="relative">
      {/* View toggle — fixed bottom-right */}
      <div className="fixed bottom-20 right-16 lg:right-24 z-50 flex items-center bg-white border border-black/10 overflow-hidden">
        <button
          onClick={() => { playClick(); setView("spread"); }}
          className={`px-12 py-6 font-sans text-9 uppercase tracking-widest transition-all duration-200 ${
            view === "spread" ? "bg-black text-white" : "text-black/30 hover:text-black/60"
          }`}
        >
          Spread
        </button>
        <div className="w-px bg-black/10 self-stretch" />
        <button
          onClick={() => { playClick(); setView("index"); }}
          className={`px-12 py-6 font-sans text-9 uppercase tracking-widest transition-all duration-200 ${
            view === "index" ? "bg-black text-white" : "text-black/30 hover:text-black/60"
          }`}
        >
          Index
        </button>
      </div>

      {/* List views */}
      <AnimatePresence mode="wait">
        {view === "spread" ? (
          <motion.div
            key="spread"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ProjectList projects={projects} onSelect={setSelectedIndex} />
          </motion.div>
        ) : (
          <motion.div
            key="index"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <IndexView projects={projects} onSelect={setSelectedIndex} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project overlay */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <ProjectOverlay
            key={selectedIndex}
            project={projects[selectedIndex]}
            index={selectedIndex}
            total={projects.length}
            onClose={handleClose}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
