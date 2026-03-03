"use client"
import { TeamMemberForm } from "@/components/admin/team-member-form"
import { Button } from "@/components/ui/button"
import { tTeamPageHeaderNew } from "@/i18n/team"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/providers/lang"
import { AlertCircle, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function NewTeamMemberPage() {
  const { currentLang, isRTL, switchLanguage } = useLanguage()
  const t = tTeamPageHeaderNew[currentLang?.toLowerCase() as "en" | "ar" || "en"]

  return (
    <div className="p-6 space-y-6 h-screen">
      <div className="flex items-center gap-4 h-20">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/team">
            {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          </Link>
        </Button>

        <div className="flex w-full justify-between items-center md:flex-row flex-col">


          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
            <p className="text-muted-foreground">{t.description}</p>
          </div>

          <div
            className={cn(
              "border-orange-400 text-orange-400 text-sm p-2 rounded-md border flex items-center justify-start self-end gap-3",
              !isRTL && ""
            )}
          >
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm text-orange-400">
              {isRTL ? (
                <>
                  ستظهر هذه الخدمة في الصفحة العربية فقط.
                  <br />
                  يمكنك تحديث هذه الخدمة في الصفحة الإنجليزية لاحقاً.
                </>
              ) : (
                <>
                  This service will only appear on the English page.
                  <br />
                  You can update it later on the Arabic page.
                </>
              )}
            </p>


            <Button
              variant="secondary"
              className="cursor-pointer"
              onClick={() =>
                switchLanguage(currentLang === "EN" ? "AR" : "EN")
              }
            >
              {isRTL ? "تغيير للإنجليزية" : "Change to Arabic"}
            </Button>
          </div>
        </div>
      </div>

      <TeamMemberForm isLoadingFetchingToUpdate={false} />
    </div>
  )
}
