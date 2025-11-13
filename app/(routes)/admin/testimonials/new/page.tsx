import { TestimonialForm } from "@/components/admin/testimonial-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewTestimonialPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/testimonials">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Testimonial</h1>
          <p className="text-muted-foreground">Add a new client testimonial</p>
        </div>
      </div>

      <TestimonialForm />
    </div>
  )
}
