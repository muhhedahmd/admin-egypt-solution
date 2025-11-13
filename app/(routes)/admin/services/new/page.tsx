import { ServiceForm } from "@/components/admin/service-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewServicePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/services">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Service</h1>
          <p className="text-muted-foreground">Add a new service to your offerings</p>
        </div>
      </div>

      <ServiceForm />
    </div>
  )
}
