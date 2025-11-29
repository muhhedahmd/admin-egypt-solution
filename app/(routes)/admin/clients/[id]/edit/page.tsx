"use client"
import { ClientForm } from "@/components/admin/client-form"
import { Button } from "@/components/ui/button"
import { useGetClientByIdQuery } from "@/lib/store/api/client-api"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import React from "react"

export default function EditClientPage({ params }: { params: Promise<{ id: string }> }) {

  const p = React.use(params)
  const { data , isLoading , isError,isFetching  } = useGetClientByIdQuery( p.id)

  if (isLoading) return <h1>Loading...</h1>
  if (isError || !data) return <h1>Error</h1>
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

      <ClientForm initialData={data?.data} />
    </div>
  )
}
