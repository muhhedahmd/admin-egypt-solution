import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-2xl">
        <div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Admin Panel</h1>
          <p className="text-xl text-gray-600">Manage your software company website with ease</p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/auth/login">
            <Button size="lg" className="px-8">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button size="lg" variant="outline" className="px-8 bg-transparent">
              Create Account
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-12">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
            <p className="text-gray-600">Services Managed</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
            <p className="text-gray-600">Projects Completed</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
            <p className="text-gray-600">Support Available</p>
          </div>
        </div>
      </div>
    </main>
  )
}
