import { cookies, headers as getHeaders } from "next/headers";

import { getInstance } from "@/api/getInstance";

export async function fetchHistory() {
  const instance = getInstance();
  const lang = getHeaders().get("Accept-Language");
  const headers = new Headers();
  if (lang) {
    headers.append("Accept-Language", lang);
  }

  const token = cookies().get("iv-token")?.value;
  headers.append(`Authorization`, `Bearer ${token}`);

  const url = new URL("api/v1/auth/history", instance);

  const result = await fetch(url, {
    headers,
    next: {
      revalidate: 1,
    },
  });

  const data = await result.json();

  return data as string[] | undefined;
}
