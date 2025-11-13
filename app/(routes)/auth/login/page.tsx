import { LoginForm } from "@/components/auth/login-form"

export const metadata = {
  title: "Login - Admin Panel",
  description: "Sign in to your account",
}

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-gray-600 mt-2">Sign in to your admin account</p>
      </div>
      <LoginForm />
    </div>
  )
}
