"use client";
import Link from "next/link";
import Image from "next/image";

import { Channel } from "@/api/Channel";
import { Video } from "@/api/Video";
import { Playlist } from "@/api/fetchPlaylists";

import { VideoCard } from "./VideoCard";
import { PlaylistCard } from "./PlaylistCard";
import { useCallback, useEffect, useRef, useState } from "react";

interface VideoGridProps {
  items: Array<Video | Playlist | Channel>;
  loadMore?: (
    page: number,
  ) => Promise<Array<Video | Playlist | Channel> | undefined>;
}

export function VideoGrid({ items, loadMore }: VideoGridProps) {
  const [moreItems, setMoreItems] = useState<Array<Video | Playlist | Channel>>(
    [],
  );
  const [isLoading, setIsLoading] = useState<0 | 1 | -1>(0);
  const [page, setPage] = useState(1);
  const ref = useRef<HTMLButtonElement | null>(null);

  const loadMoreCallback = useCallback<IntersectionObserverCallback>(
    ([entry]) => {
      if (!loadMore) {
        return;
      }
      if (entry.isIntersecting) {
        setIsLoading(1);
        loadMore(page + 1).then((items) => {
          if (items && items.length > 0) {
            setMoreItems((o) => [...o, ...items]);
            setIsLoading(0);
            setPage(page + 1);
          } else {
            setIsLoading(-1);
          }
        });
      }
    },
    [loadMore, page],
  );

  useEffect(() => {
    if (!ref.current || !loadMore) {
      return;
    }

    const observer = new IntersectionObserver(loadMoreCallback, {
      rootMargin: "300px 0px",
    });
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [loadMore, loadMoreCallback]);

  return (
    <div className="video-grid inline-grid gap-4 p-4 ">
      {[...items, ...moreItems].map((item) => {
        switch (item.type) {
          case "playlist":
            return <PlaylistCard key={item.playlistId} playlist={item} />;
          case "video":
          case "scheduled":
          case "shortVideo":
            return <VideoCard key={item.videoId} video={item} />;
          case "channel":
            const thumbnail = item.authorThumbnails.at(-1);
            return (
              <Link
                className="group flex flex-col items-center justify-center hover:underline"
                href={item.authorUrl}
              >
                {thumbnail?.url ? (
                  <Image
                    src={thumbnail?.url.replace(/^\/\//, "https://")}
                    width={thumbnail?.width}
                    height={thumbnail?.height}
                    alt=""
                    className="mb-2 w-32 rounded-full transition-shadow group-hover:ring group-hover:ring-slate-500"
                  />
                ) : null}
                <span className="text-sm">{item.channelHandle}</span>
                <strong>{item.author}</strong>
                <small className="text-xs text-slate-500">
                  {item.subCount} subs
                </small>
              </Link>
            );

          default:
            // @ts-expect-error
            return <div>{item.type}</div>;
        }
      })}
      {loadMore && (
        <div className="flex items-center justify-center text-sm uppercase">
          {isLoading === 0 ? (
            <button ref={ref} className="uppercase">
              Load more
            </button>
          ) : (
            <div>{isLoading === -1 ? "" : "Loading..."}</div>
          )}
        </div>
      )}
    </div>
  );
}
