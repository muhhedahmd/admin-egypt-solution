"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { MoreHorizontal, Pencil, Trash2, Eye, Play, Pause, Clock, Layers, ChevronDown, ChevronUp } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useDeleteSlideShowMutation, useGetSlideShowsQuery, } from "@/lib/store/api/slideShow-api"
import { useIntersectionObserver } from "@uidotdev/usehooks"
import { DeleteDialog } from "./delete-dialog"
import { toast } from "sonner"
import { useLanguage } from "@/providers/lang"
import { slideshowsTableI18n } from "@/i18n/slideShow"

export function SlideshowsTable() {

  const { currentLang } = useLanguage()
  const t = slideshowsTableI18n[(currentLang?.toLowerCase() as "en" | "ar") || 'en']
  const [page, setPage] = useState(0)
  const [ref, entry] = useIntersectionObserver({
    rootMargin: "0px",
    threshold: 0.1
  })

  const {
    data: slideshowsData,
    isLoading,
    isError,
    isFetching,
    refetch
  } = useGetSlideShowsQuery({
    skip: page,
    take: 10
  })

  const [allSlideshows, setAllSlideshows] = useState<any[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    if (slideshowsData?.data) {
      setAllSlideshows((prev: any) => {
        const existing = prev.map((s: any) => s.id)
        const newSlideshows = slideshowsData.data.filter((s: any) => !existing.includes(s.id))
        return [...prev, ...newSlideshows]
      })
    }
  }, [slideshowsData])

  useEffect(() => {
    if (entry?.isIntersecting && !isFetching && slideshowsData?.pagination) {
      const { currentPage, totalPages } = slideshowsData.pagination
      if (currentPage < totalPages) setPage(prev => prev + 1)
    }
  }, [entry, isFetching, slideshowsData])



  const [del, { isLoading: isLoadingDelete, isError: isErrorDelete, isSuccess }] = useDeleteSlideShowMutation()

  const handleDelete = async (id: string) => {
    try {

      console.log("Deleting service:", id)
      // setAllServices(prev => prev.filter(s => s.id !== id))
      await del({ id, skip: page, take: 10 }).then(res => {
        if (res.data) {
          console.log("Deleting slideshow:", id)
          setAllSlideshows(prev => prev.filter(s => s.id !== id))
          setDeleteId(null)
          toast.success("slideshow deleted successfully!")
        }
      })


    } catch (error) {
      toast.error("Failed to delete service. Please try again.")
    }
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
        <h3 className="text-xl font-semibold mb-2">{t.states.errorTitle}</h3>
        <p className="text-muted-foreground text-center max-w-md mb-4">
          {t.states.errorDescription}
        </p>
        <Button onClick={() => refetch()} variant="outline">
          {t.states.retry}
          
        </Button>
      </div>
    )
  }

  if (allSlideshows.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Layers className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{t.states.emptyTitle}</h3>
        <p className="text-muted-foreground text-center max-w-md">
          {t.states.errorDescription}
        </p>
      </div>
    )
  }

  return (
    <>

      <div className="space-y-4">
        {allSlideshows.map((slideshow) => (
          <Card
            key={slideshow.id}
            className="overflow-hidden border-2 transition-all duration-300 hover:shadow-lg hover:border-primary/50"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-card to-card/50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  {/* Title and Order */}
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-lg font-bold px-3 py-1">
                      #{slideshow.order}
                    </Badge>
                    <h3 className="text-2xl font-bold tracking-tight">
                      {slideshow.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {slideshow.description}
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="shadow-sm">
                      <Layers className="h-3 w-3 mr-1" />
                      {slideshow.type}
                    </Badge>
                    <Badge
                      variant={slideshow.isActive ? "default" : "secondary"}
                      className="shadow-sm"
                    >
                      {slideshow.isActive ? t.badges.active : t.badges.inactive}
                    </Badge>
                    <Badge
                      // variant={slideshow.isActive ? "default" : "secondary"}
                      className="shadow-sm"
                    >
                      {slideshow?.composition}
                    </Badge>
                    <Badge
                      variant={slideshow.autoPlay ? "default" : "outline"}
                      className="shadow-sm"
                    >
                      {slideshow.autoPlay ? (
                        <>
                          <Play className="h-3 w-3 mr-1 fill-current" />
                          {t.badges.autoplay}
                        </>
                      ) : (
                        <>
                          <Pause className="h-3 w-3 mr-1" />
                          {t.badges.manual}
                        </>
                      )}
                    </Badge>
                    <Badge variant="outline" className="shadow-sm">
                      <Clock className="h-3 w-3 mr-1" />
                      {Number(slideshow.interval) / 1000}s
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/slideshows/${slideshow.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          {t.actions.view}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/slideshows/${slideshow.id}/edit`}>
                          <Pencil className="h-4 w-4 mr-2" />
                          {t.actions.edit}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeleteId(slideshow.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t.actions.delete}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Slides Section (Expandable) */}

          </Card>
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={ref} className="h-20 flex items-center justify-center">
        {isFetching && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>{t.states.loadingMore}</span>
          </div>
        )}
        {slideshowsData?.pagination &&
          slideshowsData.pagination.currentPage >= slideshowsData.pagination.totalPages && (
            <p className="text-sm text-muted-foreground">
              {t.states.allLoaded(slideshowsData.pagination.totalItems)}
            </p>
          )}
      </div>

      {/* Delete Dialog */}
      <DeleteDialog
        isLoading={isLoadingDelete}
        isError={isErrorDelete}
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={async () => await handleDelete(deleteId!)}
        title= { t.deleteDialog.title(slideshowsData?.data.find(s => s.id === deleteId)?.title) }
        // title={`Delete Slideshow ( ${} )`}
        description={t.deleteDialog.description}
      />
    </>
  )
}




function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-16 rounded animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
                  <div className="h-8 w-64 rounded animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
                </div>
                <div className="h-4 w-full rounded animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
                <div className="h-4 w-3/4 rounded animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div
                      key={j}
                      className="h-6 w-20 rounded-full animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted"
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-9 w-32 rounded animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
                <div className="h-9 w-9 rounded animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}