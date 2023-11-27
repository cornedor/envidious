import clsx from "clsx";
import Link from "next/link";
import { ComponentProps } from "react";

export function NavLink({
  sub,
  ...props
}: ComponentProps<typeof Link> & { sub?: boolean }) {
  return (
    <Link
      {...props}
      className={clsx(
        "border-b border-b-slate-300 bg-slate-200 px-4 py-2 first-of-type:border-t first-of-type:border-t-slate-300 hover:bg-slate-100",
        { "pl-10 font-light": sub },
      )}
    />
  );
}
