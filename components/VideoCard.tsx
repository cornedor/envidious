"use client";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useCallback, useRef, useState } from "react";

import { Video, VideoDetails } from "@/api/Video";
import { fetchVideo } from "@/api/fetchVideo";
import { getThumbnail } from "../api/getThumbnail";

interface VideoCardProps {
  video: Video;
  playlistId?: string;
  isPlaying?: boolean;
}

export function VideoCard({ video, playlistId, isPlaying }: VideoCardProps) {
  const isFetchingMeta = useRef(false);
  const [videoMeta, setVideoMeta] = useState<VideoDetails | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const thumbnail = getThumbnail(video.videoThumbnails ?? [], "medium");

  var hours = Math.floor(video.lengthSeconds / 3600);
  var minutes = Math.floor((video.lengthSeconds - hours * 3600) / 60);
  var seconds = video.lengthSeconds - hours * 3600 - minutes * 60;

  const handleMouseOver = useCallback(async () => {
    setIsHovering(true);
    if (isFetchingMeta.current) {
      return;
    }

    isFetchingMeta.current = true;

    const s = await fetchVideo(video.videoId);

    if (!s) {
      return;
    }

    setVideoMeta(s);
  }, [video.videoId]);

  if (!video) {
    return (
      <div
        className={
          "w-80 gap-1 overflow-hidden rounded border border-solid  bg-slate-200 dark:bg-slate-700"
        }
      ></div>
    );
  }

  const miniVideo = videoMeta?.formatStreams?.find(
    (item) => item.quality === "medium",
  );

  return (
    <div
      onMouseOver={handleMouseOver}
      onMouseLeave={() => {
        setIsHovering(false);
      }}
      className={clsx(
        "w-80 gap-1 overflow-hidden rounded border border-solid border-slate-300 bg-slate-200 transition-all hover:scale-[1.02] hover:shadow-md dark:border-slate-900 dark:bg-slate-700",
        {
          "ring ring-teal-500": isPlaying,
        },
      )}
    >
      <Link
        href={{
          pathname: "/watch",
          query: playlistId
            ? {
                v: video.videoId,
                list: playlistId,
              }
            : { v: video.videoId },
        }}
      >
        <div className="relative w-full overflow-hidden border-b border-slate-300 dark:border-slate-900">
          <Image
            src={thumbnail?.url}
            width={thumbnail?.width}
            height={thumbnail?.height}
            alt="thumb"
          />
          {isHovering && (
            <video
              className="absolute bottom-0 left-0 right-0 top-0 max-h-full max-w-full"
              src={miniVideo?.url}
              width={thumbnail?.width}
              height={thumbnail?.height}
              autoPlay
              muted
            />
          )}
          <div className="absolute bottom-1 right-1 rounded-sm bg-slate-800/80 px-1 text-xs text-slate-50">
            {video.lengthSeconds === 0 ? (
              "short"
            ) : (
              <>
                {hours > 0 ? (
                  <>
                    {hours}:{String(minutes).padStart(2, "0")}:
                    {String(seconds).padStart(2, "0")}
                  </>
                ) : (
                  <>
                    {minutes}:{String(seconds).padStart(2, "0")}
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <div className="line-clamp-2 h-12 w-full px-2">{video.title}</div>
      </Link>
      <div className="flex gap-2 px-2 pb-2 text-sm text-slate-500 dark:text-slate-400">
        <Link
          className="flex-1 overflow-ellipsis whitespace-nowrap hover:underline"
          href={video.authorUrl}
        >
          {video.author}
        </Link>
        <div className="flex-1 overflow-ellipsis whitespace-nowrap text-right">
          {video.publishedText}
        </div>
      </div>
    </div>
  );
}
