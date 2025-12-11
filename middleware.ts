import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

const isProd = process.env.NODE_ENV === "production";

interface TokenPayload {
  userId: string;
  email: string;
  role: "ADMIN" | "USER";
  name: string;
  emailConfirmation: boolean;
  deviceVerification: boolean;
  profileId: string;
  profileComplete: boolean;
  avatarUrl: string;
  type: "access" | "refresh";
  iat: number;
  exp: number;
}

async function verifyAuth(token: string): Promise<TokenPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as TokenPayload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

function isTokenExpired(exp: number): boolean {
  return Date.now() >= exp * 1000;
}

async function refreshAccessToken(
  refreshToken: string,
  request: NextRequest
): Promise<{ response: NextResponse; newAccessToken: string } | null> {
  try {
    const cookieStore = await cookies();
    const payload = await verifyAuth(refreshToken);
    
    if (!payload || payload.type !== "refresh" || isTokenExpired(payload.exp)) {
      console.log("no payload");
      cookieStore.delete(isProd ? "__Secure-accessToken" : "accessToken");
      cookieStore.delete(isProd ? "__Secure-refreshToken" : "refreshToken");
      return null;
    }

    const refreshUrl = new URL(
      "/api/auth/refresh-token",
      request.url
    ).toString();
    
    const res = await fetch(refreshUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: request.headers.get("cookie") || "",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    const { newAccessToken, newRefreshToken } = data;

    if (!newAccessToken || !newRefreshToken) return null;

    const response = NextResponse.next();

    response.cookies.set(
      isProd ? "__Secure-accessToken" : "accessToken",
      newAccessToken,
      {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        expires: new Date(Date.now() + 15 * 60 * 1000), // 15min
        path: "/",
      }
    );

    response.cookies.set(
      isProd ? "__Secure-refreshToken" : "refreshToken",
      newRefreshToken,
      {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        path: "/",
      }
    );

    return { response, newAccessToken };
  } catch (error: any) {
    console.error("Token refresh failed:", error?.message ?? error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const cookieStore = await cookies();

  const accessTokenName = isProd ? "__Secure-accessToken" : "accessToken";
  const refreshTokenName = isProd ? "__Secure-refreshToken" : "refreshToken";

  const accessToken = request.cookies.get(accessTokenName)?.value;
  const refreshToken = request.cookies.get(refreshTokenName)?.value;

  const publicRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
  ];

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    if (accessToken) {
      const payload = await verifyAuth(accessToken);
      if (payload && !isTokenExpired(payload.exp)) {
        const redirectUrl = payload.role === "ADMIN" ? "/admin" : "/dashboard";
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
    }

    if (!accessToken && refreshToken) {
      const refreshed = await refreshAccessToken(refreshToken, request);
      if (refreshed) {
        return refreshed.response;
      }
    }

    return NextResponse.next();
  }

  const protectedRoutes = ["/admin", "/dashboard"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    let payload = accessToken ? await verifyAuth(accessToken) : null;

    if (!payload || isTokenExpired(payload.exp)) {
      if (refreshToken) {
        const refreshed = await refreshAccessToken(refreshToken, request);
        console.log("refreshed", refreshed);
        if (refreshed) {
          payload = await verifyAuth(refreshed.newAccessToken);

          console.log("refreshed", refreshed.response);
          if (payload && !isTokenExpired(payload.exp)) {
            return refreshed.response;
          }
        }
      }

      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (pathname.startsWith("/admin") && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/auth/:path*"],
};