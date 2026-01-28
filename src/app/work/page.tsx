import { Content } from "@/ui/components";
import { Storytelling } from "@/ui/components/storytelling/Storytelling";
import placeholder from "@/assets/images/placeholder/placeholder.svg";

interface StorytellingItem {
  variant: "portrait" | "landscape";
  mediaType: "image" | "video";
  media: any;
  title: string;
  description: string | React.ReactNode;
}

const workItems: StorytellingItem[] = [
  {
    variant: "landscape",
    mediaType: "image",
    media: placeholder,
    title: "Project One",
    description: "Project description placeholder.",
  },
  {
    variant: "portrait",
    mediaType: "image",
    media: placeholder,
    title: "Project Two",
    description: "Project description placeholder.",
  },
  {
    variant: "landscape",
    mediaType: "image",
    media: placeholder,
    title: "Project Three",
    description: "Project description placeholder.",
  },
];

export default function Work() {
  return (
    <Content className="lg:span-gap-1-wider gap-40 mb-64 text-12 leading-near">
      <div className="flex text-12 w-full flex-col gap-12">
        <h2>WORK</h2>
        <p className="text-12 lg:span-w-3 opacity-80">
          Selected projects placeholder.
        </p>
      </div>
      {workItems.map((item, index) => (
        <Storytelling
          key={index}
          variant={item.variant}
          mediaType={item.mediaType}
          media={item.media}
          title={item.title}
          description={item.description}
        />
      ))}
    </Content>
  );
}
