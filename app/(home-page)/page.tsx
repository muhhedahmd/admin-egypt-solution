import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart3, FolderKanban, Users, Settings, Bell, Search, Github, Twitter, Linkedin, Mail } from "lucide-react"
import { Metadata } from "next"
import Header from "./_comp/Header"

export const metadata: Metadata = {
  title: "AdminPro - Software Company Admin Panel | Project & Team Management",
  description: "Powerful admin panel for software companies. Manage services, projects, team members, clients, and analytics in one unified platform. Start your free trial today.",
  keywords: "admin panel, software company management, project management, team collaboration, analytics dashboard, CMS",
  authors: [{ name: "AdminPro Team" }],
  openGraph: {
    title: "AdminPro - Software Company Admin Panel",
    description: "Manage your software company with confidence. Powerful tools for project management, team collaboration, and business analytics.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AdminPro - Software Company Admin Panel",
    description: "Powerful admin panel for software companies. Manage everything in one place.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Home() {
  const currentYear = new Date().getFullYear() +1

  return (
    <>
    <Header/>
      


      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 md:py-24 flex-grow">
        <div className="text-center space-y-6 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            New Features Available
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight">
            Manage Your Software Company
            <span className="text-primary block mt-2">With Confidence</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            A powerful admin panel designed for software companies. Manage services, projects, team members, and more in one unified platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/auth/register">
              <Button size="lg" className="w-full sm:w-auto px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">100+</div>
            <p className="text-sm text-muted-foreground">Services Managed</p>
          </div>

          <div className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FolderKanban className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">250+</div>
            <p className="text-sm text-muted-foreground">Projects Delivered</p>
          </div>

          <div className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">50+</div>
            <p className="text-sm text-muted-foreground">Team Members</p>
          </div>

          <div className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Settings className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">24/7</div>
            <p className="text-sm text-muted-foreground">Support Available</p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground">
              Comprehensive tools to manage every aspect of your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border rounded-lg p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FolderKanban className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Project Management
              </h3>
              <p className="text-sm text-muted-foreground">
                Track projects from planning to completion with full status management
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Team Collaboration
              </h3>
              <p className="text-sm text-muted-foreground">
                Manage team members, roles, and permissions with ease
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Analytics & Insights
              </h3>
              <p className="text-sm text-muted-foreground">
                Get detailed analytics on visitors, page views, and engagement
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/30 mt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-foreground">AdminPro</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional admin panel for modern software companies. Streamline your workflow and boost productivity.
              </p>
              <div className="flex items-center gap-3">
                <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <Github className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <Twitter className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <Linkedin className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Product Column */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/integrations" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="/changelog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    API Reference
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} AdminPro. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>

  )
}