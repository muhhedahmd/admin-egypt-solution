import React from "react";
import { motion } from "framer-motion";

// ==================== TYPES ====================
// Update these based on your actual schema
type SlideshowType = 
  | "HERO" 
  | "PROJECTS" 
  | "SERVICES" 
  | "CLIENTS" 
  | "TESTIMONIALS" 
  | "TEAM" 
  | "CUSTOM";

type CompositionType = 
  | "SINGLE" 
  | "PARALLAX" 
  | "ZOOM" 
  | "FADE" 
  | "GRID" 
  | "CAROUSEL" 
  | "MARQUEE" 
  | "STACKED" 
  | "AUTO_GRID" 
  | "STORY";

interface SlideHeaderProps {
  title: string;
  description: string;
  slideShowType: SlideshowType;
  compositionType: CompositionType;
}

interface VariantProps {
  title: string;
  description: string;
}

// ==================== COMPOSITION VARIANTS ====================

// HERO Compositions
const HeroSingleComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.header
    className="w-full flex flex-col items-center text-center gap-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight">
      {title}
    </h1>
    <p className="text-xl max-w-3xl text-muted-foreground">{description}</p>
  </motion.header>
);

const HeroParallaxComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.header
    className="w-full flex flex-col items-start gap-4 relative overflow-hidden"
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    <motion.div
      className="absolute -top-4 -left-4 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10"
      animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
      transition={{ duration: 8, repeat: Infinity }}
    />
    <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight">{title}</h1>
    <p className="text-lg max-w-2xl text-muted-foreground">{description}</p>
  </motion.header>
);

const HeroZoomComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.header
    className="w-full flex flex-col items-center gap-5"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
  >
    <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight">{title}</h1>
    <p className="text-lg max-w-2xl text-center text-muted-foreground">{description}</p>
  </motion.header>
);

// PROJECTS Compositions
const ProjectsGridComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.div
    className="w-full grid grid-cols-1 md:grid-cols-2 gap-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex flex-col gap-3">
      <h2 className="text-3xl font-bold">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </motion.div>
);

const ProjectsCarouselComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.div
    className="w-full flex flex-col gap-4"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="flex items-center gap-4 overflow-hidden">
      <motion.h2
        className="text-3xl font-bold whitespace-nowrap"
        animate={{ x: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {title}
      </motion.h2>
      <div className="h-1 flex-1 bg-gradient-to-r from-primary to-transparent rounded-full" />
    </div>
    <p className="text-muted-foreground max-w-3xl">{description}</p>
  </motion.div>
);

const ProjectsMarqueeComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.div className="w-full overflow-hidden">
    <motion.div
      className="flex gap-8 items-center whitespace-nowrap"
      animate={{ x: ["0%", "-50%"] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      <h2 className="text-4xl font-bold">{title}</h2>
      <span className="text-muted-foreground">•</span>
      <p className="text-lg text-muted-foreground">{description}</p>
      <span className="text-muted-foreground">•</span>
      <h2 className="text-4xl font-bold">{title}</h2>
      <span className="text-muted-foreground">•</span>
      <p className="text-lg text-muted-foreground">{description}</p>
    </motion.div>
  </motion.div>
);

// SERVICES Compositions
const ServicesGridComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.div
    className="w-full text-center"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55 }}
  >
    <h3 className="text-3xl font-semibold mb-3">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

const ServicesStackedComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.div
    className="w-full flex flex-col gap-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-3xl font-bold">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

// CLIENTS Compositions
const ClientsAutoGridComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.div
    className="w-full flex flex-col gap-4"
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.45 }}
  >
    <h3 className="text-3xl font-bold">{title}</h3>
    <p className="text-muted-foreground max-w-3xl">{description}</p>
  </motion.div>
);

const ClientsMarqueeComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.div
    className="w-full flex flex-col gap-4 overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <h3 className="text-3xl font-bold">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

// TESTIMONIALS Compositions
const TestimonialsFadeComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.div
    className="w-full flex flex-col gap-5"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.7 }}
  >
    <h3 className="text-3xl font-bold">{title}</h3>
    <p className="text-muted-foreground max-w-3xl">{description}</p>
  </motion.div>
);

const TestimonialsCarouselComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.div
    className="w-full flex flex-col gap-4"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
  >
    <h3 className="text-3xl font-bold">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

// TEAM Compositions
const TeamGridComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.div
    className="w-full flex flex-col gap-5"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-3xl font-bold">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

const TeamStoryComposition: React.FC<VariantProps> = ({ title, description }) => (
  <motion.div
    className="w-full flex flex-col gap-4"
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <h3 className="text-3xl font-bold">{title}</h3>
    <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
  </motion.div>
);

// ==================== COMPOSITION MAP ====================
type CompositionMap = {
  [key in SlideshowType]: {
    [key in CompositionType]?: React.FC<VariantProps>;
  };
};

const compositionMap: CompositionMap = {
  HERO: {
    SINGLE: HeroSingleComposition,
    PARALLAX: HeroParallaxComposition,
    ZOOM: HeroZoomComposition,
    FADE: HeroSingleComposition,
  },
  PROJECTS: {
    GRID: ProjectsGridComposition,
    CAROUSEL: ProjectsCarouselComposition,
    MARQUEE: ProjectsMarqueeComposition,
    SINGLE: ProjectsGridComposition,
  },
  SERVICES: {
    GRID: ServicesGridComposition,
    STACKED: ServicesStackedComposition,
    SINGLE: ServicesGridComposition,
  },
  CLIENTS: {
    AUTO_GRID: ClientsAutoGridComposition,
    MARQUEE: ClientsMarqueeComposition,
    GRID: ClientsAutoGridComposition,
  },
  TESTIMONIALS: {
    FADE: TestimonialsFadeComposition,
    CAROUSEL: TestimonialsCarouselComposition,
    SINGLE: TestimonialsFadeComposition,
  },
  TEAM: {
    GRID: TeamGridComposition,
    STORY: TeamStoryComposition,
    SINGLE: TeamGridComposition,
  },
  CUSTOM: {},
};

// ==================== MAIN COMPONENT ====================
export const SlideHeader: React.FC<SlideHeaderProps> = ({
  slideShowType,
  compositionType,
  title,
  description,
}) => {
  const CompositionComponent =
    compositionMap[slideShowType]?.[compositionType] ||
    compositionMap[slideShowType]?.SINGLE ||
    HeroSingleComposition;

  return (
    <CompositionComponent
      title={title}
      description={description}
    />
  );
};