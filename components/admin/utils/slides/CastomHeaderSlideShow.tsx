"use client"

import type React from "react"
import { motion } from "framer-motion"
import type { CompositionType } from "@/types/schema"

// ==================== TYPES ====================
type SlideshowType = "HERO" | "PROJECTS" | "SERVICES" | "CLIENTS" | "TESTIMONIALS" | "TEAM" | "CUSTOM"

interface SlideHeaderProps {
  title: string
  description: string
  slideShowType: SlideshowType
  compositionType: CompositionType
}

interface VariantProps {
  title: string
  description: string
}

// ==================== COMPOSITION VARIANTS ====================

// HERO Compositions
const HeroSingleComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.header
    className="w-full flex flex-col items-center text-center gap-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <h1 className="text-6xl lg:text-8xl font-extrabold leading-tight">{title}</h1>
    <p className="text-2xl lg:text-3xl max-w-4xl text-muted-foreground leading-relaxed">{description}</p>
  </motion.header>
)

const HeroParallaxComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.header
    className="w-full flex flex-col items-start gap-6 relative overflow-hidden"
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    <motion.div
      className="absolute -top-4 -left-4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"
      animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
      transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
    />
    <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight">{title}</h1>
    <p className="text-xl lg:text-2xl max-w-3xl text-muted-foreground leading-relaxed">{description}</p>
  </motion.header>
)

const HeroZoomComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.header
    className="w-full flex flex-col items-center gap-8"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
  >
    <h1 className="text-6xl lg:text-8xl font-extrabold leading-tight">{title}</h1>
    <p className="text-2xl lg:text-3xl max-w-3xl text-center text-muted-foreground leading-relaxed">{description}</p>
  </motion.header>
)

const HeroFadeComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.header
    className="w-full flex flex-col items-center text-center gap-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    <h1 className="text-6xl lg:text-8xl font-extrabold leading-tight">{title}</h1>
    <p className="text-2xl lg:text-3xl max-w-4xl text-muted-foreground leading-relaxed">{description}</p>
  </motion.header>
)

// PROJECTS Compositions
const ProjectsGridComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.div
    className="w-full flex flex-col gap-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex flex-col gap-4">
      <h2 className="text-5xl lg:text-6xl font-bold">{title}</h2>
      <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-3xl">{description}</p>
    </div>
  </motion.div>
)

const ProjectsCarouselComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.div
    className="w-full flex flex-col gap-6"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="flex items-center gap-6 overflow-hidden">
      <motion.h2
        className="text-5xl lg:text-6xl font-bold whitespace-nowrap"
        animate={{ x: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
      >
        {title}
      </motion.h2>
      <div className="h-2 flex-1 bg-gradient-to-r from-primary to-transparent rounded-full" />
    </div>
    <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl leading-relaxed">{description}</p>
  </motion.div>
)

const ProjectsMarqueeComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.div className="w-full overflow-hidden">
    <motion.div
      className="flex gap-12 items-center whitespace-nowrap"
      animate={{ x: ["0%", "-50%"] }}
      transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
    >
      <h2 className="text-5xl lg:text-6xl font-bold">{title}</h2>
      <span className="text-3xl text-muted-foreground">•</span>
      <p className="text-2xl lg:text-3xl text-muted-foreground">{description}</p>
      <span className="text-3xl text-muted-foreground">•</span>
      <h2 className="text-5xl lg:text-6xl font-bold">{title}</h2>
      <span className="text-3xl text-muted-foreground">•</span>
      <p className="text-2xl lg:text-3xl text-muted-foreground">{description}</p>
    </motion.div>
  </motion.div>
)

const ProjectsFeaturedComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.div
    className="w-full flex flex-col gap-6 p-8 lg:p-12 bg-muted/30 rounded-lg border border-border/50"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <h2 className="text-4xl lg:text-5xl font-bold">{title}</h2>
    <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">{description}</p>
  </motion.div>
)

// SERVICES Compositions
const ServicesGridComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.div
    className="w-full text-center flex flex-col gap-6"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55 }}
  >
    <h3 className="text-4xl lg:text-5xl font-bold">{title}</h3>
    <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">{description}</p>
  </motion.div>
)

const ServicesStackedComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.div
    className="w-full flex flex-col gap-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-4xl lg:text-5xl font-bold">{title}</h3>
    <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">{description}</p>
  </motion.div>
)

const ServicesHighlightComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.div
    className="w-full flex flex-col gap-6 p-6 lg:p-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
  >
    <h3 className="text-3xl lg:text-4xl font-bold text-primary">{title}</h3>
    <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">{description}</p>
  </motion.div>
)

// CLIENTS Compositions
const ClientsAutoGridComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.div
    className="w-full flex flex-col gap-6"
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.45 }}
  >
    <h3 className="text-4xl lg:text-5xl font-bold">{title}</h3>
    <p className="text-lg lg:text-xl text-muted-foreground max-w-4xl leading-relaxed">{description}</p>
  </motion.div>
)

const ClientsMarqueeComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.div className="w-full flex flex-col gap-6 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <h3 className="text-4xl lg:text-5xl font-bold">{title}</h3>
    <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">{description}</p>
  </motion.div>
)

const ClientsShowcaseComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.div
    className="w-full flex flex-col gap-6 text-center"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <h3 className="text-4xl lg:text-5xl font-bold">{title}</h3>
    <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">{description}</p>
  </motion.div>
)

// TESTIMONIALS Compositions
const TestimonialsFadeComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.div
    className="w-full flex flex-col gap-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.7 }}
  >
    <h3 className="text-4xl lg:text-5xl font-bold">{title}</h3>
    <p className="text-lg lg:text-xl text-muted-foreground max-w-4xl leading-relaxed">{description}</p>
  </motion.div>
)

const TestimonialsCarouselComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.div
    className="w-full flex flex-col gap-6"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
  >
    <h3 className="text-4xl lg:text-5xl font-bold">{title}</h3>
    <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">{description}</p>
  </motion.div>
)

const TestimonialsQuoteComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.div
    className="w-full flex flex-col gap-6 p-8 lg:p-12 border-l-4 border-primary bg-muted/20 rounded"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
  >
    <p className="text-2xl lg:text-3xl font-semibold leading-relaxed">"{title}"</p>
    <p className="text-lg text-muted-foreground">{description}</p>
  </motion.div>
)

// TEAM Compositions
const TeamGridComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.div
    className="w-full flex flex-col gap-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-4xl lg:text-5xl font-bold">{title}</h3>
    <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">{description}</p>
  </motion.div>
)

const TeamStoryComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.div
    className="w-full flex flex-col gap-6"
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <h3 className="text-4xl lg:text-5xl font-bold">{title}</h3>
    <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">{description}</p>
  </motion.div>
)

const TeamIntroComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.div
    className="w-full flex flex-col gap-6 max-w-3xl"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <h3 className="text-3xl lg:text-4xl font-bold">{title}</h3>
    <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">{description}</p>
  </motion.div>
)

// ==================== COMPOSITION MAP ====================
type CompositionMap = {
  [key in SlideshowType]: {
    [key in CompositionType]?: React.FC<VariantProps>
  }
}

const compositionMap: CompositionMap = {
  HERO: {
    SINGLE: HeroSingleComposition,
    PARALLAX: HeroParallaxComposition,
    ZOOM: HeroZoomComposition,
    FADE: HeroFadeComposition,
  },
  PROJECTS: {
    GRID: ProjectsGridComposition,
    CAROUSEL: ProjectsCarouselComposition,
    MARQUEE: ProjectsMarqueeComposition,
    SINGLE: ProjectsGridComposition,
    // FEATURED: ProjectsFeaturedComposition,
  },
  SERVICES: {
    GRID: ServicesGridComposition,
    STACKED: ServicesStackedComposition,
    SINGLE: ServicesGridComposition,
    CAROUSEL: ServicesGridComposition,
    // HIGHLIGHT: ServicesHighlightComposition,
  },
  CLIENTS: {
    AUTO_GRID: ClientsAutoGridComposition,
    MARQUEE: ClientsMarqueeComposition,
    GRID: ClientsAutoGridComposition,
    // SHOWCASE: ClientsShowcaseComposition,
  },
  TESTIMONIALS: {
    FADE: TestimonialsFadeComposition,
    CAROUSEL: TestimonialsCarouselComposition,
    SINGLE: TestimonialsFadeComposition,
    // QUOTE: TestimonialsQuoteComposition,
  },
  TEAM: {
    GRID: TeamGridComposition,
    STORY: TeamStoryComposition,
    SINGLE: TeamGridComposition,
    // INTRO: TeamIntroComposition,
  },
  CUSTOM: {},
}

// ==================== MAIN COMPONENT ====================
export const SlideHeader: React.FC<SlideHeaderProps> = ({ slideShowType, compositionType, title, description }) => {
  const CompositionComponent =
    compositionMap[slideShowType]?.[compositionType] || compositionMap[slideShowType]?.SINGLE || HeroSingleComposition

  return <CompositionComponent title={title} description={description} />
}
