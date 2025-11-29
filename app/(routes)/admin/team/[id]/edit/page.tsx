"use client"
import { TeamMemberForm } from "@/components/admin/team-member-form"
import { Button } from "@/components/ui/button"
import { useGetTeamMemberByIdQuery } from "@/lib/store/api/team-api"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { use } from "react"

export default function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {

  const _params = use(params)

  const { isLoading, isError, data } = useGetTeamMemberByIdQuery(_params.id)

  const mockMember = {
   ...data?.teamMember,
   image : data?.Image
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

      <TeamMemberForm isLoadingFetchingToUpdate={isLoading} initialData={mockMember as any || undefined} />
    </div>
  )
}
