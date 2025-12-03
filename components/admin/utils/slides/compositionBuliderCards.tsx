
import BlurredImage from "@/app/_comp/BlurredHashImage"
import { ClientWithRelationsSlide, ProjectWithRelationsSlide, TeamMemberWithImage, TestimonialWithImage } from "@/types/schema"
import { motion, useScroll, useTransform } from "framer-motion"
import { ExternalLink, Github, ImageIcon } from "lucide-react"
import Image from "next/image"
import { useRef } from "react"



export const ServiceCard = ({ data, imaged = false }: { data: any, imaged?: boolean }) => {

    // console.log({
    //     data
    // })

    const DataToRender = data?.name ? data : data.data


    if (imaged) {
        return <>
            {DataToRender.image && (
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
    }
    else return <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
            duration: .2
        }}
        className="group relative h-full overflow-hidden rounded-2xl  p-2 hover:border-primary/50 transition-all duration-300"
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
                    <span>
                        {DataToRender.icon}
                    </span>
                )}
                <motion.h3
                    className="text-xl font-bold font-sora text-foreground"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                >
                    {DataToRender.name}
                </motion.h3>
            </div>

            {DataToRender.description && (
                <motion.p
                    className="text-sm text-muted-foreground leading-relaxed font-inter"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    {DataToRender.description}
                </motion.p>
            )}
            {
                DataToRender.richDescription && (
                    <motion.div

                        className="text-sm text-muted-foreground leading-relaxed font-inter"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <p
                            dangerouslySetInnerHTML={{
                                __html: DataToRender.richDescription
                            }}
                        ></p>

                    </motion.div>
                )
            }
            {DataToRender.price && (

                <motion.div
                    className="pt-4 border-t border-border"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <span className="text-base font-bold text-primary font-sora">${DataToRender.price}</span>
                </motion.div>
            )}
        </div>
    </motion.article>
}


export const ClientCard = ({ data }: { data: ClientWithRelationsSlide }) => {

    return <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group relative h-full overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
    >
        {/* Main Image */}
        {data.image && (

            <div className="relative h-60 bg-muted/50 border-b border-border overflow-hidden">
                <BlurredImage
                    imageUrl={data.image.url}
                    height={data.image.height || 400}
                    width={data.image.width || 400}
                    alt={data.image.alt || data.name}
                    blurhash={data.image.blurHash || ""}
                    quality={100}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {data.isFeatured && (
                    <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
                        Featured
                    </span>
                )}
            </div>
        )}

        {/* Logo Section */}
        {data.logo && (
            <div className=" bg-muted/30 flex  items-center justify-start gap-4 p-4 border-b border-border">
                <BlurredImage
                    imageUrl={data.logo.url}
                    height={data.logo.height || 100}
                    width={data.logo.width || 100}
                    alt={data.logo.alt || `${data.name} logo`}
                    blurhash={data.logo.blurHash || ""}
                    quality={100}
                    className="max-w-5 max-h-5 w-5 h-5 object-contain rounded-md"
                />
                <motion.h3
                    className="text-lg font-bold text-foreground font-sora"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                >
                    {data.name}
                </motion.h3>
            </div>
        )}

        <div className="p-6 space-y-3">


            {data.industry && (
                <motion.span
                    className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full font-inter"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    {data.industry}
                </motion.span>
            )}

            {data.description && (
                <motion.p
                    className="text-sm text-muted-foreground leading-relaxed font-inter"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    {data.description}
                </motion.p>
            )}

            {data.richDescription && data.richDescription !== data.description && (
                <motion.div
                    className="text-sm text-muted-foreground leading-relaxed font-inter prose prose-sm dark:prose-invert"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.35 }}
                    dangerouslySetInnerHTML={{ __html: data.richDescription }}
                />
            )}

            {data.website && (
                <motion.a
                    href={data.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors font-inter group/link"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                >
                    Visit Website
                    <span className="group-hover/link:translate-x-1 transition-transform duration-200">→</span>
                </motion.a>
            )}

            {/* Status Footer */}
            {(!data.isActive || data.type) && (
                <motion.div
                    className="pt-3 mt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-inter"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                >
                    <span>Type: {data.type}</span>
                    {!data.isActive && (
                        <span className="text-destructive font-medium">Inactive</span>
                    )}
                </motion.div>
            )}
        </div>
    </motion.div>
}

// Project Card



export const ProjectCard = ({ data, split, index = 0, imagePosition, story }: { story?: boolean, data: ProjectWithRelationsSlide, split?: boolean, index: number, imagePosition?: string }) => {

    // console.log({ data })

    if (split) {
        return <ProjectCardParallax data={data} split={split} index={index} imagePosition={imagePosition} />
    }

    if (story) return <ProjectCardStory data={data} />
    else return <motion.div


        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
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
            <motion.h3
                className="text-lg font-bold text-foreground font-sora"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
            >
                {data.title}
            </motion.h3>

            {data.clientName && (
                <motion.div
                    className="flex items-center gap-2 text-sm text-muted-foreground font-inter"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {data.clientName}
                </motion.div>
            )}

            {data.description && (
                <motion.p
                    className="text-sm text-muted-foreground leading-relaxed font-inter"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    {data.description}
                </motion.p>
            )}

            <motion.div
                className="flex gap-3 pt-3 border-t border-border"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
            >
                {data.projectUrl && (
                    <a
                        href={data.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors font-inter"
                    >
                        View Project
                    </a>
                )}
                {data.githubUrl && (
                    <a
                        href={data.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors font-inter"
                    >
                        GitHub
                    </a>
                )}
            </motion.div>
        </div>
    </motion.div>
}

export const ProjectCardParallax = ({
    data,
    split,
    index = 0,
    // imagePosition = "left", 

}: {
    imagePosition?: string,
    data: ProjectWithRelationsSlide,
    split?: boolean,
    index: number

}) => {
    const autoPosition = (['left', 'right', 'top'] as const)[index % 3];
    const position: 'left' | 'right' | 'top' | 'bottom' = autoPosition;
    // const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        offset: ["start end", "end start"]
    });

    // Parallax transforms
    const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
    const contentY = useTransform(scrollYProgress, [0, 1], [50, -50]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    // Layout configurations
    const layouts = {
        left: "flex-row",
        right: "flex-row-reverse",
        top: "flex-col",
        bottom: "flex-col-reverse"
    };

    const imageSize = ['top', 'bottom'].includes(position)
        ? "h-[60vh] w-full"
        : "h-screen w-3/5";

    if (split) {

        return (<>

            <div className="min-h-screen h-screen overflow-hidden flex items-center justify-center py-20 px-4">

                <motion.div
                    style={{ opacity }}
                    className={`group relative  w-full overflow-hidden  flex ${position && `${layouts[position as keyof typeof layouts]}`} `}
                >
                    {/* Image Section with Parallax */}
                    <motion.div
                        className={`relative ${imageSize} overflow-hidden `}
                        style={{ scale: imageScale }}
                    >
                        <motion.div
                            style={{ y: imageY }}
                            className="w-full h-full"
                        >
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
                        </motion.div>

                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-${position === 'left' ? 'r' :
                            position === 'right' ? 'l' :
                                position === 'top' ? 'b' : 't'
                            } from-transparent to-slate-900/50`} />
                    </motion.div>

                    {/* Content Section with Parallax */}
                    <motion.div
                        style={{ y: contentY }}
                        className={`flex-1 p-12 ${['top', 'bottom'].includes(position) ? 'min-h-[40vh]' : ''} flex flex-col justify-center space-y-6`}
                    >
                        <motion.div
                            initial={{ opacity: 0, x: position === 'right' ? 20 : -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4">
                                Featured Project
                            </span>

                            <h3 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                                {data.title}
                            </h3>
                        </motion.div>

                        {data.clientName && (
                            <motion.div
                                className="flex items-center gap-3 "
                                initial={{ opacity: 0, x: position === 'right' ? 20 : -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <div className="w-2 h-2 rounded-full" />
                                <span className="text-lg font-medium">{data.clientName}</span>
                            </motion.div>
                        )}

                        {data.description && (
                            <motion.p
                                className="text-lg leading-relaxed max-w-xl"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                {data.description}
                            </motion.p>
                        )}

                        <motion.div
                            className="flex flex-wrap gap-4 pt-6"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            {data.projectUrl && (
                                <a
                                    href={data.projectUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/btn px-8 py-3 rounded-full   font-semibold transition-all duration-300 flex items-center gap-2"
                                >
                                    View Project
                                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                </a>
                            )}
                            {data.githubUrl && (
                                <a
                                    href={data.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-3 rounded-full border-2 border-slate-600 hover:border-slate-400  hover:text-white font-semibold transition-all duration-300"
                                >
                                    GitHub
                                </a>
                            )}
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>

        </>
        )
    }

}



const ProjectCardStory = ({ data }: { data: ProjectWithRelationsSlide }) => {
    return (
        <article className="w-full  flex flex-col md:flex-row gap-6  mx-auto px-6 py-16">
            {/* Hero Image */}
            <div className="aspect-3/1 h-[40vh] w-[60rem]   relative mb-3 overflow-hidden group">

                {data.image && (
                    <div className="h-full w-full overflow-hidden bg-gray-100">
                        <BlurredImage
                            imageUrl={data.image.url}
                            height={data.image.height || 400}
                            width={data.image.width || 800}
                            alt={data.image.alt || data.title}
                            blurhash={data.image.blurHash || ""}
                            quality={100}
                            className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                    </div>
                )}
            </div>

            {/* Story Content */}
            <div className="space-y-8">

                {/* Tag */}


                {/* Title */}
                <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-[1.1] tracking-tight">
                    {data.title}
                </h1>

                {/* Client Info */}
                {data.clientName && (
                    <div className="flex items-center gap-2 text-base text-muted-foreground">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <span className="font-medium">{data.clientName}</span>
                        {data.clientCompany && (
                            <>
                                <span className="text-border">•</span>
                                <span>{data.clientCompany}</span>
                            </>
                        )}
                    </div>
                )}

                {/* Description */}
                {data.description && (
                    <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl">
                        {data.description}
                    </p>
                )}

                {/* Rich Description */}
                {data.richDescription && (
                    <div className="prose prose-lg max-w-3xl text-muted-foreground">
                        {data.richDescription.split('\n').map((paragraph, idx) => {

                          return paragraph.trim() && <p key={idx} className="mb-4">{paragraph}</p>
                        }
                        )}
                    </div>
                )}

                {/* Action Links */}
                <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border">
                    {data.projectUrl && (
                        <a
                            href={data.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 text-base font-semibold text-foreground hover:text-primary transition-colors"
                        >
                            <span>View Project</span>
                            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                    )}

                    {data.githubUrl && (
                        <a
                            href={data.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 text-base font-semibold text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Github className="w-4 h-4" />
                            <span>View Source</span>
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
};


export const TestimonialCard = ({ data, minmal, }: { data: TestimonialWithImage, minmal?: boolean }) => {

    if (minmal) {
        return <>
            <div className="h-full w-full flex gap-4 items-center justify-center gap-4">

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
                    <motion.div
                        className="flex gap-1"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        {[...Array(data.rating)].map((_, i) => (
                            <span key={i} className="text-yellow-500 text-lg">★</span>
                        ))}
                    </motion.div>

                    <div className="flex flex-col ">


                        <div className="font-semibold text-foreground text-sm font-sora">
                            {data.clientPosition && (
                                <p className="text-xs text-muted-foreground font-inter max-w-40 text-wrap wrap-anywhere line-clamp-1">{data.clientPosition}</p>
                            )}
                            <strong>

                                {data.clientName}
                            </strong>
                        </div>
                    </div>
                </div>
            </div>
        </>
    }
    else return <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group relative h-full rounded-2xl overflow-hidden bg-card border border-border p-6 hover:border-primary/50 transition-all duration-300"
    >
        <div className="absolute top-4 right-4 text-5xl text-primary/10 font-serif select-none">"</div>

        <div className="relative space-y-5 h-full flex flex-col justify-between">
            <motion.p
                className="text-foreground text-sm leading-relaxed italic font-inter pr-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
            >
                {data.content}
            </motion.p>

            <div className="space-y-3">
                <motion.div

                    className="flex gap-1"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    {[...Array(data.rating)].map((_, i) => (
                        <span key={i} className="text-primary text-lg">★</span>
                    ))}
                </motion.div>

                <motion.div
                    className="flex items-center gap-3 pt-3 border-t border-border"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
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
                        <p className="font-semibold text-foreground text-sm font-sora">{data.clientName}</p>
                        {data.clientPosition && (
                            <p className="text-xs text-muted-foreground font-inter">{data.clientPosition}</p>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    </motion.div>
}


export const TeamMemberCard = ({ data }: { data: TeamMemberWithImage }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group relative h-full overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
    >
        <div className="relative h-56 overflow-hidden bg-muted">
            {data.image && (
                <img
                    src={data.image.url}
                    alt={data.image.alt || data.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
            )}
        </div>

        <div className="p-6 space-y-4">
            <div>
                <motion.h3
                    className="text-lg font-bold text-foreground font-sora"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                >
                    {data.name}
                </motion.h3>
                <motion.p
                    className="text-sm font-semibold text-primary font-inter"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    {data.position}
                </motion.p>
            </div>

            {data.bio && (
                <motion.p
                    className="text-sm text-muted-foreground leading-relaxed font-inter"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    {data.bio}
                </motion.p>
            )}

            <motion.div
                className="flex gap-2 pt-3 border-t border-border"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
            >
                {data.linkedin && (
                    <a
                        href={data.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                    >
                        in
                    </a>
                )}
                {data.github && (
                    <a
                        href={data.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                    >
                        gh
                    </a>
                )}
                {data.twitter && (
                    <a
                        href={data.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                    >
                        𝕏
                    </a>
                )}
                {data.email && (
                    <a
                        href={`mailto:${data.email}`}
                        className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                    >
                        ✉️
                    </a>
                )}
            </motion.div>
        </div>
    </motion.div>
)
