"use client";
import { useFormStatus } from "react-dom";

export function SearchSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className="rounded-r-full bg-slate-500 px-2.5 py-1 hover:bg-slate-400"
      disabled={pending}
    >
      {pending ? (
        <i className="ri-loader-line inline-block animate-spin"></i>
      ) : (
        <i className="ri-search-line"></i>
      )}
    </button>
  );
}
