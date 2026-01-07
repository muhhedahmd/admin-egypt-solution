"use client"

import React, { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroCard } from "./hero-card"
import type { HeroData, IHero, Image } from "@/types/schema"

interface HeroCarouselProps {
  heroes: {
      hero : IHero ,
      backgroundImage: Image
    }[]

}

export const HeroCarousel = React.memo(({   heroes,  }: HeroCarouselProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null)

    console.log({heroes})
  return (
    <div className="relative">
      <div
        ref={containerRef}
        className=" gap-4  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2  w-full  xl:grid-cols-4  scrollbar-hide px-4"
        

      >
        {heroes.map((hero) => (
          <div key={hero.hero.id} className=" w-full  ">

            <HeroCard hero={{ 
              hero : hero.hero,
              backgroundImage: hero.backgroundImage || undefined
            }}  
            
            />
          </div>
        ))}
      </div>
    </div>
  )
})

HeroCarousel.displayName = "HeroCarousel"



      // {canScrollLeft && (
      //   <Button
      //     variant="outline"
      //     size="icon"
      //     onClick={() => scroll("left")}
      //     className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -ml-2 bg-white/80 backdrop-blur hover:bg-white"
      //   >
      //     <ChevronLeft className="w-4 h-4" />
      //   </Button>
      // )}

      // {canScrollRight && (
      //   <Button
      //     variant="outline"
      //     size="icon"
      //     onClick={() => scroll("right")}
      //     className="absolute right-0 top-1/2 -translate-y-1/2 z-10 -mr-2 bg-white/80 backdrop-blur hover:bg-white"
      //   >
      //     <ChevronRight className="w-4 h-4" />
      //   </Button>
      // )}