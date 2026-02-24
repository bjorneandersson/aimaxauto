import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const isLoginPage = req.nextUrl.pathname === "/admin/login";

    // Allow login page
    if (isLoginPage) return NextResponse.next();

    // Block non-admin users from /admin routes
    if (isAdminRoute && token?.role !== "ADMIN" && token?.role !== "MODERATOR") {
      return NextResponse.redirect(new URL("/admin/login?error=unauthorized", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow login page without auth
        if (req.nextUrl.pathname === "/admin/login") return true;
        // Require auth for all other admin routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
