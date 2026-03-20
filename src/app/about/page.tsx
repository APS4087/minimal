import { client } from "@/lib/sanity/client";
import { aboutQuery } from "@/lib/sanity/queries";
import type { AboutData } from "@/types/about";
import { AboutPage } from "./AboutPage";

// Cache the page at build time, revalidate in the background every hour (ISR)
export const revalidate = 3600;

export default async function About() {
  const data: AboutData | null = await client
    .fetch(aboutQuery, {}, { next: { revalidate: 3600 } })
    .catch(() => null);

  return <AboutPage data={data} />;
}
