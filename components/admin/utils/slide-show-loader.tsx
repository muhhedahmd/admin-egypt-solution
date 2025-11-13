
"use client"

import { cn } from "@/lib/utils"

interface SlideshowFormSkeletonProps {
  className?: string
}

export function SlideshowFormSkeleton({ className }: SlideshowFormSkeletonProps) {
  const skeletonDelay = (index: number) => ({
    animationDelay: `${index * 0.1}s`,
  })

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-6", className)}>
      {/* Form Section */}
      <div className="lg:col-span-2 space-y-6">
        <div className="p-6 space-y-6 bg-card rounded-lg border border-border">
          {/* Basic Settings Header */}
          <div className="space-y-4">
            <div className="h-6 w-32 bg-muted rounded animate-wave" style={skeletonDelay(0)} />

            {/* Title Input */}
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted rounded animate-wave" style={skeletonDelay(1)} />
              <div className="h-10 w-full bg-muted rounded animate-wave" style={skeletonDelay(2)} />
            </div>

            {/* Description Textarea */}
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted rounded animate-wave" style={skeletonDelay(3)} />
              <div className="h-20 w-full bg-muted rounded animate-wave" style={skeletonDelay(4)} />
            </div>

            {/* Type and Status Selects */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 w-16 bg-muted rounded animate-wave" style={skeletonDelay(5)} />
                <div className="h-10 w-full bg-muted rounded animate-wave" style={skeletonDelay(6)} />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-16 bg-muted rounded animate-wave" style={skeletonDelay(7)} />
                <div className="h-10 w-full bg-muted rounded animate-wave" style={skeletonDelay(8)} />
              </div>
            </div>
          </div>

          {/* Autoplay Settings */}
          <div className="space-y-4 border-t pt-6">
            <div className="h-6 w-40 bg-muted rounded animate-wave" style={skeletonDelay(9)} />

            <div className="h-5 w-32 bg-muted rounded animate-wave" style={skeletonDelay(10)} />

            <div className="space-y-2">
              <div className="h-4 w-28 bg-muted rounded animate-wave" style={skeletonDelay(11)} />
              <div className="h-10 w-full bg-muted rounded animate-wave" style={skeletonDelay(12)} />
            </div>
          </div>

          {/* Slides Management */}
          <div className="space-y-4 border-t pt-6">
            <div className="h-10 w-40 bg-muted rounded animate-wave" style={skeletonDelay(13)} />

            <div className="border-t pt-6">
              <div className="h-5 w-20 bg-muted rounded animate-wave mb-4" style={skeletonDelay(14)} />
              <div className="h-64 w-full bg-muted rounded animate-wave" style={skeletonDelay(15)} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 border-t pt-6">
            <div className="h-10 flex-1 bg-muted rounded animate-wave" style={skeletonDelay(16)} />
            <div className="h-10 flex-1 bg-muted rounded animate-wave" style={skeletonDelay(17)} />
          </div>
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="lg:col-span-1">
        <div className="p-4 bg-card rounded-lg border border-border sticky top-6">
          <div className="h-6 w-32 bg-muted rounded animate-wave mb-4" style={skeletonDelay(18)} />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-20 bg-muted rounded animate-wave" style={skeletonDelay(19 + i)} />
                <div className="h-5 w-24 bg-muted rounded animate-wave" style={skeletonDelay(20 + i)} />
              </div>
            ))}
          </div>
        </div>

        {/* Composition Builder */}
        <div className="space-y-4 border-t pt-6">
          <div className="h-5 w-40 bg-muted rounded animate-wave" style={skeletonDelay(25)} />
          <div className="grid grid-cols-2 gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded animate-wave" style={skeletonDelay(26 + i)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
