"use server";

const base = "https://sponsor.ajay.app/";

export interface SponsorBlockSegment {
  /**
   * [0, 15.23] start and end time in seconds
   */
  segment: number[];
  UUID: string;
  category: string;
  /**
   * Duration of video when submission occurred (to be used to determine when a submission is out of date). 0 when unknown. +- 1 second
   */
  videoDuration: number;
  actionType: string;
  /**
   * if submission is locked
   */
  locked: number;
  /**
   * Votes on segment
   */
  votes: number;
  /**
   * title for chapters, empty string for other segments
   */
  description: string;
}

export async function fetchSponsorBlock(videoId: string) {
  const url = new URL("/api/skipSegments", base);

  url.searchParams.append("videoID", videoId);

  const result = await fetch(url);
  try {
    const data = await result.json();

    return data as SponsorBlockSegment[] | undefined;
  } finally {
    return [] as SponsorBlockSegment[];
  }
}
