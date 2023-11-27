import { headers as getHeaders } from "next/headers";

import { getInstance } from "../app/getInstance";
import { Video } from "@/api/Video";

type TrendingItems = Video[];

export async function fetchTrending(searchParams: {
  type?: string;
  region?: string;
}) {
  const instance = getInstance();
  const lang = getHeaders().get("Accept-Language");
  const headers = new Headers();
  if (lang) {
    headers.append("Accept-Language", lang);
  }

  const url = new URL("api/v1/trending", instance);

  if (searchParams.type) {
    url.searchParams.set("type", searchParams.type);
  }
  if (searchParams.region) {
    url.searchParams.set("region", searchParams.region);
  }

  const result = await fetch(url, {
    headers,
    next: {
      revalidate: 1200,
    },
  });

  const data = await result.json();

  return data as TrendingItems | undefined;
}
