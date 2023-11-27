"use server";
import { cookies, headers as getHeaders } from "next/headers";

import { getInstance } from "@/api/getInstance";
import { revalidateTag } from "next/cache";

export interface Subscription {
  author: string;
  authorId: string;
}

export async function subscribe(formData: FormData) {
  const authorId = formData.get("authorId");
  const instant = formData.get("instant") === "yes";
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

  const url = new URL(`api/v1/auth/subscriptions/${authorId}`, instance);

  const result = await fetch(url, {
    method: "POST",
    headers,
  });

  const data = await result.text();

  if (instant) {
    revalidateTag("subs");
  } else {
    setTimeout(() => {
      revalidateTag("subs");
    }, 10);
  }

  return data;
}
