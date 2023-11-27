"use client";
import { usePathname } from "next/navigation";
import { NavLink } from "./NavLink";

export default function TrendingSubMenu() {
  const pathname = usePathname();

  return pathname.startsWith("/trending") ? (
    <>
      <NavLink href="/trending" sub>
        Now
      </NavLink>
      <NavLink href="/trending?type=Music" sub>
        Music
      </NavLink>
      <NavLink href="/trending?type=Gaming" sub>
        Gaming
      </NavLink>
      <NavLink href="/trending?type=Movies" sub>
        Movies
      </NavLink>
    </>
  ) : null;
}
