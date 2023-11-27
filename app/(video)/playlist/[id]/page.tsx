import { RedirectType, redirect } from "next/navigation";
import { fetchPlaylist } from "@/api/fetchPlaylist";
import { getInstance } from "@/app/getInstance";

export default async function PlaylistRedirect({
  params: { id },
}: {
  params: { id: string };
}) {
  const instance = getInstance();
  const playlist = await fetchPlaylist(id);

  const url = new URL("/watch", instance);
  url.searchParams.set("v", playlist?.videos[0].videoId ?? "");
  if (id) {
    url.searchParams.set("list", id);
  }

  redirect(url.toString().split(url.hostname)[1], RedirectType.replace);
}
