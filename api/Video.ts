export interface VideoThumbnail {
  quality:
    | "maxres"
    | "maxresdefault"
    | "sddefault"
    | "high"
    | "medium"
    | "default"
    | "start";
  url: string;
  width: number;
  height: number;
}

export interface Video {
  type: "video" | "scheduled" | "shortVideo";
  title: string;
  videoId: string;
  author: string;
  authorId: string;
  authorUrl: string;
  authorVerified: boolean;
  videoThumbnails?: VideoThumbnail[];
  description: string;
  descriptionHtml: string;
  viewCount: number;
  viewCountText: string;
  published: number;
  publishedText: string;
  lengthSeconds: number;
  liveNow: boolean;
  premium: boolean;
  isUpcoming: boolean;
}

export interface Storyboard {
  url: string;
  templateUrl: string;
  width: number;
  height: number;
  count: number;
  interval: number;
  storyboardWidth: number;
  storyboardHeight: number;
  storyboardCount: number;
}

export interface AdaptiveFormat {
  init: string;
  index: string;
  bitrate: string;
  url: string;
  itag: string;
  type: string;
  clen: string;
  lmt: string;
  projectionType: string;
  fps: number;
  container: string;
  encoding: string;
  audioQuality: string;
  audioSampleRate: number;
  audioChannels: number;
}

export interface FormatStream {
  url: string;
  itag: string;
  type: string;
  quality: string;
  fps: number;
  container: string;
  encoding: string;
  resolution: string;
  qualityLabel: string;
  size: string;
}

export interface AuthorThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface VideoDetails extends Video {
  storyboards: Storyboard[];
  description: string;
  descriptionHtml: string;
  keywords: string[];
  viewCount: number;
  adaptiveFormats: AdaptiveFormat[];
  formatStreams: FormatStream[];
  recommendedVideos: Video[];
  authorThumbnails?: AuthorThumbnail[];
  subCountText: string;
  publishedText: string;
  likeCount: number;
}
