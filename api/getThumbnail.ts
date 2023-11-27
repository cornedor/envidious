import { VideoThumbnail } from "@/api/Video";

export function getThumbnail(
  thumbnails: VideoThumbnail[],
  type: VideoThumbnail["quality"],
) {
  return thumbnails.find((item) => item.quality === type) ?? thumbnails[0];
}
