import  {  useRef } from "react";
import { Star } from "lucide-react";
import BlurredImage from "@/app/_comp/BlurredHashImage";

interface MarqueeProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  slides: any[];
  isInViewport: boolean;
}

const Marquee = ({ slides,  }: MarqueeProps) => {
  const marqueeRef = useRef<HTMLDivElement>(null);

  // Create items from slides with all data extraction
  const marqueeItems = slides.map((slide, idx) => {
    const type = slide?.type || 'default';
    
    return {
      id: idx,
      type: type,
      image: slide?.image?.url || slide?.avatar?.url || slide?.logo?.url || slide?.image || slide?.avatar || slide?.logo,
      title: slide?.customTitle || slide?.name || slide?.title || slide?.clientName || slide?.project?.title || `Item ${idx + 1}`,
      description: slide?.customDesc || slide?.description || slide?.content || slide?.bio || slide?.client?.description || slide?.project?.description || "",
      alt: slide?.image?.alt || slide?.avatar?.alt || slide?.logo?.alt || `Item ${idx + 1}`,
      blurHash: slide?.image?.blurHash || slide?.avatar?.blurHash || slide?.logo?.blurHash || "",
      width: slide?.image?.width || slide?.avatar?.width || slide?.logo?.width || 400,
      height: slide?.image?.height || slide?.avatar?.height || slide?.logo?.height || 300,
      icon: slide?.icon || "",
      position: slide?.position || slide?.clientPosition || "",
      rating: slide?.rating || 0,
      logo: slide?.logo || null,
    };
  });

  // Duplicate items for seamless loop
  const duplicatedItems = [...marqueeItems, ...marqueeItems];


  return (
    <div className="space-y-8">
      <div className="relative h-48 overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div 
          ref={marqueeRef}
          className="flex gap-6 h-full absolute"
          style={{ willChange: "transform" }}
        >
          {duplicatedItems.map((item, idx) => (
            <div
              key={`marquee-${idx}`}
              className="min-w-[320px] h-full rounded-2xl shrink-0 overflow-hidden group bg-background/80 backdrop-blur-sm border border-border shadow-lg"
            >
              <div className="flex items-center gap-4 h-full p-4">
                {/* Image Section */}
                <div className="w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden">
                  <BlurredImage
                    imageUrl={item.image || "/placeholder.svg"}
                    alt={item.alt}
                    blurhash={item.blurHash}
                    height={item.height}
                    width={item.width}
                    quality={70}
                    className="w-full h-full object-cover transition-all duration-500 scale-105 group-hover:scale-100"
                  />
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  {/* Icon & Title */}
                  <div className="flex items-center gap-2 mb-1">
                    {item.icon && (
                      <span className="text-lg">{item.icon}</span>
                    )}
                    <h3 className="font-bold text-sm truncate text-foreground">
                      {item.title}
                    </h3>
                  </div>

                  {/* Position (for team/testimonials) */}
                  {item.position && (
                    <p className="text-xs text-muted-foreground mb-1 truncate">
                      {item.position}
                    </p>
                  )}

                  {/* Description */}
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Rating (for testimonials) */}
                  {item.rating > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      {Array.from({ length: item.rating }).map((_, starIdx) => (
                        <Star key={starIdx} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">
                        {item.rating}/5
                      </span>
                    </div>
                  )}

                  {/* Logo (for clients) */}
                  {item.logo && item.logo.url && (
                    <div className="mt-2 w-16 h-8">
                      <BlurredImage
                        imageUrl={item.logo.url}
                        alt={item.logo.alt || "Logo"}
                        blurhash={item.logo.blurHash || ""}
                        height={item.logo.height || 100}
                        width={item.logo.width || 100}
                        quality={60}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;