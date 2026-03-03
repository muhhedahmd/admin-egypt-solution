"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Pencil, Trash2, Eye, Star, DollarSign, Package, FileImage } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { DeleteDialog } from "@/components/admin/delete-dialog"
import Blurredimage from "@/app/_comp/BlurredHashImage"
import Image from "next/image"
import { useIntersectionObserver } from "@uidotdev/usehooks"
import { ClientWithTranslation, useDeleteClientMutation, useGetClientsQuery } from "@/lib/store/api/client-api"
import { toast } from "sonner"
import { useLanguage } from "@/providers/lang"
import { tClientsTable } from "@/i18n/client"

export function ClientsTable() {
  const router = useRouter()
  const { currentLang } = useLanguage()
  const t = tClientsTable[currentLang?.toLowerCase() as 'en' | 'ar' || "en"]
  const [page, setPage] = useState(0)
  const [ref, entry] = useIntersectionObserver({
    rootMargin: "0px",
    threshold: 0.1
  })

  const {
    data: clientData,
    isLoading,
    isError,
    isFetching,
    refetch,
    error
  } = useGetClientsQuery({
    skip: page,
    take: 10
  })
  const [allClients, setAllClients] = useState<ClientWithTranslation[]>([])

  useEffect(() => {
    if (clientData?.data) {
      setAllClients((prev) => {
        const existing = prev.map((s) => s.client.id)
        const newclients = clientData.data.filter((s) => !existing.includes(s.client.id))
        return [...prev, ...newclients]
      })
    }
  }, [clientData])

  useEffect(() => {
    if (entry?.isIntersecting && !isFetching && clientData?.data) {
      console.log(
        allClients.length,
        clientData.pagination.totalItems
      )
      const hasMore = allClients.length < (clientData.pagination.totalItems || 0)
      if (hasMore) setPage(prev => prev + 1)
    }
  }, [entry, isFetching, clientData, allClients.length])


  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [del, { isLoading: isLoadingDelete, isError: isErrorDelete }] = useDeleteClientMutation()

  const handleDelete = async (id: string) => {
    try {
      await del(id
      ).then(res => {
        if (res.data) {
          toast.success("Service deleted successfully!")
          setDeleteId(null)
          setAllClients(prev => prev.filter(s => s.client.id !== id))
        }
      })
    } catch (error) {
      toast.error("Failed to delete service. Please try again.")
    }
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
        <h3 className="text-xl font-semibold mb-2">{t.failedToLoad.title}</h3>
        <p className="text-muted-foreground text-center max-w-md mb-4">
          {t.failedToLoad.description}
        </p>
        <Button onClick={() => refetch()} variant="outline">
          {t.failedToLoad.retryButton}
        </Button>
      </div>
    )
  }

  if (allClients.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Package className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{t.noClients.title}</h3>
        <p className="text-muted-foreground text-center max-w-md">
          {t.noClients.description}
        </p>
      </div>
    )
  }



  return (

    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {allClients.map((client) => {
          const currentTranlation = client?.translation?.find((t) => t.lang?.toLocaleLowerCase() === currentLang?.toLocaleLowerCase())
          return <article
            key={client.client.id}
            className="group relative overflow-hidden rounded-2xl border bg-gradient-to-br from-card to-card/50 backdrop-blur transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:border-primary/50"
          >
            {/* Header with Image */}
            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
              {client.image ? (
                <Blurredimage
                  imageUrl={client.image.url}
                  alt={client.image.alt || client.client.name + "-image"}
                  className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                  height={client.image.height || 200}
                  width={client.image.width || 200}
                  blurhash={client.image.blurHash || ""}
                  quality={90}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-muted">
                  <Package className="h-16 w-16 text-muted-foreground/30" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {client.client.isFeatured && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 shadow-lg">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    {t.badges.featured}
                  </Badge>
                )}
                <Badge
                  variant={client.client.isActive ? "default" : "secondary"}
                  className="shadow-lg"
                >
                  {client.client.isActive ? t.badges.active : t.badges.inactive}
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
                    <DropdownMenuItem onClick={() => router.push(`/admin/clients/${client.client.id}`)}>
                      <Eye className="mr-2 h-4 w-4" />
                      {t.dropdown.view}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/admin/clients/${client.client.id}/edit`)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      {t.dropdown.edit}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setDeleteId(client.client.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t.dropdown.delete}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Order badge */}

            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Title with Icon and Slug */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {client.logo && (
                    <Image
                      src={client.logo.url}
                      alt={currentTranlation?.name || "" + "-icon"}
                      width={24}
                      height={24}
                      className="rounded-md bg-muted w-6 h-6 object-cover"
                    />
                  )}
                  <h3 className="text-xl font-bold tracking-tight line-clamp-1 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    {currentTranlation?.name || client.client.name || ""}
                  </h3>
                </div>
                <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  /{client.client.slug}
                </code>
                {client.client.website &&

                  <code className=" block  mt-2 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {t.labels.website}: {client.client.website}
                  </code>
                }
                {
                  client.client.industry &&
                  <code className=" block  mt-2 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {t.labels.industry}: {client.client.industry}
                  </code>
                }
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {currentTranlation?.description || client.client.description}
              </p>

              {/* Rich Description Preview */}
              {currentTranlation?.richDescription && (
                <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div
                    className="line-clamp-2 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: currentTranlation?.richDescription }}
                  />
                </div>
              )}



              {/* Image Metadata */}
              {client.image && (
                <div className="pt-3 border-t border-border/50">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <FileImage className="h-3.5 w-3.5" />
                      <span>{client.image.width}×{client.image.height}</span>
                      <span>•</span>
                      <span>{formatFileSize(client.image.size || 0)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="uppercase text-[10px] font-medium">
                        {client.image.type?.split('/')[1]}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </article>
        })}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={ref} className="h-20 flex items-center justify-center">
        {isFetching && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>{t.loading}</span>
          </div>
        )}
        {clientData?.data &&
          allClients.length >= (clientData.pagination.totalItems || 0) && (
            <p className="text-sm text-muted-foreground">
              {t.allLoaded} {clientData.pagination.totalItems}
            </p>
          )}
      </div>

      <DeleteDialog
        isLoading={isLoadingDelete}
        isError={isErrorDelete}
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={async () => await handleDelete(deleteId!)}
        title={t.deleteDialog.title}
        description={t.deleteDialog.description}
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