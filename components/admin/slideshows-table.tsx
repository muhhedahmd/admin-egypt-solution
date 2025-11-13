"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { MoreHorizontal, Pencil, Trash2, Eye, Play, Pause, Clock, Layers, ChevronDown, ChevronUp } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useGetSlideShowsQuery, usePaginatedSlidesMutation } from "@/lib/store/api/slideShow-api"
import { SlidesEmptyState, SlidesErrorState, SlidesLoader } from "./utils/slides-loader"
import { InfiniteScrollSlides } from "./utils/slide-show-infinty-scroller"
import { useIntersectionObserver } from "@uidotdev/usehooks"

export function SlideshowsTable() {
  const router = useRouter()
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
    skip: page * 10,
    take: 10
  })

  const [allSlideshows, setAllSlideshows] = useState<any[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [expandedSlideshow, setExpandedSlideshow] = useState<string | null>(null)
  const [pagesPerType, setPagesPerType] = useState<Record<string, number>>({
    services: 1,
    projects: 1,
    clients: 1,
    testimonials: 1,
    team: 1,
  })

  const [triggerGetSlides] = usePaginatedSlidesMutation()

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

  const handleDelete = (id: string) => {
    console.log("Deleting slideshow:", id)
    setAllSlideshows(prev => prev.filter(s => s.id !== id))
    setDeleteId(null)
  }

  const toggleExpanded = async (slideshowId: string) => {
    if (expandedSlideshow === slideshowId) {
      setExpandedSlideshow(null)
    } else {
      setExpandedSlideshow(slideshowId)
      try {
        await triggerGetSlides({
          id: slideshowId,
          page: 1,
          perPage: 10,
          pagesPerType: pagesPerType as any,
        })
      } catch (err) {
        console.error("Failed to fetch slides:", err)
      }
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
        <h3 className="text-xl font-semibold mb-2">Failed to load slideshows</h3>
        <p className="text-muted-foreground text-center max-w-md mb-4">
          There was an error loading your slideshows. Please try again.
        </p>
        <Button onClick={() => refetch()} variant="outline">
          Retry
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
        <h3 className="text-xl font-semibold mb-2">No slideshows found</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Get started by creating your first slideshow.
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
                      {slideshow.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge 
                      variant={slideshow.autoPlay ? "default" : "outline"}
                      className="shadow-sm"
                    >
                      {slideshow.autoPlay ? (
                        <>
                          <Play className="h-3 w-3 mr-1 fill-current" />
                          Autoplay
                        </>
                      ) : (
                        <>
                          <Pause className="h-3 w-3 mr-1" />
                          Manual
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleExpanded(slideshow.id)}
                    className="gap-2"
                  >
                    {expandedSlideshow === slideshow.id ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        Hide Slides
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        View Slides
                      </>
                    )}
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/slideshows/${slideshow.id}/edit`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View & Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/slideshows/${slideshow.id}/edit`}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeleteId(slideshow.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Slides Section (Expandable) */}
            {expandedSlideshow === slideshow.id && (
              <div className="border-t bg-muted/30">
                <div className="p-6">
                  <SlidesDisplay
                    slideshowId={slideshow.id}
                    isOpen={expandedSlideshow === slideshow.id}
                  />
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={ref} className="h-20 flex items-center justify-center">
        {isFetching && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Loading more slideshows...</span>
          </div>
        )}
        {slideshowsData?.pagination &&
          slideshowsData.pagination.currentPage >= slideshowsData.pagination.totalPages && (
            <p className="text-sm text-muted-foreground">
              All {slideshowsData.pagination.totalItems} slideshows loaded
            </p>
          )}
      </div>

      {/* Delete Dialog */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-2">Delete Slideshow?</h2>
            <p className="text-muted-foreground mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1">
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(deleteId)} className="flex-1">
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

interface SlidesDisplayProps {
  slideshowId: string
  isOpen: boolean
}

function SlidesDisplay({ slideshowId, isOpen }: SlidesDisplayProps) {
  const [triggerGetSlides, { data: slidesData, isLoading, error }] = usePaginatedSlidesMutation()
  const [pagesPerType, setPagesPerType] = useState({
    services: 1,
    projects: 1,
    clients: 1,
    testimonials: 1,
    team: 1,
  })

  useEffect(() => {
    if (isOpen) {
      triggerGetSlides({
        id: slideshowId,
        page: 1,
        perPage: 10,
        pagesPerType: pagesPerType as any,
      })
    }
  }, [isOpen])

  const handleLoadMore = async (type: string) => {
    const newPage = (pagesPerType[type as keyof typeof pagesPerType] || 1) + 1
    setPagesPerType((prev) => ({
      ...prev,
      [type]: newPage,
    }))

    try {
      await triggerGetSlides({
        id: slideshowId,
        page: newPage,
        perPage: 10,
        pagesPerType: {
          ...pagesPerType,
          [type]: newPage,
        } as any,
      })
    } catch (err) {
      console.error("Failed to load more slides:", err)
    }
  }

  if (isLoading && !slidesData) {
    return <SlidesLoader />
  }

  if (error) {
    return <SlidesErrorState />
  }

  const slides = slidesData?.data?.slides || []

  if (slides.length === 0) {
    return <SlidesEmptyState />
  }

  // Group slides by type
  const slidesByType = slides.reduce(
    (acc: any, slide: any) => {
      if (!acc[slide.type]) acc[slide.type] = []
      acc[slide.type].push(slide)
      return acc
    },
    {} as Record<string, any[]>,
  )

  const totalSlides = (slidesData?.data?.slidesCount?.clients || 0)
    + (slidesData?.data?.slidesCount?.projects || 0)
    + (slidesData?.data?.slidesCount?.services || 0)
    + (slidesData?.data?.slidesCount?.testimonials || 0)
    + (slidesData?.data?.slidesCount?.team || 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-lg">Slides</h4>
        <Badge variant="outline" className="text-sm">
          <Layers className="h-3 w-3 mr-1" />
          Total: {totalSlides}
        </Badge>
      </div>

      {Object.entries(slidesByType).map(([type, typeSlides]) => (
        <div key={type} className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="font-semibold capitalize text-base text-primary">{type}</h5>
            {slidesData?.data?.pages?.[type as keyof typeof slidesData.data.pages] && (
              <div className="text-xs text-muted-foreground">
                Page {pagesPerType[type as keyof typeof pagesPerType] || 1} of{" "}
                {slidesData.data.pages[type as keyof typeof slidesData.data.pages]?.totalPages}
              </div>
            )}
          </div>

          <InfiniteScrollSlides
            slides={typeSlides}
            type={type}
            isLoading={isLoading}
            onLoadMore={() => handleLoadMore(type)}
            hasMore={slidesData?.data?.pages?.[type as keyof typeof slidesData.data.pages]?.hasMore || false}
            direction="horizontal"
          />
        </div>
      ))}
    </div>
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