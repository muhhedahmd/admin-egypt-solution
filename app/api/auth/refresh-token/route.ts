import axios from "axios"
import { jwtVerify, SignJWT } from "jose"
import { NextRequest, NextResponse } from "next/server"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
)

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const { refreshToken } = await request.json()
    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token required" },
        { status: 400 }
      )
    }

    // Verify refresh token validity
    const verified = await jwtVerify(refreshToken, JWT_SECRET)
    const payload = verified.payload as any

    if (payload.type !== "refresh") {
      return NextResponse.json(
        { error: "Invalid token type" },
        { status: 401 }
      )
    }

    const backendRes = await axios.post(
      `http://localhost:5000/api/auth/refresh-token`,
      {
        refreshToken
      },
      {
        withCredentials: true
      }
    )

    // Get set-cookie header(s)
    const setCookieHeader = backendRes.headers["set-cookie"]
    
    // Handle both single cookie string and array of cookies
    const cookies_array = Array.isArray(setCookieHeader) 
      ? setCookieHeader 
      : [setCookieHeader]

    // Extract tokens from cookies
    const accessTokenCookie = cookies_array.find((cookie): cookie is string =>
      cookie !== undefined && cookie.startsWith("accessToken=")
    )
    const refreshTokenCookie = cookies_array.find((cookie): cookie is string =>
      cookie !== undefined && cookie.startsWith("refreshToken=")
    )
    

    const extractTokenValue = (cookieStr: string): string => {
      if (!cookieStr) return ""
      const tokenValue = cookieStr.split(";")[0].split("=")[1]
      return decodeURIComponent(tokenValue?.trim() || "")
    }

    const newAccessToken = extractTokenValue(accessTokenCookie || "")
    const newRefreshToken = extractTokenValue(refreshTokenCookie || "")


    return NextResponse.json(
      {
        newAccessToken,
        newRefreshToken
      },
      {
        status: 200
      }
    )
  } catch (err) {
    console.error("proxy refresh error", err)
    return NextResponse.json(
      { error: "refresh failed" },
      { status: 500 }
    )
  }
}