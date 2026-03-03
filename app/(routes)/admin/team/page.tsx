"use client"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

import Link from "next/link"
import dynamic from "next/dynamic"
import { useLanguage } from "@/providers/lang"
import { tTeamPagei18n } from "@/i18n/team"
const TeamTable = dynamic(
  () => import("@/components/admin/team-table").then((mod) => mod.TeamTable),
  { ssr: false }
);


export default function TeamPage() {
  const {currentLang , isRTL} = useLanguage()

  const t = tTeamPagei18n[currentLang?.toLowerCase() as 'en' | 'ar' || "en"]
  return (

    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
          <p className="text-muted-foreground">{t.description}</p>
        </div>
        <Button asChild>
          <Link href="/admin/team/new">
            <Plus className="h-4 w-4 mr-2" />
            {t.addMember}
          </Link>
        </Button>
      </div>

      <TeamTable />
    </div>
  )
}
