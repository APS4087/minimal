import { Content } from "@/ui/components";
import { Storytelling, Showcase } from "@/ui/components";
import placeholder from "@/assets/images/tempImg.jpg";

const testVideo = "/videos/testVId.mp4";

interface StorytellingItem {
  variant: "portrait" | "landscape";
  mediaType: "image" | "video";
  media: any;
  title: string;
  description: string | React.ReactNode;
}

const storytellingItems: StorytellingItem[] = [
  {
    variant: "portrait",
    mediaType: "image",
    media: placeholder,
    title: "Project Title",
    description: "Project description placeholder.",
  },
  {
    variant: "landscape",
    mediaType: "video",
    media: testVideo,
    title: "Project Title",
    description: "Project description placeholder.",
  },
  {
    variant: "portrait",
    mediaType: "image",
    media: placeholder,
    title: "Project Title",
    description: "Project description placeholder.",
  },
  {
    variant: "landscape",
    mediaType: "video",
    media: testVideo,
    title: "Project Title",
    description: "Project description placeholder.",
  },
];

export default function About() {
  return (
    <>
      <Content className="lg:span-gap-x-1-wider lg:gap-y-64 lg-max:gap-40 mb-64 text-12 leading-near">
        <Showcase i1={placeholder} i2={placeholder} i3={placeholder} />
        <div className="flex text-12 w-full flex-col gap-12">
          <h2>ABOUT</h2>
          <p className="text-12 lg:span-w-3 opacity-80">
            Portfolio introduction placeholder.
          </p>
        </div>
        {storytellingItems.map((item, index) => (
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
    </>
  );
}
