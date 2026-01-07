"use client";

import React, { useRef, useState, useEffect, memo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { slide } from "@/types/schema";
import { TypeToRender } from "../Arrange-slides";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export interface Props {
  slides: slide[];
}

const CubeComposition = memo(({ slides }: Props) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null); // pinned wrapper
  const trackRef = useRef<HTMLDivElement | null>(null); // sliding track (flex row)
  const progress = useRef<number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  console.log(progress)
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track || slides.length === 0) return;

    // Ensure layout is measured correctly
    ScrollTrigger.refresh();

    // total horizontal percent we will move track (0 ... -(N-1)*100%)
    const totalPercent = (slides.length - 1) * 100;

    // master timeline animates track.xPercent from 0 -> -totalPercent
    const tl = gsap.timeline();
    tl.to(track, {
      xPercent: (progress.current  * 10)* totalPercent,
      ease: "none",
    });
    tlRef.current = tl;

    // ScrollTrigger ties the timeline to window scroll, pins wrapper for the duration
    const st = ScrollTrigger.create({
      animation: tl,
      trigger: wrapper,
      start: "top top",
      end: `+=${slides.length * window.innerHeight}`, // pin duration = number of slides * viewport height
      scrub: 0.6,
      pin: true,
      anticipatePin: 1,
      snap: {
        // snap to each slide step
        snapTo: 1 / Math.max(1, slides.length - 1),
        duration: 0.35,
        ease: "power2.out",
      },
      onUpdate: (self) => {
        // Update activeIndex based on timeline progress (you can comment this out to decouple bullets)
        progress.current = +self.progress.toFixed(3);
        const idx = Math.round(self.progress * (slides.length - 1));
        setActiveIndex(idx);
      },
      // markers: true, // enable during debugging
    });

    // Cleanup
    return () => {
      st.kill();
      tl.kill();
      tlRef.current = null;
    };
  }, [slides.length]);

  // Bullet click: animate timeline to the given index
  const goToIndex = (index: number) => {
    const tl = tlRef.current;
    if (!tl) return;
    const progress = index / Math.max(1, slides.length - 1);
    // Animate timeline progress (this will also update the pinned ScrollTrigger animation)
    gsap.to(tl, { progress, duration: 0.6, ease: "power2.out" });
    // Optional: setActiveIndex(index) immediately for fast UI feedback
    setActiveIndex(index);
    // If you want to also move the page scroll position to match the new progress, you could animate window.scrollTo
    // but in most cases animating the timeline is enough because ScrollTrigger updates the visual pinned section.
  };

  return (
    <div className="w-screen relative bg-black">
      {/* Pinned wrapper */}
      <div ref={wrapperRef} className="w-screen h-screen relative overflow-hidden">
        {/* Left bullets / indicators */}
        <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 pointer-events-auto">
          {slides.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => goToIndex(idx)}
              className={cn(
                "w-3 h-3 rounded-full transition-transform duration-200",
                activeIndex === idx ? "bg-white scale-125" : "bg-white/30"
              )}
            />
          ))}
        </div>

        {/* Centered viewport for slides */}
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10">
          {/* Track: a flex row with each child = 100vw */}
          <div
            ref={trackRef}
            className="flex items-center h-full will-change-transform"
            style={{
              // track width equals N * 100vw so xPercent moves in percent-space
              width: `${slides.length * 100}vw`,
            }}
          >
            {slides.map((slideItem, idx) => (
              <div
                key={slideItem.id}
                // each slide is one viewport wide and centers its content
                className="flex-shrink-0 w-[100vw] h-full flex items-center justify-center pointer-events-none"
                style={{
                  // optional: control preview spacing between slides (use marginRight)
                  // marginRight: "0px", // default no gap
                }}
              >
                <div
                  // content wrapper (centered preview); allow pointer events for content (links/buttons inside slide)
                  className="pointer-events-auto flex items-center justify-center"
                  style={{
                    width: 480,
                    height: 520,
                  }}
                >
                  <TypeToRender slide={slideItem} cube />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spacer after pinned wrapper to provide scroll space */}
      <div style={{ height: `${slides.length * 100}vh` }} />
    </div>
  );
});

CubeComposition.displayName = "CubeComposition";
export default CubeComposition;
