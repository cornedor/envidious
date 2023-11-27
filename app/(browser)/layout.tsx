import { fetchSubscriptions } from "@/api/fetchSubscriptions";
import { Header } from "@/components/Header";
import { NavLink } from "@/components/NavLink";
import SubsSubMenu from "@/components/SubsSubMenu";
import TrendingSubMenu from "@/components/TrendingSubMenu";

export default async function BrowserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const subs = await fetchSubscriptions();
  return (
    <div className="flex min-h-screen flex-col text-slate-900">
      <Header />
      <div className="flex flex-1">
        <div className="flex w-80 flex-col  border-r border-r-slate-300 bg-slate-200">
          <NavLink href="/trending">Trending</NavLink>
          <TrendingSubMenu />
          <NavLink href="/feed/subscriptions">Subscriptions</NavLink>
          <SubsSubMenu subs={subs ?? []} />
          <NavLink href="/trending">Playlists</NavLink>
        </div>
        <main className="max-w-[1400px] flex-1 bg-slate-50">{children}</main>
      </div>
    </div>
  );
}
