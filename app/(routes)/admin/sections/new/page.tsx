"use client"

import { SectionForm } from "@/components/admin/section-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NewSectionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/sections">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Section</h1>
          <p className="text-sm text-muted-foreground mt-1">Add a new section to your website</p>
        </div>
      </div>

      <SectionForm />
    </div>
  )
}
