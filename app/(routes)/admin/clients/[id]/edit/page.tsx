import { ClientForm } from "@/components/admin/client-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditClientPage({ params }: { params: { id: string } }) {
  const mockClient = {
    id: params.id,
    name: "TechCorp Inc",
    industry: "Technology",
    website: "https://techcorp.com",
    description: "Leading technology solutions provider",
    status: "ACTIVE",
    featured: true,
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/clients">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Client</h1>
          <p className="text-muted-foreground">Update client information</p>
        </div>
      </div>

      <ClientForm initialData={mockClient} />
    </div>
  )
}
