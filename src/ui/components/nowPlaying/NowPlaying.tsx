"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface SpotifyData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
  trackId?: string;
  minutesAgo?: number;
}

export const NowPlaying = () => {
  const [data, setData] = useState<SpotifyData | null>(null);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch("/api/spotify/now-playing");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching now playing:", error);
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (!data || !data.title) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
      <p className="text-11 uppercase opacity-50">
        {data.isPlaying ? "Currently listening" : `Last played ${data.minutesAgo}m ago`}
      </p>
      <a
        href={data.songUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex gap-12 group"
      >
        {data.albumImageUrl && (
          <div className="relative w-48 h-48 flex-shrink-0">
            <Image
              src={data.albumImageUrl}
              alt={data.album || "Album art"}
              fill
              className="object-cover opacity-100 group-hover:opacity-80 duration-300"
            />
            {data.isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col justify-center gap-4 min-w-0 flex-1">
          <p className="text-11 font-medium opacity-100 group-hover:opacity-80 duration-300 truncate">
            {data.title}
          </p>
          <p className="text-10 opacity-60 group-hover:opacity-80 duration-300 truncate">
            {data.artist}
          </p>
        </div>
      </a>
    </div>
  );
};
