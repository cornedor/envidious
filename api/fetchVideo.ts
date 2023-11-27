"use server";
import { headers as getHeaders } from "next/headers";

import { getInstance } from "./getInstance";

import { VideoDetails } from "@/api/Video";

export async function fetchVideo(videoId: string) {
  const instance = getInstance();
  const lang = getHeaders().get("Accept-Language");
  const headers = new Headers();
  if (lang) {
    headers.append("Accept-Language", lang);
  }

  const url = new URL(
    `api/v1/videos/${videoId}?local=true&region=US`,
    instance,
  );

  const result = await fetch(url, {
    headers,
    next: {
      revalidate: 1200,
    },
  });

  const data = await result.json();

  return data as VideoDetails | undefined;
}
