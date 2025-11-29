
"use client"

import React from "react"

import { motion, AnimatePresence } from "framer-motion"
import type { slide } from "@/types/schema"
import { TypeToRender } from "./CompositionBuilder"


interface CompositionProps {
  slides: slide[]
  currentSlide?: number
  onSlideChange?: (index: number) => void
}

export function SingleComposition({ slides, currentSlide = 0, onSlideChange }: CompositionProps) {
  return (
    <div className="space-y-6">
      <motion.div
        className="relative h-96 rounded-2xl overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <TypeToRender slide={slides[currentSlide]} />
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <div className="flex gap-2 justify-center">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => onSlideChange?.(idx)}
            className={`h-2.5 rounded-full transition-all ${idx === currentSlide ? "w-8 bg-primary" : "w-2.5 bg-muted"}`}
          />
        ))}
      </div>
    </div>
  )
}

export function GridComposition({ slides }: CompositionProps) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {slides.map((slide, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow"
        >
          <TypeToRender slide={slide} />
        </motion.div>
      ))}
    </motion.div>
  )
}

export function CarouselComposition({ slides, currentSlide = 0, onSlideChange }: CompositionProps) {
  return (
    <div className="space-y-6">
      <div className="relative h-96 rounded-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -200 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0"
          >
            <TypeToRender slide={slides[currentSlide]} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => onSlideChange?.(Math.max(0, (currentSlide || 1) - 1))}
          className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Previous
        </button>
        <div className="flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => onSlideChange?.(idx)}
              className={`h-2.5 rounded-full transition-all ${idx === currentSlide ? "w-8 bg-primary" : "w-2.5 bg-muted"}`}
            />
          ))}
        </div>
        <button
          onClick={() => onSlideChange?.((currentSlide || 0) + 1)}
          className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export function StackedComposition({ slides }: CompositionProps) {
  return (
    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {slides.map((slide, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
        >
          <TypeToRender slide={slide} />
        </motion.div>
      ))}
    </motion.div>
  )
}

export function FadeComposition({ slides, currentSlide = 0, onSlideChange }: CompositionProps) {
  return (
    <div className="space-y-6">
      <div className="relative h-96 rounded-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <TypeToRender slide={slides[currentSlide]} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex gap-2 justify-center">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => onSlideChange?.(idx)}
            className={`h-2.5 rounded-full transition-all ${idx === currentSlide ? "w-8 bg-primary" : "w-2.5 bg-muted"}`}
          />
        ))}
      </div>
    </div>
  )
}

export function ZoomComposition({ slides, currentSlide = 0, onSlideChange }: CompositionProps) {
  return (
    <div className="space-y-6">
      <div className="relative h-96 rounded-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <TypeToRender slide={slides[currentSlide]} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex gap-2 justify-center">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => onSlideChange?.(idx)}
            className={`h-2.5 rounded-full transition-all ${idx === currentSlide ? "w-8 bg-primary" : "w-2.5 bg-muted"}`}
          />
        ))}
      </div>
    </div>
  )
}

export function ParallaxComposition({ slides }: CompositionProps) {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })

  return (
    <motion.div
      className="space-y-6"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5,
        })
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slides.map((slide, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            style={{
              transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
            }}
            className="rounded-2xl overflow-hidden"
          >
            <TypeToRender slide={slide} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export function CoverflowComposition({ slides, currentSlide = 0, onSlideChange }: CompositionProps) {
  return (
    <div className="space-y-6 perspective">
      <div className="relative h-96 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, rotateY: 90, z: -500 }}
            animate={{ opacity: 1, rotateY: 0, z: 0 }}
            exit={{ opacity: 0, rotateY: -90, z: -500 }}
            transition={{ duration: 0.6 }}
            style={{ perspective: 1000 }}
            className="absolute w-3/4 max-w-md"
          >
            <TypeToRender slide={slides[currentSlide]} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex gap-2 justify-center">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => onSlideChange?.(idx)}
            className={`h-2.5 rounded-full transition-all ${idx === currentSlide ? "w-8 bg-primary" : "w-2.5 bg-muted"}`}
          />
        ))}
      </div>
    </div>
  )
}

export function KenBurnsComposition({ slides, currentSlide = 0, onSlideChange }: CompositionProps) {
  return (
    <div className="space-y-6">
      <div className="relative h-96 rounded-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1.1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <TypeToRender slide={slides[currentSlide]} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex gap-2 justify-center">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => onSlideChange?.(idx)}
            className={`h-2.5 rounded-full transition-all ${idx === currentSlide ? "w-8 bg-primary" : "w-2.5 bg-muted"}`}
          />
        ))}
      </div>
    </div>
  )
}

export function FlipComposition({ slides, currentSlide = 0, onSlideChange }: CompositionProps) {
  return (
    <div className="space-y-6">
      <div className="relative h-96 rounded-2xl overflow-hidden" style={{ perspective: 1000 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, rotateY: -180 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 180 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <TypeToRender slide={slides[currentSlide]} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex gap-2 justify-center">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => onSlideChange?.(idx)}
            className={`h-2.5 rounded-full transition-all ${idx === currentSlide ? "w-8 bg-primary" : "w-2.5 bg-muted"}`}
          />
        ))}
      </div>
    </div>
  )
}

export function CubeComposition({ slides, currentSlide = 0, onSlideChange }: CompositionProps) {
  return (
    <div className="space-y-6">
      <div className="relative h-96" style={{ perspective: 1200 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, rotateX: 90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            exit={{ opacity: 0, rotateX: -90 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 rounded-2xl overflow-hidden"
          >
            <TypeToRender slide={slides[currentSlide]} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex gap-2 justify-center">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => onSlideChange?.(idx)}
            className={`h-2.5 rounded-full transition-all ${idx === currentSlide ? "w-8 bg-primary" : "w-2.5 bg-muted"}`}
          />
        ))}
      </div>
    </div>
  )
}

export function AutoGridComposition({ slides }: CompositionProps) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-max"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {slides.map((slide, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.05 }}
          className="rounded-lg overflow-hidden hover:shadow-xl transition-shadow h-64"
        >
          <TypeToRender slide={slide} />
        </motion.div>
      ))}
    </motion.div>
  )
}

export function StoryComposition({ slides, currentSlide = 0, onSlideChange }: CompositionProps) {
  React.useEffect(() => {
    const timer = setInterval(() => {
      onSlideChange?.((currentSlide + 1) % slides.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [currentSlide, slides.length, onSlideChange])

  return (
    <div className="space-y-4">
      <div className="flex gap-1">
        {slides.map((_, idx) => (
          <div key={idx} className="flex-1 h-1 bg-muted-foreground/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: idx === currentSlide ? "100%" : "0%" }}
              transition={{ duration: 3, ease: "linear" }}
            />
          </div>
        ))}
      </div>
      <div className="relative h-96 rounded-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="absolute inset-0"
          >
            <TypeToRender slide={slides[currentSlide]} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export function FilmstripComposition({ slides, currentSlide = 0, onSlideChange }: CompositionProps) {
  return (
    <div className="space-y-6">
      <div className="relative h-96 rounded-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <TypeToRender slide={slides[currentSlide]} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {slides.map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => onSlideChange?.(idx)}
            className={`flex-shrink-0 h-20 w-24 rounded-lg overflow-hidden border-2 transition-all ${
              idx === currentSlide ? "border-primary shadow-lg" : "border-muted hover:border-primary/50"
            }`}
          >
            <div className="w-full h-full bg-muted flex items-center justify-center text-xs font-semibold">
              Slide {idx + 1}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export function LightboxComposition({ slides }: CompositionProps) {
  const [selectedIdx, setSelectedIdx] = React.useState<number | null>(null)

  return (
    <>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {slides.map((slide, idx) => (
          <motion.button
            key={idx}
            onClick={() => setSelectedIdx(idx)}
            whileHover={{ scale: 1.05 }}
            className="rounded-lg overflow-hidden h-32 border-2 border-muted hover:border-primary transition-colors"
          >
            <div className="w-full h-full bg-muted flex items-center justify-center text-xs font-semibold">
              Slide {idx + 1}
            </div>
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIdx(null)}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-96 rounded-2xl overflow-hidden"
            >
              <TypeToRender slide={slides[selectedIdx]} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function MarqueeComposition({ slides }: CompositionProps) {
  const duplicatedSlides = [...slides, ...slides]

  return (
    <motion.div
      className="relative h-96 overflow-hidden rounded-2xl bg-muted"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="flex gap-6 h-full"
        animate={{ x: -1000 }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        {duplicatedSlides.map((slide, idx) => (
          <div key={idx} className="flex-shrink-0 w-96 h-full">
            <TypeToRender slide={slide} />
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}
