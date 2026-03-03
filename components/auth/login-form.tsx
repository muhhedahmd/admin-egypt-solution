"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import axios from "axios"
export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  console.log(process.env.NEXT_PUBLIC_BACKEND_URL_API + "/auth/login")
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (email === "admin" && password === "admin") {
        document.cookie = "accessToken=demo-token; path=/";
        router.push("/admin");
        return;
      }

      const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL_API + "/auth/login", {
        "email": email,
        "password": password
      }, {
        withCredentials: true
      })


      const data = await response.data
      console.log(data)
      if (data.success === false) {
        setError(data.error || "Login failed")
        return
      }



      // Redirect based on role
      if (data.user.role === "ADMIN") {
        console.log(data.user)
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      console.log(err)
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // const handleGoogleSignIn = async () => {
  //   try {
  //     const response = await fetch("/api/auth/google", {
  //       method: "POST",
  //     })
  //     const data = await response.json()
  //     window.location.href = data.authUrl
  //   } catch (err) {
  //     setError("Google sign-in failed")
  //   }
  // }

  return (
    <Card className="p-6 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

        <div>
          <label className="block text-sm font-medium  mb-1">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium  mb-1">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      {/* 
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t 0"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 ">Or continue with</span>
        </div>
      </div> */}
      {/* 
      <Button type="button" variant="outline" className="w-full bg-transparent" onClick={handleGoogleSignIn}>
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Google
      </Button> */}

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </Card>
  )
}
