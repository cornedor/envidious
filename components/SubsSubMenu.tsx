"use client";
import { usePathname } from "next/navigation";
import { NavLink } from "./NavLink";
import { Subscription } from "@/api/fetchSubscriptions";

export default function TrendingSubMenu({ subs }: { subs: Subscription[] }) {
  const pathname = usePathname();

  return pathname.startsWith("/feed/subscriptions") ||
    pathname.startsWith("/channel") ? (
    <>
      {subs?.map((item) => (
        <NavLink
          key={item.authorId}
          href={{ pathname: `/channel/${item.authorId}` }}
          sub
        >
          {item.author}
        </NavLink>
      ))}
    </>
  ) : null;
}
