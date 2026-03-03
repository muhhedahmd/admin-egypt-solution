"use client";
import React, {  memo, useMemo, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import BlurredImage from "@/app/_comp/BlurredHashImage";

interface FilmStripProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  slides: any[];
  isInViewport: boolean;
}

const Perforation = ({ className }: { className?: string }) => (
  <div className={`film-perforation ${className || ""}`} />
);

const FilmStrip = memo(({ slides, isInViewport }: FilmStripProps) => {

  const currentRTL = slides?.[0]?.lang === "AR" ? "RTL" :"LTR" 
  const isRTL = currentRTL === "RTL"


  const stripRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const perfsTopRef = useRef<HTMLDivElement>(null);
  const perfsBottomRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  

  // Duplicate frames for seamless loop
  const duplicatedFrames =  useMemo(() => { 
    const filmFrames = slides.map((slide, idx) => ({
    id: idx,
    image: slide?.image || slide?.avatar || slide?.logo || slide?.image || slide?.avatar || slide?.logo,
    title: slide?.name || slide?.title || slide?.clientName || slide?.customTitle || `Scene ${String(idx + 1).padStart(2, '0')}`,
    alt: slide?.image?.alt || slide?.avatar?.alt || slide?.logo?.alt || `Scene ${idx + 1}`
  }));
    return [...filmFrames , ...filmFrames] }, [slides]) 
  useGSAP(() => {

    if (!stripRef.current || !containerRef.current || !isInViewport) return;

    const strip = stripRef.current;
    const perfsTop = perfsTopRef.current;
    const perfsBottom = perfsBottomRef.current;
    const totalWidth = strip.scrollWidth / 2;

    gsap.set([strip, perfsTop, perfsBottom], { x: 0 });

    const tl = gsap.timeline({ repeat: -1 });
    timelineRef.current = tl;
    
    tl.to([strip, perfsTop, perfsBottom], {
      x: isRTL ? totalWidth : -totalWidth,
      duration: 40,
      ease: "none",
    });

    const handleMouseEnter = () => {
      gsap.to(tl, { timeScale: 0.2, duration: 0.8, ease: "power2.out" });
    };

    const handleMouseLeave = () => {
      gsap.to(tl, { timeScale: 1, duration: 0.8, ease: "power2.out" });
    };

    const container = containerRef.current;
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      tl.kill();
      container?.removeEventListener("mouseenter", handleMouseEnter);
      container?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, { 
    dependencies :[isInViewport]
  });

  useGSAP(() => {
    if (timelineRef.current) {
      if (isInViewport) {
        timelineRef.current.play();
      } else {
        timelineRef.current.pause();
      }
    }
  }, [isInViewport]);

  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden py-8 bg-blend-lighten cinema-glow cursor-pointer"
    >
      {/* Film strip container */}
      <div className="bg-linear-30 from-10% from-muted to-muted-foreground/30   py-8 relative">
        {/* Top perforations row */}
        <div className="absolute top-3 left-0 overflow-hidden w-full">
          <div ref={perfsTopRef} className="flex">
            {duplicatedFrames.map((_, index) => (
              <div key={`top-perf-${index}`} className="shrink-0 w-80 flex justify-around">
                <Perforation />
                <Perforation />
                <Perforation />
                <Perforation />
              </div>
            ))}
          </div>
        </div>

        {/* Frames */}
        <div className="overflow-hidden">
          <div ref={stripRef} className="flex gap-6 px-4 py-2">
            {duplicatedFrames.map((frame, index) => (
              <div
                key={`frame-${index}`}
                className="shrink-0 w-80 group"
              >
                <div className="film-frame rounded overflow-hidden aspect-4/3 relative">
                  <BlurredImage
                    imageUrl={frame?.image?.url || "/placeholder.svg"}
                    alt={frame?.image?.alt || ""}
                    blurhash={frame?.image?.blurHash || ""}
                    height={frame?.image?.height || 400}
                    width={frame?.image?.width || 400}
                    quality={70}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-liner-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    <span className="font-display text-lg text-primary tracking-wider">
                      {frame.title}
                    </span>
                  </div>
                  {/* Film grain overlay */}
                  <div className="absolute inset-0 opacity-50 pointer-events-none mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom perforations row */}
        <div className="absolute bottom-3 left-0 overflow-hidden w-full">
          <div ref={perfsBottomRef} className="flex">
            {duplicatedFrames.map((_, index) => (
              <div key={`bottom-perf-${index}`} className="shrink-0 w-80 flex justify-around">
                <Perforation />
                <Perforation />
                <Perforation />
                <Perforation />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .cinema-glow {
          background: linear-gradient(to bottom, transparent,, transparent);
        }
        
        .film-perforation {
          width: 12px;
          height: 12px;
          background: #1a1a1a;
          border-radius: 2px;
        }
        
        .film-strip {
          background: linear-gradient(to right, #2a2a2a 0%, #1a1a1a 50%, #2a2a2a 100%);
        }
        
        .film-frame {
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        
        .font-display {
          font-family: 'Courier New', monospace;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
})

FilmStrip.displayName = "FilmStrip";
export default FilmStrip;