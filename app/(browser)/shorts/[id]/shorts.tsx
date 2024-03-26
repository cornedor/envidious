"use client";

import { Video } from "@/api/Video";
import { useRouter } from "next/navigation";
import { Short } from "./short";

interface ShortsProps {
  shorts: Video[];
}

export function Shorts({ shorts }: ShortsProps) {
  const p = useRouter();

  console.log(shorts);

  return (
    <div className="shorts-container flex snap-y snap-mandatory flex-col items-center gap-8 overflow-auto py-8">
      {shorts.map((video) => (
        <div
          key={video.videoId}
          className="flex snap-center items-center justify-center"
          style={{
            height: "100vh",
            width: "100%",
          }}
        >
          <div
            className="w-20 "
            style={{
              aspectRatio: "320 / 560",
              width: "min(80vw, calc(0.57 * 89vh))",
            }}
          >
            <Short video={video} />
          </div>
        </div>
      ))}
    </div>
  );
}
