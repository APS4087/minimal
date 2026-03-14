"use client";

import { motion } from "framer-motion";
import { ParallaxMedia, AnimatedText } from "@/ui/components";
import { SeaCanvas } from "@/ui/components/sea/SeaCanvas";
import { playTick, playClick } from "@/lib/audio";
import { useTheme } from "@/lib/theme";

/* ─── animation helpers ─────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 } as object,
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.72, delay, ease: [0.16, 1, 0.3, 1] },
});

/* ─── media helper ───────────────────────────────────────── */
type MediaItem =
  | { type: "image"; src: string; aspect?: string }
  | { type: "video"; src: string; aspect?: string };

function Media({ item }: { item: MediaItem }) {
  const cls = `w-full ${item.aspect ?? "aspect-[4/3]"} object-cover`;
  if (item.type === "video") {
    return <video src={item.src} autoPlay loop muted playsInline className={cls} />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={item.src} alt="" className={cls} />;
}

/* ─── data ───────────────────────────────────────────────── */
const STATS = [
  { value: "3+",   label: "Years in industry"     },
  { value: "300+", label: "Hackathon participants" },
  { value: "24",   label: "Hours non-stop"         },
  { value: "2",    label: "Hackathons organised"   },
];

const STACK = [
  {
    area: "Infrastructure",
    skills: ["Microsoft 365", "SharePoint", "Exchange", "Synology NAS", "Starlink", "IT Security"],
  },
  {
    area: "Development",
    skills: ["Full-Stack", "Shell Scripting", "Next.js", "React", "TypeScript", "UI / UX"],
  },
  {
    area: "Domains",
    skills: ["Cloud Systems", "Cybersecurity", "Big Data", "Community Building", "Project Management"],
  },
];

const LEARNING = ["Three.js", "WebGL", "GSAP", "3D on the web"];

const STACK_GROUPS = [
  ...STACK.map(g => ({ area: g.area, skills: g.skills, accent: false })),
  { area: "Currently learning", skills: LEARNING, accent: true },
];

const LINKS = [
  { label: "Email",    href: "mailto:hello@example.com"           },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/aungps" },
  { label: "GitHub",   href: "https://github.com/APS4087"         },
];

const heroItem = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
});

/* ─── page ───────────────────────────────────────────────── */
export default function About() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="overflow-x-hidden">

      {/* ── 1. Hero ──────────────────────────────────────────── */}
      <section className="relative h-screen overflow-hidden">

        {/* Sea — full bleed, fades in first */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <SeaCanvas isDark={isDark} />
        </motion.div>

        {/* Text — staggered entrance after sea fades in */}
        <div className="relative z-10 px-16 lg:px-24 pt-56 lg:pt-72 pb-[10vh] h-full flex flex-col justify-between">

          <motion.h1
            {...heroItem(0.6)}
            className="font-serif text-[clamp(52px,7vw,104px)] uppercase leading-[0.85] tracking-tight max-w-[60%]"
          >
            Aung Pyae Sone
          </motion.h1>

          <div className="flex flex-col gap-24 max-w-[42%]">
            <motion.p {...heroItem(0.9)} className="font-sans text-12 leading-relaxed opacity-40 max-w-[44ch]">
              IT infrastructure engineer and builder based in Singapore.
              I keep global systems running by day, ship digital products by night,
              and spend whatever's left giving back to the community that shaped me.
            </motion.p>

            <motion.div {...heroItem(1.1)} className="flex flex-col gap-8">
              <span className="font-sans text-9 uppercase tracking-widest opacity-20">Currently</span>
              <div className="flex flex-col gap-4">
                <span className="font-sans text-9 uppercase tracking-widest opacity-40">IT Infrastructure Engineer · Maxwell Ship Management</span>
                <span className="font-sans text-9 uppercase tracking-widest opacity-40">Geek · GeeksHacking</span>
                <span className="font-sans text-9 uppercase tracking-widest opacity-40">B.Sc. Computer Science · University of Wollongong</span>
              </div>
            </motion.div>

            <motion.div {...heroItem(1.3)} className="flex gap-24">
              {LINKS.map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  onMouseEnter={playTick}
                  onClick={playClick}
                  className="font-sans text-9 uppercase tracking-widest opacity-25 hover:opacity-70 transition-opacity duration-200">
                  {label} ↗
                </a>
              ))}
            </motion.div>
          </div>
        </div>

      </section>

      {/* ── 2. Stats ─────────────────────────────────────────── */}
      <section className="border-t border-black/10 dark:border-white/10 border-b border-b-black/10 dark:border-b-white/10 px-16 lg:px-24 py-24 grid grid-cols-2 lg:grid-cols-4 gap-y-20">
        {STATS.map((s, i) => (
          <motion.div key={s.label} {...fadeUp(i * 0.07)}
            onMouseEnter={playTick}
            className="flex flex-col gap-6 cursor-default">
            <span className="font-serif text-[clamp(36px,4vw,60px)] leading-none tabular-nums">{s.value}</span>
            <span className="font-sans text-9 uppercase tracking-widest opacity-30">{s.label}</span>
          </motion.div>
        ))}
      </section>

      {/* ── 3. Pull quote ────────────────────────────────────── */}
      <section className="border-t border-black/10 dark:border-white/10 px-16 lg:px-24 py-[14vh]">
        <AnimatedText
          as="blockquote"
          className="font-serif text-[clamp(28px,4.5vw,68px)] uppercase leading-[0.9] tracking-tight max-w-[20ch]"
        >
          I build for people, not portfolios.
        </AnimatedText>
      </section>

      {/* ── 4. Craft & Stack ─────────────────────────────────── */}
      <section className="border-t border-black/10 dark:border-white/10 px-16 lg:px-24 py-[10vh] grid grid-cols-12 gap-x-6 items-start">

        {/* Left — sticky heading */}
        <motion.div {...fadeUp()} className="col-start-1 col-end-4 sticky top-40 flex flex-col gap-10">
          <span className="font-sans text-9 uppercase tracking-widest opacity-25">— Craft & Stack</span>
          <h2 className="font-serif text-[clamp(24px,2.8vw,44px)] uppercase leading-[0.9]">
            Tools I<br />work with.
          </h2>
        </motion.div>

        {/* Right — skill rows */}
        <div className="col-start-5 col-end-13 flex flex-col">
          {STACK_GROUPS.map((group, gi) => (
            <motion.div
              key={group.area}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: gi * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className={`border-t py-20 flex flex-col gap-10 ${group.accent ? "border-black/20 mt-16" : "border-black/10 dark:border-white/10"}`}
            >
              <span className={`font-sans text-9 uppercase tracking-widest ${group.accent ? "opacity-50" : "opacity-30"}`}>
                {group.area}
              </span>
              <div className="flex flex-wrap gap-x-20 gap-y-6">
                {group.skills.map((skill) => (
                  <span key={skill}
                    onMouseEnter={playTick}
                    className={`font-serif uppercase leading-none cursor-default ${group.accent ? "text-20 lg:text-26" : "text-16 lg:text-20 opacity-80"}`}>
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </section>

      {/* ── 5. Events & Community ────────────────────────────── */}
      <section className="py-[6vh]">
        <motion.span {...fadeUp()} className="font-sans text-9 uppercase tracking-widest opacity-25 block px-16 lg:px-24 mb-[8vh]">
          — Events & Community
        </motion.span>

        {/* Hackomania — wide image left, copy right */}
        <div className="grid grid-cols-12 gap-x-6 px-16 lg:px-24 items-start mb-6">
          <ParallaxMedia className="col-start-1 col-end-8 overflow-hidden" distance={80}>
            <Media item={{ type: "image", src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=900&fit=crop&q=80", aspect: "aspect-[4/3]" }} />
          </ParallaxMedia>
          <motion.div {...fadeUp(0.12)} className="col-start-8 col-end-13 flex flex-col gap-14 pt-[10vh] pl-16 lg:pl-24">
            <span className="font-sans text-9 uppercase tracking-widest opacity-25 tabular-nums">2026</span>
            <h2 className="font-serif text-[clamp(28px,3.5vw,52px)] uppercase leading-[0.88]">
              Hackomania<br />2026
            </h2>
            <span className="font-sans text-9 uppercase tracking-widest opacity-25">Organised · 300+ participants</span>
            <p className="font-sans text-11 leading-relaxed opacity-45 max-w-[28ch] mt-4">
              Singapore's largest community hackathon. I ran it end-to-end — logistics,
              judging, sponsors — while 300 builders stayed up 24 hours straight.
            </p>
            <div className="flex gap-20 mt-4">
              <div className="flex flex-col gap-4" onMouseEnter={playTick}>
                <span className="font-serif text-24 leading-none">60+</span>
                <span className="font-sans text-8 uppercase tracking-widest opacity-30">Teams</span>
              </div>
              <div className="flex flex-col gap-4" onMouseEnter={playTick}>
                <span className="font-serif text-24 leading-none">24h</span>
                <span className="font-sans text-8 uppercase tracking-widest opacity-30">Non-stop</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Hackomania — staggered media row */}
        <div className="grid grid-cols-12 gap-x-6 px-16 lg:px-24 mb-[14vh]">
          <ParallaxMedia className="col-start-2 col-end-6 overflow-hidden mt-[-4vh]" distance={50}>
            <Media item={{ type: "image", src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=1000&fit=crop&q=80", aspect: "aspect-[3/4]" }} />
          </ParallaxMedia>
          <ParallaxMedia className="col-start-6 col-end-10 overflow-hidden mt-[5vh]" distance={30}>
            <Media item={{ type: "video", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", aspect: "aspect-[4/3]" }} />
          </ParallaxMedia>
          <ParallaxMedia className="col-start-10 col-end-13 overflow-hidden mt-[14vh]" distance={60}>
            <Media item={{ type: "image", src: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=800&fit=crop&q=80", aspect: "aspect-[3/4]" }} />
          </ParallaxMedia>
        </div>

        {/* Community pull quote */}
        <div className="border-t border-black/10 dark:border-white/10 px-16 lg:px-24 py-[12vh]">
          <div className="grid grid-cols-12">
            <motion.p {...fadeUp()} className="col-start-1 col-end-9 lg:col-start-2 lg:col-end-9 font-sans text-12 leading-relaxed opacity-40">
              Community is the work. Every hackathon I've organised has taught me more
              about shipping under pressure, leading through chaos, and what it takes to
              get a room of strangers to build something worth showing — than any job
              title ever could.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── 6. Achievements ──────────────────────────────────── */}
      <section className="py-[10vh]">
        <motion.span {...fadeUp()} className="font-sans text-9 uppercase tracking-widest opacity-25 block px-16 lg:px-24 mb-[8vh]">
          — Recognition
        </motion.span>

        <div className="grid grid-cols-12 gap-x-6 px-16 lg:px-24 items-start mb-[14vh]">
          <motion.div {...fadeUp()} className="col-start-1 col-end-7 flex flex-col gap-12 pt-[2vh]">
            <span className="font-sans text-9 uppercase tracking-widest opacity-25 tabular-nums">2024</span>
            <h2 className="font-serif text-[clamp(32px,4.5vw,72px)] uppercase leading-[0.88]">
              Hackathon<br />Name —<br />1st Place
            </h2>
            <p className="font-sans text-11 leading-relaxed opacity-45 max-w-[32ch] mt-8">
              What you built, who you built it with, and why it won.
              The problem, the solution, the moment you knew it landed.
            </p>
          </motion.div>
          <div className="col-start-7 col-end-13 flex flex-col gap-6">
            <ParallaxMedia className="overflow-hidden" distance={50}>
              <Media item={{ type: "image", src: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=900&h=600&fit=crop&q=80", aspect: "aspect-[3/2]" }} />
            </ParallaxMedia>
            <ParallaxMedia className="overflow-hidden w-3/4 ml-auto" distance={30}>
              <Media item={{ type: "video", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4", aspect: "aspect-[4/3]" }} />
            </ParallaxMedia>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-x-6 px-16 lg:px-24">
          <ParallaxMedia className="col-start-1 col-end-9 overflow-hidden" distance={70}>
            <Media item={{ type: "image", src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1400&h=900&fit=crop&q=80", aspect: "aspect-[3/2]" }} />
          </ParallaxMedia>
          <motion.div {...fadeUp(0.1)} className="col-start-9 col-end-13 flex flex-col gap-8 pt-[8vh] pl-16 lg:pl-24">
            <span className="font-sans text-9 uppercase tracking-widest opacity-25 tabular-nums">2023</span>
            <h2 className="font-serif text-[clamp(20px,2.5vw,36px)] uppercase leading-[0.9]">
              Hackathon<br />Name —<br />Finalist
            </h2>
            <p className="font-sans text-10 leading-relaxed opacity-45 max-w-[22ch] mt-4">
              Short description of what you built and the outcome.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 7. Closing ───────────────────────────────────────── */}
      <section className="border-t border-black/10 dark:border-white/10 px-16 lg:px-24 py-[12vh] flex flex-col lg:flex-row lg:justify-between lg:items-end gap-32">
        <AnimatedText
          as="p"
          className="font-serif text-[clamp(36px,5vw,80px)] uppercase leading-[0.88] tracking-tight max-w-[18ch]"
        >
          Always building. Always learning.
        </AnimatedText>
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 } as object}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2, ease: [0.16,1,0.3,1] }}
          className="flex flex-col gap-12 lg:items-end"
        >
          <span className="font-sans text-9 uppercase tracking-widest opacity-25">Singapore · Open to opportunities</span>
          <div className="flex gap-20">
            {LINKS.map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                onMouseEnter={playTick}
                onClick={playClick}
                className="font-sans text-9 uppercase tracking-widest opacity-25 hover:opacity-70 transition-opacity duration-200">
                {label} ↗
              </a>
            ))}
          </div>
        </motion.div>
      </section>

    </div>
  );
}
