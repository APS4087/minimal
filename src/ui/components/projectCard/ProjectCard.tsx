"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ParallaxMedia } from "@/ui/components/parallaxMedia/ParallaxMedia";

interface ProjectCardProps {
  title: string;
  description: string;
  techStack: string[];
  media: Array<{ type: "image" | "video"; src: any }>;
  layout:
    | "left"
    | "right"
    | "center"
    | "stacked"
    | "offset"
    | "minimal"
    | "hero"
    | "asymmetric";
  link: string;
}

export const ProjectCard = ({
  title,
  description,
  techStack,
  media,
  layout,
  link,
}: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-4");
          }
        });
      },
      { threshold: 0.1 },
    );

    if (cardRef.current) observer.observe(cardRef.current);

    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  const renderMedia = (
    item: { type: "image" | "video"; src: any },
    index: number,
  ) => {
    if (item.type === "image") {
      return (
        <ParallaxMedia key={index}>
          <Image
            src={item.src}
            alt={title}
            fill
            className="object-cover"
          />
        </ParallaxMedia>
      );
    } else {
      return (
        <ParallaxMedia key={index}>
          <video
            src={item.src}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </ParallaxMedia>
      );
    }
  };

  if (layout === "left") {
    return (
      <div
        ref={cardRef}
        className="grid lg:grid-cols-6 gap-16 lg-max:gap-32 w-full transition-all duration-700 ease-out opacity-0 translate-y-4"
      >
        <div className="lg:col-span-2 flex flex-col gap-12 justify-center">
          <h3 className="text-16 uppercase">{title}</h3>
          <p className="text-12 opacity-80 leading-relaxed">{description}</p>
          <div className="flex flex-wrap gap-8">
            {techStack.map((tech, i) => (
              <span
                key={i}
                className="text-10 uppercase px-8 py-4 border border-black/20 opacity-60"
              >
                {tech}
              </span>
            ))}
          </div>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-11 uppercase opacity-80 hover:opacity-100 transition-all duration-300 mt-4 inline-flex items-center gap-4 group"
          >
            <span>Visit</span>
            <span className="transform transition-transform duration-300 group-hover:translate-x-4">→</span>
          </a>
        </div>
        <div className="lg:col-span-4 aspect-video overflow-hidden relative">
          {renderMedia(media[0], 0)}
        </div>
      </div>
    );
  }

  if (layout === "right") {
    return (
      <div
        ref={cardRef}
        className="grid lg:grid-cols-6 gap-16 lg-max:gap-32 w-full transition-all duration-700 ease-out opacity-0 translate-y-4"
      >
        <div className="lg:col-span-4 aspect-video overflow-hidden lg-max:order-1 relative">
          {renderMedia(media[0], 0)}
        </div>
        <div className="lg:col-span-2 flex flex-col gap-12 justify-center lg-max:order-2">
          <h3 className="text-16 uppercase">{title}</h3>
          <p className="text-12 opacity-80 leading-relaxed">{description}</p>
          <div className="flex flex-wrap gap-8">
            {techStack.map((tech, i) => (
              <span
                key={i}
                className="text-10 uppercase px-8 py-4 border border-black/20 opacity-60"
              >
                {tech}
              </span>
            ))}
          </div>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-11 uppercase opacity-80 hover:opacity-100 transition-all duration-300 mt-4 inline-flex items-center gap-4 group"
          >
            <span>Visit</span>
            <span className="transform transition-transform duration-300 group-hover:translate-x-4">→</span>
          </a>
        </div>
      </div>
    );
  }

  if (layout === "stacked") {
    return (
      <div
        ref={cardRef}
        className="grid lg:grid-cols-5 gap-16 lg-max:gap-32 w-full transition-all duration-700 ease-out opacity-0 translate-y-4"
      >
        <div className="lg:col-span-3 lg:col-start-2 flex flex-col gap-16">
          <div className="aspect-[4/3] overflow-hidden relative">
            {renderMedia(media[0], 0)}
          </div>
          <div className="flex flex-col gap-12">
            <h3 className="text-16 uppercase">{title}</h3>
            <p className="text-12 opacity-80 leading-relaxed">{description}</p>
            <div className="flex flex-wrap gap-8">
              {techStack.map((tech, i) => (
                <span
                  key={i}
                  className="text-10 uppercase px-8 py-4 border border-black/20 opacity-60"
                >
                  {tech}
                </span>
              ))}
            </div>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-11 uppercase underline opacity-80 hover:opacity-100 transition-opacity duration-300 mt-4"
            >
              Visit →
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (layout === "offset") {
    return (
      <div
        ref={cardRef}
        className="grid lg:grid-cols-6 gap-16 lg-max:gap-32 w-full transition-all duration-700 ease-out opacity-0 translate-y-4"
      >
        <div className="lg:col-span-2 lg:col-start-1 flex flex-col gap-12 justify-center lg-max:order-2">
          <h3 className="text-16 uppercase">{title}</h3>
          <p className="text-12 opacity-80 leading-relaxed">{description}</p>
          <div className="flex flex-wrap gap-8">
            {techStack.map((tech, i) => (
              <span
                key={i}
                className="text-10 uppercase px-8 py-4 border border-black/20 opacity-60"
              >
                {tech}
              </span>
            ))}
          </div>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-11 uppercase opacity-80 hover:opacity-100 transition-all duration-300 mt-4 inline-flex items-center gap-4 group"
          >
            <span>Visit</span>
            <span className="transform transition-transform duration-300 group-hover:translate-x-4">→</span>
          </a>
        </div>
        <div className="lg:col-span-3 lg:col-start-4 aspect-[3/4] overflow-hidden lg-max:order-1 relative">
          {renderMedia(media[0], 0)}
        </div>
      </div>
    );
  }

  if (layout === "minimal") {
    return (
      <div
        ref={cardRef}
        className="grid lg:grid-cols-12 gap-16 lg-max:gap-32 w-full transition-all duration-700 ease-out opacity-0 translate-y-4"
      >
        <div className="lg:col-span-3 lg:col-start-2 flex flex-col gap-12 justify-start">
          <h3 className="text-14 uppercase">{title}</h3>
          <div className="flex flex-wrap gap-8">
            {techStack.map((tech, i) => (
              <span
                key={i}
                className="text-10 uppercase px-8 py-4 border border-black/20 opacity-60"
              >
                {tech}
              </span>
            ))}
          </div>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-11 uppercase opacity-80 hover:opacity-100 transition-all duration-300 inline-flex items-center gap-4 group"
          >
            <span>Visit</span>
            <span className="transform transition-transform duration-300 group-hover:translate-x-4">→</span>
          </a>
        </div>
        <div className="lg:col-span-5 lg:col-start-6 flex flex-col gap-12">
          <p className="text-12 opacity-80 leading-relaxed">{description}</p>
          <div className="aspect-[4/5] overflow-hidden relative">
            {renderMedia(media[0], 0)}
          </div>
        </div>
      </div>
    );
  }

  if (layout === "hero") {
    return (
      <div
        ref={cardRef}
        className="flex flex-col gap-24 w-full transition-all duration-700 ease-out opacity-0 translate-y-4"
      >
        <div className="aspect-[21/9] overflow-hidden w-full relative">
          {renderMedia(media[0], 0)}
        </div>
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4 lg:col-start-3 flex flex-col gap-12">
            <h3 className="text-18 uppercase">{title}</h3>
            <p className="text-12 opacity-80 leading-relaxed">{description}</p>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-11 uppercase underline opacity-80 hover:opacity-100 transition-opacity duration-300"
            >
              Visit →
            </a>
          </div>
          <div className="lg:col-span-3 lg:col-start-8 flex flex-wrap gap-8 items-start">
            {techStack.map((tech, i) => (
              <span
                key={i}
                className="text-10 uppercase px-8 py-4 border border-black/20 opacity-60"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (layout === "asymmetric") {
    return (
      <div
        ref={cardRef}
        className="grid lg:grid-cols-12 gap-16 lg-max:gap-32 w-full transition-all duration-700 ease-out opacity-0 translate-y-4"
      >
        <div className="lg:col-span-5 lg:col-start-1 aspect-square overflow-hidden relative">
          {renderMedia(media[0], 0)}
        </div>
        <div className="lg:col-span-4 lg:col-start-8 flex flex-col gap-12 justify-end">
          <h3 className="text-16 uppercase">{title}</h3>
          <p className="text-12 opacity-80 leading-relaxed">{description}</p>
          <div className="flex flex-wrap gap-8">
            {techStack.map((tech, i) => (
              <span
                key={i}
                className="text-10 uppercase px-8 py-4 border border-black/20 opacity-60"
              >
                {tech}
              </span>
            ))}
          </div>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-11 uppercase opacity-80 hover:opacity-100 transition-all duration-300 mt-4 inline-flex items-center gap-4 group"
          >
            <span>Visit</span>
            <span className="transform transition-transform duration-300 group-hover:translate-x-4">→</span>
          </a>
        </div>
      </div>
    );
  }

  // Default center layout
  return (
    <div
      ref={cardRef}
      className="flex flex-col gap-16 w-full transition-all duration-700 ease-out opacity-0 translate-y-4"
    >
      <div className="lg:mx-auto lg:max-w-[70%] aspect-[4/3] overflow-hidden relative">
        {renderMedia(media[0], 0)}
      </div>
      <div className="flex flex-col gap-12 lg:mx-auto lg:max-w-[50%]">
        <h3 className="text-16 uppercase text-center">{title}</h3>
        <p className="text-12 opacity-80 leading-relaxed text-center">
          {description}
        </p>
        <div className="flex flex-wrap gap-8 justify-center">
          {techStack.map((tech, i) => (
            <span
              key={i}
              className="text-10 uppercase px-8 py-4 border border-black/20 opacity-60"
            >
              {tech}
            </span>
          ))}
        </div>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-11 uppercase opacity-80 hover:opacity-100 transition-all duration-300 text-center mt-4 inline-flex items-center gap-4 group justify-center"
        >
          <span>Visit</span>
          <span className="transform transition-transform duration-300 group-hover:translate-x-4">→</span>
        </a>
      </div>
    </div>
  );
};
