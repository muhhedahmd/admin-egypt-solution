import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import dynamic from "next/dynamic"
import { cookies } from "next/headers"
import { layoutTranslations } from "@/i18n/layout"

const AdminSidebar = dynamic(() => import("@/components/admin/admin-sidebar").then(mod => mod.AdminSidebar), {
  ssr: true,
  loading: () => <div className="w-64 h-full bg-muted/20 animate-pulse border-r" />
})
const AdminHeader = dynamic(() => import("@/components/admin/header/admin-header"), {
  ssr: true,
  loading: () => <div className="w-full h-16 bg-muted/20 animate-pulse border-b" />
})
const isDemoOverride = !!process.env.NEXT_PUBLIC_FALLBACK_TOKEN;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const _cookies = await cookies()
  const lang = (_cookies.get("user_lang")?.value || "en") as "en" | "ar"
  const t = layoutTranslations[lang.toLowerCase() as keyof typeof layoutTranslations] || layoutTranslations.en

  return (
    <SidebarProvider>
      <AdminSidebar />
      <div className="flex flex-col min-h-screen w-full relative">
        {isDemoOverride && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-600 px-4 py-2 text-sm text-center font-medium">
            {t.demoBanner}
          </div>
        )}
        <AdminHeader />
        <main className="relative flex flex-col w-full items-center justify-start flex-1 overflow-y-auto bg-muted/30">
          <div className="w-full h-full">



            {children}
          </div>
        </main>

      </div>
    </SidebarProvider>
  )
}
