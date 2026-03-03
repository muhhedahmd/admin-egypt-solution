"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

import dynamic from "next/dynamic"
import { useLanguage } from "@/providers/lang"
import { Translations_landingService } from "@/i18n/services"
const DynamicServicesTable = dynamic(
  () => import("@/components/admin/services-table").then((mod) => mod.ServicesTable),
  { ssr: false }
);






export default function ServicesPage() {
  const   { 
    currentLang 
  } = useLanguage()
  const t = Translations_landingService[currentLang?.toLowerCase() as 'en' | 'ar' || "en"]
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t["mainHeading"]}</h1>
          <p className="text-muted-foreground">{t["pageDescription"]}</p>
        </div>
        <Button asChild>
          <Link href="/admin/services/new">
            <Plus className="h-4 w-4 mr-2" />
            {t["addService"]}
          </Link>
        </Button>
      </div>

      <DynamicServicesTable />
    </div>
  )
}
