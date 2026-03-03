import { TestimonialWithImage } from "@/types/schema"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import BlurredImage from "@/app/_comp/BlurredHashImage"
interface TestimonialCardProps {
    data: TestimonialWithImage
    minmal?: boolean,
    light?: boolean
}
export const TestimonialCard = ({ data, minmal, light }: TestimonialCardProps) => {

    const cardRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const card = cardRef.current
        if (!card) return
        if (minmal) {
            gsap.fromTo(
                card,
                { opacity: 0, scale: 0.95 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 90%"
                    }
                }
            )
            return
        }

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

        const content = card.querySelector(".testimonial-content")
        const rating = card.querySelector(".testimonial-rating")
        const author = card.querySelector(".testimonial-author")

        const elements = [
            { el: content, delay: 0.1 },
            { el: rating, delay: 0.2, x: -10 },
            { el: author, delay: 0.3, y: 10 }
        ]

        elements.forEach(({ el, delay, x = 0, y = 0 }) => {
            if (el) {
                gsap.fromTo(
                    el,
                    { opacity: 0, x, y },
                    {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        duration: 0.5,
                        delay,
                        scrollTrigger: {
                            trigger: card,
                            start: "top 90%"
                        }
                    }
                )
            }
        })
    }, [minmal])
    if (minmal) {

        return (
            <div ref={cardRef} className="h-full w-full flex gap-4 items-center justify-center">
                <div>
                    {data.avatar && (
                        <BlurredImage
                            imageUrl={data.avatar.url || ""}
                            height={data.avatar.height || 400}
                            width={data.avatar.width || 800}
                            alt={data.avatar.alt || data.clientName}
                            blurhash={data.avatar.blurHash || ""}
                            quality={100}
                            className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                        />
                    )}
                </div>
                <div>
                    <div className="flex gap-1">
                        {[...Array(data.rating)].map((_, i) => (
                            <span key={i} className="text-yellow-500 text-lg">
                                ★
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-col">
                        <div className="font-semibold text-foreground text-sm font-sora">
                            {data.clientPosition && (
                                <p className="text-xs text-muted-foreground font-inter max-w-40 text-wrap wrap-anywhere line-clamp-1">
                                    {data.clientPosition}
                                </p>
                            )}
                            <strong>{data.clientName}</strong>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
if (light) {
           return (
            <div ref={cardRef} className="h-full w-full flex gap-4 border border-border p-2 rounded-xl shadow-lg items-center justify-start w-full">
                <div>
                    {data.avatar && (
                        <BlurredImage
                            imageUrl={data.avatar.url || ""}
                            height={data.avatar.height || 400}
                            width={data.avatar.width || 800}
                            alt={data.avatar.alt || data.clientName}
                            blurhash={data.avatar.blurHash || ""}
                            quality={100}
                            className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                        />
                    )}
                </div>
                <div>
                    <div className="flex gap-1">
                        {[...Array(data.rating)].map((_, i) => (
                            <span key={i} className="text-yellow-500 text-lg">
                                ★
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-col">
                        <div className="font-semibold text-foreground text-sm font-sora">
                            {data.clientPosition && (
                                <p className="text-xs text-muted-foreground font-inter max-w-40 text-wrap wrap-anywhere line-clamp-1">
                                    {data.clientPosition}
                                </p>
                            )}
                            <strong>{data.clientName}</strong>
                        </div>
                    </div>
                </div>
            </div>
        )
}
    else return (
        <div
            ref={cardRef}
            className="group relative h-full rounded-2xl overflow-hidden bg-card border border-border p-6 hover:border-primary/50 transition-all duration-300"
        >
            <div className="absolute top-4 right-4 text-5xl text-primary/10 font-serif select-none">
                "
            </div>
            <div className="relative space-y-5 h-full flex flex-col justify-between">
                <p className="testimonial-content text-foreground text-sm leading-relaxed italic font-inter pr-8">
                    {data.content}
                </p>

                <div className="space-y-3">
                    <div className="testimonial-rating flex gap-1">
                        {[...Array(data.rating)].map((_, i) => (
                            <span key={i} className="text-primary text-lg">
                                ★
                            </span>
                        ))}
                    </div>

                    <div className="testimonial-author flex items-center gap-3 pt-3 border-t border-border">
                        {data.avatar && (
                            <BlurredImage
                                imageUrl={data.avatar.url || ""}
                                height={data.avatar.height || 400}
                                width={data.avatar.width || 800}
                                alt={data.avatar.alt || data.clientName}
                                blurhash={data.avatar.blurHash || ""}
                                quality={100}
                                className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                            />
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground text-sm font-sora">
                                {data.clientName}
                            </p>
                            {data.clientPosition && (
                                <p className="text-xs text-muted-foreground font-inter">
                                    {data.clientPosition}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}