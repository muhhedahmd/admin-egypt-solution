import { TeamMemberForm } from "@/components/admin/team-member-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditTeamMemberPage({ params }: { params: { id: string } }) {
  const mockMember = {
    id: params.id,
    name: "John Doe",
    role: "Lead Developer",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    bio: "Experienced full-stack developer with 10+ years in the industry",
    status: "ACTIVE",
    order: 1,
    socialLinks: {
      linkedin: "https://linkedin.com/in/johndoe",
      twitter: "https://twitter.com/johndoe",
      github: "https://github.com/johndoe",
    },
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/team">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Team Member</h1>
          <p className="text-muted-foreground">Update team member information</p>
        </div>
      </div>

      <TeamMemberForm initialData={mockMember} />
    </div>
  )
}
