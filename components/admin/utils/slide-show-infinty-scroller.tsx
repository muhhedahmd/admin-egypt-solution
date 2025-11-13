"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Slide {
  id: string
  type: string
  order: number
  data: {
    name?: string
    title?: string
    clientName?: string
    image?: { url: string; alt?: string }
    avatar?: { url: string; alt?: string }
    [key: string]: any
  }
}

interface InfiniteScrollSlidesProps {
  slides: Slide[]
  type: string
  isLoading?: boolean
  onLoadMore?: () => void
  hasMore?: boolean
  direction?: "horizontal" | "vertical"
}

export function InfiniteScrollSlides({
  slides,
  type,
  isLoading = false,
  onLoadMore,
  hasMore = false,
  direction = "horizontal",
}: InfiniteScrollSlidesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = useCallback(() => {
    if (!scrollContainerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth, scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current

    if (direction === "horizontal") {
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    } else {
      setCanScrollLeft(scrollTop > 0)
      setCanScrollRight(scrollTop < scrollHeight - clientHeight - 10)
    }
  }, [direction])

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || !hasMore || !onLoadMore || isLoading) return

    const container = scrollContainerRef.current
    const threshold = 200

    if (direction === "horizontal") {
      const scrollPosition = container.scrollLeft + container.clientWidth
      const scrollWidth = container.scrollWidth
      
      console.log('Horizontal Scroll Check:', {
        scrollPosition,
        scrollWidth,
        remaining: scrollWidth - scrollPosition,
        threshold,
        shouldLoad: scrollWidth - scrollPosition < threshold,
        isLoading,
        hasMore
      })

      if (scrollWidth - scrollPosition < threshold) {
        console.log('🔄 Triggering load more (horizontal)...')
        onLoadMore()
      }
    } else {
      const scrollPosition = container.scrollTop + container.clientHeight
      const scrollHeight = container.scrollHeight
      
      console.log('Vertical Scroll Check:', {
        scrollPosition,
        scrollHeight,
        remaining: scrollHeight - scrollPosition,
        threshold,
        shouldLoad: scrollHeight - scrollPosition < threshold,
        isLoading,
        hasMore
      })

      if (scrollHeight - scrollPosition < threshold) {
        console.log('🔄 Triggering load more (vertical)...')
        onLoadMore()
      }
    }
  }, [direction, hasMore, onLoadMore, isLoading])

  useEffect(() => {
    checkScroll()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", checkScroll)
      container.addEventListener("scroll", handleScroll)
      window.addEventListener("resize", checkScroll)
      return () => {
        container.removeEventListener("scroll", checkScroll)
        container.removeEventListener("scroll", handleScroll)
        window.removeEventListener("resize", checkScroll)
      }
    }
  }, [checkScroll, handleScroll])

  const scroll = (scrollDirection: "left" | "right" | "up" | "down") => {
    if (!scrollContainerRef.current) return

    const scrollAmount = 400
    const container = scrollContainerRef.current

    if (scrollDirection === "left" || scrollDirection === "up") {
      if (scrollDirection === "left") {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" })
      } else {
        container.scrollBy({ top: -scrollAmount, behavior: "smooth" })
      }
    } else {
      if (scrollDirection === "right") {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" })
      } else {
        container.scrollBy({ top: scrollAmount, behavior: "smooth" })
      }
    }
  }

  const getSlideTitle = (slide: Slide) => {
    return slide.data?.name || slide.data?.title || slide.data?.clientName || "Untitled"
  }

  if (slides.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <p>No slides available</p>
      </div>
    )
  }

  return (
    <div className="relative group">
      <div
        ref={scrollContainerRef}
        className={`flex gap-4 pb-2 ${
          direction === "vertical" 
            ? "flex-col h-[600px] overflow-y-auto overflow-x-hidden" 
            : "flex-row w-full overflow-x-auto overflow-y-hidden"
        }`}
      >
        {slides.map((slide, idx) => (
          <Card
            key={slide.id}
            className="flex-shrink-0 p-4 border hover:shadow-lg transition-shadow"
            style={{
              width: direction === "horizontal" ? "300px" : "100%",
              minHeight: direction === "vertical" ? "200px" : "auto",
            }}
          >
            <div className="space-y-3 h-full flex flex-col">
              <div>
                <p className="text-sm font-semibold text-foreground">Slide {idx + 1}</p>
                <p className="text-xs text-muted-foreground truncate mt-1">{getSlideTitle(slide)}</p>
              </div>

              {(slide.data?.image || slide.data?.avatar) && (
                <div className="relative w-full h-32 bg-muted rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={slide.data.image?.url || slide.data.avatar?.url}
                    alt={slide.data.image?.alt || slide.data.avatar?.alt || getSlideTitle(slide)}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex gap-2 flex-wrap mt-auto">
                <Badge variant="outline" className="text-xs">
                  {type}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Order: {slide.order}
                </Badge>
              </div>
            </div>
          </Card>
        ))}

        {isLoading && (
          <div className="flex-shrink-0 flex items-center justify-center w-20">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {direction === "horizontal" && (
        <>
          {canScrollLeft && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background z-10 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          {canScrollRight && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background z-10 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </>
      )}
    </div>
  )
}