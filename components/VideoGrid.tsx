import Link from "next/link";
import Image from "next/image";

import { Channel } from "@/api/Channel";
import { Video } from "@/api/Video";
import { Playlist } from "@/api/fetchPlaylists";

import { VideoCard } from "./VideoCard";
import { PlaylistCard } from "./PlaylistCard";

interface VideoGridProps {
  items: Array<Video | Playlist | Channel>;
}

export function VideoGrid({ items }: VideoGridProps) {
  return (
    <div className="video-grid inline-grid gap-4 p-4 ">
      {items.map((item) => {
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
    </div>
  );
}
