"use client";

import { ReactNode, useState } from "react";
import { twMerge } from "tailwind-merge";

interface DescriptionProps {
  html: string;
  className?: string;
  labelMore?: ReactNode;
  labelLess?: ReactNode;
}

export function Description({
  html,
  className,
  labelMore = "Read more",
  labelLess = "Read less",
}: DescriptionProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={twMerge(
          "html-content whitespace-pre-wrap",
          open ? "" : "fade-out-text max-h-28 overflow-hidden",
          className,
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <button
        className="mt-1 rounded bg-slate-200 p-1 px-2 hover:bg-slate-300"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? labelLess : labelMore}
      </button>
    </>
  );
}
