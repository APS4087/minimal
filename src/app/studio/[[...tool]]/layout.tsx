"use client";

import { useEffect } from "react";

// Suppress Sanity Studio 3.99.x internal React key warning in dev mode only.
function SuppressSanityKeyWarning() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const original = console.error.bind(console);
    console.error = (...args: unknown[]) => {
      const msg = typeof args[0] === "string" ? args[0] : "";
      if (msg.includes('unique "key" prop')) return;
      original(...args);
    };
    return () => { console.error = original; };
  }, []);
  return null;
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Reset everything the root layout adds so the Studio can manage its
    // own scroll, height, and z-index stack without interference.
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      <SuppressSanityKeyWarning />
      {children}
    </div>
  );
}
