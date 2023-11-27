import { cookies } from "next/headers";
import { fetchPreferences } from "@/api/fetchPreferences";
import { fetchTrending } from "@/api/fetchTrending";
import { VideoGrid } from "@/components/VideoGrid";

export default async function TrendingPage({
  searchParams,
}: {
  searchParams: { type?: string; region?: string };
}) {
  const prefs = cookies().has("iv-token")
    ? await fetchPreferences()
    : undefined;

  const videos = await fetchTrending({
    type: searchParams.type,
    region: searchParams.region ?? prefs?.region,
  });

  return (
    <div>
      <h1 className="p-4 text-2xl">Trending</h1>

      <VideoGrid items={videos ?? []} />
    </div>
  );
}
