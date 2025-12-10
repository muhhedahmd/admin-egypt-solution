import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/header/admin-header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full relative">
        <AdminSidebar />

        <main className="  flex flex-col w-full items-center justify-start flex-1 overflow-y-auto bg-muted/30">
        <AdminHeader/>
        <div className="w-full h-full">

        {children}
        </div>
        </main>
       
      </div>
    </SidebarProvider>
  )
}
