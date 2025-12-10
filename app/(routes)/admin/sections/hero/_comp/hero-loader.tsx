import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const HeroLoader = () => {
  const placeholders = Array.from({ length: 5 });

  return (
    <div className="relative">
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 scrollbar-hide px-4">
        {placeholders.map((_, idx) => (
          <div
            key={idx}
            className="p-1 group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <div className="w-full h-40 rounded-t-md ">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center  w-full px-4">
                  <Skeleton className="w-full h-8 animate-wave" />
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <Skeleton className="w-3/4 h-6 animate-wave" />
               
                    <Skeleton className="w-1/3 h-4 animate-wave" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl">
              <div className="space-y-2 text-sm">
                  <Skeleton className="w-full h-12 animate-wave" />

                <div className="flex gap-2 pt-2">
                    <Skeleton className="w-12 h-4 animate-wave" />

                    <Skeleton className="w-16 h-4 animate-wave" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HeroLoader
