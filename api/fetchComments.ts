import { cookies, headers as getHeaders } from "next/headers";
import { AuthorThumbnail } from "./Video";
import { getInstance } from "./getInstance";

export interface Comment {
  author: string;
  authorThumbnails?: AuthorThumbnail[];
  authorId: string;
  authorUrl: string;
  isEdited: boolean;
  isPinned: boolean;
  content: string;
  contentHtml: string;
  published: number;
  publishedText: string;
  likeCount: number;
  commentId: string;
  authorIsChannelOwner: boolean;
  creatorHeart?: {
    creatorThumbnail: string;
    creatorName: string;
  };
  replies?: {
    replyCount: number;
    continuation: string;
  };
}

export interface Comments {
  commentCount: number;
  videoId: string;
  comments: Comment[];
}

export async function fetchComments(
  videoId: string,
  sortBy: "top" | "new",
  continuation?: string,
) {
  const instance = getInstance();
  const lang = getHeaders().get("Accept-Language");
  const headers = new Headers();
  if (lang) {
    headers.append("Accept-Language", lang);
  }

  const token = cookies().get("iv-token")?.value;
  headers.append(`Authorization`, `Bearer ${token}`);

  const url = new URL("api/v1/comments/" + videoId, instance);

  const result = await fetch(url, {
    headers,
    next: {
      revalidate: 1200,
    },
  });

  const data = await result.json();

  return data as Comments | undefined;
}
