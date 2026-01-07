import BlurredImage from "@/app/_comp/BlurredHashImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slide } from "@/lib/store/api/slideShow-api";
import { cn } from "@/lib/utils";
import { Edit2, Eye, EyeOff } from "lucide-react";


interface SlideCardProps {
    slide: Slide;
    index: number;
    onEdit: (slide: Slide) => void;
    onDelete: (slide: Slide) => void;
}

export const SlideCard = ({ slide , index, onEdit, onDelete }: SlideCardProps) => {


    return (
        <div
            className="slide-card group animate-fade-in border-border border rounded-lg p-4 transition-transform duration-300 hover:scale-105"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="relative mb-4 overflow-hidden rounded-lg">
                <BlurredImage
                    quality={50}
                    width={400}
                    height={400}
                    imageUrl={slide?.image?.url || ""}
                    alt={slide?.image?.alt || slide?.name || ""}
                    blurhash={slide?.image?.blurHash || ""}
                    className="slide-image max-h-[10rem] w-full transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-3 right-3 flex gap-2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onEdit(slide)}
                    >
                        <Edit2 className="mr-1.5 h-3.5 w-3.5" />
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(slide)}
                    >
                        Delete
                    </Button>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                        {slide?.icon && <span className="text-2xl">{slide?.icon}</span>} 
                        <h3 className="font-display max-w-[10rem] overflow-hidden line-clamp-1 text-lg font-semibold text-foreground leading-tight">
                            {slide?.customTitle || slide?.name}
                        </h3>
                    </div>
                    <div
                        className={cn(
                            "status-badge shrink-0",
                            slide.isVisible ? "status-badge-active" : "status-badge-inactive"
                        )}
                    >
                        {slide.isVisible ? (
                            <Badge>
                                <Eye className="h-3 w-3" />
                            </Badge>
                        ) : (
                            <Badge variant={"destructive"}>
                                <EyeOff className="h-3 w-3" />
                            </Badge>
                        )}
                    </div>
                </div>

                <p className="text-sm line-clamp-1 text-muted-foreground ">
                    {slide?.customDescption || slide?.description}
                </p>

                {slide?.price && (
                    <div className="pt-2">
                        <span className="inline-block rounded-md bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                            {slide?.price}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};