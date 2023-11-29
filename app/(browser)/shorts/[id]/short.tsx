import { Video, VideoDetails } from "@/api/Video";
import { fetchInnertubeInfo } from "@/api/fetchInnertubeInfo";
import { fetchVideo } from "@/api/fetchVideo";
import { VideoPlayer } from "@/components/VideoPlayer";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface ShortProps {
  video: Video;
}

export function Short({ video }: ShortProps) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  const [videoDetails, setVideoDetails] = useState<VideoDetails | undefined>(
    undefined,
  );

  const callback = useCallback<IntersectionObserverCallback>(
    async ([target]) => {
      setInView(target.isIntersecting);

      const data = await fetchVideo(video.videoId);
      // const dashManifest = await fetchInnertubeInfo(video.videoId);
      setVideoDetails(data);
    },
    [video.videoId],
  );

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new IntersectionObserver(callback, {
      threshold: 0.5,
    });

    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [callback]);

  const thumbnail = video.videoThumbnails?.find(
    (item) => item.quality === "maxres",
  );

  return (
    <div
      ref={ref}
      className={clsx(
        "h-full w-full overflow-hidden rounded-xl bg-black transition-transform",
        {
          "origin-center scale-95 ": !inView,
          "": inView,
        },
      )}
    >
      {inView && videoDetails ? (
        // <Image
        //   src={thumbnail?.url ?? ""}
        //   width={thumbnail?.width ?? 0}
        //   height={thumbnail?.height ?? 0}
        //   alt=""
        //   className="h-full w-full object-cover"
        // />
        <VideoPlayer
          className="h-full w-full object-cover"
          video={videoDetails}
          instance={"https://video.cd0.nl"}
          skipPlyr
        />
      ) : (
        <Image
          src={thumbnail?.url ?? ""}
          width={thumbnail?.width ?? 0}
          height={thumbnail?.height ?? 0}
          alt=""
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}
