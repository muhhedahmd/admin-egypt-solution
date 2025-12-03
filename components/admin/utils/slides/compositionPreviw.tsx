"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { TypeToRender } from "./CompositionBuilder"
import type { slide } from "@/types/schema"

interface CompositionPreviewProps {
  composition:
  | "SINGLE"
  | "GRID"
  | "CAROUSEL"
  | "STACKED"
  | "FADE"
  | "CUSTOM"
  | "ZOOM"
  | "PARALLAX"
  | "COVERFLOW"
  | "KEN_BURNS"
  | "FLIP"
  | "CUBE"
  | "AUTO_GRID"
  | "STORY"
  | "FILMSTRIP"
  | "LIGHTBOX"
  | "MARQUEE"
  slides: slide[]
  onScroll?: () => void
}

export function CompositionPreview({ composition, slides, onScroll }: CompositionPreviewProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [[page, direction], setPage] = useState([0, 0])
  const [isAutoSlide, setIsAutoSlide] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [columns, setColumns] = useState(3)
  const [autoProgress, setAutoProgress] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setColumns(1)
      else if (window.innerWidth < 1024) setColumns(2)
      else setColumns(3)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (composition !== "STORY") return

    const interval = setInterval(() => {
      setAutoProgress((prev) => {
        if (prev >= 100) {
          paginate(1)
          return 0
        }
        return prev + 1
      })
    }, 50)
    return () => clearInterval(interval)
  }, [currentSlide, composition])

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 200 : -200,
      opacity: 0,
    }),
  }

  const fadeVariants = {
    enter: {
      opacity: 0,
    },
    center: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
      },
    }),
  }

  const paginate = (newDirection: number) => {
    const newPage = (currentSlide + newDirection + slides.length) % slides.length
    setPage([newPage, newDirection])
    setCurrentSlide(newPage)
    setIsAutoSlide(false)
  }

  if (!slides.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center h-96 rounded-lg border border-border bg-muted/20"
      >
        <p className="text-muted-foreground font-light">No slides to preview</p>
      </motion.div>
    )
  }

  switch (composition) {
    case "CAROUSEL":
      return (
        <div className="space-y-8 overflow-hidden">

          <div className="flex items-center  gap-3 justify-end px-8">
            <motion.button
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={() => paginate(-1)}
              className="group flex items-center gap-3 p-2  rounded-full border border-primary hover:bg-primary hover:text-secondary transition duration-150 cursor-pointer  font-semibold shadow-2xl overflow-hidden relative"
            >
              <ChevronLeft className="w-5 h-5 relative z-10" />
            </motion.button>

        
            <motion.button
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={() => paginate(1)}
              className="group flex items-center gap-3 p-2  rounded-full border border-primary hover:bg-primary hover:text-secondary transition duration-150 cursor-pointer  font-semibold shadow-2xl overflow-hidden relative"
            >
              <ChevronRight className="w-5 h-5 relative z-10" />
            </motion.button>
          </div>
          <div className="relative h-[500px] perspective-[1000px]">

            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={page}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                }}
                className=" inset-0 glass-card rounded-3xl premium-shadow gradient-border"
              >
                <TypeToRender slide={slides[currentSlide]} />
              </motion.div>
            </AnimatePresence>
          </div>
              <div className="flex gap-4 w-full justify-center items-center">
                
              {slides.map((_, idx) => (
                <motion.button
                  key={idx}
                  initial="inactive"
                  animate={idx === currentSlide ? "active" : "inactive"}
                  whileHover={{ scale: 1.3 }}
                  onClick={() => {
                    setPage([idx, idx > currentSlide ? 1 : -1])
                    setCurrentSlide(idx)
                  }}
                  className={`h-2.5 rounded-full transition-all shadow-lg ${idx === currentSlide
                    ? "w-2 bg-primary shadow-primary/50"
                    : "w-8 bg-muted-foreground/20 hover:bg-muted-foreground/40"
                    }`}
                />
              ))}
            </div>



        </div>
      )

    case "GRID":
      return (
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" initial="hidden" animate="visible">
          {slides.map((slide, idx) => (
            <motion.div
              key={idx}
              custom={idx}
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              className="glass-card rounded-3xl premium-shadow gradient-border overflow-hidden cursor-pointer group"
            >
              <div className=" inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <TypeToRender slide={slide} />
            </motion.div>
          ))}
        </motion.div>
      )

    case "STACKED":
      return (
        <motion.div className="flex flex-col gap-8" initial="hidden" animate="visible">
          {slides.map((slide, idx) => (
            <motion.div
              key={idx}
              custom={idx}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              className="glass-card rounded-3xl premium-shadow gradient-border overflow-hidden group"
            >
              <div className=" inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <TypeToRender slide={slide} />
            </motion.div>
          ))}
        </motion.div>
      )

    case "FADE":
      return (
        <div className="space-y-8">
          <div className="relative h-[500px] rounded-3xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                variants={fadeVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.8 }}
                className=" inset-0 glass-card premium-shadow gradient-border"
              >
                <TypeToRender slide={slides[currentSlide]} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex gap-4 justify-center">
            {slides.map((_, idx) => (
              <motion.button
                key={idx}
                initial="inactive"
                animate={idx === currentSlide ? "active" : "inactive"}
                whileHover={{ scale: 1.4 }}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all shadow-lg ${idx === currentSlide
                  ? "w-16 bg-gradient-to-r from-primary to-accent shadow-primary/50"
                  : "w-2.5 bg-muted-foreground/20 hover:bg-muted-foreground/40"
                  }`}
              />
            ))}
          </div>
        </div>
      )

    case "SINGLE":
      return (
        <div className="space-y-8">
          <motion.div
            className="h-[500px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100, rotateY: 15 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -100, rotateY: -15 }}
                transition={{ duration: 0.5 }}
                className="h-full glass-card rounded-3xl premium-shadow gradient-border"
              >
                <TypeToRender slide={slides[currentSlide]} />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <div className="flex gap-6 justify-center items-center">
            <motion.button
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
              disabled={currentSlide === 0}
              className="p-4 rounded-2xl bg-primary/90 backdrop-blur-xl text-primary-foreground font-semibold disabled:opacity-30 disabled:cursor-not-allowed premium-shadow group overflow-hidden relative"
            >
              <ChevronLeft className="w-6 h-6 relative z-10" />
            </motion.button>

            <motion.div
              key={currentSlide}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card px-8 py-4 rounded-2xl min-w-[140px] text-center premium-shadow"
            >
              <span className="text-foreground font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {currentSlide + 1}
              </span>
              <span className="text-muted-foreground font-medium text-lg mx-2">/</span>
              <span className="text-muted-foreground font-medium text-lg">{slides.length}</span>
            </motion.div>

            <motion.button
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={() => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))}
              disabled={currentSlide === slides.length - 1}
              className="p-4 rounded-2xl bg-primary/90 backdrop-blur-xl text-primary-foreground font-semibold disabled:opacity-30 disabled:cursor-not-allowed premium-shadow group overflow-hidden relative"
            >
              <ChevronRight className="w-6 h-6 relative z-10" />
            </motion.button>
          </div>
        </div>
      )

    case "ZOOM":
      return (
        <div className="space-y-8">
          <div className="relative h-[500px] overflow-hidden rounded-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className=" inset-0 glass-card premium-shadow gradient-border"
              >
                <TypeToRender slide={slides[currentSlide]} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => paginate(-1)}
              className="px-6 py-2 rounded-lg bg-primary/90 text-primary-foreground font-semibold premium-shadow"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            {slides.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${idx === currentSlide ? "w-12 bg-primary" : "w-2 bg-muted-foreground/30"}`}
              />
            ))}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => paginate(1)}
              className="px-6 py-2 rounded-lg bg-primary/90 text-primary-foreground font-semibold premium-shadow"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      )

    case "PARALLAX":
      return (
        <div className="space-y-8">
          <div
            className="relative  overflow-hidden rounded-3xl flex flex-col w-full h-full gap-5"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const offset = ((e.clientX - rect.left) / rect.width - 0.5) * 30
              setScrollPosition(offset)
            }}
          >
            <AnimatePresence mode="wait" >

              {slides.map((slide, idx) => {
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: scrollPosition }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className=" inset-0 glass-card premium-shadow gradient-border min-h-screen space-y-12"
                  >
                    <TypeToRender slide={slide} split={true} index={idx} />
                  </motion.div>

                )
              })}
            </AnimatePresence>
          </div>
          {/* 
          <div className="flex justify-center gap-3">
            {slides.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                whileHover={{ scale: 1.2 }}
                className={`h-3 rounded-full transition-all ${idx === currentSlide ? "w-12 bg-primary" : "w-3 bg-muted-foreground/40"}`}
              />
            ))}
          </div> */}
        </div>
      )

    case "COVERFLOW":
      return (
        <div className="space-y-8">
          <div className="relative h-[500px] perspective-[1000px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {slides.map((slide, idx) => {
                const offset = idx - currentSlide
                const isVisible = Math.abs(offset) <= 2
                if (!isVisible) return null

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, rotateY: 45 }}
                    animate={{
                      opacity: offset === 0 ? 1 : 0.6,
                      rotateY: offset * 45,
                      x: offset * 120,
                      z: offset === 0 ? 0 : -200,
                    }}
                    exit={{ opacity: 0, rotateY: -45 }}
                    transition={{ duration: 0.6 }}
                    className=" h-96 w-80 glass-card rounded-2xl premium-shadow gradient-border"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <TypeToRender slide={slide} />
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => paginate(-1)}
              className="px-8 py-2 rounded-lg bg-primary/90 text-primary-foreground font-semibold premium-shadow"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            {slides.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all ${idx === currentSlide ? "w-10 bg-primary" : "w-2.5 bg-muted-foreground/30"}`}
              />
            ))}
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => paginate(1)}
              className="px-8 py-2 rounded-lg bg-primary/90 text-primary-foreground font-semibold premium-shadow"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      )

    case "KEN_BURNS":
      return (
        <div className="space-y-8">
          <div className="relative h-[500px] overflow-hidden rounded-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ scale: 1.3, x: -40, y: -40, opacity: 0 }}
                animate={{ scale: 1, x: 0, y: 0, opacity: 1 }}
                exit={{ scale: 1.3, x: 40, y: 40, opacity: 0 }}
                transition={{ duration: 4, ease: "easeInOut" }}
                className=" inset-0 glass-card premium-shadow gradient-border"
              >
                <TypeToRender slide={slides[currentSlide]} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex gap-3 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => paginate(-1)}
              className="px-6 py-2 rounded-lg bg-primary/90 text-primary-foreground font-semibold premium-shadow"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <div className="flex gap-2">
              {slides.map((_, idx) => (
                <motion.div
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full cursor-pointer transition-all ${idx === currentSlide ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"}`}
                />
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => paginate(1)}
              className="px-6 py-2 rounded-lg bg-primary/90 text-primary-foreground font-semibold premium-shadow"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      )

    case "FLIP":
      return (
        <div className="space-y-8">
          <div className="flex items-center justify-center h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full glass-card rounded-3xl premium-shadow gradient-border"
                style={{ transformStyle: "preserve-3d" }}
              >
                <TypeToRender slide={slides[currentSlide]} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => paginate(-1)}
              className="px-8 py-2 rounded-lg bg-primary/90 text-primary-foreground font-semibold premium-shadow"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            {slides.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${idx === currentSlide ? "w-12 bg-primary" : "w-2 bg-muted-foreground/30"}`}
              />
            ))}
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => paginate(1)}
              className="px-8 py-2 rounded-lg bg-primary/90 text-primary-foreground font-semibold premium-shadow"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      )

    case "CUBE":
      return (
        <div className="space-y-8">
          <div className="relative h-[500px] perspective-[1200px] flex items-center justify-center rounded-3xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className=" inset-0 glass-card premium-shadow gradient-border"
                style={{ transformStyle: "preserve-3d" }}
              >
                <TypeToRender slide={slides[currentSlide]} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => paginate(-1)}
              className="px-8 py-2 rounded-lg bg-primary/90 text-primary-foreground font-semibold premium-shadow"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <div className="flex gap-2">
              {slides.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all ${idx === currentSlide ? "w-10 bg-primary" : "w-2 bg-muted-foreground/30"}`}
                />
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => paginate(1)}
              className="px-8 py-2 rounded-lg bg-primary/90 text-primary-foreground font-semibold premium-shadow"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      )

    case "AUTO_GRID":
      return (
        <motion.div
          className={`grid gap-6`}
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          initial="hidden"
          animate="visible"
        >
          {slides.map((slide, idx) => (
            <motion.div
              key={idx}
              custom={idx}
              variants={cardVariants}
              whileHover={{ scale: 1.05, y: -4 }}
              className="h-64 glass-card rounded-2xl premium-shadow gradient-border overflow-hidden cursor-pointer group"
            >
              <div className=" inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <TypeToRender slide={slide} />
            </motion.div>
          ))}
        </motion.div>
      )

    case "STORY":
      return (
        <div className="space-y-4">
          <div className="flex gap-1">
            {slides.map((_, idx) => (
              <motion.div key={idx} className="flex-1 h-1 bg-muted-foreground/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent"
                  initial={{ width: 0 }}
                  animate={{ width: idx === currentSlide ? `${autoProgress}%` : idx < currentSlide ? "100%" : "0%" }}
                  transition={{ ease: "linear" }}
                />
              </motion.div>
            ))}
          </div>

          <div className="relative  w-full  rounded-3xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className=" inset-0 glass-card premium-shadow h-full gradient-border"
              >
                <TypeToRender slide={slides[2]} story={true} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )

    case "FILMSTRIP":
      return (
        <div className="space-y-6" >
          <div className="relative h-max rounded-3xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className=" inset-0 glass-card premium-shadow gradient-border"
              >
                <TypeToRender slide={slides[currentSlide]} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 px-4">
            {slides.map((slide, idx) => (
              <motion.button
              style={{
                outline: "none",
                border:"none",
              }}
                key={idx}
                onClick={() => {
                  setCurrentSlide(idx)
                  setLightboxOpen(true)
                }}
                // whileHover={{ scale: 1.1 }}
                className={`w-40 h-40 rounded-lg border-4 transition-all overflow-hidden ${idx === currentSlide
                  ? "border-primary shadow-lg scale-105"
                  : "border-muted-foreground/30 opacity-60 hover:opacity-100"
                  }`}
              >
                <div className="h-full ">
                  <TypeToRender slide={slide} imaged={true} minmal={true} />
                </div>
                {/* <div className=" inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <motion.div initial={{ scale: 0 }} whileHover={{ scale: 1 }} className="text-white text-2xl">
                    +
                  </motion.div>
                </div> */}
              </motion.button>
            ))}
          </div>
        </div>
      )

    case "LIGHTBOX":
      return (
        <div className="space-y-6">
          <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-4" initial="hidden" animate="visible">
            {slides.map((slide, idx) => (
              <motion.button
                key={idx}
                custom={idx}
                variants={cardVariants}
                onClick={() => {
                  setCurrentSlide(idx)
                  setLightboxOpen(true)
                }}
                whileHover={{ scale: 1.05 }}
                className="h-32 rounded-lg overflow-hidden cursor-pointer group relative"
              >
                <div className="h-full glass-card premium-shadow">
                  <TypeToRender slide={slide} />
                </div>
                <div className=" inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <motion.div initial={{ scale: 0 }} whileHover={{ scale: 1 }} className="text-white text-2xl">
                    +
                  </motion.div>
                </div>
              </motion.button>
            ))}
          </motion.div>

          <AnimatePresence>
            {lightboxOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLightboxOpen(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-2xl h-full flex items-center justify-center rounded-3xl overflow-hidden"
                >
                  <div className=" inset-0 glass-card premium-shadow">
                    <TypeToRender slide={slides[currentSlide]} />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setLightboxOpen(false)}
                    className=" top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 z-10"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>


                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )

    case "MARQUEE":
      return (
        <div className="space-y-8 ">
          <div className="relative h-32 overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
            <motion.div
              className="flex gap-4 h-full"
              animate={{
                x: [0, -100 * slides.length],
                transition: {
                  x: {
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "linear",
                  }
                }
              }}

            >
              {[...slides, ...slides].map((slide, idx) => (
                <motion.div
                  key={idx}
                  className="min-w-fit h-full aspect-video glass-card rounded-2xl premium-shadow gradient-border flex-shrink-0"
                >
                  <TypeToRender slide={slide} imaged={true} minmal={true} />
                </motion.div>
              ))}
            </motion.div>
          </div>


        </div>
      )

    case "CUSTOM":
    default:
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center h-96 rounded-lg border border-border bg-muted/20"
        >
          <p className="text-muted-foreground font-light">Custom composition rendering</p>
        </motion.div>
      )
  }
}
