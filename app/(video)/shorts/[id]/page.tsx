import Link from "next/link";
import Image from "next/image";
import { VideoCard } from "@/components/VideoCard";
import { Header } from "@/components/Header";
import { getInstance } from "@/app/getInstance";
import { VideoPlayer } from "@/components/VideoPlayer";
import { fetchVideo } from "@/api/fetchVideo";

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

  const authorThumbnail = data.authorThumbnails.at(-1);

  return (
    <div>
      <Header />
      <div className="bg-black">
        <div className="player mx-auto flex min-h-[200px] flex-1 bg-slate-950">
          <VideoPlayer
            className="h-full w-full"
            video={data}
            key={data.videoId}
            instance={getInstance()}
          />
        </div>
      </div>
      <div className="mx-auto flex max-w-[1400px] justify-between gap-4 px-8 pt-8">
        <div className="sticky top-0 flex w-full  flex-col gap-4 p-2">
          <h1 className="text-xl font-semibold">{data.title}</h1>
          <div className="flex rounded border border-slate-300">
            <div className="rounded-w flex flex-1 items-center gap-2 rounded bg-slate-100 p-2 pr-4">
              <Link href={data.authorUrl}>
                {authorThumbnail && (
                  <Image
                    src={authorThumbnail?.url}
                    alt=""
                    className="rounded-full"
                    width={64}
                    height={64}
                  />
                )}
              </Link>
              <Link href={data.authorUrl} className="flex flex-1 flex-col ">
                <div className="font-semibold">{data.author}</div>
                <div>{data.subCountText}</div>
              </Link>
              <button className="rounded bg-slate-200 p-2 hover:bg-slate-300 hover:shadow active:bg-slate-200">
                Subscribe
              </button>
            </div>
            <div className="flex items-center gap-2 rounded-e bg-slate-200 p-2 pl-4 font-semibold">
              Posted {data.publishedText}
              <button className="rounded bg-slate-300 p-2 hover:bg-slate-200 hover:shadow active:bg-slate-200">
                <i className="ri-heart-line"></i> {data.likeCount}
              </button>
            </div>
          </div>
          <div
            className="html-content whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: data.descriptionHtml }}
          />
        </div>
        <div className="flex flex-col gap-2 py-2">
          {data.recommendedVideos.map((item) => (
            <VideoCard video={item} key={item.videoId} />
          ))}
        </div>
      </div>
      <details>
        <summary>Technical Details</summary>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </details>
    </div>
  );
}
