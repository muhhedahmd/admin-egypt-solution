import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {  ChevronLeft, ChevronRight, Loader2, Package } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

export function InfiniteSlider({
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
            className="shrink-0 p-4 border-2 hover:border-primary/50 hover:shadow-xl transition-all duration-300 w-[300px]"
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
          <div className="shrink-0 w-[300px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!hasMore && slides.length > 0 && (
          <div className="shrink-0 w-[300px] flex items-center justify-center text-sm text-muted-foreground">
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
