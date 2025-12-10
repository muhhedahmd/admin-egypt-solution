"use client"

import type { CSSProperties } from "react"
import { memo } from "react"
import { ChevronDown } from "lucide-react"
import { IHero, Image } from "@/types/schema"

export const HeroPreview = memo(({ heroData  , bgImage} : {
  heroData: IHero & { backgroundImageUrl?: string } ,
  bgImage?: Image 
}) => {

  const backgroundImageUrl = heroData.backgroundImageUrl || bgImage?.url || ""
  const titleSizeMap = {
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
    "7xl": "4.5rem",
  }

  const alignmentMap = {
    LEFT: "flex-start",
    CENTER: "center",
    RIGHT: "flex-end",
  }

  const buttonVariantStyles = {
    PRIMARY: "bg-primary text-primary-foreground hover:bg-primary/90 transition-all",
    SECONDARY: "bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-all",
    GHOST: "bg-transparent border-2 border-current text-foreground hover:bg-foreground/10 transition-all",
    OUTLINE:
      "bg-transparent border-2 border-primary text-foreground hover:bg-primary hover:text-primary-foreground transition-all",
    LINK: "bg-transparent text-primary hover:underline transition-all",
  }

  const getResponsiveHeight = () => {
    if (typeof window === "undefined") return heroData.minHeight
    const vh = window.innerHeight
    if (heroData.variant === "FULL_SCREEN") return vh
    if (heroData.variant === "MINIMAL") return Math.max(400, (heroData.minHeight || 1) * 0.7)
    return Math.max(600, heroData.minHeight || 0 ) 
  }

  const previewStyle: CSSProperties = {
    minHeight: `${getResponsiveHeight()}px`,
    backgroundColor: heroData.backgroundColor || "",
    backgroundImage: heroData.backgroundImageUrl || heroData.backgroundVideo ? `url(${heroData.backgroundImageUrl})` : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }

  const getContentPadding = () => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768
    switch (heroData.variant) {
      case "MINIMAL":
        return isMobile ? "px-4 py-8" : "px-8 py-12"
      case "SPLIT":
        return isMobile ? "px-4 py-8" : "px-16 py-12"
      default:
        return isMobile ? "px-4 py-12" : "px-8 py-16"
    }
  }

  const renderVariant = () => {
    switch (heroData.variant) {
      case "SPLIT":
        return renderSplitVariant()
      case "IMAGE_BACKGROUND":
        return renderImageBackgroundVariant()
      case "MINIMAL":
        return renderMinimalVariant()
      case "VIDEO_BACKGROUND":
        return renderVideoBackgroundVariant()
      case "FULL_SCREEN":
        return renderFullScreenVariant()
      default:
        return renderCenteredVariant()
    }
  }

  const renderCenteredVariant = () => (
    <div className="relative z-10 w-full max-w-4xl mx-auto" style={{ padding: getContentPadding() }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: alignmentMap[heroData.alignment || "CENTER"] || "center",
          textAlign: heroData.alignment === "LEFT" ? "left" : heroData.alignment === "RIGHT" ? "right" : "center",
        }}
      >
        {renderContent()}
      </div>
    </div>
  )

  const renderSplitVariant = () => (
    <div className="relative z-10 w-full h-full flex items-stretch">
      <div className="pl-5 flex-1 flex flex-col justify-center" style={{ padding: getContentPadding() }}>

        <div style={{ textAlign: "left" }}>{renderContent()}</div>
      </div>
      {heroData.backgroundImageUrl && (
        <div className="hidden md:flex flex-1 overflow-hidden pr-5">
          <img
            src={heroData.backgroundImageUrl || "/placeholder.svg"}
            alt="split"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      )}
    </div>
  )

  const renderImageBackgroundVariant = () => (
    <div className="relative z-10 w-full max-w-4xl mx-auto" style={{ padding: getContentPadding() }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        {renderContent()}
      </div>
    </div>
  )

  const renderMinimalVariant = () => (
    <div className="relative z-10 w-full max-w-2xl mx-auto" style={{ padding: getContentPadding() }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <h1
          style={{
            color: heroData.titleColor || "",
            fontSize: titleSizeMap[heroData.titleSize as keyof typeof titleSizeMap] || "2.25rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
          className="text-balance"
        >
          {heroData.title}
        </h1>
        {heroData.description && (
          <p style={{ color: heroData.descriptionColor||"", fontSize: "1rem", marginBottom: "1.5rem", maxWidth: "28rem" }}>
            {heroData.description}
          </p>
        )}
        {renderButtons()}
      </div>
    </div>
  )

  const renderVideoBackgroundVariant = () => (
    <>
      {heroData.backgroundVideo && (
        <video autoPlay muted loop className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: 0 }}>
          <source src={heroData.backgroundVideo} type="video/mp4" />
        </video>
      )}
      <div className="relative z-10 w-full max-w-4xl mx-auto" style={{ padding: getContentPadding() }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          {renderContent()}
        </div>
      </div>
    </>
  )

  const renderFullScreenVariant = () => (
    <div
      className="relative z-10 w-full h-full flex flex-col items-center justify-center"
      style={{ padding: getContentPadding() }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: "56rem",
        }}
      >
        {renderContent()}
      </div>
    </div>
  )

  const renderContent = () => (

    <>
      <h1
        style={{
          color: heroData.titleColor || "",
          fontSize: titleSizeMap[heroData.titleSize  || "2xl"] || "2.25rem",
          fontWeight: "bold",
          marginBottom: "1rem",
        }}
        className="text-balance leading-tight"
      >
        {heroData.title}
      </h1>
      {heroData.subtitle && (
        <p
          style={{ color: heroData.subtitleColor || "", fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}
          className="text-balance"
        >
          {heroData.subtitle}
        </p>
      )}
      {heroData.description && (
        <p
          style={{ color: heroData.descriptionColor || "", fontSize: "1.125rem", marginBottom: "2rem", maxWidth: "32rem" }}
          className="text-balance leading-relaxed"
        >
          {heroData.description}
        </p>
      )}
      {renderButtons()}
      {heroData.showScrollIndicator && renderScrollIndicator()}
    </>
  )

  const renderButtons = () => (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        justifyContent: alignmentMap[heroData.alignment] || "center",
        width: "100%",
        flexWrap: "wrap",
      }}
    >
      {heroData.ctaText && (
        <a
          href={heroData.ctaUrl || ""}
          className={`px-8 py-3 rounded-lg font-semibold transition-all ${buttonVariantStyles[heroData.ctaVariant] || buttonVariantStyles.PRIMARY}`}
        >
          {heroData.ctaText}
        </a>
      )}
      {heroData.secondaryCtaText && (
        <a
          href={heroData.secondaryCtaUrl || ""}
          className={`px-8 py-3 rounded-lg font-semibold transition-all ${buttonVariantStyles[heroData.secondaryCtaVariant] || buttonVariantStyles.GHOST}`}
        >
          {heroData.secondaryCtaText}
        </a>
      )}
    </div>
  )

  const renderScrollIndicator = () => (
    <div className="mt-12 flex flex-col items-center gap-2 text-foreground/60 animate-pulse">
      <p className="text-sm">Scroll to explore</p>
      <ChevronDown size={24} className="animate-bounce" />
    </div>
  )

  return (
    <div style={previewStyle} className=" flex items-center justify-between w-full rounded-lg shadow-2xl overflow-hidden relative">

      {/* Overlay */}
      {(heroData.backgroundImageUrl || heroData.backgroundVideo) && (
        <div
        className="flex justify-center items-center"
          style={{
            backgroundColor: heroData.overlayColor || "",
            opacity: heroData.overlayOpacity || "",
            position: "absolute",
            inset: 0,
            zIndex: 1,
          }}
        />
      )}

      {/* Content */}
      {renderVariant()}
    </div>
  )
})

HeroPreview.displayName = "HeroPreview"
