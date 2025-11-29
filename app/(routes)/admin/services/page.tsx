"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

import dynamic from "next/dynamic"
const DynamicServicesTable = dynamic(
  () => import("@/components/admin/services-table").then((mod) => mod.ServicesTable),
  { ssr: false }
);

export default function ServicesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">Manage your company's service offerings</p>
        </div>
        <Button asChild>
          <Link href="/admin/services/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Link>
        </Button>
      </div>

      <DynamicServicesTable />
    </div>
  )
}
