"use client"

import { SectionForm } from "@/components/admin/section-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function EditSectionPage({ params }: { params: { id: string } }) {
  const section = {
    id: params.id,
    title: "Hero Section",
    slug: "hero",
    description: "Main hero section with featured slideshow",
    type: "HERO",
    isActive: true,
    order: 1,
    selectedSlideshows: ["1"],
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/sections/${params.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Section</h1>
          <p className="text-sm text-muted-foreground mt-1">Update section details and slideshows</p>
        </div>
      </div>

      <SectionForm initialData={section} />
    </div>
  )
}
