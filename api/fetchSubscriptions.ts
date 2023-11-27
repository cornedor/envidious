import { cookies, headers as getHeaders } from "next/headers";

import { getInstance } from "./getInstance";

export interface Subscription {
  author: string;
  authorId: string;
}

export async function fetchSubscriptions() {
  const instance = getInstance();
  const lang = getHeaders().get("Accept-Language");
  const headers = new Headers();
  if (lang) {
    headers.append("Accept-Language", lang);
  }

  const token = cookies().get("iv-token")?.value;
  if (!token) {
    return undefined;
  }
  headers.append(`Authorization`, `Bearer ${token}`);

  const url = new URL("api/v1/auth/subscriptions", instance);

  const result = await fetch(url, {
    headers,
    next: {
      revalidate: 1200,
      tags: ["subs"],
    },
  });

  const data = await result.json();
  console.log(headers, data);

  return data as Subscription[] | undefined;
}
