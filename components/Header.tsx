import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SearchSubmitButton } from "./SearchSubmitButton";
import { getInstance } from "@/api/getInstance";

async function submitSearch(formData: FormData) {
  "use server";

  return redirect(`/results?search_query=${formData.get("search_query")}`);
}

async function login() {
  "use server";

  const url = new URL("authorize_token", getInstance());
  url.searchParams.set(
    "scopes",
    ":history*,:subscriptions*,:playlists*,:feed*,:notifications*,:preferences*",
  );
  url.searchParams.set("callback_url", "http://localhost:3000/authorized");
  // url.searchParams.set("expire", "2629746");

  return redirect(url.toString());
}

export function Header() {
  const username = cookies().get("iv-username");

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between bg-slate-600 px-4 text-slate-50 dark:bg-slate-900 dark:text-slate-300">
      <Link
        className="text-lg font-semibold"
        href={username ? "/feed/subscriptions" : "/trending"}
      >
        Envidious
      </Link>
      <form
        className="rounded-full focus-within:ring focus-within:ring-teal-400"
        action={submitSearch}
      >
        <input
          name="search_query"
          type="search"
          placeholder="Search"
          className="w-80 rounded-l-full bg-slate-500 px-4 py-1 focus:outline-none dark:bg-slate-700"
        />
        <SearchSubmitButton />
      </form>
      <div>
        {username?.value ? (
          <div>
            {" "}
            <i className="ri-user-line"></i> {username.value}
          </div>
        ) : (
          <form action={login}>
            <button type="submit">
              <i className="ri-login-box-line"></i> Login
            </button>
          </form>
        )}
      </div>
    </header>
  );
}
