import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TestimonialsTable } from "@/components/admin/testimonials-table"
import Link from "next/link"

export default function TestimonialsPage() {
  return (
    <div className="p-6 space-y-6">

       <header className=" h-fit bg-muted z-50 w-full border-b border-border bg-background/95 backdrop-blur ">

          <div className="flex items-center justify-start gap-4 px-4 sm:px-6 lg:px-8 h-16">
                <SidebarTrigger />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">E </span>
              </div>
              <span className="font-semibold text-foreground hidden sm:inline">solution</span>
            </div>

          </div>
        </header>
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
