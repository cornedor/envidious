import { headers as getHeaders } from "next/headers";

import { getInstance } from "@/app/getInstance";
import { Playlist } from "./fetchPlaylists";

export async function fetchPlaylist(id: string) {
  const instance = getInstance();
  const lang = getHeaders().get("Accept-Language");
  const headers = new Headers();
  if (lang) {
    headers.append("Accept-Language", lang);
  }

  const url = new URL(`/api/v1/playlists/${id}?local=true`, instance);

  const result = await fetch(url, {
    headers,
    next: {
      revalidate: 1200,
    },
  });

  const data = await result.json();

  return data as Playlist | undefined;
}
