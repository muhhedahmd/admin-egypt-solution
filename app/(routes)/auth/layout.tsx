import type React from "react"
import { Sparkles } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Visual Section */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-muted/30 relative overflow-hidden border-r">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10" />
        <div className="max-w-md text-center relative z-10 px-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-8 border border-primary/20 shadow-sm shadow-primary/10">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl font-extrabold mb-4 tracking-tight text-foreground">
            Welcome to DevBuilder
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Experience the future of visual web development. Build, test, and deploy faster than ever before with our intuitive toolset.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex items-center justify-center p-8 xs:p-12 relative">
        <div className="absolute top-8 left-8 lg:hidden flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="font-bold text-lg">DevBuilder</span>
        </div>
        <div className="w-full max-w-sm space-y-6">
          {children}
        </div>
      </div>
    </div>
  )
}
