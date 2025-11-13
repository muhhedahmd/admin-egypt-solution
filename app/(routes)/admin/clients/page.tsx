import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ClientsTable } from "@/components/admin/clients-table"
import Link from "next/link"

export default function ClientsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Manage your client relationships and logos</p>
        </div>
        <Button asChild>
          <Link href="/admin/clients/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Link>
        </Button>
      </div>

      <ClientsTable />
    </div>
  )
}
