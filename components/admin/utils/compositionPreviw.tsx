import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { TypeToRender } from "./CompositionBuilder"
import { useIntersectionObserver } from "@uidotdev/usehooks"

interface CompositionPreviewProps {
  composition: "CAROUSEL" | "GRID" | "STACKED" | "FADE" | "SINGLE"
  slides: any[] , 
  onScroll ?: ()=>void
}



export const CompositionPreview = ({ composition, slides , onScroll}: CompositionPreviewProps) => {


  // const [ref, isIntercecting] = useIntersectionObserver({
  //   scrollMargin: "0px",
  //   rootMargin: "0px",
  //   threshold : .1
  // })

  // useEffect(() => {

  //   if (isIntercecting) {
  //     console.log("isIntercecting" )
  //     if(onScroll)onScroll()
  //   }
  // }, [isIntercecting])


  const [currentSlide, setCurrentSlide] = useState(0)

  if (!slides.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}

        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center h-64 glass-card rounded-3xl premium-shadow"
      >
        <p className="text-muted-foreground font-medium font-inter">No slides to preview</p>
      </motion.div>
    )
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? 25 : -25,
      filter: "blur(10px)",
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      filter: "blur(0px)",
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
      rotateY: direction < 0 ? 25 : -25,
      filter: "blur(10px)",
    })
  }

  const fadeVariants = {
    enter: {
      opacity: 0,
      scale: 1.05,
      filter: "blur(20px)",
    },
    center: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      filter: "blur(20px)",
    }
  }

  const cardVariants = {

    hidden: { opacity: 0, y: 60, scale: 0.9, rotateX: -15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      }
    }),
    // hover: {
    //   y: -12,
    //   scale: 1.03,
    //   rotateX: 5,
    //   transition: {
    //     duration: 0.3,
    //     ease: "easeOut" as const
    //   }
    // }
  }

  const buttonVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      boxShadow: "0 0 30px hsl(var(--primary) / 0.5)",
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.97,
      transition: { duration: 0.1 }
    }
  }

  const dotVariants = {
    inactive: {
      scale: 1,
      opacity: 0.4,
    },
    active: {
      scale: 1.4,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 500,
        damping: 15
      }
    }
  }

  const [[page, direction], setPage] = useState([0, 0])

  const paginate = (newDirection: number) => {

    const newPage = (currentSlide + newDirection + slides.length) % slides.length
    setPage([newPage, newDirection])
    setCurrentSlide(newPage)
  }

  switch (composition) {

    case "CAROUSEL":
      return (
        <div className="space-y-8">

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
                  scale: { duration: 0.4 },
                  rotateY: { duration: 0.6 },
                  filter: { duration: 0.4 }
                }}
                className="absolute inset-0 glass-card rounded-3xl premium-shadow gradient-border shimmer"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <TypeToRender slide={slides[currentSlide]} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between px-8">

            <motion.button
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={() => paginate(-1)}
              className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary/90 backdrop-blur-xl text-primary-foreground font-semibold font-sora shadow-2xl overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <ChevronLeft className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Previous</span>
            </motion.button>

            <div className="flex gap-4">
              {slides.map((_, idx) => (
                <motion.button
                  key={idx}
                  variants={dotVariants}
                  initial="inactive"
                  animate={idx === currentSlide ? "active" : "inactive"}
                  whileHover={{ scale: 1.3 }}
                  onClick={() => {
                    setPage([idx, idx > currentSlide ? 1 : -1])
                    setCurrentSlide(idx)
                  }}
                  className={`h-2.5 rounded-full transition-all shadow-lg ${idx === currentSlide
                    ? "w-16 bg-gradient-to-r from-primary to-accent shadow-primary/50"
                    : "w-2.5 bg-muted-foreground/20 hover:bg-muted-foreground/40"
                    }`}
                />
              ))}
            </div>

            <motion.button
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={() => paginate(1)}
              className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary/90 backdrop-blur-xl text-primary-foreground font-semibold font-sora shadow-2xl overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">Next</span>
              <ChevronRight className="w-5 h-5 relative z-10" />
            </motion.button>
          </div>
        </div>
      )

    case "GRID":

      return (
        <>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            style={{ perspective: 1000 }}
          >
            {slides.map((slide, idx) => (
              <motion.div
                key={idx}
                custom={idx}
                variants={cardVariants}
                whileHover="hover"
                className="glass-card rounded-3xl premium-shadow gradient-border overflow-hidden cursor-pointer group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <TypeToRender slide={slide} />
              </motion.div>
            ))}

          </motion.div>
     
        </>

      )

    case "STACKED":
      return (
        <motion.div
          className="flex flex-col gap-8"
          initial="hidden"
          animate="visible"
          style={{ perspective: 1000 }}
        >
          {slides.map((slide, idx) => (
            <motion.div
              key={idx}
              custom={idx}
              variants={cardVariants}
              whileHover="hover"
              className="glass-card rounded-3xl premium-shadow gradient-border overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
                transition={{
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="absolute inset-0 glass-card premium-shadow gradient-border"
              >
                <TypeToRender slide={slides[currentSlide]} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex gap-4 justify-center">
            {slides.map((_, idx) => (
              <motion.button
                key={idx}
                variants={dotVariants}
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
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="h-full glass-card rounded-3xl premium-shadow gradient-border shimmer"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <TypeToRender slide={slides[currentSlide]} />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <div className="flex gap-6 justify-center items-center">
            <motion.button
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
              disabled={currentSlide === 0}
              className="p-4 rounded-2xl bg-primary/90 backdrop-blur-xl text-primary-foreground font-semibold disabled:opacity-30 disabled:cursor-not-allowed premium-shadow group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <ChevronLeft className="w-6 h-6 relative z-10" />
            </motion.button>

            <motion.div
              key={currentSlide}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card px-8 py-4 rounded-2xl min-w-[140px] text-center premium-shadow"
            >
              <span className="text-foreground font-bold text-xl font-sora bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {currentSlide + 1}
              </span>
              <span className="text-muted-foreground font-medium text-lg mx-2 font-inter">
                /
              </span>
              <span className="text-muted-foreground font-medium text-lg font-inter">
                {slides.length}
              </span>
            </motion.div>

            <motion.button
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={() => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))}
              disabled={currentSlide === slides.length - 1}
              className="p-4 rounded-2xl bg-primary/90 backdrop-blur-xl text-primary-foreground font-semibold disabled:opacity-30 disabled:cursor-not-allowed premium-shadow group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <ChevronRight className="w-6 h-6 relative z-10" />
            </motion.button>
          </div>
        </div>
      )

    default:
      return null
  }
}
