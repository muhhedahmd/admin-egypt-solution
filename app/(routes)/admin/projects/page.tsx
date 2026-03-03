"use client"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { useLanguage } from "@/providers/lang"
import { projectsTableI18n } from "@/i18n/project"
const ProjectsTable = dynamic(
  () => import("@/components/admin/projects-table").then((mod) => mod.ProjectsTable),
  { ssr: false }
);


export default function ProjectsPage() {
  const { currentLang } = useLanguage();
  const t  = projectsTableI18n[(currentLang?.toLowerCase() as  "en" | "ar" )|| 'en']




  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.header.title}</h1>
          <p className="text-muted-foreground">{t.header.subtitle}</p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="h-4 w-4 mr-2" />
            {t.header.addButton}
          </Link>
        </Button>
      </div>

      <ProjectsTable />
    </div>
  )
}
