"use client"

import { JSX, memo, useCallback, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import type { slide } from "@/types/schema"
import { TypeToRenderProd } from "./_comp/TypToRenderProd"
import { ExpermintalParallaxContainer } from "./_comp/expermintal/ExpermintalParallaxContainer"
import CoverflowComposition from "./_comp/expermintal/coverflowComposition"
import FilmStrip from "./_comp/cardProd/generic/filmStrap"
import MarqueeComposition from "./_comp/expermintal/marqueeComposition"
import SingleComposition from "./_comp/expermintal/singleComposition"
import CubeComposition from "./_comp/expermintal/cubeComposition"
// import { TypeToRenderProd  } from "./TypeToRenderProd "


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
  interval: number
  autoPlay: boolean,
  isInViewport: boolean,
    HeaderSlideShow ?: JSX.Element | null

  // containerRef : RefObject<HTMLDivElement | null>
}

export const CompositionPreview = memo(({ isInViewport, HeaderSlideShow ,interval, autoPlay, composition, slides }: CompositionPreviewProps) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [[page, direction], setPage] = useState([0, 0])
  const [lightboxOpen, setLightboxOpen] = useState(false)
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

  // Memoize paginate to avoid recreating it on every render
  const paginate = useCallback((newDirection: number) => {
    if (!slides || slides.length === 0) 
      if(composition === "LIGHTBOX") return

    const nextIndex = currentSlide + newDirection

    // Check boundaries and wrap around
    let newPage: number
    if (nextIndex >= slides.length) {
      newPage = 0 // Go back to first slide
    } else if (nextIndex < 0) {
      newPage = slides.length - 1 // Go to last slide
    } else {
      newPage = nextIndex
    }

    setPage([newPage, newDirection])
    setCurrentSlide(newPage)

  }, [composition, currentSlide, slides])

  // Auto-progress effect with smooth progress bar
  useEffect(() => {

    if(composition === "LIGHTBOX") return
    if (!autoPlay || !slides || slides.length === 0 || interval <= 0 || isInViewport === false) {
      (() => {

        setAutoProgress(0)
      })()
      return
    }

    const tickMs = 50 // Update progress every 50ms for smooth animation
    const step = (100 * tickMs) / interval // Calculate increment per tick

    const progressInterval = setInterval(() => {
      setAutoProgress(prev => {
        const next = prev + step
        if (next >= 100) {
          // Progress complete, advance to next slide
          paginate(1)
          return 0 // Reset progress
        }
        return next
      })
    }, tickMs)

    // Cleanup function
    return () => {
      clearInterval(progressInterval)
    }
  }, [autoPlay, interval, paginate, slides, currentSlide, isInViewport, composition])

  // Reset progress when slide changes manually
  useEffect(() => {
    if (autoPlay) {
      (() => {

        setAutoProgress(0)
      })()
    }
  }, [currentSlide, autoPlay])

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
          <div dir="ltr" className="flex items-center  gap-3 justify-end px-8">
            <motion.button
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={() => paginate(-1)}
              className="group flex items-center gap-3 p-2  rounded-full border border-primary hover:bg-primary hover:text-secondary transition duration-150 cursor-pointer  font-semibold  overflow-hidden relative"
            >
              <ChevronLeft className="w-5 h-5 relative z-10" />
            </motion.button>

            <motion.button
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={() => paginate(1)}
              className="group flex items-center gap-3 p-2  rounded-full border border-primary hover:bg-primary hover:text-secondary transition duration-150 cursor-pointer  font-semibold  overflow-hidden relative"
            >
              <ChevronRight className="w-5 h-5 relative z-10" />
            </motion.button>
          </div>
          <div className="relative ">

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
                className=" inset-0  rounded-3xl  "
              >
                <TypeToRenderProd play={isInViewport} splitcarousel={true} slide={slides[currentSlide]} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex gap-4 mt-16 w-full justify-center items-center">

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
                className={`h-2.5 rounded-full transition-all  ${idx === currentSlide
                  ? "w-2 bg-primary "
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
              className=" rounded-3xl   overflow-hidden cursor-pointer group"
            >
              <div className=" inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <TypeToRenderProd play={isInViewport} slide={slide} />
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
              className=" rounded-3xl   overflow-hidden group"
            >
              <div className=" inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <TypeToRenderProd play={isInViewport} slide={slide} />
            </motion.div>
          ))}
        </motion.div>
      )

    case "FADE":
      return (
        <div className="space-y-8">
          <div className="relative  rounded-3xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                variants={fadeVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.1, ease: "easeInOut" }}
                className=" inset-0   "
              >
                <TypeToRenderProd play={isInViewport} slide={slides[currentSlide]} />
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
                className={`h-2.5 rounded-full transition-all  ${idx === currentSlide
                  ? "w-16 bg-linear-to-r from-primary to-accent "
                  : "w-2.5 bg-muted-foreground/20 hover:bg-muted-foreground/40"
                  }`}
              />
            ))}
          </div>
        </div>
      )

    case "SINGLE":


      return (
        <SingleComposition  slides={slides} />
      )

   

    case "ZOOM":
      return (
        <div className="space-y-8">
          <div className="relative  overflow-hidden rounded-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className=" inset-0  flex w-full justify-center items-center gap-4 "
              >
                <motion.button

                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => paginate(-1)}
                  className="px-3 py-3 rounded-full  border border-primary/90  text-primary font-semibold "
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
                <TypeToRenderProd play={isInViewport} slide={slides[currentSlide]} />
                <motion.button

                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => paginate(1)}
                  className="px-3 py-3 rounded-full  border border-primary/90  text-primary font-semibold "
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex gap-4 justify-center items-center">

            {slides.map((_, idx) => (

              <motion.button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${idx === currentSlide ? "w-4 bg-primary" : "w-2 bg-muted-foreground/30"}`}
              />
            ))}

          </div>
        </div>
      )

    case "PARALLAX":
      return (

        <ExpermintalParallaxContainer slides={slides} isInViewport={isInViewport} />
       
      )

    case "COVERFLOW":
      return <CoverflowComposition slides={slides} isInViewport={isInViewport}  />
    

    case "KEN_BURNS":
      return (
        <div className="space-y-8">
          <div className="relative  overflow-hidden rounded-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ scale: 1.3, x: -40, y: -40, opacity: 0 }}
                animate={{ scale: 1, x: 0, y: 0, opacity: 1 }}
                exit={{ scale: 1.3, x: 40, y: 40, opacity: 0 }}
                transition={{ duration: .5, ease: "easeInOut" }}
                className=" inset-0   "
              >
                <TypeToRenderProd play={isInViewport} slide={slides[currentSlide]} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex items-center justify-center gap-4">
            {/* Previous Button */}
            <button
              onClick={() => paginate(-1)}
              className="group relative px-4 py-2.5 rounded-xl bg-background border-2 border-border hover:border-primary transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>

            {/* Dot Indicators */}
            <div className="flex items-center gap-2 px-4">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`rounded-full transition-all duration-300 hover:scale-110 ${idx === currentSlide
                    ? "w-10 h-3 bg-primary shadow-lg shadow-primary/30"
                    : "w-3 h-3 bg-muted-foreground/20 hover:bg-muted-foreground/40"
                    }`}
                />
              ))}
            </div>
            {/* Next Button */}
            <button
              onClick={() => paginate(1)}
              className="group relative px-4 py-2.5 rounded-xl bg-background border-2 border-border hover:border-primary transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          </div>
        </div>
      )

    case "FLIP":
      return (
        <div className="space-y-8">
          <div className="flex items-center justify-center h-132">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full  rounded-3xl  "
                style={{ transformStyle: "preserve-3d" }}
              >
                <TypeToRenderProd play={isInViewport} slide={slides[currentSlide]} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => paginate(-1)}
              className="px-8 py-2 rounded-lg bg-primary/90 text-primary-foreground font-semibold "
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
              className="px-8 py-2 rounded-lg bg-primary/90 text-primary-foreground font-semibold "
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      )

    case "CUBE":

      // expemental
      // return null
      return <CubeComposition   slides={slides} />

   

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
              className="h-64  rounded-2xl   overflow-hidden cursor-pointer group"
            >
              <div className=" inset-0 bg-linear-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <TypeToRenderProd play={isInViewport} slide={slide} />
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
                  className="h-full bg-primary"
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
                className=" inset-0   h-full "
              >
                <TypeToRenderProd play={isInViewport} slide={slides[currentSlide]} story={true} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )

    case "FILMSTRIP":
        return <FilmStrip slides={slides} isInViewport={isInViewport} />
  

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
                <div className="h-full  ">
                  <TypeToRenderProd light={true} play={isInViewport} slide={slide} />
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
                  className="relative  w-full max-w-2xl h-fit flex items-center justify-center rounded-3xl overflow-hidden"
                >
                  <div className=" inset-0  h-full w-full ">
                    <TypeToRenderProd lightOpen={true}  play={isInViewport} slide={slides[currentSlide]} />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setLightboxOpen(false)}
                    className=" top-4 right-4 p-2 absolute bg-black/50 rounded-full text-white hover:bg-black/70 z-10"
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
        
        <MarqueeComposition isInViewport={isInViewport}  slides={slides} key={"ma"}/>
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
})

CompositionPreview.displayName = "CompositionPreview"


