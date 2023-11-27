import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("iv-token")?.value;

  if (token) {
    return new Response("Redirecting...", {
      status: 302,
      headers: {
        Location: "/feed/subscriptions",
      },
    });
  }

  return new Response("Redirecting...", {
    status: 302,
    headers: {
      Location: "/trending",
    },
  });
}
