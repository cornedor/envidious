import { Video } from "@/api/Video";

export function getVideoType(video: Video) {
  // TODO: This requires work in Invidious, but there is no prop that indicates if a video is a
  // short or live.
  const isLive = video.lengthSeconds === 0 && video.viewCount === 0;
  const isShort = video.lengthSeconds === 0 && !isLive;

  return {
    isLive,
    isShort,
  };
}
