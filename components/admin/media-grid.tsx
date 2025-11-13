"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Download, Trash2, ExternalLink } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const mockMedia = [
  {
    id: 1,
    name: "hero-banner.jpg",
    type: "image",
    size: "2.4 MB",
    url: "/hero-background.jpg",
    uploadedAt: "2024-01-15",
  },
  {
    id: 2,
    name: "team-photo.jpg",
    type: "image",
    size: "1.8 MB",
    url: "/team-collaboration.jpg",
    uploadedAt: "2024-01-14",
  },
  {
    id: 3,
    name: "product-demo.mp4",
    type: "video",
    size: "45.2 MB",
    url: "/video-thumbnail.png",
    uploadedAt: "2024-01-13",
  },
  {
    id: 4,
    name: "client-logo.png",
    type: "image",
    size: "156 KB",
    url: "/company-logo.jpg",
    uploadedAt: "2024-01-12",
  },
  {
    id: 5,
    name: "office-space.jpg",
    type: "image",
    size: "3.1 MB",
    url: "/modern-office.jpg",
    uploadedAt: "2024-01-11",
  },
  {
    id: 6,
    name: "project-mockup.jpg",
    type: "image",
    size: "2.7 MB",
    url: "/design-mockup.jpg",
    uploadedAt: "2024-01-10",
  },
]

export function MediaGrid() {
  const [media] = useState(mockMedia)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {media.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <div className="aspect-video bg-muted relative">
            <img src={item.url || "/placeholder.svg"} alt={item.name} className="object-cover w-full h-full" />
            <div className="absolute top-2 right-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="font-medium text-sm truncate">{item.name}</div>
              <Badge variant="outline" className="shrink-0">
                {item.type}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{item.size}</span>
              <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
