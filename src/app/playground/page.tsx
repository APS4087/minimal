import type { CommitData } from "./GithubUniverse";
import { UniverseClient } from "./UniverseClient";

export const revalidate = 3600;

const GITHUB_USER = "APS4087";

async function getAllCommits(): Promise<CommitData[]> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    ...(process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {}),
  };
  const opts = { next: { revalidate: 3600 }, headers };

  // 1. Fetch owned repos
  const reposRes = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&type=owner`,
    opts
  );
  if (!reposRes.ok) return [];
  const repos: { name: string; fork: boolean }[] = await reposRes.json();
  const ownRepos = repos.filter(r => !r.fork);

  // 2. Fetch up to 100 recent commits per repo in parallel
  const commitArrays = await Promise.all(
    ownRepos.map(async repo => {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${GITHUB_USER}/${repo.name}/commits?per_page=100`,
          opts
        );
        if (!res.ok) return [];
        const data = await res.json();
        if (!Array.isArray(data)) return [];
        return data.map(c => ({
          sha:      c.sha.slice(0, 7) as string,
          message:  (c.commit.message as string).split("\n")[0].trim(),
          date:     c.commit.author.date as string,
          repoName: repo.name,
        })) satisfies CommitData[];
      } catch {
        return [] as CommitData[];
      }
    })
  );

  // 3. Flatten, dedupe merges, sort oldest → newest
  return commitArrays
    .flat()
    .filter(c => c.message.length > 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export default async function PlaygroundPage() {
  const commits = await getAllCommits();

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] overflow-hidden">
      <UniverseClient commits={commits} />

      {/* ── Bottom-left legend ─────────────────────────── */}
      <div className="absolute bottom-0 left-0 px-16 lg:px-24 pb-16 pointer-events-none z-10 flex flex-col gap-10">
        <div className="flex flex-col gap-6">
          <span className="font-serif text-16 uppercase text-white leading-none tracking-tight">
            Github Universe
          </span>
          <span className="font-sans text-10 uppercase tracking-widest text-white/75 leading-relaxed">
            Every commit I&apos;ve made, mapped across space and time.
          </span>
        </div>
        <div className="flex flex-col gap-5 border-l border-white/20 pl-10">
          <span className="font-sans text-9 uppercase tracking-widest text-white/55">
            Centre → edge · oldest to newest
          </span>
          <span className="font-sans text-9 uppercase tracking-widest text-white/55">
            Brighter · more recent
          </span>
          <span className="font-sans text-9 uppercase tracking-widest text-white/40">
            {commits.length.toLocaleString()} commits across {Math.floor(commits.length / 50)}+ repositories
          </span>
        </div>
      </div>
    </div>
  );
}
