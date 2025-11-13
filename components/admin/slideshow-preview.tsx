"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Slide {
  id: number
  title: string
  description?: string
  image?: string
  cta?: string
  ctaUrl?: string
  rating?: number
  author?: string
  company?: string
}

interface SlideshowPreviewProps {
  type: string
  slides: Slide[]
  autoplay: boolean
  autoplayInterval: number
}

export function SlideshowPreview({ type, slides, autoplay, autoplayInterval }: SlideshowPreviewProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (!autoplay || slides.length === 0) return

    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
        setIsTransitioning(false)
      }, 300)
    }, autoplayInterval)

    return () => clearInterval(interval)
  }, [autoplay, autoplayInterval, slides.length])

  const handlePrev = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
      setIsTransitioning(false)
    }, 300)
  }

  const handleNext = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
      setIsTransitioning(false)
    }, 300)
  }

  if (slides.length === 0) {
    return (
      <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground text-sm">No slides added yet</p>
      </div>
    )
  }

  const slide = slides[currentSlide]

  return (
    <div className="space-y-4">
      {/* Preview Container with smooth transitions */}
      <div className="relative w-full bg-muted rounded-lg overflow-hidden shadow-lg">
        <div className={`transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
          {type === "HERO" && <HeroPreview slide={slide} />}
          {type === "PROJECT" && <ProjectPreview slide={slide} />}
          {type === "CLIENT" && <ClientPreview slide={slide} />}
          {type === "TEAM" && <TeamPreview slide={slide} />}
          {type === "TESTIMONIAL" && <TestimonialPreview slide={slide} />}
          {type === "PORTFOLIO" && <PortfolioPreview slide={slide} />}
        </div>
      </div>

      {/* Navigation */}
      {slides.length > 1 && (
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            className="hover:bg-primary hover:text-white transition-colors bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsTransitioning(true)
                  setTimeout(() => {
                    setCurrentSlide(idx)
                    setIsTransitioning(false)
                  }, 300)
                }}
                className={`rounded-full transition-all duration-300 ${
                  idx === currentSlide
                    ? "bg-primary w-8 h-2.5"
                    : "bg-muted-foreground/30 w-2 h-2.5 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            className="hover:bg-primary hover:text-white transition-colors bg-transparent"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Slide Counter */}
      <p className="text-xs text-muted-foreground text-center font-medium">
        Slide {currentSlide + 1} of {slides.length}
      </p>
    </div>
  )
}

function HeroPreview({ slide }: { slide: Slide }) {
  return (
    <div className="relative w-full aspect-video bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center overflow-hidden">
      {slide.image && (
        <Image
          src={slide.image || "/placeholder.svg"}
          alt={slide.title}
          fill
          className="object-cover opacity-30 animate-zoom"
        />
      )}
      <div className="relative z-10 text-center text-white space-y-4 px-6 animate-fade-in">
        <h3 className="text-4xl font-bold tracking-tight">{slide.title}</h3>
        {slide.description && <p className="text-lg text-blue-100 max-w-xl">{slide.description}</p>}
        {slide.cta && <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold">{slide.cta}</Button>}
      </div>
    </div>
  )
}

function ProjectPreview({ slide }: { slide: Slide }) {
  return (
    <div className="relative w-full aspect-video bg-gray-900 flex items-center justify-center overflow-hidden group">
      {slide.image && (
        <Image
          src={slide.image || "/placeholder.svg"}
          alt={slide.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
      )}
      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors duration-300" />
      <div className="relative z-10 text-center text-white space-y-3 animate-fade-in">
        <h3 className="text-3xl font-bold">{slide.title}</h3>
        {slide.description && <p className="text-base text-gray-200">{slide.description}</p>}
        {slide.cta && (
          <Button variant="outline" className="border-white text-white hover:bg-white/20 bg-transparent font-semibold">
            {slide.cta}
          </Button>
        )}
      </div>
    </div>
  )
}

function ClientPreview({ slide }: { slide: Slide }) {
  return (
    <div className="w-full aspect-video bg-gradient-to-br from-white to-gray-50 flex flex-col items-center justify-center gap-6 p-6 animate-fade-in">
      {slide.image && (
        <div className="relative w-40 h-40 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
          <Image src={slide.image || "/placeholder.svg"} alt={slide.title} fill className="object-contain p-4" />
        </div>
      )}
      <div className="text-center">
        <h3 className="font-bold text-xl text-gray-900">{slide.title}</h3>
        {slide.company && <p className="text-sm text-gray-600 mt-1">{slide.company}</p>}
      </div>
    </div>
  )
}

function TeamPreview({ slide }: { slide: Slide }) {
  return (
    <div className="w-full aspect-video bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center gap-6 p-6 animate-fade-in">
      {slide.image && (
        <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl hover:shadow-2xl transition-shadow">
          <Image src={slide.image || "/placeholder.svg"} alt={slide.title} fill className="object-cover" />
        </div>
      )}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900">{slide.title}</h3>
        {slide.description && <p className="text-base text-gray-600 mt-2">{slide.description}</p>}
      </div>
    </div>
  )
}

function TestimonialPreview({ slide }: { slide: Slide }) {
  return (
    <div className="w-full aspect-video bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center gap-6 p-8 animate-fade-in">
      <div className="flex gap-1.5">
        {[...Array(slide.rating || 5)].map((_, i) => (
          <Star
            key={i}
            className="h-6 w-6 fill-yellow-400 text-yellow-400 animate-bounce"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
      <p className="text-center text-gray-700 italic max-w-2xl text-lg">"{slide.description}"</p>
      <div className="text-center">
        <p className="font-bold text-gray-900 text-lg">{slide.author}</p>
        {slide.company && <p className="text-sm text-gray-600 mt-1">{slide.company}</p>}
      </div>
    </div>
  )
}

function PortfolioPreview({ slide }: { slide: Slide }) {
  return (
    <div className="relative w-full aspect-video bg-gray-100 flex items-center justify-center overflow-hidden group">
      {slide.image && (
        <Image
          src={slide.image || "/placeholder.svg"}
          alt={slide.title}
          fill
          className="object-cover group-hover:scale-125 transition-transform duration-500"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="relative z-10 text-white text-center space-y-3 animate-fade-in">
        <h3 className="text-3xl font-bold">{slide.title}</h3>
        {slide.description && <p className="text-base text-gray-200">{slide.description}</p>}
      </div>
    </div>
  )
}
