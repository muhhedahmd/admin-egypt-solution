"use client";
import React, { memo, useMemo, useRef } from "react";
import gsap from "gsap";
// import BlurredImage from "@/composnents/Reusabale/ClientImageWithBlurHash";
import { useGSAP } from "@gsap/react";
import { TypeToRenderProd } from "../TypToRenderProd";
// import Marquee from "../CardProd/generic/Marquee";
// import { TypeToRenderProd } from "../TypToRenderProd";

interface MarqueeCompositionProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    slides: any[];
    isInViewport: boolean;
}

const Perforation = ({ className }: { className?: string }) => (
    <div className={`film-perforation ${className || ""}`} />
);

const MarqueeComposition = memo(({ slides, isInViewport }: MarqueeCompositionProps) => {

    const currentRTL = slides?.[0]?.lang === "AR" ? "RTL" : "LTR"
    const isRTL = currentRTL === "RTL"


    const stripRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const perfsTopRef = useRef<HTMLDivElement>(null);
    const perfsBottomRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);



    // Duplicate frames for seamless loop
    const duplicatedFrames = useMemo(() => {
        const filmFrames = slides.map((slide, idx) => ({
            id: idx,
            image: slide?.image?.url || slide?.avatar?.url || slide?.logo?.url || slide?.image || slide?.avatar || slide?.logo,
            title: slide?.name || slide?.title || slide?.clientName || slide?.customTitle || `Scene ${String(idx + 1).padStart(2, '0')}`,
            alt: slide?.image?.alt || slide?.avatar?.alt || slide?.logo?.alt || `Scene ${idx + 1}`
        }));
        return [...filmFrames, ...filmFrames]
    }, [slides])
    useGSAP(() => {

        if (!stripRef.current || !containerRef.current || !isInViewport) return;

        const strip = stripRef.current;
        const perfsTop = perfsTopRef.current;
        const perfsBottom = perfsBottomRef.current;
        const totalWidth = strip.scrollWidth / 2;

        gsap.set([strip, perfsTop, perfsBottom], { x: 0 });

        const tl = gsap.timeline({ repeat: -1 });
        timelineRef.current = tl;

        tl.to([strip, perfsTop, perfsBottom], {
            x: isRTL ? totalWidth : -totalWidth,
            duration: 40,
            ease: "none",
        });

        const handleMouseEnter = () => {
            gsap.to(tl, { timeScale: 0.2, duration: 0.8, ease: "power2.out" });
        };

        const handleMouseLeave = () => {
            gsap.to(tl, { timeScale: 1, duration: 0.8, ease: "power2.out" });
        };

        const container = containerRef.current;
        container.addEventListener("mouseenter", handleMouseEnter);
        container.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            tl.kill();
            container?.removeEventListener("mouseenter", handleMouseEnter);
            container?.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, {
        dependencies: [isInViewport]
    });

    useGSAP(() => {
        if (timelineRef.current) {
            if (isInViewport) {
                timelineRef.current.play();
            } else {
                timelineRef.current.pause();
            }
        }
    }, [isInViewport]);

    return (
        <div
            ref={containerRef}
            className="relative overflow-hidden py-8 cinema-glow cursor-pointer"
        >
            {/* marquee container */}
            <div className="bg-linear-to-r from-primary/10 via-accent/10 to-primary/10    rounded-xl relative">
                {/* Top perforations row */}
                <div className="absolute top-3 left-0 overflow-hidden w-full">
                    <div ref={perfsTopRef} className="flex">
                        {duplicatedFrames.map((_, index) => (
                            <div key={`top-perf-${index}`} className="shrink-0 w-80 flex justify-around">
                  
                            </div>
                        ))}
                    </div>
                </div>

                {/* Frames */}
                <div className="overflow-hidden">
                    <div ref={stripRef} className="flex gap-6 px-4 py-2">
                        {slides.map((slide, idx) => (
                            <div
                                key={`original-${idx}`}
                                className="min-w-fit h-full aspect-video rounded-2xl shrink-0"
                            >
                                <TypeToRenderProd play={isInViewport} slide={slide} imaged={true} minmal={true} />
                            </div>
                        ))}

                        {slides.map((slide, idx) => (
                            <div
                                key={`clone-${idx}`}
                                className="min-w-fit h-full aspect-video rounded-2xl shrink-0"
                            >
                                <TypeToRenderProd play={isInViewport} slide={slide} imaged={true} minmal={true} />
                            </div>
                        ))}

                    </div>
                </div>


            </div>


        </div>
    );
})

MarqueeComposition.displayName = "MarqueeComposition";
export default MarqueeComposition;