"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
          <Link href="/">
            <h1 className="text-16 uppercase">Portfolio</h1>
          </Link>
          <p className="opacity-80">
            {/* Add your tagline or brief intro here */}
          </p>
          <nav className="flex flex-row justify-center items-center span-w-2 text-11 gap-8 border border-black/20 p-16">
            <Link
              href="/"
              className={`uppercase ${
                isActive("/") ? "opacity-100" : "opacity-50 hover:opacity-100"
              } duration-300`}
            >
              About
            </Link>
            <span>|</span>
            <Link
              href="/work"
              className={`uppercase ${
                isActive("/work")
                  ? "opacity-100"
                  : "opacity-50 hover:opacity-100"
              } duration-300`}
            >
              Work
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
          <p className="opacity-80">
            {/* Add your location or social links here */}
          </p>
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
            About
          </Link>
          <span>|</span>
          <Link
            href="/work"
            className={`uppercase ${
              isActive("/work") ? "opacity-100" : "opacity-50 hover:opacity-100"
            } duration-300`}
          >
            Work
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
