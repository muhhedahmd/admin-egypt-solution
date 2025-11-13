import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TestimonialsTable } from "@/components/admin/testimonials-table"
import Link from "next/link"

export default function TestimonialsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
          <p className="text-muted-foreground">Manage client testimonials and reviews</p>
        </div>
        <Button asChild>
          <Link href="/admin/testimonials/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Testimonial
          </Link>
        </Button>
      </div>

      <TestimonialsTable />
    </div>
  )
}
