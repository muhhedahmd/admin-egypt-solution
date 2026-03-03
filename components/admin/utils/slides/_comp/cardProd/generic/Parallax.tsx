/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Link from "next/link";
import {
    ClientWithRelationsSlide,
    ProjectWithRelationsSlide,
    ServiceWithImage,
    TeamMemberWithImageSlide,
    TestimonialWithImageSlide
} from "@/types/schema";
import BlurredImage from "@/app/_comp/BlurredHashImage";

gsap.registerPlugin(ScrollTrigger);

type GenericCardData =
    | ClientWithRelationsSlide
    | ProjectWithRelationsSlide
    | ServiceWithImage
    | TeamMemberWithImageSlide
    | TestimonialWithImageSlide;

export const GenericCardParallax = ({
    data,
    index = 0,
}: {
    data: GenericCardData;
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
        scope: containerRef,
        dependencies: [index, position],
    });

    const isLeftLayout = position === 'left';

    // Extract common fields with fallbacks
    const getTitle = () => {
        if ('title' in data) return data.title;
        if ('name' in data) return data.name;
        if ('clientName' in data) return data.clientName;
        return 'Untitled';
    };

    const getDescription = () => {
        if ('description' in data) return data.description;
        if ('content' in data) return data.content;
        if ('bio' in data) return data.bio;
        return '';
    };

    const getRichDescription = () => {
        if ('richDescription' in data) return data.richDescription;
        return '';
    };

    const getImage = () => {
        if ('image' in data) return data.image;
        if ('avatar' in data) return data.avatar;
        return null;
    };

    const getStatus = () => {
        if ('status' in data) return data.status;
        return null;
    };

    const getClientInfo = () => {
        if ('clientName' in data) {
            return {
                name: data.clientName,
                company: 'clientCompany' in data ? data.clientCompany : null,
                position: 'clientPosition' in data ? data.clientPosition : null,
            };
        }
        if ('position' in data) {
            return {
                name: 'name' in data ? data.name : null,
                company: null,
                position: data.position,
            };
        }
        return null;
    };

    const getTechnologies = () => {
        if ('technologies' in data) return data.technologies;
        return null;
    };

    const getLinks = () => {
        const links: { url: string; label: string; isPrimary?: boolean }[] = [];

        if ('projectUrl' in data && data.projectUrl) {
            links.push({ url: data.projectUrl, label: 'View Project', isPrimary: true });
        }
        if ('githubUrl' in data && data.githubUrl) {
            links.push({ url: data.githubUrl, label: 'GitHub' });
        }
        if ('website' in data && data.website) {
            links.push({ url: data.website, label: 'Visit Website', isPrimary: true });
        }
        if ('linkedin' in data && data.linkedin) {
            links.push({ url: data.linkedin, label: 'LinkedIn' });
        }
        if ('twitter' in data && data.twitter) {
            links.push({ url: data.twitter, label: 'Twitter' });
        }

        return links.length > 0 ? links : null;
    };

    const getRating = () => {
        if ('rating' in data) return data.rating;
        return null;
    };

    const getIndustry = () => {
        if ('industry' in data) return data.industry;
        return null;
    };

    const getPrice = () => {
        if ('price' in data) return data.price;
        return null;
    };

    const title = getTitle();
    const description = getDescription();
    const richDescription = getRichDescription();
    const image = getImage() as any;
    const status = getStatus();
    const clientInfo = getClientInfo();
    const technologies = getTechnologies();
    const links = getLinks();
    const rating = getRating();
    const industry = getIndustry();
    const price = getPrice();

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
                    {image ? (
                        <BlurredImage
                            imageUrl={image.url}
                            alt={image.alt || title}
                            height={image.height || 400}
                            width={image.width || 600}
                            blurhash={image.blurHash || ""}
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
                    {status && (
                        <span className="inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider border border-border rounded-full text-muted-foreground">
                            {status.replace('_', ' ')}
                        </span>
                    )}

                    {/* Industry Badge */}
                    {industry && (
                        <span className="inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider border border-border rounded-full text-muted-foreground">
                            {industry}
                        </span>
                    )}

                    {/* Title */}
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                        {title}
                    </h2>

                    {/* Client/Position Info */}
                    {clientInfo && (
                        <div className="space-y-1">
                            {clientInfo.name && (
                                <p className="text-base sm:text-lg font-medium text-foreground">
                                    {clientInfo.name}
                                </p>
                            )}
                            {clientInfo.company && (
                                <p className="text-sm sm:text-base text-muted-foreground">
                                    {clientInfo.company}
                                </p>
                            )}
                            {clientInfo.position && (
                                <p className="text-sm sm:text-base text-muted-foreground">
                                    {clientInfo.position}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Rating */}
                    {rating && (
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold text-foreground">Rating:</span>
                            <span className="text-lg text-primary">{rating}</span>
                        </div>
                    )}

                    {/* Price */}
                    {price && (
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold text-foreground">Price:</span>
                            <span className="text-lg text-primary">{price}</span>
                        </div>
                    )}

                    {/* Description */}
                    {description && (
                        <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                            {description}
                        </p>
                    )}

                    {/* Rich Description */}
                    {richDescription && richDescription !== description && (
                        <div
                            className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert"
                            dangerouslySetInnerHTML={{ __html: richDescription }}
                        />
                    )}

                    {/* Technologies */}
                    {technologies && technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {technologies.slice(0, 5).map((tech: any, idx) => (
                                <span
                                    key={idx}
                                    className="px-2.5 sm:px-3 py-1 text-xs sm:text-sm border border-border rounded-md bg-accent/50 text-foreground"
                                >
                                    {tech.technology?.name || tech.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Action Links */}
                    {links && links.length > 0 && (
                        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2 sm:pt-4">
                            {links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-medium rounded-full transition-all ${link.isPrimary
                                            ? 'bg-primary text-primary-foreground hover:opacity-90'
                                            : 'border border-border hover:bg-accent'
                                        }`}
                                >
                                    {link.label}
                                    {link.isPrimary && <span>→</span>}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
};