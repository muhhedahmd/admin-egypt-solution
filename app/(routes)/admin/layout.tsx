import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import dynamic from "next/dynamic"

const AdminSidebar = dynamic(() => import("@/components/admin/admin-sidebar").then(mod => mod.AdminSidebar), {
  ssr: true,
  loading: () => <div className="w-64 h-full bg-muted/20 animate-pulse border-r" />
})
const AdminHeader = dynamic(() => import("@/components/admin/header/admin-header"), {
  ssr: true,
  loading: () => <div className="w-full h-16 bg-muted/20 animate-pulse border-b" />
})

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <div className="flex flex-col min-h-screen w-full relative pt-8">
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
