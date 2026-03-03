"use client"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { useLanguage } from "@/providers/lang"
import { tClientsPage } from "@/i18n/client"
const ClientsTable = dynamic(
  () => import("@/components/admin/clients-table").then((mod) => mod.ClientsTable),
  { ssr: false }
);


export default function ClientsPage() {
  const {currentLang} = useLanguage()
  const t = tClientsPage[currentLang?.toLowerCase() as 'en' | 'ar' || "en"]
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        <Button asChild>
          <Link href="/admin/clients/new">
            <Plus className="h-4 w-4 mr-2" />
            {t.addButton}
          </Link>
        </Button>
      </div>

      <ClientsTable />
    </div>
  )
}
