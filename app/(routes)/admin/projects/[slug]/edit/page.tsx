"use client"
import { AlertCircle } from "lucide-react"
import { ProjectEditorForm } from "../../_comp/ProjectEditorForm"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/providers/lang"
import { cn } from "@/lib/utils"
import { projectFormI18n } from "@/i18n/project"
import React from "react"

export default function EditProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const projectSlug = React.use(params).slug
  const { currentLang, isRTL, switchLanguage } = useLanguage()
  const t = projectFormI18n[currentLang?.toLowerCase() as 'en' | 'ar' || "en"]



  return (
    <div className="min-h-screen bg-background flex items-start flex-col justify-start p-4 sm:p-6 lg:p-8">
      {/* Background Glow */}

      <div className=" flex justify-between w-full border-b border-border w-fukk pb-3 mb-0 w-full">
       <div>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
           <span className="text-gradient">{t.page.editProject.title}</span>
        </h1>
        <p className="text-muted-foreground">
          {t.page.editProject.subtitle}
        </p>
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


      <ProjectEditorForm projectSlug={projectSlug} />
    </div>
  )
}
