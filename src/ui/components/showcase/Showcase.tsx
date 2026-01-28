"use client";

import Image, { StaticImageData } from "next/image";
import { useState } from "react";

interface ShowcaseProps {
  i1: string | StaticImageData;
  i2: StaticImageData;
  i3: StaticImageData;
  i1Type?: "video" | "image";
}

export const Showcase = ({ i1, i2, i3, i1Type = "image" }: ShowcaseProps) => {
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [image2Loaded, setImage2Loaded] = useState(false);
  const [image3Loaded, setImage3Loaded] = useState(false);

  return (
    <section className="flex w-full flex-wrap gutter-gap-1">
      {i1Type === "video" ? (
        <video
          autoPlay
          loop
          muted
          className={`lg:span-w-4 object-cover aspect-square transition-opacity duration-500 ${
            mediaLoaded ? "opacity-100" : "opacity-0"
          }`}
          src={i1 as string}
          onLoadedData={() => setMediaLoaded(true)}
        />
      ) : (
        <Image
          className={`lg:span-w-4 object-cover aspect-square transition-opacity duration-500 ${
            mediaLoaded ? "opacity-100" : "opacity-0"
          }`}
          src={i1}
          alt="showcase"
          onLoadingComplete={() => setMediaLoaded(true)}
        />
      )}
      <div className="flex lg:flex-col gutter-gap-1">
        <Image
          className={`span-w-3 lg:span-w-2 aspect-square object-cover transition-opacity duration-500 ${
            image2Loaded ? "opacity-100" : "opacity-0"
          }`}
          src={i2}
          alt="showcase"
          onLoadingComplete={() => setImage2Loaded(true)}
        />
        <Image
          className={`span-w-3 lg:span-w-2 aspect-square object-cover transition-opacity duration-500 ${
            image3Loaded ? "opacity-100" : "opacity-0"
          }`}
          src={i3}
          alt="showcase"
          onLoadingComplete={() => setImage3Loaded(true)}
        />
      </div>
    </section>
  );
};
