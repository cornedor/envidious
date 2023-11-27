import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  console.log(request);

  const headers = new Headers();

  headers.set("Content-Type", "application/vnd.apple.mpegurl");
  headers.set("Access-Control-Allow-Origin", "*");

  const url = new URL(
    request.nextUrl.pathname,
    "https://manifest.googlevideo.com",
  );
  console.log(url.toString());
  const response = await fetch(url);
  const text = await response.text();

  return new Response(
    text
      .replaceAll("https://manifest.googlevideo.com", "http://localhost:3000")
      .replaceAll(/https:\/\/(.*)\.googlevideo\.com/gm, "https://video.cd0.nl"),
    {
      headers,
    },
  );
}
