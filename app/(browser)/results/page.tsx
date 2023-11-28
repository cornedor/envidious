import { VideoGrid } from "@/components/VideoGrid";
import { fetchSearch } from "@/api/fetchSearch";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search results",
};

export default async function TrendingPage({
  searchParams,
}: {
  searchParams: { search_query?: string };
}) {
  if (!searchParams.search_query) {
    return <>404</>;
  }

  const result = await fetchSearch(searchParams.search_query);

  return (
    <div>
      <h1 className="p-4 text-2xl">Trending</h1>
      <VideoGrid items={result ?? []} />
    </div>
  );
}
