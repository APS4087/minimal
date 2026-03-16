import { ProjectsView, Content } from "@/ui/components";
import { serverClient } from "@/lib/sanity/client";
import { projectsQuery } from "@/lib/sanity/queries";
import type { Project } from "@/types/project";

type RawProject = {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  layout: string;
  link: string;
  order?: number;
  mediaType?: string;
  mediaUrl?: string;
  gallery?: { mediaType: string; url: string | null }[];
};

const DUMMY_PROJECTS: Project[] = [
  {
    _id: "d1",
    title: "Solène",
    description: "Identity and campaign direction for a Paris-based fragrance house.",
    techStack: ["Art Direction", "Print", "Web"],
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&h=1400&fit=crop&q=85",
    gallery: [
      { mediaType: "image", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&h=1400&fit=crop&q=85" },
      { mediaType: "image", url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&h=1400&fit=crop&q=85" },
      { mediaType: "image", url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&h=1400&fit=crop&q=85" },
      { mediaType: "image", url: "https://images.unsplash.com/photo-1558171813-2b1b7e9e6e6a?w=1000&h=1400&fit=crop&q=85" },
    ],
    layout: "hero",
    link: "#",
  },
  {
    _id: "d2",
    title: "Atelier Nord",
    description: "E-commerce redesign for a Scandinavian furniture atelier.",
    techStack: ["Next.js", "Three.js", "Shopify"],
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000&h=1400&fit=crop&q=85",
    gallery: [
      { mediaType: "image", url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000&h=1400&fit=crop&q=85" },
      { mediaType: "image", url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd3?w=1000&h=1400&fit=crop&q=85" },
      { mediaType: "image", url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1000&h=1400&fit=crop&q=85" },
    ],
    layout: "minimal",
    link: "#",
  },
  {
    _id: "d3",
    title: "Cendre Studio",
    description: "Brand identity and motion language for an independent architecture practice.",
    techStack: ["Branding", "Motion", "TypeScript"],
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1000&h=1400&fit=crop&q=85",
    gallery: [
      { mediaType: "image", url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1000&h=1400&fit=crop&q=85" },
      { mediaType: "image", url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00d?w=1000&h=1400&fit=crop&q=85" },
      { mediaType: "image", url: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1000&h=1400&fit=crop&q=85" },
      { mediaType: "image", url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1000&h=1400&fit=crop&q=85" },
    ],
    layout: "asymmetric",
    link: "#",
  },
  {
    _id: "d4",
    title: "Maren",
    description: "Campaign site for a sustainable fashion label. Grain and editorial pacing.",
    techStack: ["React", "GSAP", "WebGL"],
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1000&h=1400&fit=crop&q=85",
    gallery: [
      { mediaType: "image", url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1000&h=1400&fit=crop&q=85" },
      { mediaType: "image", url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1000&h=1400&fit=crop&q=85" },
      { mediaType: "image", url: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1000&h=1400&fit=crop&q=85" },
    ],
    layout: "stacked",
    link: "#",
  },
  {
    _id: "d5",
    title: "Vaulted",
    description: "Digital archive and discovery platform for independent film.",
    techStack: ["Next.js", "Framer Motion", "Postgres"],
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1000&h=1400&fit=crop&q=85",
    gallery: [
      { mediaType: "image", url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1000&h=1400&fit=crop&q=85" },
      { mediaType: "image", url: "https://images.unsplash.com/photo-1478720568477-152d9b92b15b?w=1000&h=1400&fit=crop&q=85" },
      { mediaType: "image", url: "https://images.unsplash.com/photo-1440404347445-d9e7f3e0dca3?w=1000&h=1400&fit=crop&q=85" },
    ],
    layout: "offset",
    link: "#",
  },
  {
    _id: "d6",
    title: "Kōen",
    description: "Restaurant concept identity and digital presence. Type-led, grounded in Japanese craft.",
    techStack: ["Branding", "Web", "Print"],
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1000&h=1400&fit=crop&q=85",
    gallery: [
      { mediaType: "image", url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1000&h=1400&fit=crop&q=85" },
      { mediaType: "image", url: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1000&h=1400&fit=crop&q=85" },
      { mediaType: "image", url: "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=1000&h=1400&fit=crop&q=85" },
      { mediaType: "image", url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1000&h=1400&fit=crop&q=85" },
    ],
    layout: "center",
    link: "#",
  },
  {
    _id: "d7",
    title: "Orda",
    description: "SaaS dashboard for climate data analytics. Dense information design.",
    techStack: ["React", "D3.js", "Tailwind"],
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&h=1400&fit=crop&q=85",
    gallery: [
      { mediaType: "image", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&h=1400&fit=crop&q=85" },
      { mediaType: "image", url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1000&h=1400&fit=crop&q=85" },
      { mediaType: "image", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&h=1400&fit=crop&q=85" },
    ],
    layout: "minimal",
    link: "#",
  },
  {
    _id: "d8",
    title: "Reverie",
    description: "Generative art installation for a contemporary gallery.",
    techStack: ["WebGL", "GLSL", "p5.js"],
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1000&h=1400&fit=crop&q=85",
    gallery: [
      { mediaType: "image", url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1000&h=1400&fit=crop&q=85" },
      { mediaType: "image", url: "https://images.unsplash.com/photo-1558865869-c93f6f8482af?w=1000&h=1400&fit=crop&q=85" },
      { mediaType: "image", url: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=1000&h=1400&fit=crop&q=85" },
    ],
    layout: "hero",
    link: "#",
  },
];

async function getProjects(): Promise<Project[]> {
  try {
    const raw: RawProject[] = await serverClient.fetch(projectsQuery);

    if (!raw?.length) return DUMMY_PROJECTS;

    return raw.map((p) => {
      const gallery = (p.gallery ?? [])
        .filter((g) => g.url)
        .map((g) => ({ mediaType: (g.mediaType || "image") as "image" | "video", url: g.url! }));

      return {
        _id: p._id,
        title: p.title,
        description: p.description,
        techStack: p.techStack,
        mediaType: p.mediaType || "image",
        mediaUrl: p.mediaUrl || "",
        gallery: gallery.length
          ? gallery
          : p.mediaUrl
          ? [{ mediaType: (p.mediaType || "image") as "image" | "video", url: p.mediaUrl }]
          : [],
        layout: p.layout,
        link: p.link,
      };
    });
  } catch {
    return DUMMY_PROJECTS;
  }
}

export default async function Home() {
  const projects = await getProjects();

  return projects.length > 0 ? (
    <ProjectsView projects={projects} />
  ) : (
    <Content className="flex flex-col py-48">
      <div className="opacity-40">
        <p className="font-sans text-12">No projects yet.</p>
        <a
          href="/studio"
          className="font-sans text-11 uppercase opacity-60 hover:opacity-100 mt-12 inline-block"
        >
          Open Studio →
        </a>
      </div>
    </Content>
  );
}
