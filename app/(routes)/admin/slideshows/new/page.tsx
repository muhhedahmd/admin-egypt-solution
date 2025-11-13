"use client"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SlideshowForm } from "@/components/admin/slideshow-form"

export default function NewSlideshowPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/slideshows">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Slideshow</h1>
          <p className="text-muted-foreground">Add a new slideshow to your website</p>
        </div>
      </div>

      <SlideshowForm />
    </div>
  )
}
