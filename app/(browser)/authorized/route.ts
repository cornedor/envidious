import { NextRequest } from "next/server";
import { serialize } from "cookie";

export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const token = searchParams.get("token");
  const username = searchParams.get("username");
  if (username && token) {
    const headers = new Headers();
    headers.set("Location", "/feed/subscriptions");
    headers.append(
      "Set-Cookie",
      serialize("iv-token", token, {
        httpOnly: true,
        maxAge: 2629746,
      }),
    );
    headers.append(
      "Set-Cookie",
      serialize("iv-username", username, {
        httpOnly: true,
        maxAge: 2629746,
      }),
    );
    return new Response("Redirecting...", {
      status: 302,
      headers,
    });
  }

  return new Response("Redirecting...", {
    status: 302,
    headers: {
      Location: "/trending",
    },
  });

  // redirect("/feed/subscriptions");
  // return Response.redirect();
}
