import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { VideoPlayer } from "@/components/VideoPlayer";
import { VideoCard } from "@/components/VideoCard";
import { Header } from "@/components/Header";
import { Description } from "@/components/Description";
import { SubscribeButton } from "@/components/SubscribeButton";
import { fetchVideo } from "@/api/fetchVideo";
import { fetchPlaylist } from "@/api/fetchPlaylist";
import { fetchSubscriptions } from "@/api/fetchSubscriptions";
import { getInstance } from "@/api/getInstance";
import { fetchInnertubeInfo } from "@/api/fetchInnertubeInfo";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import { fetchComments } from "@/api/fetchComments";

interface WatchPageProps {
  searchParams: { v?: string; list?: string };
}

export async function generateMetadata({
  searchParams,
}: WatchPageProps): Promise<Metadata> {
  if (!searchParams.v) {
    return {};
  }
  const data = await fetchVideo(searchParams.v);
  return {
    title: `${data?.title} | Envidious`,
  };
}

export default async function WatchPage({ searchParams }: WatchPageProps) {
  if (!searchParams.v) {
    notFound();
  }
  const data = await fetchVideo(searchParams.v);
  const dashManifest = await fetchInnertubeInfo(searchParams.v);
  const subs = await fetchSubscriptions();
  const playlist = searchParams.list
    ? await fetchPlaylist(searchParams.list)
    : undefined;
  if (!data) {
    return <div>404</div>;
  }

  const comments = fetchComments(data.videoId, "top");

  const nextInPlaylistIndex = playlist?.videos
    ? playlist.videos.findIndex((item) => item.videoId === data.videoId)
    : -1;
  const nextInPlaylist =
    nextInPlaylistIndex === -1
      ? undefined
      : playlist?.videos[nextInPlaylistIndex + 1];
  const nextInPlaylistUrl = nextInPlaylist
    ? `/watch?v=${nextInPlaylist.videoId}&list=${playlist?.playlistId}`
    : undefined;

  if (!data.authorThumbnails) {
    notFound();
  }

  const authorThumbnail = data.authorThumbnails.at(-1);

  // Storyboards can be used to extract the video aspect ratio
  const storyboard = data.storyboards?.at(-1);

  return (
    <div>
      <Header />
      <div
        className={clsx("bg-black", {
          flex: Boolean(playlist),
        })}
      >
        <div
          className="player mx-auto flex min-h-[200px] flex-1 bg-slate-950"
          style={{
            aspectRatio: `${storyboard?.width ?? 16} / ${
              storyboard?.height ?? 9
            }`,
          }}
        >
          <VideoPlayer
            className="h-full w-full"
            video={data}
            key={data.videoId}
            redirectOnEnded={nextInPlaylistUrl}
            instance={getInstance()}
            dashManifest={dashManifest}
          />
        </div>
        {playlist ? (
          <div className="relative flex w-[352px] min-w-[352px] max-w-full flex-col gap-2 overflow-y-auto overflow-x-hidden border border-slate-200 bg-slate-100">
            <div className="sticky top-0 z-10 w-full overflow-hidden text-ellipsis whitespace-nowrap bg-slate-200 p-2">
              <strong>Playlist: </strong>
              {playlist.title}
            </div>
            <div className="absolute top-10 flex h-max flex-col gap-2 p-2">
              {playlist.videos.map((item) => (
                <VideoCard
                  video={item}
                  key={item.videoId}
                  playlistId={playlist.playlistId}
                  isPlaying={data.videoId === item.videoId}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <div className="mx-auto flex max-w-[1400px] justify-between gap-4 px-8 pt-8">
        <div className="sticky top-0 flex w-full  flex-col gap-4 p-2">
          <h1 className="text-xl font-semibold">{data.title}</h1>
          <div className="flex rounded border border-slate-300 dark:border-slate-800">
            <div className="rounded-w flex flex-1 items-center gap-2 rounded bg-slate-100 p-2 pr-4 dark:bg-slate-600">
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

              <SubscribeButton
                authorId={data.authorId}
                subscribed={subs?.some(
                  (item) => item.authorId === data.authorId,
                )}
              />
            </div>
            <div className="flex items-center gap-2 rounded-e bg-slate-200 p-2 pl-4 font-semibold dark:bg-slate-500 dark:text-slate-200">
              Posted {data.publishedText}
              <button className="rounded bg-slate-300 p-2 hover:bg-slate-200 hover:shadow active:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-800 dark:active:bg-slate-700">
                <i className="ri-heart-line"></i> {data.likeCount}
              </button>
            </div>
          </div>
          <Description html={data.descriptionHtml} />
          {dashManifest.hls ? (
            <div className="flex w-full items-center gap-2 whitespace-nowrap">
              Fallback HLS:{" "}
              <input
                className="inline-block flex-1 whitespace-nowrap rounded-sm border border-slate-300 bg-slate-200 p-1"
                value={dashManifest.hls}
              />
            </div>
          ) : null}
          <div>
            <h3 className="font-bold">Comments</h3>
            {(await comments)?.comments.map((comment) => {
              const image = comment.authorThumbnails?.at(-1);
              return (
                <div
                  key={comment.commentId}
                  className="mt-4 flex gap-2 border-l-2 pl-2"
                >
                  <div className="w-8">
                    {image?.url && (
                      <Image
                        src={image?.url}
                        width={32}
                        height={32}
                        className="aspect-square w-16 min-w-0 rounded-full"
                        alt=""
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <strong className="font-semibold">{comment.author} </strong>
                    <span className="text-slate-600">
                      {comment.publishedText}
                    </span>
                    <small className="float-right">
                      {comment.isPinned ? "pinned" : ""}
                    </small>
                    <div
                      className="html-content"
                      dangerouslySetInnerHTML={{ __html: comment.contentHtml }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
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
