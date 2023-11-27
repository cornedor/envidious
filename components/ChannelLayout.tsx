import Image from "next/image";
import Link from "next/link";

import { Video } from "@/api/Video";
import { Playlist } from "@/api/fetchPlaylists";
import { fetchSubscriptions } from "@/api/fetchSubscriptions";
import { Channel } from "@/api/Channel";
import { Description } from "./Description";
import { VideoGrid } from "./VideoGrid";
import { SubscribeButton } from "./SubscribeButton";

export async function ChannelLayout({
  channel,
  videos,
}: {
  channel: Channel;
  videos?: (Video | Playlist)[];
}) {
  const banner = channel.authorBanners?.[0];
  const subs = await fetchSubscriptions();
  return (
    <div>
      <header>
        {banner && (
          <Image
            alt=""
            src={banner.url}
            width={banner?.width}
            height={banner?.height}
          />
        )}
        <div className="flex gap-2 bg-slate-200 px-2 py-1 dark:bg-slate-700">
          <Link
            href={`/channel/${channel.authorId}`}
            className="rounded p-2 px-4 hover:bg-slate-300 hover:underline dark:hover:bg-slate-800"
          >
            Videos
          </Link>
          <Link
            href={`/channel/${channel.authorId}/playlists`}
            className="rounded p-2 px-4 hover:bg-slate-300 hover:underline dark:hover:bg-slate-800"
          >
            Playlists
          </Link>
          <Link
            href="/"
            className="rounded p-2 px-4 hover:bg-slate-300 hover:underline dark:hover:bg-slate-800"
          >
            Channels
          </Link>
          <div className="flex-1" />
          <SubscribeButton
            authorId={channel.authorId}
            subscribed={subs?.some(
              (item) => item.authorId === channel.authorId,
            )}
            instant
          />
        </div>
      </header>
      <h1 className="p-4 text-2xl">{channel.author}</h1>
      <div className="max-w-prose p-4">
        <Description html={channel.descriptionHtml ?? ""} />
      </div>

      <VideoGrid items={videos ?? channel.latestVideos} />

      <details>
        <pre>{JSON.stringify(videos, null, 2)}</pre>
      </details>
    </div>
  );
}
