import axios from "axios";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key",
);

const isProd = process.env.NODE_ENV === "production";

export async function POST(request: NextRequest) {
  try {
    if (
      process.env.NEXT_PUBLIC_FALLBACK_TOKEN &&
      process.env.NEXT_PUBLIC_FALLBACK_REFRESH_TOKEN
    ) {
      return NextResponse.json(
        {
          newAccessToken: process.env.NEXT_PUBLIC_FALLBACK_TOKEN,
          newRefreshToken: process.env.NEXT_PUBLIC_FALLBACK_REFRESH_TOKEN,
        },
        { status: 200 },
      );
    }

    const { refreshToken } = await request.json();
    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token required" },
        { status: 400 },
      );
    }

    // Verify refresh token validity
    const verified = await jwtVerify(refreshToken, JWT_SECRET);
    const payload = verified.payload as any;

    if (payload.type !== "refresh") {
      return NextResponse.json(
        { error: "Invalid token type" },
        { status: 401 },
      );
    }

    const backendRes = await axios.post(
      `${process.env.BACKEND_URL || "http://localhost:5000"}/api/auth/refresh-token`,
      {
        refreshToken,
      },
      {
        withCredentials: true,
      },
    );

    const setCookieHeader = backendRes.headers["set-cookie"];

    // Handle both single cookie string and array of cookies
    const cookies_array = Array.isArray(setCookieHeader)
      ? setCookieHeader
      : [setCookieHeader];

    // Cookie names based on environment
    const accessTokenName = isProd ? "__Secure-accessToken" : "accessToken";
    const refreshTokenName = isProd ? "__Secure-refreshToken" : "refreshToken";

    // Extract tokens from cookies
    const accessTokenCookie = cookies_array.find(
      (cookie): cookie is string =>
        cookie !== undefined && cookie.startsWith(`${accessTokenName}=`),
    );
    const refreshTokenCookie = cookies_array.find(
      (cookie): cookie is string =>
        cookie !== undefined && cookie.startsWith(`${refreshTokenName}=`),
    );

    const extractTokenValue = (cookieStr: string): string => {
      if (!cookieStr) return "";
      const tokenValue = cookieStr.split(";")[0].split("=")[1];
      return decodeURIComponent(tokenValue?.trim() || "");
    };

    const newAccessToken = extractTokenValue(accessTokenCookie || "");
    const newRefreshToken = extractTokenValue(refreshTokenCookie || "");

    return NextResponse.json(
      {
        newAccessToken,
        newRefreshToken,
      },
      {
        status: 200,
      },
    );
  } catch (err) {
    console.error("proxy refresh error", err);
    return NextResponse.json({ error: "refresh failed" }, { status: 500 });
  }
}
