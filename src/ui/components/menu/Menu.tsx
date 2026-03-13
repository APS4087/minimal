"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const Menu = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    return pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center h-40 px-16 lg:px-24 bg-white border-b border-black/10">
      <Link href="/" className="font-serif text-13 uppercase leading-none tracking-wide">
        Portfolio
      </Link>

      <nav className="flex items-center gap-20 font-sans text-10 uppercase tracking-widest">
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`transition-opacity duration-200 ${
              isActive(href) ? "opacity-100" : "opacity-30 hover:opacity-70"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
};
