"use client";

import "plyr/dist/plyr.css";

import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";
import dashjs from "dashjs";
import Plyr from "plyr";
import React from "react";

import { VideoDetails } from "@/api/Video";
import { getThumbnail } from "@/api/getThumbnail";
import { fetchSponsorBlock } from "@/api/fetchSponsorBlock";
import { fetchInnertubeInfo } from "@/api/fetchInnertubeInfo";

interface VideoPlayerProps {
  className?: string;
  video: VideoDetails;
  redirectOnEnded?: string;
  instance: string;
  dashManifest?: Awaited<ReturnType<typeof fetchInnertubeInfo>>;
}

export const VideoPlayer = React.memo(function VideoPlayer({
  className,
  video,
  redirectOnEnded,
  instance,
  dashManifest,
}: VideoPlayerProps) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const thumbnail = getThumbnail(video.videoThumbnails ?? [], "medium");

  const { push } = useRouter();

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const sponsorBlockPromise = fetchSponsorBlock(video.videoId);

    // @ts-ignore
    window.dashjs = dashjs;

    // const source =
    //   dashManifest && "dash" in dashManifest
    //     ? dashManifest.dash
    //     : `${instance}/api/manifest/dash/id/${video.videoId}?local=true&unique_res=1`;

    // const source = "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd";
    const source = `${instance}/api/manifest/dash/id/${video.videoId}?local=true&unique_res=1`;

    const dash = dashjs.MediaPlayer().create();
    dash.initialize(ref.current, source, true);

    dash.updateSettings({
      streaming: {
        abr: {
          initialBitrate: { audio: -1, video: 10000 },
          autoSwitchBitrate: { audio: true, video: true },
          useDefaultABRRules: true,
          ABRStrategy: "abrThroughput",
          additionalAbrRules: {
            insufficientBufferRule: true,
            switchHistoryRule: false,
            droppedFramesRule: false,
            abandonRequestsRule: false,
          },
        },
      },
    });
    dash.setInitialMediaSettingsFor("audio", {
      role: "main",
    });

    let player: Plyr;

    const bufferLoaded = async (e: dashjs.Event) => {
      console.log("EVENT -> bufferLoaded");
      if (!ref.current) {
        return;
      }

      const bitrates = dash.getBitrateInfoListFor("video");

      const sponsorBlockSegment = await sponsorBlockPromise;

      player = new Plyr(ref.current, {
        captions: {
          active: true,
          update: true,
        },
        previewThumbnails: {
          enabled: true,
          src: `${instance}/api/v1/storyboards/${video.videoId}?height=180`,
        },
        keyboard: {
          global: true,
        },
        tooltips: {
          controls: true,
        },
        settings: ["captions", "quality", "speed", "loop"],
        mediaMetadata: {
          artist: video.author,
          title: video.title,
        },
        markers: {
          enabled: true,
          points:
            sponsorBlockSegment?.flatMap((item) => [
              {
                time: item.segment[0],
                label: "ad",
              },
              {
                time: item.segment[1],
                label: "ad",
              },
            ]) ?? [],
        },
        controls: [
          "play-large", // The large play button in the center
          "restart", // Restart playback
          "rewind", // Rewind by the seek time (default 10 seconds)
          "play", // Play/pause playback
          "fast-forward", // Fast forward by the seek time (default 10 seconds)
          "progress", // The progress bar and scrubber for playback and buffering
          "current-time", // The current time of playback
          "duration", // The full duration of the media
          "mute", // Toggle mute
          "volume", // Volume control
          "captions", // Toggle captions
          "settings", // Settings menu
          "pip", // Picture-in-picture (currently Safari only)
          "airplay", // Airplay (currently Safari only)
          "fullscreen", // Toggle fullscreen
          "quality",
          "audioquality",
        ],
        quality: {
          default: bitrates.length - 1,
          options: [0, ...bitrates.map((item) => item.height)],
          forced: true,
          onChange(quality) {
            const bitrate = bitrates.findIndex(
              (item) => item.height === quality,
            );
            dash.setQualityFor("video", bitrate, true);
          },
        },
        i18n: {
          qualityLabel: {
            0: "Auto",
          },
        },
        debug: true,
        disableContextMenu: false,
      });

      if (redirectOnEnded) {
        player.on("ended", () => {
          push(redirectOnEnded);
        });
      }

      // @ts-ignore
      window.player = player;
    };

    dash.on("streamInitialized", (e) => {
      console.log("EVENT -> streamInitialized", e, dash.getTracksFor("audio"));
      const matchingAudioTracks = dash.getTracksFor("audio").map((item) => {
        // This check sucks, but is the only somewhat unique difference
        const match = dashManifest?.audioSets?.find(
          (rep) =>
            rep.representations[0].bitrate === item.bitrateList[0].bandwidth,
        );

        if (match?.track_role === "main") {
          dash.setCurrentTrack(item);
        }
      });
    });
    dash.on("bufferLoaded", bufferLoaded);

    dash.on("qualityChangeRendered", (e) => {
      if (player) {
        player.quality = e.newQuality;
      }
      console.log("EVENT -> qualityChangeRendered", e);
    });

    // @ts-ignore
    window.dash = dash;

    return () => {
      player?.destroy();
      dash.off("bufferLoaded", bufferLoaded);
      dash.destroy();
    };
  }, [
    dashManifest,
    instance,
    push,
    redirectOnEnded,
    video.author,
    video.title,
    video.videoId,
  ]);

  // TODO: Check if the HLS manifest can be proxied correctly
  // useEffect(() => {
  //   if (
  //     !dashManifest ||
  //     !("hls" in dashManifest) ||
  //     !dashManifest.hls ||
  //     !ref.current
  //   ) {
  //     return;
  //   }
  //   const hls = new Hls();
  //   hls.loadSource(
  //     dashManifest.hls.replaceAll("https://manifest.googlevideo.com", ""),
  //   );

  //   hls.attachMedia(ref.current);
  // }, [dashManifest]);

  return (
    <div key={video.videoId} className="contents">
      <video
        ref={ref}
        style={{ width: "100%", height: "100%" }}
        className={className}
        crossOrigin=""
        autoPlay
        playsInline
        controls
        poster={thumbnail.url}
      />
    </div>
  );
});
