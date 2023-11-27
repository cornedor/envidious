import { VideoPlayer } from "@/components/VideoPlayer";
import { fetchVideo } from "@/api/fetchVideo";
import { getInstance } from "@/app/getInstance";

export default async function WatchPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const data = await fetchVideo(id);

  if (!data?.videoThumbnails) {
    console.log(data);
    return <div>404</div>;
  }
  return (
    <div className="embed h-screen w-screen">
      <VideoPlayer video={data} instance={getInstance()} />
    </div>
  );
}