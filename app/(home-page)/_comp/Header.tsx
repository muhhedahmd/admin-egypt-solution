import { ThemeToggle } from '@/app/_comp/theme-toggle'
import { Button } from '@/components/ui/button'
import { jwtVerify } from 'jose'
import { BarChartBigIcon } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import React from 'react'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

const Header = async () => {
  const Cookies = await cookies()
  const accessToken = Cookies.get("accessToken")?.value || Cookies.get("__Secure-accessToken")?.value
  
  let user = null
  
  if (accessToken) {
    try {
      const verified = await jwtVerify(accessToken, JWT_SECRET);
      user = verified.payload

    } catch (error) {
      console.error("Token verification failed:", error)
    }
  }
  console.log({user})

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BarChartBigIcon className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">AdminPro</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/admin/settings" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Settings
            </Link>
            <Link 
              href="/admin" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/admin/services" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              services
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth Buttons */}
            {user ? (
              <>
                <Link href="/admin">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header