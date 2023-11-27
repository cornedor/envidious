import { fetchFeed } from "@/api/fetchFeed";
import { VideoGrid } from "@/components/VideoGrid";

export default async function SubscriptionsPage() {
  const feed = await fetchFeed({});

  return (
    <div>
      <h1 className="p-4 text-2xl">Subscription feed</h1>

      <VideoGrid items={feed?.videos ?? []} />
    </div>
  );
}
