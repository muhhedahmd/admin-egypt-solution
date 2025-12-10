
import BlurredImage from "@/app/_comp/BlurredHashImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slide } from "@/lib/store/api/slideShow-api";
import { cn } from "@/lib/utils";
import { slide } from "@/types/schema";
import { Edit2, Eye, EyeOff, Star } from "lucide-react";



interface newSlideCardProps {
    slide: any;
    index: number;
    onEdit: (slide: slide) => void;
}

export const NewSlideCard = ({ slide, index, onEdit }: newSlideCardProps) => {
    const id = slide?.id
    const image = slide.image || slide.avatar
    const name = slide?.title || slide?.name || slide.clientName
    const desc = slide?.content || slide?.description
    const ratting = slide?.rating
    const isVisible = slide?.isVisible
    const price = slide?.price
    const icon = slide?.icon
    const type = slide?.type

    return (
        <div
            className="relative border-emerald-400 slide-card group animate-fade-in border-border border rounded-lg p-4 transition-transform duration-300 hover:scale-105"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <Badge className='absolute top-2 right-2 z-30'>
                NEW
            </Badge>

            <div className="relative mb-4 overflow-hidden rounded-lg">
                {image && (
                    <BlurredImage
                        quality={50}
                        width={400}
                        height={400}
                        imageUrl={image?.url || ""}
                        alt={image?.alt || ""}
                        blurhash={image?.blurHash || ""}
                        className="slide-image aspect-2/2 h-[10rem] w-full transition-transform duration-500 group-hover:scale-105"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEdit(slide)}
                    className="absolute bottom-3 right-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                >
                    <Edit2 className="mr-1.5 h-3.5 w-3.5" />
                    Edit
                </Button>
            </div>

            <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                        {icon && <span className="text-2xl">{icon}</span>}
                        <h3 className="font-display max-w-[10rem] overflow-hidden line-clamp-1 text-lg font-semibold text-foreground leading-tight">
                            {name}
                        </h3>
                    </div>
                    <div
                        className={cn(
                            "status-badge shrink-0",
                            isVisible ? "status-badge-active" : "status-badge-inactive"
                        )}
                    >
                        {isVisible ? (
                            <Badge>
                                <Eye className="h-3 w-3" />
                            </Badge>
                        ) : (
                            <Badge>
                                <EyeOff className="h-3 w-3" />
                            </Badge>
                        )}
                    </div>
                </div>

                {desc && (
                    <p className="text-sm line-clamp-1 text-muted-foreground ">
                        {desc}
                    </p>
                )}

                {price && (
                    <div className="pt-2">
                        <span className="inline-block rounded-md bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                            {price}
                        </span>
                    </div>
                )}

                {ratting && (
                    <div className="pt-2 flex items-center justify-start gap-1">
                        {Array.from({ length: ratting }).map((_, i) => (
                            <Star
                                key={i}
                                className="h-6 w-6 fill-yellow-400 text-yellow-400 animate-accordion-down"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};