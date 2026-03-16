import { serverClient } from "@/lib/sanity/client";
import { aboutQuery } from "@/lib/sanity/queries";
import type { AboutData } from "@/types/about";
import { AboutPage } from "./AboutPage";

export default async function About() {
  const data: AboutData | null = await serverClient
    .fetch(aboutQuery)
    .catch(() => null);

  return <AboutPage data={data} />;
}
