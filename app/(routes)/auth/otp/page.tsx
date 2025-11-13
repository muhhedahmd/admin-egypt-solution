import { OTPForm } from "@/components/auth/otp-form"

export const metadata = {
  title: "Verify OTP - Admin Panel",
  description: "Verify your email with OTP",
}

export default function OTPPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Verify Email</h1>
        <p className="text-gray-600 mt-2">Enter the OTP sent to your email</p>
      </div>
      <OTPForm />
    </div>
  )
}
