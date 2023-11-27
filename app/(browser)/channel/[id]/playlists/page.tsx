import { ChannelLayout } from "@/components/ChannelLayout";
import { fetchChannel } from "@/api/fetchChannel";
import { fetchPlaylists } from "@/api/fetchPlaylists";

export default async function ChannelPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const channel = await fetchChannel(id);
  const videos = await fetchPlaylists(id);

  if (!channel) {
    return <>404</>;
  }

  return <ChannelLayout channel={channel} videos={videos?.playlists} />;
}
