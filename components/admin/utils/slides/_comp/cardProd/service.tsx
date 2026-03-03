"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import Image from "next/image"
import { cn } from "@/lib/utils"
import BlurredImage from "@/app/_comp/BlurredHashImage"

gsap.registerPlugin(ScrollTrigger)


interface ServiceCardProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
    imaged?: boolean
    splitcarousel?: boolean
    story?: boolean,
    lightOpen ?: boolean
}

export const ServiceCard = ({ lightOpen ,data, imaged = false, splitcarousel, story }: ServiceCardProps) => {


    const cardRef = useRef<HTMLElement>(null)
    const DataToRender = data?.name ? data : data.data


    useEffect(() => {
        const card = cardRef.current
        if (!card) return

        gsap.fromTo(
            card,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                scrollTrigger: {
                    trigger: card,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                }
            }
        )

        // Animate children
        const title = card.querySelector(".service-title")
        const description = card.querySelector(".service-description")
        // const price = card.querySelector(".service-price")

        if (title) {
            gsap.fromTo(
                title,
                { opacity: 0, x: -10 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    delay: 0.1,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 90%"
                    }
                }
            )
        }

        if (description) {
            gsap.fromTo(
                description,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 0.5,
                    delay: 0.2,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 90%"
                    }
                }
            )
        }

   
    }, [])

    if (imaged) {
        return (
            <>
                {DataToRender?.image && (
                    <div className="mb-5 h-full w-full overflow-hidden rounded-xl bg-muted">
                        <BlurredImage
                            imageUrl={DataToRender.image.url || ""}
                            height={DataToRender.image.height || 400}
                            width={DataToRender.image.width || 800}
                            alt={DataToRender.image.alt || data.name}
                            blurhash={DataToRender.image.blurHash || ""}
                            quality={100}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                    </div>
                )}
            </>
        )
    }

    if (splitcarousel) {
        return (
            <article
                ref={cardRef}
                className="group relative h-full overflow-hidden rounded-2xl flex flex-col lg:flex-row w-full gap-4 md:gap-6 p-3 sm:p-4 md:p-6 hover:border-primary/50 transition-all duration-300"
            >
                {/* Image Container */}
                {DataToRender?.image && (
                    <div className="w-full lg:w-2/5 xl:w-1/2 h-48 sm:h-64 md:h-80 lg:h-full overflow-hidden rounded-lg bg-muted flex-shrink-0">
                        <BlurredImage
                            imageUrl={DataToRender.image.url || ""}
                            height={DataToRender.image.height || 400}
                            width={DataToRender.image.width || 800}
                            alt={DataToRender.image.alt || data.name}
                            blurhash={DataToRender.image.blurHash || ""}
                            quality={100}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                    </div>
                )}

                {/* Content Container */}
                <div className="flex-1 space-y-3 sm:space-y-4 md:space-y-6 flex flex-col">
                    {/* Title with Icon */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {DataToRender?.icon && DataToRender?.icon?.startsWith("http") ? (
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 p-2 sm:p-2.5 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300 flex-shrink-0">
                                <Image
                                    src={DataToRender?.icon}
                                    width={24}
                                    height={24}
                                    alt={DataToRender?.name + "-icon"}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        ) : (
                            <span className="text-2xl sm:text-3xl md:text-4xl flex-shrink-0">{DataToRender?.icon}</span>
                        )}
                        <h3 className="service-title text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-sora text-foreground">
                            {DataToRender?.name}
                        </h3>
                    </div>

                    {/* Description */}
                    {DataToRender?.description && (
                        <p className="service-description text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed font-inter">
                            {DataToRender?.description}
                        </p>
                    )}

                    {/* Rich Description */}
                    {DataToRender?.richDescription && (
                        <div
                            className="service-description text-sm sm:text-base md:text-md text-muted-foreground leading-relaxed font-inter prose prose-sm sm:prose-base max-w-none"
                            dangerouslySetInnerHTML={{ __html: DataToRender?.richDescription }}
                        />
                    )}

                    {/* Price - Push to bottom */}
                  
                </div>
            </article>
        )
    }

    if(lightOpen){
        return (
    <article
        ref={cardRef}
        className={cn(
            "group relative overflow-hidden bg-background/90 rounded-2xl transition-all duration-300",
            lightOpen 
                ? "h-full w-full flex flex-col" 
                : "h-full p-2 hover:border-primary/50"
        )}
    >
        {/* Image Section */}
        {DataToRender?.image && (
            <div 
                className={cn(
                    "overflow-hidden rounded-md bg-muted",
                    lightOpen 
                        ? "h-64 md:h-96 w-full rounded-t-2xl rounded-b-none" 
                        : "mb-5 h-70"
                )}
            >
                <BlurredImage
                    imageUrl={DataToRender?.image.url || ""}
                    height={DataToRender?.image.height || 400}
                    width={DataToRender?.image.width || 800}
                    alt={DataToRender?.image.alt || data.name}
                    blurhash={DataToRender?.image.blurHash || ""}
                    quality={100}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
            </div>
        )}

        {/* Content Section */}
        <div 
            className={cn(
                "space-y-4",
                lightOpen 
                    ? "p-8 flex-1 overflow-y-auto" 
                    : "p-0"
            )}
        >
            {/* Icon & Title */}
            <div className="flex items-center gap-3">
                {DataToRender?.icon && DataToRender?.icon?.startsWith("http") ? (
                    <div className="w-12 h-12 rounded-xl bg-primary/10 p-2.5 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                        <Image
                            src={DataToRender?.icon}
                            width={24}
                            height={24}
                            alt={DataToRender.name + "-icon"}
                            className="w-full h-full object-contain"
                        />
                    </div>
                ) : (
                    <span className="text-2xl">{DataToRender?.icon}</span>
                )}
                <h3 
                    className={cn(
                        "service-title font-bold font-sora text-foreground",
                        lightOpen ? "text-2xl" : "text-xl"
                    )}
                >
                    {DataToRender?.name}
                </h3>
            </div>

            {/* Description */}
            {DataToRender?.description && (
                <p 
                    className={cn(
                        "service-description text-muted-foreground leading-relaxed font-inter",
                        lightOpen ? "text-base" : "text-sm"
                    )}
                >
                    {DataToRender?.description}
                </p>
            )}

            {/* Rich Description */}
            {DataToRender.richDescription && (
                <div
                    className={cn(
                        "service-description text-muted-foreground leading-relaxed font-inter prose prose-sm dark:prose-invert",
                        lightOpen 
                            ? "text-base line-clamp-none prose-base" 
                            : "text-sm line-clamp-4"
                    )}
                    dangerouslySetInnerHTML={{ __html: DataToRender?.richDescription }}
                />
            )}
        </div>
    </article>
);

    }

    return (
        <article
            ref={cardRef}
            className="group relative h-full overflow-hidden bg-background/90 rounded-2xl p-2 hover:border-primary/50 transition-all duration-300"
        >
            {DataToRender.image && (
                <div className="mb-5 h-70 overflow-hidden rounded-md bg-muted">
                    <BlurredImage
                        imageUrl={DataToRender.image.url || ""}
                        height={DataToRender.image.height || 400}
                        width={DataToRender.image.width || 800}
                        alt={DataToRender.image.alt || data.name}
                        blurhash={DataToRender.image.blurHash || ""}
                        quality={100}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                </div>
            )}

            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    {DataToRender.icon && DataToRender?.icon?.startsWith("http") ? (
                        <div className="w-12 h-12 rounded-xl bg-primary/10 p-2.5 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                            <Image
                                src={DataToRender.icon}
                                width={24}
                                height={24}
                                alt={DataToRender.name + "-icon"}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    ) : (
                        <span>{DataToRender.icon}</span>
                    )}
                    <h3 className="service-title text-xl font-bold font-sora text-foreground">
                        {DataToRender.name}
                    </h3>
                </div>

                {DataToRender.description && (
                    <p className="service-description text-sm text-muted-foreground leading-relaxed font-inter">
                        {DataToRender.description}
                    </p>
                )}

                {DataToRender.richDescription && (
                    <div
                        className="service-description text-sm text-muted-foreground leading-relaxed font-inter"
                        dangerouslySetInnerHTML={{ __html: DataToRender.richDescription }}
                    />
                )}


            </div>
        </article>
    )
}

// ============================================================================
// CLIENT CARD
// ============================================================================

// ============================================================================
// TESTIMONIAL CARD
// ============================================================================

// ============================================================================
// TEAM MEMBER CARD
// ============================================================================
