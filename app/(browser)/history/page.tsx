import { fetchHistory } from "@/api/fetchHistory";
import Link from "next/link";

export default async function SubscriptionsPage() {
  const history = await fetchHistory();

  return (
    <div>
      <h1 className="p-4 text-2xl">History</h1>
      <ol className="list-decimal pl-14">
        {history?.map((item) => (
          <li key={item}>
            <Link
              href={{
                pathname: "watch",
                query: {
                  v: item,
                },
              }}
              className="text-blue-600 underline"
            >
              {item}
            </Link>
          </li>
        ))}
      </ol>

      {/* <VideoGrid items={feed?.videos ?? []} /> */}
    </div>
  );
}
