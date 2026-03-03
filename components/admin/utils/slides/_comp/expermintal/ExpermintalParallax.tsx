/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";
import { ProjectWithRelationsSlide } from "@/types/schema";
import Link from "next/link";
import BlurredImage from "@/app/_comp/BlurredHashImage";

gsap.registerPlugin(ScrollTrigger);

export const ProjectCardParallax = ({
    data,
    index = 0,
}: {
    data: ProjectWithRelationsSlide;
    index: number;
}) => {
    const position = (['left', 'right'] as const)[index % 2];

    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
            // Image parallax
            if (imageRef.current) {
                gsap.fromTo(imageRef.current,

                    { y: 100, opacity: 0.8, scale: .8 },
                    {
                        y: -100,
                        opacity: 1,
                        ease: "none",
                        scale: 1,
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: 1.5,
                            // markers: true
                        }
                    }
                );
            }

            // Content slide in
            if (contentRef.current) {
                gsap.fromTo(contentRef.current,

                    {
                        x: position === 'left' ? -80 : 80,
                        opacity: 0
                    },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: "top 70%",
                            toggleActions: "play none none reverse",
                            // markers: true
                        }
                    }
                );
            }
        });

        mm.add("(max-width: 767px)", () => {
            if (imageRef.current) {
                gsap.fromTo(imageRef.current,
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: "top 80%",
                            toggleActions: "play none none reverse",
                        }
                    }
                );
            }

            if (contentRef.current) {
                gsap.fromTo(contentRef.current,
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        delay: 0.2,
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: "top 80%",
                            toggleActions: "play none none reverse",
                        }
                    }
                );
            }
        });

        return () => mm.revert();
    }, {
        scope: containerRef, dependencies: [index, position],
        
    });

    const isLeftLayout = position === 'left';

    return (
        <article
            ref={containerRef}
            className="w-full flex items-center justify-between"
        >
            <div className={`w-full justify-between flex flex-col ${isLeftLayout ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-6 sm:gap-8 md:gap-10 lg:gap-20 items-center`}>
                {/* Image Section */}
                <div
                    ref={imageRef}
                    className="w-full lg:w-1/2 relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] xl:h-[600px] rounded-xl sm:rounded-2xl overflow-hidden"
                >
                    {data.image ? (
                        <BlurredImage
                            imageUrl={data.image.url}
                            alt={data.image.alt || data.title}
                            height={data.image.height || 400}
                            width={data.image.width || 600}
                            blurhash={data.image.blurHash || ""}
                            className="object-cover w-full h-full"
                            quality={90}
                        />
                    ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-muted-foreground text-sm">No image</span>
                        </div>
                    )}
                </div>
                {/* Content Section */}
                <div
                
                    ref={contentRef}
                    className="w-full lg:w-1/2 space-y-4 sm:space-y-5 md:space-y-6"
                >
                    {/* Status Badge */}
                    {data.status && (
                        <span className="inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider border border-border rounded-full text-muted-foreground">
                            {data.status.replace('_', ' ')}
                        </span>
                    )}

                    {/* Title */}
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                        {data.title}
                    </h2>

                    {/* Client Info */}
                    {data.clientName && (
                        <div className="space-y-1">
                            <p className="text-base sm:text-lg font-medium text-foreground">
                                {data.clientName}
                            </p>
                            {data.clientCompany && (
                                <p className="text-sm sm:text-base text-muted-foreground">
                                    {data.clientCompany}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Description */}
                    {data.description && (
                        <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                            {data.description}
                        </p>
                    )}

                    {/* Technologies */}
                    {data.technologies && data.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {data.technologies.slice(0, 5).map((tech: any, idx) => (
                                <span
                                    key={idx}
                                    className="px-2.5 sm:px-3 py-1 text-xs sm:text-sm border border-border rounded-md bg-accent/50 text-foreground"
                                >
                                    {tech.technology.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2 sm:pt-4">
                        {data.projectUrl && (
                            <Link
                                href={data.projectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-all"
                            >
                                View Project
                                <span>→</span>
                            </Link>
                        )}
                        {data.githubUrl && (
                            <Link
                                href={data.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-medium border border-border rounded-full hover:bg-accent transition-all"
                            >
                                GitHub
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
};