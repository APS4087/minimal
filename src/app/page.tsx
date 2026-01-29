import { Content } from "@/ui/components";
import { ProjectCard } from "@/ui/components/projectCard/ProjectCard";
import { client } from "@/lib/sanity/client";
import { projectsQuery } from "@/lib/sanity/queries";

interface SanityAsset {
  _ref: string;
  _type: string;
}

interface SanityMedia {
  type: "image" | "video";
  asset: SanityAsset;
}

interface SanityProjectRaw {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  media: SanityMedia;
  layout: "left" | "right" | "center" | "stacked" | "offset" | "minimal" | "hero" | "asymmetric";
  link: string;
}

async function getProjects() {
  try {
    const projects: SanityProjectRaw[] = await client.fetch(projectsQuery);
    console.log("Fetched projects:", JSON.stringify(projects, null, 2));

    // Transform projects to get asset URLs
    const transformedProjects = projects.map(project => {
      const assetId = project.media?.asset?.asset?._ref;
      let mediaUrl = "";

      if (assetId) {
        // Extract file info from asset reference (format: file-{id}-{ext})
        const [, id, ext] = assetId.match(/^file-(.+)-(\w+)$/) || [];
        if (id && ext) {
          // Construct Sanity CDN URL
          mediaUrl = `https://cdn.sanity.io/files/${client.config().projectId}/${client.config().dataset}/${id}.${ext}`;
        }
      }

      return {
        ...project,
        mediaType: project.media?.type || "image",
        mediaUrl,
      };
    });

    console.log("Transformed projects:", JSON.stringify(transformedProjects, null, 2));
    return transformedProjects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export default async function Home() {
  const projects = await getProjects();

  return (
    <Content className="flex flex-col gap-200 lg-max:gap-96 mb-96 text-12 leading-near">
      <div className="flex text-12 w-full flex-col gap-12">
        <h2>WORK</h2>
        <p className="text-12 lg:max-w-[50%] opacity-80">
          Selected projects showcasing my experience in full-stack development,
          UI/UX design, and modern web technologies.
        </p>
      </div>
      {projects.length > 0 ? (
        projects.map((project) => (
          <ProjectCard
            key={project._id}
            title={project.title}
            description={project.description}
            techStack={project.techStack}
            media={[{ type: project.mediaType, src: project.mediaUrl }]}
            layout={project.layout}
            link={project.link}
          />
        ))
      ) : (
        <div className="text-center py-48 opacity-60">
          <p className="text-12">No projects yet. Add some in the Sanity Studio!</p>
          <a
            href="/studio"
            className="text-11 uppercase underline opacity-80 hover:opacity-100 mt-12 inline-block"
          >
            Open Studio →
          </a>
        </div>
      )}
    </Content>
  );
}
