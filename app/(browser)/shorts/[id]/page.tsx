import Link from "next/link";
import Image from "next/image";
import { VideoCard } from "@/components/VideoCard";
import { Header } from "@/components/Header";
import { getInstance } from "@/api/getInstance";
import { VideoPlayer } from "@/components/VideoPlayer";
import { fetchVideo } from "@/api/fetchVideo";
import { Shorts } from "./shorts";
import { getVideoType } from "@/components/getVideoType";

export default async function WatchPage({
  params,
}: {
  params: { id?: string };
}) {
  if (!params.id) {
    return <div>404</div>;
  }
  const data = await fetchVideo(params.id);
  if (!data) {
    return <div>404</div>;
  }

  return (
    <Shorts
      shorts={[
        data,
        // ...data.recommendedVideos.filter((item) => getVideoType(item).isShort),
        ...data.recommendedVideos,
      ]}
    />
  );
}
