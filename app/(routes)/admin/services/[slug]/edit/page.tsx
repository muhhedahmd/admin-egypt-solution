"use client"
import { ServiceForm } from "@/components/admin/service-form"
import { Button } from "@/components/ui/button"
import { useGetServiceByIdQuery } from "@/lib/store/api/services-api"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import React from "react"
import ServiceNewLoader from "../../_comp/service-new-loader"

export default function EditServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const p = React.use(params)
  console.log(p)
  // by id to give a parial info not all info 
  const { data: service, isLoading, isError } = useGetServiceByIdQuery(p.slug)



  if (isLoading) return <ServiceNewLoader />

  if (isError) return <h1>
    Error
  </h1>
  console.log(service?.data.image)
  console.log(service?.data.service)
  const mockService = {
    ...service?.data.service
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/services">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Service</h1>
          <p className="text-muted-foreground">Update service information</p>
        </div>
      </div>

      <ServiceForm initialData={{
        ...mockService,
        image: null,
        iconImage: null,
      }} initalImage={
        service?.data?.Image
      } />
    </div>
  )
}
