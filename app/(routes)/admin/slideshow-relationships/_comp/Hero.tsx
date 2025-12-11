"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetActiveHeroesQuery } from "@/lib/store/api/hero-api"
import type { IHero, Image } from "@/types/schema"
import BlurredImage from "@/app/_comp/BlurredHashImage"

interface HeroSectionProps {
    onLoad?: () => void
}

export function HeroSection({ onLoad }: HeroSectionProps) {

    const { data, isLoading, isError } = useGetActiveHeroesQuery()

    useEffect(() => {
        if (!isLoading && data) {
            onLoad?.()
        }
    }, [isLoading, data])

    // Loading state
    if (isLoading) {
        return (
            <section className="relative w-full min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden bg-background">
                <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="space-y-8 text-center">
                        <Skeleton className="h-8 w-64 mx-auto rounded-full" />
                        <Skeleton className="h-20 w-full max-w-4xl mx-auto" />
                        <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
                        <div className="flex justify-center gap-4 pt-4">
                            <Skeleton className="h-12 w-40" />
                            <Skeleton className="h-12 w-40" />
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    // Error state
    if (isError || !data?.data) {
        return (
            <section className="relative w-full min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden bg-background">
                <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <p className="text-muted-foreground">Unable to load hero section</p>
                </div>
            </section>
        )
    }

    const hero = data.data.hero
    const backgroundImage = data.data.backgroundImage

    return <ProductionHero hero={hero} backgroundImage={backgroundImage} />
}

interface ProductionHeroProps {
    hero: IHero
    backgroundImage?: Image
}

function ProductionHero({ hero, backgroundImage }: ProductionHeroProps) {
    // Only render if hero is active
    if (!hero.isActive) return null

    const backgroundImageUrl = backgroundImage?.url || ""


    // Parse style overrides
    const styleOverrides = hero.styleOverrides
        ? typeof hero.styleOverrides === "string"
            ? JSON.parse(hero.styleOverrides)
            : hero.styleOverrides
        : {}

    // Alignment map
    const alignmentMap = {
        LEFT: "flex-start",
        CENTER: "center",
        RIGHT: "flex-end",
    }

    // Title size mapping (converted to Tailwind classes for production)
    const titleSizeMap = {
        "2xl": "text-4xl sm:text-5xl lg:text-6xl",
        "3xl": "text-5xl sm:text-6xl lg:text-7xl",
        "4xl": "text-6xl sm:text-7xl lg:text-8xl",
        "5xl": "text-7xl sm:text-8xl lg:text-9xl",
        "6xl": "text-8xl sm:text-9xl",
        "7xl": "text-9xl",
    }

    // Button variant styles
    const buttonVariantStyles = {
        PRIMARY: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl hover:scale-105",
        SECONDARY: "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg hover:shadow-xl hover:scale-105",
        GHOST: "bg-transparent border-2 border-current text-foreground hover:bg-foreground/10 backdrop-blur-sm",
        OUTLINE: "bg-transparent border-2 border-primary text-foreground hover:bg-primary hover:text-primary-foreground",
        DANGER: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg hover:shadow-xl",
        LINK: "bg-transparent text-primary hover:underline",
    }

    const getButtonClass = (variant?: string | null) => {
        const baseClasses = "inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold transition-all duration-300"
        return `${baseClasses} ${buttonVariantStyles[variant as keyof typeof buttonVariantStyles] || buttonVariantStyles.PRIMARY}`
    }

    // Responsive height calculation
    const getMinHeight = () => {
        if (hero.variant === "FULL_SCREEN") return "min-h-screen"
        if (hero.variant === "MINIMAL") return "min-h-[400px] md:min-h-[500px]"
        if (hero.variant === "SPLIT") return "min-h-screen md:min-h-screen"
        return hero.minHeight ? `min-h-[${hero.minHeight}px]` : "min-h-[calc(100vh-64px)]"
    }

    // Content padding based on variant
    const getContentPadding = () => {
        switch (hero.variant) {
            case "MINIMAL":
                return "px-4 py-8 sm:px-8 sm:py-12"
            case "SPLIT":
                return "px-4 py-8 sm:px-16 sm:py-12"
            default:
                return "px-4 py-12 sm:px-8 sm:py-16"
        }
    }

    // Render content
    const renderContent = () => (
        <>
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className={`${titleSizeMap[hero.titleSize as keyof typeof titleSizeMap] || titleSizeMap["4xl"]} font-bold leading-tight tracking-tight text-balance`}
                style={{ color: hero.titleColor || undefined, marginBottom: "1rem" }}
            >
                {hero.title}
            </motion.h1>

            {hero.subtitle && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.6 }}
                    className="text-xl sm:text-2xl md:text-3xl font-semibold text-balance"
                    style={{ color: hero.subtitleColor || undefined, marginBottom: "1rem" }}
                >
                    {hero.subtitle}
                </motion.p>
            )}

            {hero.description && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed text-balance"
                    style={{ color: hero.descriptionColor || undefined, marginBottom: "2rem" }}
                >
                    {hero.description}
                </motion.p>
            )}

            {(hero.ctaText || hero.secondaryCtaText) && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    style={{
                        display: "flex",
                        gap: "1rem",
                        justifyContent: alignmentMap[hero.alignment as keyof typeof alignmentMap] || "center",
                        width: "100%",
                        flexWrap: "wrap",
                    }}
                >
                    {hero.ctaText && hero.ctaUrl && (
                        <Link href={hero.ctaUrl}>
                            <button className={getButtonClass(hero.ctaVariant)}>
                                {hero.ctaText}
                            </button>
                        </Link>
                    )}
                    {hero.secondaryCtaText && hero.secondaryCtaUrl && (
                        <Link href={hero.secondaryCtaUrl}>
                            <button className={getButtonClass(hero.secondaryCtaVariant)}>
                                {hero.secondaryCtaText}
                            </button>
                        </Link>
                    )}
                </motion.div>
            )}

            {hero.showScrollIndicator && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="mt-12 flex flex-col items-center gap-2 text-foreground/60"
                >
                    <p className="text-sm">Scroll to explore</p>
                    <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                        <ChevronDown size={24} />
                    </motion.div>
                </motion.div>
            )}
        </>
    )

    // Render variants - MATCHING HeroPreview
    const renderVariant = () => {
        switch (hero.variant) {
            case "SPLIT":
                return (
                    <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-stretch">
                        <div className="pl-5 flex-1 flex flex-col justify-center" style={{ padding: getContentPadding() }}>
                            <div
                                style={{
                                    textAlign: hero.alignment === "CENTER" ? "center" : hero.alignment === "RIGHT" ? "right" : "left",
                                }}
                            >
                                {renderContent()}
                            </div>
                        </div>
                        {backgroundImageUrl && (
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="hidden rounded-xl p-5 md:flex flex-1 overflow-hidden pr-5"
                            >
                                <BlurredImage
                                    imageUrl={backgroundImageUrl}
                                    width={backgroundImage?.width || 800}
                                    height={backgroundImage?.height || 600}
                                    className="w-full h-full object-cover rounded-xl"
                                    alt={backgroundImage?.alt || hero.title}
                                    quality={90}
                                    blurhash={backgroundImage?.blurHash}
                                />
                            </motion.div>
                        )}
                    </div>
                )

            case "IMAGE_BACKGROUND":
                return (
                    <div className="relative z-10 w-full max-w-4xl mx-auto" style={{ padding: getContentPadding() }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                            {renderContent()}
                        </div>
                    </div>
                )

            case "MINIMAL":
                return (
                    <div className="relative z-10 w-full max-w-2xl mx-auto" style={{ padding: getContentPadding() }}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
                        >
                            {renderContent()}
                        </motion.div>
                    </div>
                )

            case "VIDEO_BACKGROUND":
                return (
                    <div className="relative z-10 w-full max-w-4xl mx-auto" style={{ padding: getContentPadding() }}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
                        >
                            {renderContent()}
                        </motion.div>
                    </div>
                )

            case "FULL_SCREEN":
                return (
                    <div
                        className="relative z-10 w-full h-full flex flex-col items-center justify-center"
                        style={{ padding: getContentPadding() }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                textAlign: "center",
                                maxWidth: "56rem",
                            }}
                        >
                            {renderContent()}
                        </motion.div>
                    </div>
                )

            default: // CENTERED
                return (
                    <div className="relative z-10 w-full max-w-4xl mx-auto" style={{ padding: getContentPadding() }}>
                        <motion.div
                      
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: alignmentMap[hero.alignment as keyof typeof alignmentMap] || "center",
                                textAlign: hero.alignment === "LEFT" ? "left" : hero.alignment === "RIGHT" ? "right" : "center",
                            }}
                        >
                            {renderContent()}
                        </motion.div>
                    </div>
                )
        }
    }

    return (
        <section
            className={`relative w-full overflow-hidden flex items-center justify-center ${getMinHeight()}`}
            style={{
                backgroundColor: !backgroundImageUrl && !hero.backgroundVideo ? hero.backgroundColor || "transparent" : "transparent",
                backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                ...(styleOverrides as React.CSSProperties),
            }}
            role="banner"
            aria-label={hero.name || "Hero section"}
        >
            <div className="container">

            {/* Background Image with BlurredImage - Not for SPLIT variant */}
            {backgroundImageUrl && hero.variant !== "SPLIT" && (
                <div className="absolute inset-0 w-full h-full -z-20">
                    <BlurredImage
                        imageUrl={backgroundImageUrl}
                        width={backgroundImage?.width || 1920}
                        height={backgroundImage?.height || 1080}
                        className="w-full h-full object-cover"
                        alt={backgroundImage?.alt || "Hero background"}
                        quality={85}
                        blurhash={backgroundImage?.blurHash}
                    />
                </div>
            )}

            {/* Background Video */}
            {hero.backgroundVideo && (
                <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover -z-20">
                    <source src={hero.backgroundVideo} type="video/mp4" />
                </video>
            )}

            {/* Overlay */}
            {(backgroundImageUrl || hero.backgroundVideo) && (
                <div
                    className="absolute inset-0 -z-10"
                    style={{
                        backgroundColor: hero.overlayColor || "#000000",
                        opacity: hero.overlayOpacity ?? 0.5,
                    }}
                    aria-hidden="true"
                />
            )}

            {/* Background Gradient - Only if no image/video */}
            {!backgroundImageUrl && !hero.backgroundVideo && (
                <div className="absolute inset-0 -z-10" aria-hidden="true">
                    <div className="absolute top-20 right-1/4 w-80 h-80 bg-primary/8 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
                </div>
            )}

            {/* Content */}
            <div className="relative w-full">{renderVariant()}</div>

            {/* Custom CSS */}
            {hero.customCSS && <style dangerouslySetInnerHTML={{ __html: hero.customCSS }} />}
            </div>

        </section>
    )
}