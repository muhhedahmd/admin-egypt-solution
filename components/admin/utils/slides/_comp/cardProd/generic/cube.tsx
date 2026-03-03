
import BlurredImage from '@/app/_comp/BlurredHashImage'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import  { memo } from 'react'

const Cube = memo(( { data} : {data : any}) => {

    return (
            <div
                className="group relative h-full w-full  flex lg:flex-row flex-col   rounded-2xl  border-primary bg-card  border hover:border-primary/50 transition-all duration-300 overflow-hidden gap-4">
                <div className={cn("lg:h-full h-1/2 lg:w-1/2 w-full  ")}>


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
                                className={cn("client-description md:line-clamp-none  line-clamp-3 text-sm font-bold text-muted-foreground leading-relaxed font-inter prose prose-sm dark:prose-invert")}
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
})

Cube.displayName = "Cube"

export default Cube