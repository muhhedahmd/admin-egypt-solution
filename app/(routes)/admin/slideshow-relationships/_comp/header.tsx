"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetCompanyInfoQuery } from "@/lib/store/api/companyInfo"

export default function Header({ onLoad }: { onLoad?: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const { data, isLoading } = useGetCompanyInfoQuery()

  useEffect(() => {
    if (!isLoading && data) {
      onLoad?.()
    }
  }, [isLoading, data])

  const companyInfo = data?.data

  // Navigation items - you can make this dynamic too if needed
  const navItems = [
    { label: "Services", href: "#services" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Team", href: "#team" },
    { label: "Blog", href: "#blog" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          {isLoading ? (
            <>
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="w-20 h-5 hidden sm:block" />
            </>
          ) : companyInfo?.logo?.url ? (
            <>
              <img
                src={companyInfo.logo.url}
                alt={companyInfo.logo.alt || companyInfo.name}
                className="w-8 h-8 object-contain"
              />
              <span className="font-semibold text-foreground hidden sm:inline">
                {companyInfo.name}
              </span>
            </>
          ) : (
            <>
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  {companyInfo?.name?.charAt(0).toUpperCase() || "V"}
                </span>
              </div>
              <span className="font-semibold text-foreground hidden sm:inline">
                {companyInfo?.name || "Brand"}
              </span>
            </>
          )}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <button className="hidden md:inline-flex px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
          Get Started
        </button>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-3 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/5"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <button
              className="w-full mt-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  )
}