"use server";
import { headers as getHeaders } from "next/headers";
import Innertube from "youtubei.js";

import { getInstance } from "@/app/getInstance";

export async function fetchInnertubeInfo(videoId: string) {
  const instance = getInstance();
  const lang = getHeaders().get("Accept-Language");

  const youtube = await Innertube.create({
    lang: lang ?? undefined,
    location: "US",
  });

  const info = await youtube.getInfo(videoId);

  info.getStreamingInfo().audio_sets;

  // console.log(info);

  try {
    const manifest = await info.toDash((url) => {
      url.searchParams.append("__host", url.host);

      const instanceUrl = new URL(instance);
      url.hostname = instanceUrl.hostname;
      url.port = instanceUrl.port;
      url.protocol = instanceUrl.protocol;
      return new URL(url, instance);
    });

    const uri =
      "data:application/dash+xml;charset=utf-8;base64," + btoa(manifest);

    return {
      dash: uri,
      audioSets: info.getStreamingInfo().audio_sets,
    };
  } catch {
    console.log(info.streaming_data?.dash_manifest_url);

    return {
      hls: info.streaming_data?.hls_manifest_url,
      audioSets: info.getStreamingInfo().audio_sets,
    };
  }
}
