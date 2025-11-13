import { TestimonialForm } from "@/components/admin/testimonial-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditTestimonialPage({ params }: { params: { id: string } }) {
  const mockTestimonial = {
    id: params.id,
    content: "Working with this team was an absolute pleasure. They delivered beyond our expectations.",
    author: "John Smith",
    position: "CEO",
    company: "TechCorp Inc",
    rating: 5,
    status: "APPROVED",
    featured: true,
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/testimonials">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Testimonial</h1>
          <p className="text-muted-foreground">Update testimonial information</p>
        </div>
      </div>

      <TestimonialForm initialData={mockTestimonial} />
    </div>
  )
}
