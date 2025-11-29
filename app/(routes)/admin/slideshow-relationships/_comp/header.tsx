"use client"

import Link from "next/link"
import { useState } from "react"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto max-w-7xl  flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
     {/*  */}
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">V</span>
          </div>
          <span className="font-semibold text-foreground hidden sm:inline">Brand</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="#services"
            className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Services
          </Link>
          <Link
            href="#portfolio"
            className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Portfolio
          </Link>
          <Link
            href="#team"
            className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Team
          </Link>
          <Link
            href="#blog"
            className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Blog
          </Link>
          <Link href="#" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="#" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
            Pricing
          </Link>
          <Link href="#" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
            About
          </Link>
          <Link
            href="#contact"
            className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* CTA Button */}
        <button className="hidden md:inline-flex px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
          Get Started
        </button>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-3 space-y-2">
            <Link
              href="#services"
              className="block px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Services
            </Link>
            <Link
              href="#portfolio"
              className="block px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Portfolio
            </Link>
            <Link
              href="#team"
              className="block px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Team
            </Link>
            <Link
              href="#blog"
              className="block px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Blog
            </Link>
            <Link
              href="#"
              className="block px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#"
              className="block px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#"
              className="block px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="#contact"
              className="block px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>
            <button className="w-full mt-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
