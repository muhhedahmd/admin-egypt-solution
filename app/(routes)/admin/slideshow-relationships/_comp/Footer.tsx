"use client"

import Link from "next/link"
import { Facebook, Twitter, Linkedin, Instagram, Github, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetCompanyInfoQuery } from "@/lib/store/api/companyInfo"

export default function Footer() {
  const { data, isLoading, isError } = useGetCompanyInfoQuery()
  const currentYear = new Date().getFullYear()

  // Loading state
  if (isLoading) {
    return (
      <footer className="w-full border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </footer>
    )
  }

  // Error or no data state
  if (isError || !data?.data) {
    return (
      <footer className="w-full border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">© {currentYear} All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
  }

  const companyInfo = data.data

  // Social media links
  const socialLinks = [
    { icon: Facebook, url: companyInfo.facebook, label: "Facebook" },
    { icon: Twitter, url: companyInfo.twitter, label: "Twitter" },
    { icon: Linkedin, url: companyInfo.linkedin, label: "LinkedIn" },
    { icon: Instagram, url: companyInfo.instagram, label: "Instagram" },
    { icon: Github, url: companyInfo.github, label: "GitHub" },
    { icon: Youtube, url: companyInfo.youtube, label: "YouTube" },
  ].filter(link => link.url)

  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {companyInfo.logo?.url ? (
                <img 
                  src={companyInfo.logo.url} 
                  alt={companyInfo.logo.alt || companyInfo.name}
                  className="w-8 h-8 object-contain"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">
                    {companyInfo.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="font-semibold text-foreground">{companyInfo.name}</span>
            </div>
            
            {companyInfo.tagline && (
              <p className="text-sm font-medium text-foreground">{companyInfo.tagline}</p>
            )}
            
            {companyInfo.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {companyInfo.description}
              </p>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <ul className="space-y-3">
              {companyInfo.email && (
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <a 
                    href={`mailto:${companyInfo.email}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors break-all"
                  >
                    {companyInfo.email}
                  </a>
                </li>
              )}
              
              {companyInfo.phone && (
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <a 
                    href={`tel:${companyInfo.phone}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {companyInfo.phone}
                  </a>
                </li>
              )}
              
              {(companyInfo.address || companyInfo.city || companyInfo.country) && (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    {[companyInfo.address, companyInfo.city, companyInfo.postalCode, companyInfo.country]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </li>
              )}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Bottom Bar */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {companyInfo.name}. All rights reserved.
          </p>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={link.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}