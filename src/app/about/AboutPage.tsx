"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ParallaxMedia, AnimatedText } from "@/ui/components";

// Lazy-load Three.js — defers the heavy WebGL bundle until after the page shell renders
const SeaCanvas = dynamic(
  () => import("@/ui/components/sea/SeaCanvas").then((m) => ({ default: m.SeaCanvas })),
  { ssr: false, loading: () => <div className="absolute inset-0" /> }
);
import { playTick, playClick } from "@/lib/audio";
import { useTheme } from "@/lib/theme";
import type { AboutData, AboutEvent, Achievement } from "@/types/about";

/* ─── animation helpers ─────────────────────────────────── */
const EASE = [0.16, 1, 0.3, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 } as object,
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.72, delay, ease: EASE },
});

/* ─── media helper ───────────────────────────────────────── */
type MediaItem =
  | { type: "image"; src: string; aspect?: string }
  | { type: "video"; src: string; aspect?: string };

function Media({ item }: { item: MediaItem }) {
  const cls = `w-full ${item.aspect ?? "aspect-[4/3]"} object-cover`;
  if (item.type === "video") {
    return (
      <video src={item.src} autoPlay loop muted playsInline className={cls} />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={item.src} alt="" className={cls} />;
}

/* ─── fallback data ──────────────────────────────────────── */
const FALLBACK_BIO =
  "IT infrastructure engineer and builder based in Singapore. I keep global systems running by day, ship digital products by night, and spend whatever's left giving back to the community that shaped me.";

const FALLBACK_ROLES = [
  "IT Infrastructure Engineer · Maxwell Ship Management",
  "Geek · GeeksHacking",
  "B.Sc. Computer Science · University of Wollongong",
];

const FALLBACK_STATS = [
  { value: "3+", label: "Years in industry" },
  { value: "300+", label: "Hackathon participants" },
  { value: "24", label: "Hours non-stop" },
  { value: "2", label: "Hackathons organised" },
];

const FALLBACK_STACK_GROUPS = [
  { area: "Infrastructure", skills: ["Microsoft 365", "SharePoint", "Exchange", "Synology NAS", "Starlink", "IT Security"], accent: false },
  { area: "Development", skills: ["Full-Stack", "Shell Scripting", "Next.js", "React", "TypeScript", "UI / UX"], accent: false },
  { area: "Domains", skills: ["Cloud Systems", "Cybersecurity", "Big Data", "Community Building", "Project Management"], accent: false },
  { area: "Currently learning", skills: ["Three.js", "WebGL", "GSAP", "3D on the web"], accent: true },
];

const FALLBACK_PULL_QUOTE = "I build for people, not portfolios.";

const FALLBACK_COMMUNITY_QUOTE =
  "Community is the work. Every hackathon I've organised has taught me more about shipping under pressure, leading through chaos, and what it takes to get a room of strangers to build something worth showing — than any job title ever could.";

const FALLBACK_CLOSING = "Always building. Always learning.";

// Placeholder media used when Sanity images haven't been uploaded yet
const PH = {
  hackHero: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=900&fit=crop&q=80",
  hackGallery0: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=1000&fit=crop&q=80",
  hackGallery1: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  hackGallery2: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=800&fit=crop&q=80",
  ach0Hero: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=900&h=600&fit=crop&q=80",
  ach0Video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
  ach1Hero: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1400&h=900&fit=crop&q=80",
};

const EMAIL = "hello@example.com";

const LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/aungps" },
  { label: "GitHub",   href: "https://github.com/APS4087" },
];

/* ── contact / scramble helpers ─────────────────────────── */
const CHARS       = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@._-";
const SCRAMBLE_MS = 38;
const RESOLVE_MS  = 58;

function randChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

function useLocalTime(timezone: string) {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-US", {
        timeZone: timezone, hour: "2-digit", minute: "2-digit",
        second: "2-digit", hour12: true,
      });
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, [timezone]);
  return time;
}

const heroItem = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: EASE },
});

/* ─── event section ──────────────────────────────────────── */
function EventSection({ event, index }: { event: AboutEvent; index: number }) {
  const heroSrc = event.heroImageUrl || (index === 0 ? PH.hackHero : null);
  const gallery0 = event.galleryImageUrls?.[0] || (index === 0 ? PH.hackGallery0 : null);
  const videoSrc = event.featuredVideoUrl || (index === 0 ? PH.hackGallery1 : null);
  const gallery2 = event.galleryImageUrls?.[1] || (index === 0 ? PH.hackGallery2 : null);
  const stats = event.stats?.length ? event.stats : (index === 0 ? [{ value: "60+", label: "Teams" }, { value: "24h", label: "Non-stop" }] : []);

  return (
    <>
      {/* Wide image left, copy right */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-x-6 px-16 lg:px-24 items-start mb-6">
        {heroSrc && (
          <ParallaxMedia className="w-full lg:col-start-1 lg:col-end-8 overflow-hidden" distance={80}>
            <Media item={{ type: "image", src: heroSrc, aspect: "aspect-[16/10] lg:aspect-[4/3]" }} />
          </ParallaxMedia>
        )}
        <motion.div
          {...fadeUp(0.12)}
          className="lg:col-start-8 lg:col-end-13 flex flex-col gap-14 pt-10 lg:pt-[10vh] lg:pl-16 xl:pl-24"
        >
          <span className="font-sans text-9 uppercase tracking-widest opacity-25 dark:opacity-40 tabular-nums">
            {event.year}
          </span>
          <h2 className="font-serif text-[clamp(28px,3.5vw,52px)] uppercase leading-[0.88]">
            {event.title}
          </h2>
          {event.role && (
            <span className="font-sans text-9 uppercase tracking-widest opacity-25 dark:opacity-40">
              {event.role}
            </span>
          )}
          {event.description && (
            <p className="font-sans text-11 leading-relaxed opacity-45 dark:opacity-60 max-w-[28ch] mt-4">
              {event.description}
            </p>
          )}
          {stats.length > 0 && (
            <div className="flex gap-20 mt-4">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col gap-4" onMouseEnter={playTick}>
                  <span className="font-serif text-24 leading-none">{s.value}</span>
                  <span className="font-sans text-8 uppercase tracking-widest opacity-30 dark:opacity-45">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Staggered gallery row */}
      {(gallery0 || videoSrc || gallery2) && (
        <div className="grid grid-cols-3 lg:grid-cols-12 gap-x-3 lg:gap-x-6 px-16 lg:px-24 mb-[8vh] lg:mb-[14vh]">
          {gallery0 && (
            <ParallaxMedia className="col-span-1 lg:col-start-2 lg:col-end-6 overflow-hidden lg:mt-[-4vh]" distance={50}>
              <Media item={{ type: "image", src: gallery0, aspect: "aspect-[3/4]" }} />
            </ParallaxMedia>
          )}
          {videoSrc && (
            <ParallaxMedia className="col-span-1 lg:col-start-6 lg:col-end-10 overflow-hidden lg:mt-[5vh]" distance={30}>
              <Media item={{ type: "video", src: videoSrc, aspect: "aspect-[4/3] lg:aspect-[4/3]" }} />
            </ParallaxMedia>
          )}
          {gallery2 && (
            <ParallaxMedia className="col-span-1 lg:col-start-10 lg:col-end-13 overflow-hidden lg:mt-[14vh]" distance={60}>
              <Media item={{ type: "image", src: gallery2, aspect: "aspect-[3/4]" }} />
            </ParallaxMedia>
          )}
        </div>
      )}
    </>
  );
}

/* ─── achievement section ────────────────────────────────── */
function AchievementSection({ achievement, index }: { achievement: Achievement; index: number }) {
  const heroSrc = achievement.heroImageUrl || (index === 0 ? PH.ach0Hero : index === 1 ? PH.ach1Hero : null);
  const videoSrc = achievement.featuredVideoUrl || (index === 0 ? PH.ach0Video : null);
  const titleWithResult = achievement.result
    ? `${achievement.title} —\n${achievement.result}`
    : achievement.title;

  if (index % 2 === 0) {
    // Primary: copy left, media right — stacked on mobile
    return (
      <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-x-6 px-16 lg:px-24 items-start mb-[8vh] lg:mb-[14vh]">
        {heroSrc && (
          <div className="w-full lg:hidden mb-8 overflow-hidden">
            <Media item={{ type: "image", src: heroSrc, aspect: "aspect-[16/10]" }} />
          </div>
        )}
        <motion.div {...fadeUp()} className="lg:col-start-1 lg:col-end-7 flex flex-col gap-12 lg:pt-[2vh]">
          <span className="font-sans text-9 uppercase tracking-widest opacity-25 dark:opacity-40 tabular-nums">
            {achievement.year}
          </span>
          <h2 className="font-serif text-[clamp(32px,4.5vw,72px)] uppercase leading-[0.88]">
            {titleWithResult.split("\n").map((line, i) => (
              <span key={i}>{line}{i < titleWithResult.split("\n").length - 1 && <br />}</span>
            ))}
          </h2>
          {achievement.description && (
            <p className="font-sans text-11 leading-relaxed opacity-45 dark:opacity-60 max-w-[32ch] mt-8">
              {achievement.description}
            </p>
          )}
        </motion.div>
        <div className="hidden lg:flex lg:col-start-7 lg:col-end-13 flex-col gap-6">
          {heroSrc && (
            <ParallaxMedia className="overflow-hidden" distance={50}>
              <Media item={{ type: "image", src: heroSrc, aspect: "aspect-[3/2]" }} />
            </ParallaxMedia>
          )}
          {videoSrc && (
            <ParallaxMedia className="overflow-hidden w-3/4 ml-auto" distance={30}>
              <Media item={{ type: "video", src: videoSrc, aspect: "aspect-[4/3]" }} />
            </ParallaxMedia>
          )}
        </div>
      </div>
    );
  }

  // Secondary: media left, copy right — stacked on mobile
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-x-6 px-16 lg:px-24 mb-[8vh] lg:mb-0">
      {heroSrc && (
        <ParallaxMedia className="w-full lg:col-start-1 lg:col-end-9 overflow-hidden mb-8 lg:mb-0" distance={70}>
          <Media item={{ type: "image", src: heroSrc, aspect: "aspect-[16/10] lg:aspect-[3/2]" }} />
        </ParallaxMedia>
      )}
      <motion.div {...fadeUp(0.1)} className="lg:col-start-9 lg:col-end-13 flex flex-col gap-8 lg:pt-[8vh] lg:pl-16 xl:pl-24">
        <span className="font-sans text-9 uppercase tracking-widest opacity-25 tabular-nums">
          {achievement.year}
        </span>
        <h2 className="font-serif text-[clamp(20px,2.5vw,36px)] uppercase leading-[0.9]">
          {titleWithResult.split("\n").map((line, i) => (
            <span key={i}>{line}{i < titleWithResult.split("\n").length - 1 && <br />}</span>
          ))}
        </h2>
        {achievement.description && (
          <p className="font-sans text-10 leading-relaxed opacity-45 dark:opacity-60 max-w-[22ch] mt-4">
            {achievement.description}
          </p>
        )}
      </motion.div>
    </div>
  );
}

/* ─── page ───────────────────────────────────────────────── */
export function AboutPage({ data }: { data: AboutData | null }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  /* ── contact scramble state ────────────────────────────── */
  const [displayed,  setDisplayed]  = useState<string[]>(() => EMAIL.split(""));
  const [resolved,   setResolved]   = useState(0);
  const [copied,     setCopied]     = useState(false);
  const resolvedRef  = useRef(0);
  const time = useLocalTime("Asia/Singapore");

  useEffect(() => {
    let frameId:   ReturnType<typeof setTimeout>;
    let resolveId: ReturnType<typeof setTimeout>;
    let stopped = false;
    const scramble = () => {
      if (stopped) return;
      setDisplayed(prev => prev.map((_, i) => i < resolvedRef.current ? EMAIL[i] : randChar()));
      frameId = setTimeout(scramble, SCRAMBLE_MS);
    };
    const resolveNext = () => {
      if (stopped || resolvedRef.current >= EMAIL.length) return;
      resolvedRef.current++;
      setResolved(resolvedRef.current);
      playTick();
      if (resolvedRef.current < EMAIL.length) resolveId = setTimeout(resolveNext, RESOLVE_MS);
      else clearTimeout(frameId);
    };
    // Start only when section scrolls near (300ms delay)
    const startId = setTimeout(() => { scramble(); setTimeout(resolveNext, 420); }, 300);
    return () => { stopped = true; clearTimeout(startId); clearTimeout(frameId); clearTimeout(resolveId); };
  }, []);

  const handleCopy = useCallback(async () => {
    if (copied) return;
    try { await navigator.clipboard.writeText(EMAIL); }
    catch { window.location.href = `mailto:${EMAIL}`; return; }
    playClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }, [copied]);

  const bio = data?.bio ?? FALLBACK_BIO;
  const currentRoles = data?.currentRoles ?? FALLBACK_ROLES;
  const stats = data?.stats ?? FALLBACK_STATS;
  const stackGroups = data?.stackGroups ?? FALLBACK_STACK_GROUPS;
  const pullQuote = data?.pullQuote ?? FALLBACK_PULL_QUOTE;
  const communityQuote = data?.communityQuote ?? FALLBACK_COMMUNITY_QUOTE;
  const closingTagline = data?.closingTagline ?? FALLBACK_CLOSING;

  // Use Sanity events if populated, otherwise show Hackomania placeholder
  const events: AboutEvent[] = data?.events?.length
    ? data.events
    : [{ year: "2026", title: "Hackomania 2026", role: "Organised · 300+ participants", description: "Singapore's largest community hackathon. I ran it end-to-end — logistics, judging, sponsors — while 300 builders stayed up 24 hours straight." }];

  const achievements: Achievement[] = data?.achievements?.length
    ? data.achievements
    : [
        { year: "2024", title: "Hackathon Name", result: "1st Place", description: "What you built, who you built it with, and why it won. The problem, the solution, the moment you knew it landed." },
        { year: "2023", title: "Hackathon Name", result: "Finalist", description: "Short description of what you built and the outcome." },
      ];

  return (
    <div className="overflow-x-hidden">
      {/* ── 1. Hero ──────────────────────────────────────────── */}
      <section className="relative h-screen overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
          className="absolute inset-0"
        >
          <SeaCanvas isDark={isDark} />
        </motion.div>

        <div className="relative z-10 px-16 lg:px-24 pt-56 lg:pt-72 pb-[10vh] h-full flex flex-col justify-between">
          <motion.h1
            {...heroItem(0.6)}
            className="font-serif uppercase leading-[0.85] tracking-tight"
          >
            <span className="block text-[clamp(72px,9vw,140px)]">Bill</span>
            <span className="block text-[clamp(36px,4.5vw,72px)] opacity-50">Aung Pyae Soe</span>
          </motion.h1>

          <div className="flex flex-col gap-24 max-w-full lg:max-w-[42%]">
            <motion.p
              {...heroItem(0.9)}
              className="font-sans text-12 leading-relaxed opacity-40 dark:opacity-55 max-w-[44ch]"
            >
              {bio}
            </motion.p>

            <motion.div {...heroItem(1.1)} className="flex flex-col gap-8">
              <span className="font-sans text-9 uppercase tracking-widest opacity-20 dark:opacity-35">
                Currently
              </span>
              <div className="flex flex-col gap-4">
                {currentRoles.map((role) => (
                  <span key={role} className="font-sans text-9 uppercase tracking-widest opacity-40 dark:opacity-55">
                    {role}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div {...heroItem(1.3)} className="flex gap-24">
              {LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={playTick}
                  onClick={playClick}
                  className="font-sans text-9 uppercase tracking-widest opacity-25 dark:opacity-40 hover:opacity-70 transition-opacity duration-200"
                >
                  {label} ↗
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. Stats ─────────────────────────────────────────── */}
      <section className="border-t border-black/10 dark:border-white/10 border-b border-b-black/10 dark:border-b-white/10 px-16 lg:px-24 py-24 grid grid-cols-2 lg:grid-cols-4 gap-y-20">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            {...fadeUp(i * 0.07)}
            onMouseEnter={playTick}
            className="flex flex-col gap-6 "
          >
            <span className="font-serif text-[clamp(36px,4vw,60px)] leading-none tabular-nums">
              {s.value}
            </span>
            <span className="font-sans text-9 uppercase tracking-widest opacity-30 dark:opacity-45">
              {s.label}
            </span>
          </motion.div>
        ))}
      </section>

      {/* ── 3. Pull quote ────────────────────────────────────── */}
      <section className="border-t border-black/10 dark:border-white/10 px-16 lg:px-24 py-[14vh]">
        <AnimatedText
          as="blockquote"
          className="font-serif text-[clamp(28px,4.5vw,68px)] uppercase leading-[0.9] tracking-tight max-w-[20ch]"
        >
          {pullQuote}
        </AnimatedText>
      </section>

      {/* ── 4. Craft & Stack ─────────────────────────────────── */}
      <section className="border-t border-black/10 dark:border-white/10 px-16 lg:px-24 py-[8vh] lg:py-[10vh]">
        {/* Mobile header */}
        <motion.div {...fadeUp()} className="flex flex-col gap-8 mb-16 lg:hidden">
          <span className="font-sans text-9 uppercase tracking-widest opacity-25 dark:opacity-40">— Craft & Stack</span>
          <h2 className="font-serif text-[clamp(24px,6vw,44px)] uppercase leading-[0.9]">
            Tools I work with.
          </h2>
        </motion.div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-6 lg:items-start">
          {/* Desktop sticky sidebar */}
          <motion.div
            {...fadeUp()}
            className="hidden lg:flex lg:col-start-1 lg:col-end-4 sticky top-40 flex-col gap-10"
          >
            <span className="font-sans text-9 uppercase tracking-widest opacity-25">
              — Craft & Stack
            </span>
            <h2 className="font-serif text-[clamp(24px,2.8vw,44px)] uppercase leading-[0.9]">
              Tools I<br />
              work with.
            </h2>
          </motion.div>

        <div className="lg:col-start-5 lg:col-end-13 flex flex-col">
          {stackGroups.map((group, gi) => (
            <motion.div
              key={group.area}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: gi * 0.07, ease: EASE }}
              className={`border-t py-16 lg:py-20 flex flex-col gap-10 ${group.accent ? "border-black/20 mt-16" : "border-black/10 dark:border-white/10"}`}
            >
              <span className={`font-sans text-9 uppercase tracking-widest ${group.accent ? "opacity-50 dark:opacity-65" : "opacity-30 dark:opacity-45"}`}>
                {group.area}
              </span>
              <div className="flex flex-wrap gap-x-16 lg:gap-x-20 gap-y-6">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    onMouseEnter={playTick}
                    className={`font-serif uppercase leading-none ${group.accent ? "text-18 lg:text-26" : "text-14 lg:text-20 opacity-80"}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        </div>{/* end lg:grid */}
      </section>

      {/* ── 5. Events & Community ────────────────────────────── */}
      <section className="py-[6vh]">
        <motion.span
          {...fadeUp()}
          className="font-sans text-9 uppercase tracking-widest opacity-25 dark:opacity-40 block px-16 lg:px-24 mb-[8vh]"
        >
          — Events & Community
        </motion.span>

        {events.map((event, i) => (
          <EventSection key={`${event.year}-${event.title}`} event={event} index={i} />
        ))}

        {/* Community pull quote */}
        <div className="border-t border-black/10 dark:border-white/10 px-16 lg:px-24 py-[8vh] lg:py-[12vh]">
          <motion.p
            {...fadeUp()}
            className="font-sans text-12 leading-relaxed opacity-40 dark:opacity-55 max-w-[52ch]"
          >
            {communityQuote}
          </motion.p>
        </div>
      </section>

      {/* ── 6. Achievements ──────────────────────────────────── */}
      <section className="py-[10vh]">
        <motion.span
          {...fadeUp()}
          className="font-sans text-9 uppercase tracking-widest opacity-25 dark:opacity-40 block px-16 lg:px-24 mb-[8vh]"
        >
          — Recognition
        </motion.span>

        {achievements.map((achievement, i) => (
          <AchievementSection
            key={`${achievement.year}-${achievement.title}`}
            achievement={achievement}
            index={i}
          />
        ))}
      </section>

      {/* ── 7. Contact ───────────────────────────────────────── */}
      <section className="border-t border-black/10 dark:border-white/10 px-16 lg:px-24 pt-[10vh] pb-[14vh] flex flex-col gap-16">

        {/* Top row: label + availability */}
        <motion.div
          {...fadeUp()}
          className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between"
        >
          <span className="font-sans text-9 uppercase tracking-widest opacity-25 dark:opacity-40">
            — Get in touch
          </span>
          <div className="flex items-center gap-8">
            <span className="relative flex h-[6px] w-[6px] shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-30" />
              <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-current opacity-60" />
            </span>
            <span className="font-sans text-10 uppercase tracking-widest opacity-40 dark:opacity-55">
              Available for projects
            </span>
          </div>
        </motion.div>

        {/* Scrambling email */}
        <motion.button
          {...fadeUp(0.1)}
          onClick={handleCopy}
          onMouseEnter={() => !copied && playTick()}
          className="group text-left focus:outline-none"
          aria-label={`Copy email address: ${EMAIL}`}
        >
          <p
            className="font-serif uppercase leading-none tracking-tight"
            style={{ fontSize: "clamp(28px, 6.5vw, 88px)" }}
          >
            {displayed.map((char, i) => (
              <span
                key={i}
                className={`inline-block transition-opacity duration-75 ${
                  i < resolved ? "opacity-100" : "opacity-35 dark:opacity-55"
                }`}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </p>
          <div className="mt-10 h-[14px] relative">
            <span className={`absolute inset-0 font-sans text-10 uppercase tracking-widest transition-opacity duration-200 ${
              copied ? "opacity-0" : "opacity-0 group-hover:opacity-30 dark:group-hover:opacity-45"
            }`}>
              Click to copy
            </span>
            <AnimatePresence>
              {copied && (
                <motion.span
                  className="absolute inset-0 font-sans text-10 uppercase tracking-widest opacity-55"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 0.55, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.22 }}
                >
                  Copied ✓
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.button>

        {/* Bottom bar: socials + time */}
        <motion.div
          {...fadeUp(0.2)}
          className="flex flex-col gap-14 lg:flex-row lg:items-center lg:justify-between border-t border-black/8 dark:border-white/8 pt-16"
        >
          <div className="flex items-center gap-20">
            {LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={playTick}
                className="font-sans text-10 uppercase tracking-widest opacity-30 dark:opacity-45 hover:opacity-80 transition-opacity duration-200"
              >
                {label} ↗
              </a>
            ))}
          </div>
          {time && (
            <span className="font-sans text-10 uppercase tracking-widest opacity-30 dark:opacity-45 tabular-nums">
              Singapore · {time}
            </span>
          )}
        </motion.div>
      </section>
    </div>
  );
}
