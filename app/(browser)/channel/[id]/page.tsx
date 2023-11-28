import { fetchChannel } from "@/api/fetchChannel";
import { ChannelLayout } from "@/components/ChannelLayout";
import { Metadata } from "next";

interface ChannelPageProps {
  params: { id: string };
}

export async function generateMetadata({
  params: { id },
}: ChannelPageProps): Promise<Metadata> {
  if (!id) {
    return {};
  }
  const channel = await fetchChannel(id);
  return {
    title: `${channel?.author} | Channel | Envidious`,
  };
}

export default async function ChannelPage({
  params: { id },
}: ChannelPageProps) {
  const channel = await fetchChannel(id);

  if (!channel) {
    return <>404</>;
  }

  return <ChannelLayout channel={channel} />;
}
