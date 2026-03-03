/* eslint-disable @typescript-eslint/no-explicit-any */
import BlurredImage from "@/app/_comp/BlurredHashImage"
import { cn } from "@/lib/utils"
import Link from "next/link"

const GenricSingle = ({ data, idx = 0 }: { data: any, idx?: number }) => {
    const name = data.name || data.title || (data?.clientName && data?.clientCompany ? `${data.clientName}-${data.clientCompany}` : '') || 'Untitled'
    
    const description = data.description || ''
    
    const richDescription = data.richDescription || data.bio || ''
    
    const image = data.image || data.avatar || null
    
    const githubUrl = data.githubUrl || ''
    const rating = data.rating || ''
    
    return (
        <div
            className="group relative h-full w-full flex lg:flex-row flex-col items-center justify-start rounded-2xl border-primary hover:border-primary/50 transition-all duration-300 overflow-hidden gap-4"
        >
            <div className="h-full xl:w-1/2 lg:w-full w-full shrink-0">
                {image && (
                    <div className="relative h-full items-center justify-center">
                        <BlurredImage
                            imageUrl={image.url}
                            height={image.height || 400}
                            width={image.width || 400}
                            alt={image.alt || name}
                            blurhash={image.blurHash || ""}
                            quality={100}
                            className="md:w-full md:h-full sm:h-[70%] sm:w-[90%] w-full h-full object-cover transition-transform duration-700 ease-out rounded-2xl shadow-md"
                        />
                    </div>
                )}
            </div>

            <div className="relative lg:h-3/4 h-1/4 lg:w-1/2 w-full md:mr-10 items-center justify-center md:flex hidden">
                <h2 
                    // style={{ textShadow: "0 0 3px black" }} 
                    className={cn("z-5 cursor-default text-shadow-primary  text-shadow-2xs text-background lg:text-[50rem] xl:text-[50rem] ")}
                > 
                    {idx + 1}
                </h2>
                {data.industry && (
                    <span
                        // style={{ textShadow: "0 0 2px black" }}
                        className="w-max z-10 absolute -top-20 left-1/2 text-shadow-primary  text-shadow-2xs text-background  -translate-x-1/2 text-8xl font-bold  font-sora"
                    >
                        {data.industry}
                    </span>
                )}
            </div>

            {/* Logo Section */}
            <div className="z-10 md:min-w-auto md:w-auto min-w-5/6 w-3/4 absolute top-1/2 left-1/2 md:top-1/2 md:left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-4 shadow-2xl border border-border rounded-xl space-y-4">
                {data.logo && (
                    <div className="bg-muted/30 flex items-center justify-start gap-4 p-4">
                        <BlurredImage
                            imageUrl={data.logo.url}
                            height={data.logo.height || 100}
                            width={data.logo.width || 100}
                            alt={data.logo.alt || `${name} logo`}
                            blurhash={data.logo.blurHash || ""}
                            quality={100}
                            className="max-w-10 max-h-10 sm:w-10 sm:h-10 object-contain rounded-md"
                        />
                        <h3 className="text-2xl md:text-4xl line-clamp-1 font-bold text-foreground font-sora">
                            {name}
                        </h3>
                    </div>
                )}

                <div className="p-6 space-y-8">
                    {description && (
                        <p className="client-description text-xl lg:text-md lg:text-2xl xl:text-3xl font-bold text-primary leading-relaxed font-inter">
                            {description}
                        </p>
                    )}

                    {richDescription && richDescription !== description && (
                        <div
                            className="relative z-30 client-description md:line-clamp-none sm:line-clamp-6 line-clamp-5 lg:text-xl xl:text-xl text-muted-foreground leading-relaxed font-inter prose prose-sm dark:prose-invert"
                            dangerouslySetInnerHTML={{ __html: richDescription }}
                        />
                    )}

                    {rating && (
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold text-foreground">Rating:</span>
                            <span className="text-lg text-primary">{rating}</span>
                        </div>
                    )}

                    {githubUrl && (
                        <Link
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 lg:text-xl xl:text-2xl font-semibold text-primary hover:text-primary/80 transition-colors font-inter group/link"
                        >
                            View on GitHub
                            <span className="group-hover/link:translate-x-1 transition-transform duration-200">
                                →
                            </span>
                        </Link>
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
        </div>
    )
}

export default GenricSingle