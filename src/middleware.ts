// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("adminToken")?.value;

  const pathname = request.nextUrl.pathname;

  // Only protect /admin routes (but not /admin/login)
  const isAdminProtectedRoute =
    pathname.startsWith("/admin") && pathname !== "/admin/login";

  if (isAdminProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
