import { headers as getHeaders } from "next/headers";

import { getInstance } from "@/app/getInstance";
import { Channel } from "@/api/Channel";

export async function fetchChannel(id: string) {
  const instance = getInstance();
  const lang = getHeaders().get("Accept-Language");
  const headers = new Headers();
  if (lang) {
    headers.append("Accept-Language", lang);
  }

  const url = new URL(`/api/v1/channels/${id}`, instance);

  const result = await fetch(url, {
    headers,
    next: {
      revalidate: 1200,
    },
  });

  const data = await result.json();

  return data as Channel | undefined;
}
