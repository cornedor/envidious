import { fetchChannel } from "@/api/fetchChannel";
import { ChannelLayout } from "@/components/ChannelLayout";

export default async function ChannelPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const channel = await fetchChannel(id);

  console.log(channel);

  if (!channel) {
    return <>404</>;
  }

  return <ChannelLayout channel={channel} />;
}
