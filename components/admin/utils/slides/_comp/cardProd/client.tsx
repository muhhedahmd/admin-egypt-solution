import { ClientWithRelationsSlide } from "@/types/schema"
import Link from "next/link"
interface ClientCardProps {
    data: ClientWithRelationsSlide
    cube?: boolean,
    single?: boolean,
    idx?: number
    light?: boolean,
    lightOpen?: boolean , 
    story?: boolean,
    imaged ?: boolean
}
import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"
import { ExternalLink } from "lucide-react"
import gsap from "gsap"
import BlurredImage from "@/app/_comp/BlurredHashImage"

export const ClientCard = ({ story  ,  imaged,   lightOpen, light, data, single, idx }: ClientCardProps) => {

    if (light) {
        return <div className="h-full  w-full  ">



            {data.image && (


                <div className="relative h-full  bg-muted/50 border-b border-border ">
                    <BlurredImage
                        imageUrl={data.image.url}
                        height={data.image.height || 400}
                        width={data.image.width || 400}
                        alt={data.image.alt || data.name}
                        blurhash={data.image.blurHash || ""}
                        quality={100}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                </div>
            )}
        </div>

    }
    if (lightOpen) {
        return (
            <div
                className={cn(
                    "group relative flex rounded-2xl border border-primary bg-card transition-all duration-300 overflow-hidden",
                    lightOpen
                        ? "flex-col w-full h-full"
                        : "h-full w-full lg:flex-row flex-col hover:border-primary/50 gap-4"
                )}
            >
                {/* Image Section */}
                <div
                    className={cn(
                        lightOpen
                            ? "w-full h-64 md:h-96"
                            : "lg:h-full h-1/2 lg:w-1/2 w-full"
                    )}
                >
                    {data.image && (
                        <div className="relative h-full bg-muted/50 border-b border-border">
                            <BlurredImage
                                imageUrl={data.image.url}
                                height={data.image.height || 400}
                                width={data.image.width || 400}
                                alt={data.image.alt || data.name}
                                blurhash={data.image.blurHash || ""}
                                quality={100}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div
                    className={cn(
                        "border-border bg-card",
                        lightOpen
                            ? "w-full flex-1 overflow-y-auto"
                            : "lg:h-full h-1/2 lg:w-1/2 w-full"
                    )}
                >
                    {/* Logo Header */}
                    {data.logo && (
                        <div className="bg-muted/30 flex items-center justify-start gap-4 p-4 border-b border-border">
                            <BlurredImage
                                imageUrl={data.logo.url}
                                height={data.logo.height || 100}
                                width={data.logo.width || 100}
                                alt={data.logo.alt || `${data.name} logo`}
                                blurhash={data.logo.blurHash || ""}
                                quality={100}
                                className="max-w-5 max-h-5 w-5 h-5 object-contain rounded-xl"
                            />
                            <h3 className="text-lg font-bold text-foreground font-sora">
                                {data.name}
                            </h3>
                        </div>
                    )}

                    {/* Content Area */}
                    <div className={cn("p-6 space-y-3", lightOpen && "p-8")}>
                        {data.industry && (
                            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full font-inter">
                                {data.industry}
                            </span>
                        )}

                        {data.description && (
                            <p className={cn(
                                "font-semibold text-muted-foreground leading-relaxed font-inter",
                                lightOpen ? "text-base" : "lg:text-md text-sm"
                            )}>
                                {data.description}
                            </p>
                        )}

                        {data.richDescription && data.richDescription !== data.description && (
                            <div
                                className={cn(
                                    "text-sm font-bold text-muted-foreground leading-relaxed font-inter prose prose-sm dark:prose-invert",
                                    lightOpen ? "line-clamp-none" : "md:line-clamp-none line-clamp-3"
                                )}
                                dangerouslySetInnerHTML={{ __html: data.richDescription }}
                            />
                        )}

                        {data.website && (
                            <Link
                                href={data.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors font-inter group/link"
                            >
                                Visit Website
                                <span className="group-hover/link:translate-x-1 transition-transform duration-200">
                                    →
                                </span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        );
    }
    if(story) return <ClientCardStory data={data} />
    if (imaged) {
        return (
            <>
                {data.image && (
                    <div className="mb-5 h-full w-full overflow-hidden rounded-xl bg-muted">
                        <BlurredImage
                            imageUrl={data.image.url || ""}
                            height={data.image.height || 400}
                            width={data.image.width || 800}
                            alt={data.image.alt || data.name}
                            blurhash={data.image.blurHash || ""}
                            quality={100}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                    </div>
                )}
            </>
        )
    }
    if (single) return <ClientCardsingle data={data} idx={idx} />
    else
        return (
    

            <div
                className="group relative h-full w-full  flex lg:flex-row flex-col   rounded-2xl  border-primary bg-card  border-1  hover:border-primary/50 transition-all duration-300 overflow-hidden gap-4"
            >
                <div className={cn("lg:h-full h-1/2 lg:w-1/2 w-full  ", lightOpen && "")}>


                    {data.image && (



                        <div className="relative h-full  bg-muted/50 border-b border-border ">
                            <BlurredImage
                                imageUrl={data.image.url}
                                height={data.image.height || 400}
                                width={data.image.width || 400}
                                alt={data.image.alt || data.name}
                                blurhash={data.image.blurHash || ""}
                                quality={100}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                        </div>
                    )}
                </div>

                {/* Logo Section */}
                <div className="lg:h-full h-1/2 lg:w-1/2 w-full border-border bg-card">


                    {data.logo && (
                        <div className=" bg-muted/30 flex  items-center justify-start gap-4 p-4 border-b border-border">
                            <BlurredImage
                                imageUrl={data.logo.url}
                                height={data.logo.height || 100}
                                width={data.logo.width || 100}
                                alt={data.logo.alt || `${data.name} logo`}
                                blurhash={data.logo.blurHash || ""}
                                quality={100}
                                className="max-w-5 max-h-5 w-5 h-5 object-contain rounded-xl"
                            />
                            <h3
                                className="text-lg font-bold text-foreground font-sora"
                            >
                                {data.name}
                            </h3>
                        </div>
                    )}
                    <div className="p-6 space-y-3">

                        {data.industry && (
                            <span className="client-industry inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full font-inter">
                                {data.industry}
                            </span>
                        )}

                        {data.description && (
                            <p className="client-description lg:text-md text-sm font-semibold text-muted-foreground leading-relaxed font-inter">
                                {data.description}
                            </p>
                        )}

                        {data.richDescription && data.richDescription !== data.description && (
                            <div
                                className={cn("client-description md:line-clamp-none  line-clamp-3 text-sm font-bold text-muted-foreground leading-relaxed font-inter prose prose-sm dark:prose-invert", lightOpen && "line-clamp-4")}
                                dangerouslySetInnerHTML={{ __html: data.richDescription }}
                            />
                        )}

                        {data.website && (
                            <Link
                                href={data.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="client-website inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors font-inter group/link"
                            >
                                Visit Website
                                <span className="group-hover/link:translate-x-1 transition-transform duration-200">
                                    →
                                </span>
                            </Link>
                        )}


                    </div>
                </div>

            </div >
        )
}


const ClientCardsingle = ({ data, idx = 0 }: ClientCardProps) => {



    return (
        <div
            className="group relative h-full w-full  flex lg:flex-row flex-col  items-center justify-start  rounded-2xl  border-primary  hover:border-primary/50 transition-all duration-300 overflow-hidden gap-4"
        >
            <div className=" h-full   xl:w-1/2 lg:w-full w-full  shrink-0 ">



                {data.image && (


                    <div className="relative h-full  items-center justify-center    ">

                        <BlurredImage
                            imageUrl={data.image.url}
                            height={data.image.height || 400}
                            width={data.image.width || 400}
                            alt={data.image.alt || data.name}
                            blurhash={data.image.blurHash || ""}
                            quality={100}
                            className="md:w-full md:h-full sm:h-[70%] sm:w-[90%]  w-full h-full  object-cover  transition-transform duration-700 ease-out rounded-2xl shadow-md"
                        />
                    </div>

                )}
            </div>

            <div className="  relative  lg:h-3/4 h-1/4 lg:w-1/2 w-full  md:mr-10  items-center justify-center md:flex hidden ">


                <h2 style={{
                    textShadow: "0 0  3px black"
                }} className={cn("  z-5 cursor-default  lg:text-[50rem] xl:text-[60rem] text-white ",)}> {idx + 1}
                </h2>
                <span
                    style={{
                        textShadow: "0 0  2px black"

                    }}
                    className=" w-max z-10 absolute -top-20 left-1/2 -translate-1/2  text-8xl font-bold  text-white font-sora">
                    {data.industry}
                </span>

            </div>
            {/* Logo Section */}
            <div className=" z-10 md:min-w-auto md:w-auto min-w-5/6 w-3/4   absolute  top-1/2 left-1/2 md:top-1/2   md:left-1/2 -translate-1/2 bg-white  p-4 shadow-2xl border border-border rounded-xl space-y-4 ">



                {data.logo && (

                    <div className=" bg-muted/30 flex  items-center justify-start gap-4 p-4 ">
                        <BlurredImage
                            imageUrl={data.logo.url}
                            height={data.logo.height || 100}
                            width={data.logo.width || 100}
                            alt={data.logo.alt || `${data.name} logo`}
                            blurhash={data.logo.blurHash || ""}
                            quality={100}
                            className="max-w-10 max-h-10 sm:w-10 sm:h-10  object-contain rounded-md"
                        />
                        <h3
                            className="text-2xl md:text-4xl line-clamp-1 font-bold text-foreground font-sora"
                        >
                            {data.name}
                        </h3>
                    </div>
                )}
                <div className="p-6 space-y-8">



                    {data.description && (
                        <p className="client-description text-xl lg:text-md lg:text-2xl xl:text3xl font-bold text-primary leading-relaxed font-inter">
                            {data.description}
                        </p>
                    )}

                    {data.richDescription && data.richDescription !== data.description && (
                        <div
                            className=" relative z-30 client-description md:line-clamp-none  sm:line-clamp-6 line-clamp-5 lg:text-xl xl:text-xl  text-black leading-relaxed font-inter prose prose-sm dark:prose-invert"
                            dangerouslySetInnerHTML={{ __html: data.richDescription }}
                        />
                    )}

                    {data.website && (
                        <Link
                            href={data.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="client-website inline-flex items-center gap-1 lg:text-xl xl:text-2xl font-semibold text-primary hover:text-primary/80 transition-colors font-inter group/link"
                        >
                            Visit Website
                            <span className="group-hover/link:translate-x-1 transition-transform duration-200">
                                →
                            </span>
                        </Link>
                    )}


                </div>
            </div>

        </div >

    )
}

const ClientCardStory = ({ data }: { data: ClientWithRelationsSlide }) => {

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
                            alt={data.image.alt || data.name}
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
                    {data.name}
                </h1>

                {/* Client Info */}


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
                    {data.website && (
                        <Link
                            href={data.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 text-sm md:text-base font-semibold text-foreground hover:text-primary transition-colors"
                        >
                            <span>View website</span>
                            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    )}

                </div>
            </div>
        </article>
    )
}