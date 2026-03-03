"use client"

import { SectionForm } from "@/components/admin/section-form"
import { AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/providers/lang"

export default function NewSectionPage() {
  const { switchLanguage, currentLang, isRTL } = useLanguage();
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
        <div className={cn("border-orange-400 text-orange-400  text-sm p-2 rounded-md border flex items-center justify-start self-end gap-3   ", !isRTL && "")}>

          <AlertCircle className="h-5 w-5 text-orange-400  text-md" />
          {
            isRTL ?
              " ستظهر هذه الخدمة في الصفحة العربية فقط." :
              "This service will only appear on the english page.."
          }
          <Button variant={"secondary"} className="cursor-pointer" onClick={() => switchLanguage(currentLang === 'EN' ? 'AR' : 'EN')}>
            {
              isRTL ? "تغير للانجليزية" : "Change to Arabic"
            }
          </Button>

        </div>

      </div>

      <SectionForm />
    </div>
  )
}
