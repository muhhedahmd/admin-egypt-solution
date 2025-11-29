"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Pencil, Trash2, Eye, Star, DollarSign, Package, FileImage } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { DeleteDialog } from "@/components/admin/delete-dialog"
import { useGetServicesQuery } from "@/lib/store/api/services-api"
import Blurredimage from "@/app/_comp/BlurredHashImage"
import Image from "next/image"
import { useIntersectionObserver } from "@uidotdev/usehooks"
import { ServiceWithImage } from "@/types/schema"

export function ServicesTable() {
  const router = useRouter()
  const [page, setPage] = useState(0)
  const [ref, entry] = useIntersectionObserver({
    rootMargin: "0px",
    threshold: 0.1
  })

  const {
    data: servicesData,
    isLoading,
    isError,
    isFetching,
    refetch
  } = useGetServicesQuery({
    skip: page ,
    take: 10
  })

  const [allServices, setAllServices] = useState<ServiceWithImage[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    if (servicesData?.data) {
      setAllServices((prev) => {
        const existing = prev.map((s: any) => s.id)
        const newServices = servicesData?.data?.filter((s: any) => !existing.includes(s.id))
        return [...prev, ...newServices]
      })
    }
  }, [servicesData])

  useEffect(() => {
    if (entry?.isIntersecting && !isFetching && servicesData?.data) {
      console.log( 
        allServices.length ,
        servicesData.pagination.totalItems
      )
      const hasMore = allServices.length < (servicesData.pagination.totalItems || 0)
      if (hasMore) setPage(prev => prev + 1)
    }
  }, [entry, isFetching, servicesData, allServices.length])

  const handleDelete = (id: string) => {
    console.log("Deleting service:", id)
    setAllServices(prev => prev.filter(s => s.id !== id))
    setDeleteId(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1048576).toFixed(1) + ' MB'
  }

  if (isLoading && page === 0) {
    return <LoadingSkeleton />
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="rounded-full bg-destructive/10 p-6 mb-4">
          <Trash2 className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Failed to load services</h3>
        <p className="text-muted-foreground text-center max-w-md mb-4">
          There was an error loading your services. Please try again.
        </p>
        <Button onClick={() => refetch()} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  if (allServices.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Package className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No services found</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Get started by creating your first service.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {allServices.map((service) => (
          <article
            key={service.id}
            className="group relative overflow-hidden rounded-2xl border bg-gradient-to-br from-card to-card/50 backdrop-blur transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:border-primary/50"
          >
            {/* Header with Image */}
            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
              {service.image ? (
                <Blurredimage
                  imageUrl={service.image.url}
                  alt={service.image.alt || service.name + "-image"}
                  className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                  height={service.image.height || 200}
                  width={service.image.width || 200}
                  blurhash={service.image.blurHash || ""}
                  quality={90}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-muted">
                  <Package className="h-16 w-16 text-muted-foreground/30" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {service.isFeatured && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 shadow-lg">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                )}
                <Badge
                  variant={service.isActive ? "default" : "secondary"}
                  className="shadow-lg"
                >
                  {service.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="absolute top-4 right-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-9 w-9 rounded-full shadow-lg backdrop-blur-sm bg-background/80 hover:bg-background"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => router.push(`/admin/services/${service.id}`)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/admin/services/${service.id}/edit`)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Service
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setDeleteId(service.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Service
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Order badge */}
              <div className="absolute bottom-4 right-4">
                <Badge variant="secondary" className="shadow-lg backdrop-blur-sm bg-background/80">
                  Order #{service.order}
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Title with Icon and Slug */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {service.icon && (
                    <Image
                      src={service.icon}
                      alt={service.name + "-icon"}
                      width={24}
                      height={24}
                      className="rounded-md bg-muted w-6 h-6 object-cover"
                    />
                  )}
                  <h3 className="text-xl font-bold tracking-tight line-clamp-1 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    {service.name}
                  </h3>
                </div>
                <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  /{service.slug}
                </code>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {service.description}
              </p>

              {/* Rich Description Preview */}
              {service.richDescription && (
                <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div
                    className="line-clamp-2 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: service.richDescription }}
                  />
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">Price</p>
                  <p className="font-bold text-lg text-primary">
                    ${service.price}
                  </p>
                </div>
              </div>

              {/* Image Metadata */}
              {service.image && (
                <div className="pt-3 border-t border-border/50">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <FileImage className="h-3.5 w-3.5" />
                      <span>{service.image.width}×{service.image.height}</span>
                      <span>•</span>
                      <span>{formatFileSize(service.image.size || 0)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="uppercase text-[10px] font-medium">
                        {service.image.type?.split('/')[1]}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={ref} className="h-20 flex items-center justify-center">
        {isFetching && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Loading more services...</span>
          </div>
        )}
        {servicesData?.data && 
          allServices.length >= (servicesData.pagination.totalItems || 0) && (
            <p className="text-sm text-muted-foreground">
              All {servicesData.pagination.totalItems} services loaded
            </p>
          )}
      </div>

      <DeleteDialog
        skip={page * 10}
        take={10}
        id={deleteId}
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone."
      />
    </>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border bg-card"
        >
          {/* Image skeleton */}
          <div className="h-56 bg-muted relative overflow-hidden">
            <div className="absolute inset-0 animate-wave bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* Content skeleton */}
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
                <div className="h-6 w-2/3 rounded animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
              </div>
              <div className="h-5 w-32 rounded animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
            </div>

            <div className="space-y-2">
              <div className="h-4 w-full rounded animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
              <div className="h-4 w-5/6 rounded animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
            </div>

            <div className="h-20 rounded-lg animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />

            <div className="h-16 rounded-lg animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />

            <div className="h-8 w-full rounded animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}