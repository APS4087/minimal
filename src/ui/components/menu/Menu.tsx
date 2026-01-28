"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Signature } from "../signature/Signature";
import { NowPlaying } from "../nowPlaying/NowPlaying";

export const Menu = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    return pathname === path;
  };

  return (
    <>
      <section className="lg-max:hidden lg:fixed flex flex-col justify-between top-0 span-p-1-wider left-0 z-50 bg-white text-black span-w-4-wider text-12 leading-near h-full">
        <div className="flex flex-col gap-32">
          <Signature />
          <Link href="/">
            <h1 className="text-16 uppercase">Portfolio</h1>
          </Link>
          <p className="opacity-80">
            Managing IT infrastructure in Singapore by day, building cool stuff
            by night
          </p>
          <div className="flex gap-16 text-11">
            <a
              href="https://www.linkedin.com/in/aungps"
              target="_blank"
              rel="noopener noreferrer"
              className="uppercase opacity-80 hover:opacity-100 duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-black after:transition-all after:duration-300 hover:after:w-full"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/APS4087"
              target="_blank"
              rel="noopener noreferrer"
              className="uppercase opacity-80 hover:opacity-100 duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-black after:transition-all after:duration-300 hover:after:w-full"
            >
              GitHub
            </a>
          </div>
          <nav className="flex flex-row justify-center items-center span-w-2 text-11 gap-8 border border-black/20 p-16">
            <Link
              href="/"
              className={`uppercase ${
                isActive("/") ? "opacity-100" : "opacity-50 hover:opacity-100"
              } duration-300`}
            >
              Work
            </Link>
            <span>|</span>
            <Link
              href="/about"
              className={`uppercase ${
                isActive("/about")
                  ? "opacity-100"
                  : "opacity-50 hover:opacity-100"
              } duration-300`}
            >
              About
            </Link>
            <span>|</span>
            <Link
              href="/contact"
              className={`uppercase ${
                isActive("/contact")
                  ? "opacity-100"
                  : "opacity-50 hover:opacity-100"
              } duration-300`}
            >
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex flex-col gap-8">
          <NowPlaying />
        </div>
      </section>
      <section className="lg:hidden">
        <header className="flex justify-between items-center margin-p-1">
          <Link href="/">
            <span className="text-16 uppercase">Portfolio</span>
          </Link>
        </header>
        <nav className="flex flex-row text-black fixed margin-bottom-1 z-100 bg-white justify-center items-center span-w-6 margin-mx-1 text-11 gap-8 border border-black/20 p-16">
          <Link
            href="/"
            className={`uppercase ${
              isActive("/") ? "opacity-100" : "opacity-50 hover:opacity-100"
            } duration-300`}
          >
            Work
          </Link>
          <span>|</span>
          <Link
            href="/about"
            className={`uppercase ${
              isActive("/about")
                ? "opacity-100"
                : "opacity-50 hover:opacity-100"
            } duration-300`}
          >
            About
          </Link>
          <span>|</span>
          <Link
            href="/contact"
            className={`uppercase ${
              isActive("/contact")
                ? "opacity-100"
                : "opacity-50 hover:opacity-100"
            } duration-300`}
          >
            Contact
          </Link>
        </nav>
      </section>
    </>
  );
};
