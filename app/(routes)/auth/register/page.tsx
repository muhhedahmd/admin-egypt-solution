import { RegisterForm } from "@/components/auth/register-form"

export const metadata = {
  title: "Register - Admin Panel",
  description: "Create a new account",
}

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold ">Create Account</h1>
        <p className=" mt-2">Join our admin panel</p>
      </div>
      <RegisterForm />
    </div>
  )
}
