import { Feed, fetchFeed } from "@/api/fetchFeed";
import { VideoGrid } from "@/components/VideoGrid";
import { getVideoType } from "@/components/getVideoType";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Subscriptions feed",
};

function stripShorts(feed: Feed | undefined) {
  const stripShorts = cookies().get("ev-strip-shorts")?.value;
  return stripShorts
    ? feed?.videos.filter((item) => !getVideoType(item).isShort)
    : feed?.videos;
}

export default async function SubscriptionsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const feed = await fetchFeed(searchParams);

  const noShorts = stripShorts(feed);

  async function loadMore(page: number) {
    "use server";

    const feed = await fetchFeed({
      page: page ? String(page) : undefined,
    });

    return stripShorts(feed);
  }

  return (
    <div>
      <h1 className="p-4 text-2xl">Subscription feed</h1>

      <VideoGrid items={noShorts ?? []} loadMore={loadMore} />
    </div>
  );
}
