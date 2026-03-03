"use client"
import { ProjectForm } from "@/components/admin/project-form"
import { Button } from "@/components/ui/button"
import { projectFormI18n } from "@/i18n/project"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/providers/lang"
import { AlertCircle, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function NewProjectPage() {
  const { isRTL, switchLanguage, currentLang } = useLanguage()
  const t = projectFormI18n[currentLang?.toLowerCase() as 'en' | 'ar' || "en"]
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center  justify-between gap-4">
        <div className="flex items-start gap-3 items-center">

        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/projects">
            {
              isRTL ?
                <ArrowRight className="h-4 w-4" />
                : <ArrowLeft className="h-4 w-4" />
            }
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.page.newProject.title}</h1>
          <p className="text-muted-foreground">{t.page.newProject.subtitle}</p>
        </div>
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

      <ProjectForm />
    </div>
  )
}
