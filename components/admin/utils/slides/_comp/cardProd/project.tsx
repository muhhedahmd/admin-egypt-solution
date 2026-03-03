import { ProjectWithRelationsSlide } from "@/types/schema"
import { ExternalLink, Github } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { ProjectCardParallax } from "../expermintal/ExpermintalParallax"
import BlurredImage from "@/app/_comp/BlurredHashImage"
gsap.registerPlugin(ScrollTrigger);


interface ProjectCardProps {
    data: ProjectWithRelationsSlide
    split?: boolean
    index?: number
    imagePosition?: string
    story?: boolean ,
    imaged?: boolean
}


export const ProjectCard = ({
    imaged = false,
    data,
    split,
    index = 0,
    story
}: ProjectCardProps) => {
    if (split) {
        return <ProjectCardParallax data={data} index={index} />
    }
    if (story) {
        return <ProjectCardStory data={data} />
    }
  if (imaged) {
        return (
            <>
                {data.image && (
                    <div className="mb-5 h-full w-full overflow-hidden rounded-xl bg-muted">
                        <BlurredImage
                            imageUrl={data.image.url || ""}
                            height={data.image.height || 400}
                            width={data.image.width || 800}
                            alt={data.image.alt || data.clientName || ""}
                            blurhash={data.image.blurHash || ""}
                            quality={100}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                    </div>
                )}
            </>
        )
    }


    return <ProjectCardDefault data={data} />
}

const ProjectCardDefault = ({ data }: { data: ProjectWithRelationsSlide }) => {
    

    const cardRef = useRef<HTMLDivElement>(null)

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

        const title = card.querySelector(".project-title")
        const client = card.querySelector(".project-client")
        const description = card.querySelector(".project-description")
        const links = card.querySelector(".project-links")

        const elements = [
            { el: title, delay: 0.1, x: -10 },
            { el: client, delay: 0.2, x: -10 },
            { el: description, delay: 0.3, x: 0 },
            { el: links, delay: 0.4, y: 10 }
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
    }, [])

    return (
        <div
            ref={cardRef}
            className="group relative h-full overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
        >
            <div className="relative h-48 overflow-hidden bg-muted">
                {data.image && (
                    <BlurredImage
                        imageUrl={data.image.url || ""}
                        height={data.image.height || 400}
                        width={data.image.width || 800}
                        alt={data.image.alt || data.title}
                        blurhash={data.image.blurHash || ""}
                        quality={100}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                )}
            </div>

            <div className="p-6 space-y-3">
                <h3 className="project-title text-lg font-bold text-foreground font-sora">
                    {data.title}
                </h3>

                {data.clientName && (
                    <div className="project-client flex items-center gap-2 text-sm text-muted-foreground font-inter">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {data.clientName}
                    </div>
                )}

                {data.description && (
                    <p className="project-description text-sm text-muted-foreground leading-relaxed font-inter">
                        {data.description}
                    </p>
                )}

                <div className="project-links flex gap-3 pt-3 border-t border-border">
                    {data.projectUrl && (
                        <Link
                            href={data.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors font-inter"
                        >
                            View Project
                        </Link>
                    )}

                    {data.githubUrl && (
                        <Link
                            href={data.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors font-inter"
                        >
                            GitHub
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}






const ProjectCardStory = ({ data }: { data: ProjectWithRelationsSlide }) => {

    const articleRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const article = articleRef.current
        if (!article) return

        gsap.fromTo(
            article,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                scrollTrigger: {
                    trigger: article,
                    start: "top 85%"
                }
            }
        )

        const elements = article.querySelectorAll(".story-element")
        elements.forEach((el, i) => {
            gsap.fromTo(
                el,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    delay: 0.2 + i * 0.1,
                    scrollTrigger: {
                        trigger: article,
                        start: "top 85%"
                    }
                }
            )
        })
    }, [])

    return (
   <article
    ref={articleRef}
    className="w-full flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8 mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16"
>
    {/* Image Container */}
    <div className="w-full lg:w-1/2 xl:w-[60%] aspect-video lg:aspect-square relative overflow-hidden group rounded-lg">
        {data.image && (
            <div className="h-full w-full overflow-hidden bg-gray-100">
                <BlurredImage
                    imageUrl={data.image.url}
                    height={data.image.height || 400}
                    width={data.image.width || 800}
                    alt={data.image.alt || data.title}
                    blurhash={data.image.blurHash || ""}
                    quality={100}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
            </div>
        )}
    </div>

    {/* Content Container */}
    <div className="w-full lg:w-1/2 xl:w-[40%] space-y-4 md:space-y-6 lg:space-y-8">
        {/* Title */}
        <h1 className="story-element text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight">
            {data.title}
        </h1>

        {/* Client Info */}
        {data.clientName && (
            <div className="story-element flex items-center gap-2 text-sm md:text-base text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                <span className="font-medium">{data.clientName}</span>
                {data.clientCompany && (
                    <>
                        <span className="text-border">•</span>
                        <span className="truncate">{data.clientCompany}</span>
                    </>
                )}
            </div>
        )}

        {/* Description */}
        {data.description && (
            <p className="story-element text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                {data.description}
            </p>
        )}

        {/* Rich Description */}
        {data.richDescription && (
            <div className="story-element prose prose-sm sm:prose-base md:prose-lg text-muted-foreground">
                {data.richDescription.split("\n").map((paragraph, idx) => {
                    return (
                        paragraph.trim() && (
                            <p key={idx} className="mb-3 md:mb-4">
                                {paragraph}
                            </p>
                        )
                    )
                })}
            </div>
        )}

        {/* Action Links */}
        <div className="story-element flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-6 pt-4 md:pt-6 border-t border-border">
            {data.projectUrl && (
                <Link
                    href={data.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-sm md:text-base font-semibold text-foreground hover:text-primary transition-colors"
                >
                    <span>View Project</span>
                    <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
            )}

            {data.githubUrl && (
                <Link
                    href={data.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-sm md:text-base font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Github className="w-4 h-4" />
                    <span>View Source</span>
                </Link>
            )}
        </div>
    </div>
</article>
    )
}