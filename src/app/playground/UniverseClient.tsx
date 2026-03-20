"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import type { CommitData } from "./GithubUniverse";

const GithubUniverse = dynamic(
  () => import("./GithubUniverse").then(m => ({ default: m.GithubUniverse })),
  {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-[#0a0a0a]" />,
  }
);

export function UniverseClient({ commits }: { commits: CommitData[] }) {
  // Force dark mode while on the playground so the menu and entire UI
  // feel like part of the space — restored when navigating away
  useEffect(() => {
    const html = document.documentElement;
    const hadDark = html.classList.contains("dark");
    html.classList.add("dark");
    return () => {
      if (!hadDark) html.classList.remove("dark");
    };
  }, []);

  return <GithubUniverse commits={commits} />;
}
