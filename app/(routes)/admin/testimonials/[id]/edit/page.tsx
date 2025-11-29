"use client"
import { TestimonialForm } from "@/components/admin/testimonial-form"
import { Button } from "@/components/ui/button"
import { useGetTestimonialByIdQuery } from "@/lib/store/api/testimonials-api"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { use } from "react"

export default function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
    const _params = use(params)
  
    const { isLoading, isError, data } = useGetTestimonialByIdQuery(_params.id)
  

    const mockMember = {
     ...data?.data?.testimonial,
     avatar : data?.data.Avatar
    }
    console.log({
      mockMember
    })
  
  const mockTestimonial = {
  ...data?.data?.testimonial,
     avatar : data?.data?.Avatar
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

      <TestimonialForm initialData={mockTestimonial as any} />
    </div>
  )
}
