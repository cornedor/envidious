import { headers as getHeaders } from "next/headers";

import { getInstance } from "@/api/getInstance";
import { Video } from "@/api/Video";
import { Channel } from "@/api/Channel";
import { Playlist } from "@/api/fetchPlaylists";

export async function fetchSearch(query: string, page: number = 1) {
  const instance = getInstance();
  const lang = getHeaders().get("Accept-Language");
  const headers = new Headers();
  if (lang) {
    headers.append("Accept-Language", lang);
  }

  const url = new URL(`/api/v1/search`, instance);
  url.searchParams.set("q", query);
  url.searchParams.set("page", String(page));

  const result = await fetch(url, {
    headers,
    next: {
      revalidate: 1200,
    },
  });

  const data = await result.json();

  console.log(data);

  return data as Array<Video | Playlist | Channel> | undefined;
}
