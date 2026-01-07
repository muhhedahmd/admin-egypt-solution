import { CompositionType, SlideshowType } from "@/types/schema";
import { memo, useMemo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion"
import { SlideShow } from "@/types/slideShows";
import { SlideHeader } from "@/components/admin/utils/slides/CastomHeaderSlideShow";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const RenderSlides = dynamic(() => import("./RenderSlides").then((mod) => mod.RenderSlides), { ssr: false })

interface SlideshowCardProps {
    item: SlideShow;
    index: number;
    bgColor?: string;
    textColor?: string;
    autoPlay: boolean
    interval: number
}

export const SlideshowCard = memo(({ interval, autoPlay, item, index, bgColor, textColor }: SlideshowCardProps) => {
    const compositionType = useMemo(
        () => CompositionType[item.composition as keyof typeof CompositionType],
        [item.composition]
    );

    const cardRef = useRef<HTMLDivElement>(null);
    const [isInViewport, setIsInViewport] = useState(false);

    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;

        // Start when ~40% of card is visible
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries.find(e => e.target === el) ?? entries[0];
                if (!entry) return;

                // Use intersectionRatio instead of just isIntersecting for more stability
                const visible = entry.isIntersecting && entry.intersectionRatio >= 0.4;

                // Avoid rapid toggles by scheduling the state update in next animation frame
                // and only update when value actually changes
                requestAnimationFrame(() => {
                    setIsInViewport((prev) => (prev === visible ? prev : visible));
                });
            },
            {
                threshold: [0, 0.1, 0.25, 0.4, 0.6, 1],
                rootMargin: "0px 0px 200px 0px", // preload when approaching viewport (optional)
            }
        );

        observer.observe(el);

        return () => {
            observer.unobserve(el);
            observer.disconnect();
        };
        // intentionally no dependencies so we only attach once; ref's element read above
    }, []);


    return (
        <motion.div
            ref={cardRef}
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            viewport={{ once: true, margin: "100px" }}
            className={cn("w-full container mx-auto") }

        >
            <div
                style={{
                    backgroundColor: bgColor,
                    color: textColor,
                }}
                className="rounded-lg duration-200 overflow-hidden"
            >
                <SlideHeader
                    compositionType={
                        CompositionType[item.composition as keyof typeof CompositionType]
                    }
                    title={item.title}
                    description={item.description || ""}
                    slideShowType={SlideshowType[item.type as keyof typeof SlideshowType]}
                />
                <div className="mt-5"/>
                        <RenderSlides
                            isInViewport={isInViewport}
                            autoPlay={autoPlay}
                            interval={interval}
                            id={item.id}
                            composition={compositionType}
                        />
                {/* </div> */}
            </div>
        </motion.div>
    );
});

SlideshowCard.displayName = "SlideshowCard";