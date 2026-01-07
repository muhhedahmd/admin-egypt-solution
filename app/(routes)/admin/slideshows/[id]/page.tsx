
"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Clock,
  Play,
  Pause,
  Layers,
  Grid3x3,
  Zap,
  Square,
  Settings,
  Eye,
  TrendingUp,
  Package,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react"
import { DeleteDialog } from "@/components/admin/delete-dialog"
import { useGetSlideShowByIdQuery, usePaginatedSlidesMutation } from "@/lib/store/api/slideShow-api"
import { motion, AnimatePresence } from "framer-motion"
import { SlidesEmptyState, SlidesErrorState } from "@/components/admin/utils/slides-loader"
import { CompositionPreview } from "@/components/admin/utils/slides/compositionPreviw"

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const containerRef = useRef<HTMLDivElement>(null)
  console.log({containerRef} , "containerRef")
  const router = useRouter()
  const p = React.use(params)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [fullscreenPreview, setFullscreenPreview] = useState(false)

  const [pagesPerType, setPagesPerType] = useState({
    services: 1,
    projects: 1,
    clients: 1,
    testimonials: 1,
    team: 1,
  })

  const { data: slideshowData, isLoading, isError } = useGetSlideShowByIdQuery(p.id)
  const [triggerGetSlides, { data: slidesData, isLoading: slidesLoading, error: slidesError }] =
    usePaginatedSlidesMutation()

  const [allSlides, setAllSlides] = useState<any[]>([])
  useEffect(() => {
    const data = slidesData?.data.slides ? [...allSlides, ...slidesData?.data.slides] : [...allSlides]
    setAllSlides(() => (data))
  }, [slidesData?.data.slides])


  React.useEffect(() => {
    if (p.id) {
      triggerGetSlides({
        id: p.id,
        page: 1,
        perPage: 10,
        pagesPerType: pagesPerType as any,
      })
    }
  }, [p.id])

  const formatDate = (date: string | Date) => {
    if (!date) return null
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const onScroll = () => {

    if (slidesData?.data.pages.services.hasMore) {
      handleLoadMore('services')
      console.log("load more -> services")
    }
    // if(pagesPerType.projects < (slidesData?.data?.pages?.projects?.totalPages || 1)){
    //   handleLoadMore('projects')
    // }
    // if(pagesPerType.clients < (slidesData?.data?.pages?.clients?.totalPages || 1)){
    //   handleLoadMore('clients')
    // }
    // if(pagesPerType.testimonials < (slidesData?.data?.pages?.testimonials?.totalPages || 1)){
    //   handleLoadMore('testimonials')
    // }
    // if(pagesPerType.team < (slidesData?.data?.pages?.team?.totalPages || 1)){
    //   handleLoadMore('team')
    // }

  }


  const formatInterval = (ms: number) => {
    const seconds = ms / 1000
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
  }

  const getCompositionIcon = (type: string) => {
    switch (type) {
      case "CAROUSEL": return Zap
      case "GRID": return Grid3x3
      case "STACKED": return Layers
      case "FADE": return Square
      case "SINGLE": return Square
      default: return Layers
    }
  }

  const handleDelete = () => {
    console.log("Deleting slideshow:", p.id)
    setDeleteDialogOpen(false)
    router.push('/admin/slideshows')
  }

  const handleLoadMore = async (type: string) => {

    const newPage = (pagesPerType[type as keyof typeof pagesPerType] || 1) + 1
    setPagesPerType((prev) => ({
      ...prev,
      [type]: newPage,
    }))

    try {
      await triggerGetSlides({
        id: p.id,
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

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (isError || !slideshowData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="rounded-full bg-destructive/10 p-6 mb-4 inline-block">
            <Trash2 className="h-12 w-12 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Slideshow Not Found</h2>
          <p className="text-muted-foreground mb-6">The slideshow you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/admin/slideshows')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Slideshows
          </Button>
        </div>
      </div>
    )
  }

  const slideshow = slideshowData.data

  // const slides = slidesData?.data?.slides || []

  const slidesByType = allSlides?.reduce((acc: any, slide: any) => {

    if (!acc[slide.type]) acc[slide.type] = []
    acc[slide.type].push(slide)
    return acc
  }, {} as Record<string, any[]>)


  const totalSlides = (slidesData?.data?.slidesCount?.clients || 0) +
    (slidesData?.data?.slidesCount?.projects || 0) +
    (slidesData?.data?.slidesCount?.services || 0) +
    (slidesData?.data?.slidesCount?.testimonials || 0) +
    (slidesData?.data?.slidesCount?.team || 0)

  const CompositionIcon = getCompositionIcon(slideshow.composition)

  return (
    <>
      <div className="max-h-[calc(100vh-5rem)] overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push('/admin/slideshows')}
                  className="rounded-full"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <span>Slideshows</span>
                    <span>/</span>
                    <span className="text-foreground font-medium">{slideshow.type}</span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight">{slideshow.title}</h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setFullscreenPreview(true)}
                  className="gap-2"
                >
                  <Maximize2 className="h-4 w-4" />
                  Full Preview
                </Button>
                <Button
                  onClick={() => router.push(`/admin/slideshows/${slideshow.id}/edit`)}
                  className="gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container overflow-hidden mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header Card */}
              <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-primary/10 via-card to-card">
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <Badge variant="outline" className="text-lg font-bold px-3 py-1">
                          #{slideshow.order}
                        </Badge>
                        <h2 className="text-3xl font-bold tracking-tight">{slideshow.title}</h2>
                      </div>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {slideshow.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Badge variant="secondary" className="shadow-sm text-base py-2 px-4">
                      <Layers className="h-4 w-4 mr-2" />
                      {slideshow.type}
                    </Badge>
                    <Badge
                      variant={slideshow.isActive ? "default" : "secondary"}
                      className="shadow-sm text-base py-2 px-4"
                    >
                      {slideshow.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge
                      variant={slideshow.autoPlay ? "default" : "outline"}
                      className="shadow-sm text-base py-2 px-4"
                    >
                      {slideshow.autoPlay ? (
                        <>
                          <Play className="h-4 w-4 mr-2 fill-current" />
                          Autoplay
                        </>
                      ) : (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Manual
                        </>
                      )}
                    </Badge>
                    <Badge variant="outline" className="shadow-sm text-base py-2 px-4">
                      <Clock className="h-4 w-4 mr-2" />
                      {formatInterval(slideshow.interval)}
                    </Badge>
                    <Badge variant="outline" className="shadow-sm text-base py-2 px-4">
                      <CompositionIcon className="h-4 w-4 mr-2" />
                      {slideshow.composition}
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Compact Preview */}
              {allSlides?.length > 0 && (
                <Card  className="p-8 border-0 shadow-xl   ">
                  <div className="flex items-center justify-between mb-6">

                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                        <Eye className="h-6 w-6 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">Quick Preview</h3>
                        <p className="text-sm text-muted-foreground">
                          {slideshow.composition} • {totalSlides} slides
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setFullscreenPreview(true)}
                      variant="outline"
                      className="gap-2"
                    >
                      <Maximize2 className="h-4 w-4" />
                      Fullscreen
                    </Button>
                  </div>

                  <div className="aspect-video  rounded-xl  overflow-hidden">
                    {/* <CompositionPreview
                    containerRef={containerRef}
                      autoPlay={slideshow.autoPlay}
                      interval={slideshow.interval}
                      isInViewport={false}
                      // onScroll={onScroll}
                      composition={slideshow.composition as any}
                      slides={allSlides.map((s) => {
                        return {
                          ...s.data,
                          order: s.order,
                          type: s.type
                        }
                      })}
                    /> */}
                  </div>
                </Card>
              )}

              {/* Enhanced Slides Collection */}
              <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-card to-card/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Layers className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Slides Collection</h3>
                    <p className="text-sm text-muted-foreground">
                      {totalSlides} total slides • Scroll horizontally to view
                    </p>
                  </div>
                </div>

                {slidesLoading && !slidesData ? (
                  <SlidesLoader />
                ) : slidesError ? (
                  <SlidesErrorState />
                ) : allSlides.length === 0 ? (
                  <SlidesEmptyState />
                ) : (
                  <div className="space-y-8">
                    {Object.entries(slidesByType).map(([type, typeSlides]) => (
                      <div key={type} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold capitalize text-lg text-primary flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            {type} ({typeSlides.length})
                          </h4>
                          {slidesData?.data?.pages?.[type as keyof typeof slidesData.data.pages] && (
                            <div className="text-xs text-muted-foreground">
                              Page {pagesPerType[type as keyof typeof pagesPerType] || 1} of{" "}
                              {slidesData.data.pages[type as keyof typeof slidesData.data.pages]?.totalPages}
                            </div>
                          )}
                        </div>

                        <EnhancedInfiniteSlider
                          slides={typeSlides}
                          type={type}
                          isLoading={slidesLoading}
                          onLoadMore={() => handleLoadMore(type)}
                          hasMore={slidesData?.data?.pages?.[type as keyof typeof slidesData.data.pages]?.hasMore || false}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Configuration */}
              <Card className="p-6 border-0 shadow-xl bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <Settings className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">CONFIGURATION</p>
                    <h3 className="text-xl font-bold">Settings</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                    <CompositionIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Composition</p>
                      <p className="font-semibold">{slideshow.composition}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                    <Layers className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Type</p>
                      <p className="font-semibold">{slideshow.type}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Interval</p>
                      <p className="font-semibold">{formatInterval(slideshow.interval)}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Stats */}
              <Card className="p-6 border-0 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Statistics</h3>
                    <p className="text-xs text-muted-foreground">Slideshow metrics</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Total Slides</span>
                    <Badge variant="secondary" className="text-base font-bold">
                      {totalSlides}
                    </Badge>
                  </div>

                  {Object.entries(slidesData?.data?.slidesCount || {}).map(([type, count]) => (
                    count > 0 && (
                      <div key={type} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm text-muted-foreground capitalize">{type}</span>
                        <Badge variant="outline" className="text-sm">
                          {count}
                        </Badge>
                      </div>
                    )
                  ))}

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Display Order</span>
                    <Badge variant="outline" className="text-sm">
                      #{slideshow.order}
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Metadata */}
              <Card className="p-6 border-0 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-gray-500/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Metadata</h3>
                    <p className="text-xs text-muted-foreground">System info</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Slideshow ID</p>
                    <code className="text-xs bg-muted px-2 py-1 rounded block truncate">
                      {slideshow.id}
                    </code>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Created</p>
                    <p className="text-sm font-medium">{formatDate(slideshow.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
                    <p className="text-sm font-medium">{formatDate(slideshow.updatedAt)}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Preview Modal */}
                  

      <AnimatePresence>

        {fullscreenPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100   backdrop-blur-xl"
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div>
                  <h2 className="text-2xl font-bold text-white">{slideshow.title}</h2>
                  <p className="text-sm text-white/60">{slideshow.composition} Composition • {totalSlides} Slides</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setFullscreenPreview(false)}
                  className="text-white hover:bg-white/10 rounded-full"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

   
                  <CompositionPreview
                    autoPlay={slideshow.autoPlay}
                    interval={slideshow.interval}
                    isInViewport={false}
                    containerRef={containerRef}
                    composition={slideshow.composition as any}
                    slides={allSlides.map((slide: any) => ({
                      ...slide.data,
                      order: slide.order,
                      type: slide.type
                    }))}
                  />
                    </div>
             
          </motion.div>
        )}
      </AnimatePresence>

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Slideshow"
        description="Are you sure you want to delete this slideshow? This action cannot be undone and will remove all associated slides."
      />
    </>
  )
}

// Enhanced Infinite Slider Component
function EnhancedInfiniteSlider({
  slides,
  type,
  isLoading,
  onLoadMore,
  hasMore
}: {
  slides: any[]
  type: string
  isLoading: boolean
  onLoadMore: () => void
  hasMore: boolean
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }, [])

  const handleScroll = useCallback(() => {
    checkScroll()
    if (!scrollRef.current || !hasMore || isLoading) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    const threshold = 300

    if (scrollWidth - (scrollLeft + clientWidth) < threshold) {
      onLoadMore()
    }
  }, [hasMore, isLoading, onLoadMore, checkScroll])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    checkScroll()
    container.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', checkScroll)

    return () => {
      container.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [handleScroll, checkScroll])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const scrollAmount = 400
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }

  const getSlideTitle = (slide: any) => {
    return slide.data?.name || slide.data?.title || slide.data?.clientName || "Untitled"
  }

  return (
    <div className="relative group">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto overflow-y-hidden pb-4 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {slides.map((slide, idx) => (
          <Card
            key={slide.id}
            className="flex-shrink-0 p-4 border-2 hover:border-primary/50 hover:shadow-xl transition-all duration-300 w-[300px]"
          >
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    #{slide.order}
                  </Badge>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {type}
                  </Badge>
                </div>
                <p className="text-sm font-semibold text-foreground line-clamp-1">
                  {getSlideTitle(slide)}
                </p>
              </div>

              {(slide.data?.image || slide.data?.avatar) && (
                <div className="relative w-full h-40 bg-muted rounded-lg overflow-hidden">
                  <img
                    src={slide.data.image?.url || slide.data.avatar?.url}
                    alt={slide.data.image?.alt || slide.data.avatar?.alt || getSlideTitle(slide)}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              )}

              {slide.data?.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {slide.data.description}
                </p>
              )}
            </div>
          </Card>
        ))}

        {isLoading && (
          <div className="flex-shrink-0 w-[300px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!hasMore && slides.length > 0 && (
          <div className="flex-shrink-0 w-[300px] flex items-center justify-center text-sm text-muted-foreground">
            <div className="text-center">
              <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No more slides</p>
            </div>
          </div>
        )}
      </div>

      {canScrollLeft && (
        <Button
          variant="secondary"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl rounded-full"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}

      {canScrollRight && (
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl rounded-full"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}

function SlidesLoader() {
  return (
    <div className="flex gap-4 pb-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex-shrink-0 w-[300px]">
          <Card className="p-4 animate-pulse">
            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="h-5 w-12 bg-muted rounded" />
                <div className="h-5 w-16 bg-muted rounded" />
              </div>
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-40 w-full bg-muted rounded-lg" />
              <div className="h-3 w-full bg-muted rounded" />
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
              <div className="space-y-2">
                <div className="h-4 w-32 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
                <div className="h-6 w-48 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-24 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
              <div className="h-10 w-20 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
              <div className="h-10 w-10 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="h-64 rounded-2xl animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
            <div className="h-96 rounded-2xl animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
            <div className="h-64 rounded-2xl animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
          </div>
          <div className="space-y-6">
            <div className="h-64 rounded-2xl animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
            <div className="h-48 rounded-2xl animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
            <div className="h-48 rounded-2xl animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
          </div>
        </div>
      </div>
    </div>
  )
}