import { headers as getHeaders } from "next/headers";

import { getInstance } from "@/api/getInstance";
import { Video } from "@/api/Video";

export interface Playlist {
  type: "playlist";
  title: string;
  playlistId: string;
  playlistThumbnail: string;
  author: string;
  authorId: string;
  authorUrl: string;
  authorVerified: boolean;
  videoCount: number;
  videos: Video[];
}

export async function fetchPlaylists(id: string) {
  const instance = getInstance();
  const lang = getHeaders().get("Accept-Language");
  const headers = new Headers();
  if (lang) {
    headers.append("Accept-Language", lang);
  }

  const url = new URL(`/api/v1/channels/${id}/playlists?local=true`, instance);

  const result = await fetch(url, {
    headers,
    next: {
      revalidate: 1200,
    },
  });

  const data = await result.json();

  return data as { playlists: Playlist[] } | undefined;
}
