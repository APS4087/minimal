"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/theme";
import { RollingText } from "@/ui/components/rollingText/RollingText";

const NAV_LINKS = [
  { href: "/", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/playground", label: "Playground" },
];

export const Menu = () => {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    return pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center h-40 px-16 lg:px-24 bg-white dark:bg-[#0a0a0a] border-b border-black/10 dark:border-white/10 transition-colors duration-300">
      <Link href="/" className="font-serif text-13 uppercase leading-none tracking-wide">
        Portfolio
      </Link>

      <nav className="flex items-center gap-20 font-sans text-10 uppercase tracking-widest">
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`transition-opacity duration-200 ${
              isActive(href) ? "opacity-100" : "opacity-30 dark:opacity-50 hover:opacity-70"
            }`}
          >
            <RollingText>{label}</RollingText>
          </Link>
        ))}
        <button
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            toggle(rect.left + rect.width / 2, rect.top + rect.height / 2);
          }}
          aria-label="Toggle theme"
          className="opacity-30 dark:opacity-50 hover:opacity-70 transition-opacity duration-200"
        >
          {theme === "light" ? "○" : "●"}
        </button>
      </nav>
    </header>
  );
};
