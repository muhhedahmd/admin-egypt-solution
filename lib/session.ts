import { cookies } from "next/headers"

export async function setSessionCookie(session: any) {
  const cookieStore = await cookies()
  cookieStore.set("session", JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60, // 24 hours
  })
}

export async function getSessionCookie() {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")
  return session ? JSON.parse(session.value) : null
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}
