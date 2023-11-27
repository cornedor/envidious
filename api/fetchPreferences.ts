import { cookies, headers as getHeaders } from "next/headers";

import { getInstance } from "@/api/getInstance";

export interface InvidiousPreferences {
  annotations: boolean;
  annotations_subscribed: boolean;
  autoplay: boolean;
  automatic_instance_redirect: boolean;
  captions: string[];
  comments: string[];
  continue: boolean;
  continue_autoplay: boolean;
  dark_mode: string;
  latest_only: boolean;
  listen: boolean;
  local: boolean;
  watch_history: boolean;
  vr_mode: boolean;
  show_nick: boolean;
  locale: string;
  region: string;
  max_results: number;
  notifications_only: boolean;
  player_style: string;
  quality: string;
  quality_dash: string;
  default_home: string;
  feed_menu: string[];
  related_videos: boolean;
  sort: string;
  speed: number;
  thin_mode: boolean;
  unseen_only: boolean;
  video_loop: boolean;
  extend_desc: boolean;
  volume: number;
  save_player_pos: boolean;
}

export async function fetchPreferences() {
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

  const url = new URL("api/v1/auth/preferences", instance);

  const result = await fetch(url, {
    headers,
    next: {
      revalidate: 1200,
    },
  });

  const data = await result.json();

  return data as InvidiousPreferences | undefined;
}
