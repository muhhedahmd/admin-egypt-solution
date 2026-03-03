"use client"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TestimonialsTable } from "@/components/admin/testimonials-table"
import Link from "next/link"
import { useLanguage } from "@/providers/lang"
import { tTestimonialsPagei18n } from "@/i18n/testimonals"

export default function TestimonialsPage() {
  const {currentLang
    , isRTL} = useLanguage()

    const t = tTestimonialsPagei18n[currentLang?.toLowerCase() as 'en' | 'ar' || "en"]


  return (
    <div className="p-6 space-y-6">

      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
          <p className="text-muted-foreground">{t.description}</p>
        </div>
        <Button asChild>
          <Link href="/admin/testimonials/new">
            <Plus className="h-4 w-4 mr-2" />
            {t.addButton}
          </Link>
        </Button>
      </div>

      <TestimonialsTable />
    </div>
  )
}
