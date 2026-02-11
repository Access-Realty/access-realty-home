// ABOUTME: Hostname-based routing for multi-domain brand separation
// ABOUTME: Rewrites direct-list.com requests to /direct-list/* routes without changing browser URL

import { NextRequest, NextResponse } from "next/server";

const DIRECTLIST_HOSTS = ["direct-list.com", "www.direct-list.com"];

// Paths that should pass through to their own routes (not prefixed with /direct-list)
const SHARED_PATHS = ["/privacy", "/terms", "/api/", "/_next/", "/favicon"];

export function proxy(request: NextRequest) {
  const hostname = request.headers.get("host")?.split(":")[0] || "";
  const { pathname } = request.nextUrl;

  const isDirectList = DIRECTLIST_HOSTS.includes(hostname);

  // Set brand header for all requests
  const response = isDirectList
    ? handleDirectListRequest(request, pathname)
    : NextResponse.next();

  response.headers.set("x-brand", isDirectList ? "directlist" : "access");
  return response;
}

function handleDirectListRequest(
  request: NextRequest,
  pathname: string
): NextResponse {
  // Skip rewrites for shared paths, static files, and API routes
  if (SHARED_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Skip static files
  if (pathname.includes(".")) {
    return NextResponse.next();
  }

  // Rewrite: direct-list.com/get-started → internal /direct-list/get-started
  // direct-list.com/ → internal /direct-list
  const internalPath =
    pathname === "/" ? "/direct-list" : `/direct-list${pathname}`;

  const url = request.nextUrl.clone();
  url.pathname = internalPath;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)$).*)",
  ],
};
