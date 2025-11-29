import { TeamMemberForm } from "@/components/admin/team-member-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewTeamMemberPage() {
  return (
    <div className="p-6 space-y-6 h-screen">
      <div className="flex items-center gap-4  h-20">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/team">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Team Member</h1>
          <p className="text-muted-foreground">Add a new member to your team</p>
        </div>
      </div>

      <TeamMemberForm />
    </div>
  )
}
