"use client"

import { Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"

export function SlidesLoader() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 overflow-hidden pb-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="flex-shrink-0 p-4 border animate-pulse" style={{ width: "300px" }}>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-20" />
              <div className="h-3 bg-muted rounded w-32" />
              <div className="w-full h-32 bg-muted rounded-md" />
              <div className="flex gap-2">
                <div className="h-6 bg-muted rounded w-16" />
                <div className="h-6 bg-muted rounded w-20" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function SlidesErrorState({ message = "Failed to load slides" }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-12 px-4">
      <div className="text-center">
        <p className="text-destructive font-medium">{message}</p>
        <p className="text-sm text-muted-foreground mt-2">Please try again or contact support</p>
      </div>
    </div>
  )
}

export function SlidesEmptyState() {
  return (
    <div className="flex items-center justify-center py-12 px-4">
      <div className="text-center">
        <Loader2 className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
        <p className="text-muted-foreground">No slides added yet</p>
      </div>
    </div>
  )
}
