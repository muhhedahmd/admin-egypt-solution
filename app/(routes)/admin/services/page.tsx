import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ServicesTable } from "@/components/admin/services-table"
import Link from "next/link"

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

      <ServicesTable />
    </div>
  )
}
