import { type NextRequest, NextResponse } from "next/server";

// Demo mode: bypass all authentication, redirect everything to /admin
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Redirect root "/" to "/admin"
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Redirect auth pages (login/register) to /admin — no login needed in demo
  const authRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password"];
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Allow all /admin routes through without any token verification
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/dashboard/:path*", "/auth/:path*"],
};
