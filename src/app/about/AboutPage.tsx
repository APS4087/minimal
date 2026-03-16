"use client";

import { motion } from "framer-motion";
import { ParallaxMedia, AnimatedText } from "@/ui/components";
import { SeaCanvas } from "@/ui/components/sea/SeaCanvas";
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

const LINKS = [
  { label: "Email", href: "mailto:hello@example.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/aungps" },
  { label: "GitHub", href: "https://github.com/APS4087" },
];

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
      <div className="grid grid-cols-12 gap-x-6 px-16 lg:px-24 items-start mb-6">
        {heroSrc && (
          <ParallaxMedia className="col-start-1 col-end-8 overflow-hidden" distance={80}>
            <Media item={{ type: "image", src: heroSrc, aspect: "aspect-[4/3]" }} />
          </ParallaxMedia>
        )}
        <motion.div
          {...fadeUp(0.12)}
          className="col-start-8 col-end-13 flex flex-col gap-14 pt-[10vh] pl-16 lg:pl-24"
        >
          <span className="font-sans text-9 uppercase tracking-widest opacity-25 tabular-nums">
            {event.year}
          </span>
          <h2 className="font-serif text-[clamp(28px,3.5vw,52px)] uppercase leading-[0.88]">
            {event.title}
          </h2>
          {event.role && (
            <span className="font-sans text-9 uppercase tracking-widest opacity-25">
              {event.role}
            </span>
          )}
          {event.description && (
            <p className="font-sans text-11 leading-relaxed opacity-45 max-w-[28ch] mt-4">
              {event.description}
            </p>
          )}
          {stats.length > 0 && (
            <div className="flex gap-20 mt-4">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col gap-4" onMouseEnter={playTick}>
                  <span className="font-serif text-24 leading-none">{s.value}</span>
                  <span className="font-sans text-8 uppercase tracking-widest opacity-30">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Staggered gallery row */}
      {(gallery0 || videoSrc || gallery2) && (
        <div className="grid grid-cols-12 gap-x-6 px-16 lg:px-24 mb-[14vh]">
          {gallery0 && (
            <ParallaxMedia className="col-start-2 col-end-6 overflow-hidden mt-[-4vh]" distance={50}>
              <Media item={{ type: "image", src: gallery0, aspect: "aspect-[3/4]" }} />
            </ParallaxMedia>
          )}
          {videoSrc && (
            <ParallaxMedia className="col-start-6 col-end-10 overflow-hidden mt-[5vh]" distance={30}>
              <Media item={{ type: "video", src: videoSrc, aspect: "aspect-[4/3]" }} />
            </ParallaxMedia>
          )}
          {gallery2 && (
            <ParallaxMedia className="col-start-10 col-end-13 overflow-hidden mt-[14vh]" distance={60}>
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
    // Primary: copy left, media right
    return (
      <div className="grid grid-cols-12 gap-x-6 px-16 lg:px-24 items-start mb-[14vh]">
        <motion.div {...fadeUp()} className="col-start-1 col-end-7 flex flex-col gap-12 pt-[2vh]">
          <span className="font-sans text-9 uppercase tracking-widest opacity-25 tabular-nums">
            {achievement.year}
          </span>
          <h2 className="font-serif text-[clamp(32px,4.5vw,72px)] uppercase leading-[0.88]">
            {titleWithResult.split("\n").map((line, i) => (
              <span key={i}>{line}{i < titleWithResult.split("\n").length - 1 && <br />}</span>
            ))}
          </h2>
          {achievement.description && (
            <p className="font-sans text-11 leading-relaxed opacity-45 max-w-[32ch] mt-8">
              {achievement.description}
            </p>
          )}
        </motion.div>
        <div className="col-start-7 col-end-13 flex flex-col gap-6">
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

  // Secondary: media left, copy right
  return (
    <div className="grid grid-cols-12 gap-x-6 px-16 lg:px-24">
      {heroSrc && (
        <ParallaxMedia className="col-start-1 col-end-9 overflow-hidden" distance={70}>
          <Media item={{ type: "image", src: heroSrc, aspect: "aspect-[3/2]" }} />
        </ParallaxMedia>
      )}
      <motion.div {...fadeUp(0.1)} className="col-start-9 col-end-13 flex flex-col gap-8 pt-[8vh] pl-16 lg:pl-24">
        <span className="font-sans text-9 uppercase tracking-widest opacity-25 tabular-nums">
          {achievement.year}
        </span>
        <h2 className="font-serif text-[clamp(20px,2.5vw,36px)] uppercase leading-[0.9]">
          {titleWithResult.split("\n").map((line, i) => (
            <span key={i}>{line}{i < titleWithResult.split("\n").length - 1 && <br />}</span>
          ))}
        </h2>
        {achievement.description && (
          <p className="font-sans text-10 leading-relaxed opacity-45 max-w-[22ch] mt-4">
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

          <div className="flex flex-col gap-24 max-w-[42%]">
            <motion.p
              {...heroItem(0.9)}
              className="font-sans text-12 leading-relaxed opacity-40 max-w-[44ch]"
            >
              {bio}
            </motion.p>

            <motion.div {...heroItem(1.1)} className="flex flex-col gap-8">
              <span className="font-sans text-9 uppercase tracking-widest opacity-20">
                Currently
              </span>
              <div className="flex flex-col gap-4">
                {currentRoles.map((role) => (
                  <span key={role} className="font-sans text-9 uppercase tracking-widest opacity-40">
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
                  className="font-sans text-9 uppercase tracking-widest opacity-25 hover:opacity-70 transition-opacity duration-200"
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
            className="flex flex-col gap-6 cursor-default"
          >
            <span className="font-serif text-[clamp(36px,4vw,60px)] leading-none tabular-nums">
              {s.value}
            </span>
            <span className="font-sans text-9 uppercase tracking-widest opacity-30">
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
      <section className="border-t border-black/10 dark:border-white/10 px-16 lg:px-24 py-[10vh] grid grid-cols-12 gap-x-6 items-start">
        <motion.div
          {...fadeUp()}
          className="col-start-1 col-end-4 sticky top-40 flex flex-col gap-10"
        >
          <span className="font-sans text-9 uppercase tracking-widest opacity-25">
            — Craft & Stack
          </span>
          <h2 className="font-serif text-[clamp(24px,2.8vw,44px)] uppercase leading-[0.9]">
            Tools I<br />
            work with.
          </h2>
        </motion.div>

        <div className="col-start-5 col-end-13 flex flex-col">
          {stackGroups.map((group, gi) => (
            <motion.div
              key={group.area}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: gi * 0.07, ease: EASE }}
              className={`border-t py-20 flex flex-col gap-10 ${group.accent ? "border-black/20 mt-16" : "border-black/10 dark:border-white/10"}`}
            >
              <span className={`font-sans text-9 uppercase tracking-widest ${group.accent ? "opacity-50" : "opacity-30"}`}>
                {group.area}
              </span>
              <div className="flex flex-wrap gap-x-20 gap-y-6">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    onMouseEnter={playTick}
                    className={`font-serif uppercase leading-none cursor-default ${group.accent ? "text-20 lg:text-26" : "text-16 lg:text-20 opacity-80"}`}
                  >
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
        <motion.span
          {...fadeUp()}
          className="font-sans text-9 uppercase tracking-widest opacity-25 block px-16 lg:px-24 mb-[8vh]"
        >
          — Events & Community
        </motion.span>

        {events.map((event, i) => (
          <EventSection key={`${event.year}-${event.title}`} event={event} index={i} />
        ))}

        {/* Community pull quote */}
        <div className="border-t border-black/10 dark:border-white/10 px-16 lg:px-24 py-[12vh] grid grid-cols-12">
          <motion.p
            {...fadeUp()}
            className="col-start-1 col-end-9 lg:col-start-2 lg:col-end-9 font-sans text-12 leading-relaxed opacity-40"
          >
            {communityQuote}
          </motion.p>
        </div>
      </section>

      {/* ── 6. Achievements ──────────────────────────────────── */}
      <section className="py-[10vh]">
        <motion.span
          {...fadeUp()}
          className="font-sans text-9 uppercase tracking-widest opacity-25 block px-16 lg:px-24 mb-[8vh]"
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

      {/* ── 7. Closing ───────────────────────────────────────── */}
      <section className="border-t border-black/10 dark:border-white/10 px-16 lg:px-24 py-[12vh] flex flex-col lg:flex-row lg:justify-between lg:items-end gap-32">
        <AnimatedText
          as="p"
          className="font-serif text-[clamp(36px,5vw,80px)] uppercase leading-[0.88] tracking-tight max-w-[18ch]"
        >
          {closingTagline}
        </AnimatedText>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 } as object}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="flex flex-col gap-12 lg:items-end"
        >
          <span className="font-sans text-9 uppercase tracking-widest opacity-25">
            Singapore · Open to opportunities
          </span>
          <div className="flex gap-20">
            {LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={playTick}
                onClick={playClick}
                className="font-sans text-9 uppercase tracking-widest opacity-25 hover:opacity-70 transition-opacity duration-200"
              >
                {label} ↗
              </a>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
