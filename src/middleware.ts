import { NextRequest, NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════════════
// SITE PASSWORD — change via env variable or edit default here
// ═══════════════════════════════════════════════════════════════
const SITE_PASSWORD = process.env.SITE_PASSWORD || "aimaxauto2026";
const COOKIE_NAME = "site-auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip: password page itself, API auth routes, static assets
  if (
    pathname === "/password" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Check password cookie
  const authCookie = req.cookies.get(COOKIE_NAME)?.value;
  if (authCookie !== SITE_PASSWORD) {
    const url = req.nextUrl.clone();
    url.pathname = "/password";
    url.searchParams.set("from", pathname);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|app-legacy\\.html).*)",
  ],
};
