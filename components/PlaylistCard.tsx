import Image from "next/image";
import Link from "next/link";
import { Playlist } from "@/api/fetchPlaylists";

export function PlaylistCard({ playlist }: { playlist: Playlist }) {
  if (!playlist) {
    return <div>...</div>;
  }

  return (
    <div className="w-80 gap-1 overflow-hidden rounded border border-solid border-slate-300 bg-slate-200 transition-shadow hover:shadow-md">
      <Link
        className="group"
        href={{
          pathname: `/playlist/${encodeURIComponent(playlist.playlistId)}`,
        }}
      >
        <div className="relative w-full overflow-hidden border-b border-slate-300">
          <Image
            src={playlist.playlistThumbnail}
            width={480}
            height={270}
            alt="thumb"
            className="transition-transform group-hover:scale-110"
          />
          <div className="absolute bottom-1 right-1 rounded-sm bg-slate-800/80 px-1  text-xs text-slate-50">
            {playlist.videoCount} videos
          </div>
        </div>
        <div className="line-clamp-2 h-12 w-full px-2">{playlist.title}</div>
      </Link>
      <div className="flex gap-2 px-2 pb-2 text-sm text-slate-500">
        <Link
          className="flex-1 overflow-ellipsis whitespace-nowrap hover:underline"
          href={playlist.authorUrl}
        >
          {playlist.author}
        </Link>
      </div>
    </div>
  );
}
