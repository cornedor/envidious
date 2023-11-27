"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";
import { subscribe } from "@/api/subscribe";
import { unsubscribe } from "@/api/unsubscribe";

interface SubscribeButtonProps {
  authorId: string;
  subscribed?: boolean;
  className?: string;
  instant?: boolean;
}

export function SubscribeButton({
  authorId,
  subscribed: initialSubscribed,
  className,
  instant,
}: SubscribeButtonProps) {
  const [subscribed, setSubscribed] = useState(initialSubscribed);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  return (
    <>
      <input type="hidden" name="authorId" value={authorId} />
      <input type="hidden" name="instant" value={instant ? "yes" : "no"} />
      <button
        className={twMerge(
          "rounded bg-slate-200 p-2 hover:bg-slate-300 hover:shadow active:bg-slate-200",
          className,
        )}
        type="submit"
        disabled={pending}
        onClick={async () => {
          setPending(true);
          const formData = new FormData();
          formData.set("authorId", authorId);

          if (subscribed) {
            await unsubscribe(formData);
            setSubscribed(false);
          } else {
            await subscribe(formData);
            setSubscribed(true);
          }
          if (instant) {
            router.refresh();
          }
          setPending(false);
        }}
      >
        {pending ? (
          <i className="ri-loader-line inline-block animate-spin"></i>
        ) : subscribed ? (
          <>Unsubscribe</>
        ) : (
          <>Subscribe</>
        )}
      </button>
    </>
  );
}
