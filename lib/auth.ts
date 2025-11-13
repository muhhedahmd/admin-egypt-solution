import crypto from "crypto"

// Mock user database
const users: Record<string, any> = {}
const otpStore: Record<string, { code: string; expiresAt: number }> = {}

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function generateSession(userId: string, email: string, role: string) {
  return {


    userId,
    email,
    role,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  }
}

export function storeOTP(email: string, otp: string) {
  otpStore[email] = {
    code: otp,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
  }
}

export function verifyOTP(email: string, otp: string): boolean {
  const stored = otpStore[email]
  if (!stored) return false
  if (Date.now() > stored.expiresAt) {
    delete otpStore[email]
    return false
  }
  return stored.code === otp
}

export function createUser(email: string, password: string, firstName: string, lastName: string, role: string) {
  const userId = crypto.randomUUID()
  const hashedPassword = hashPassword(password)

  users[email] = {
    id: userId,
    email,
    password: hashedPassword,
    firstName,
    lastName,
    role,
    createdAt: new Date(),
  }

  return userId
}

export function findUser(email: string) {
  return users[email]
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}


export async function refreshAccessTokenClient() {
  try {
    const response = await fetch("/api/auth/refresh-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })

    if (!response.ok) {
      // Redirect to login if refresh fails
      window.location.href = "/auth/login"
      return false
    }

    return true
  } catch (error) {
    console.error("Client token refresh failed:", error)
    window.location.href = "/auth/login"
    return false
  }
}
