import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const match = request.nextUrl.pathname.match(/^\/papers\/([^/]+)$/);
  if (!match) return NextResponse.next();
  const paperId = decodeURIComponent(match[1]);
  if (paperId === "attention-is-all-you-need") return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = `/local-papers/${encodeURIComponent(paperId)}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: "/papers/:path*",
};
