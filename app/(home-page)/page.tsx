import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Layout, Palette, Zap, ArrowRight, CheckCircle2, MonitorSmartphone, Code2, Sparkles } from "lucide-react"
import { Metadata } from "next"
import Header from "./_comp/Header"

export const metadata: Metadata = {
  title: "DevBuilder - The Ultimate Website Builder",
  description: "Create stunning websites without writing a single line of code. DevBuilder offers a powerful, intuitive drag-and-drop interface for everyone.",
}

export default function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 flex flex-col">
      <Header />

      {/* Hero Section */}
      <main className="grow">
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10" />

          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span>The Next Generation Website Builder</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
              Build Stunning Websites <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/60">
                In Minutes, Not Months.
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience the seamless creation process. Drag, drop, and publish beautiful, responsive websites with our advanced builder. No coding required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/register">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full group">
                  Start Building Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-muted/30 border-t">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Design Without Limits</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Everything you need to create a professional online presence, built right into the platform.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: <Layout className="w-6 h-6 text-primary" />,
                  title: "Intuitive Drag & Drop",
                  desc: "Move elements freely around the canvas. What you see is exactly what you get."
                },
                {
                  icon: <Palette className="w-6 h-6 text-primary" />,
                  title: "Beautiful Templates",
                  desc: "Start with carefully crafted templates and customize them to match your brand perfectly."
                },
                {
                  icon: <MonitorSmartphone className="w-6 h-6 text-primary" />,
                  title: "Fully Responsive",
                  desc: "Your website will look incredible on desktops, tablets, and smartphones automatically."
                },
                {
                  icon: <Zap className="w-6 h-6 text-primary" />,
                  title: "Lightning Fast",
                  desc: "Optimized code generation ensures your website loads instantly for your visitors."
                },
                {
                  icon: <Code2 className="w-6 h-6 text-primary" />,
                  title: "Clean Code Export",
                  desc: "Want to host it yourself? Export clean, semantic HTML and CSS with one click."
                },
                {
                  icon: <CheckCircle2 className="w-6 h-6 text-primary" />,
                  title: "SEO Optimized",
                  desc: "Built-in tools to help your website rank higher in search engine results."
                }
              ].map((feature, i) => (
                <div key={i} className="p-6 rounded-2xl bg-background border hover:border-primary/50 transition-colors shadow-sm hover:shadow-md">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Layout className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">DevBuilder</span>
          </div>
          <p className="text-muted-foreground mb-6">Empowering creators to build the web.</p>
          <div className="flex gap-6 justify-center text-sm font-medium">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
          </div>
          <p className="text-sm text-muted-foreground mt-8">
            © {currentYear} DevBuilder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}