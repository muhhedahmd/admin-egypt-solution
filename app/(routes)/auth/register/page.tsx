import { RegisterForm } from "@/components/auth/register-form"

export const metadata = {
  title: "Register - Admin Panel",
  description: "Create a new account",
}

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
        <p className="text-gray-600 mt-2">Join our admin panel</p>
      </div>
      <RegisterForm />
    </div>
  )
}
