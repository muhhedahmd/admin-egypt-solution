import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TeamTable } from "@/components/admin/team-table"
import Link from "next/link"

export default function TeamPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">Manage your company's team members and their profiles</p>
        </div>
        <Button asChild>
          <Link href="/admin/team/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </Link>
        </Button>
      </div>

      <TeamTable />
    </div>
  )
}
