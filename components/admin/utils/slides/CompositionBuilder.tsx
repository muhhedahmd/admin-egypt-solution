
"use client"

import {
  Zap,
  Grid3x3,
  Layers,
  Square,
  Maximize,
  Layers2,
  RotateCw,
  Wind,
  Repeat2,
  Cable as Cube,
  Grid,
  Bookmark,
  Lightbulb,
  ArrowRight,
} from "lucide-react"
import React, { } from "react"
import { Label } from "@/components/ui/label"
import { CompositionType, slide, } from "@/types/schema"
import { ArrangeSlidesDialog } from "./Arrange-slides"



interface CompositionBuilderProps {

  composition: string
  slides: slide[]
  setSlides: React.Dispatch<React.SetStateAction<slide[]>>
  onCompositionChange: React.Dispatch<React.SetStateAction<CompositionType>>
  setSelectedComposition: React.Dispatch<React.SetStateAction<CompositionType>>
  selectedComposition: CompositionType,
  isDialogOpen: boolean
  , setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>

}

export const COMPOSITIONS: {
  value: CompositionType
  label: string
  icon: any
  description: string
}[] = [
    {
      value: CompositionType.CAROUSEL,
      label: "Carousel",
      icon: Zap,
      description: "Slides transition one at a time",
    },
    {
      value: CompositionType.GRID,
      label: "Grid",
      icon: Grid3x3,
      description: "Display slides in a grid layout",
    },
    {
      value: CompositionType.STACKED,
      label: "Stacked",
      icon: Layers,
      description: "Slides stacked vertically",
    },
    {
      value: CompositionType.FADE,
      label: "Fade",
      icon: Square,
      description: "Slides fade in and out",
    },
    {
      value: CompositionType.SINGLE,
      label: "Single",
      icon: Square,
      description: "Display one slide at a time",
    },
    {
      value: CompositionType.ZOOM,
      label: "Zoom",
      icon: Maximize,
      description: "Smooth zoom in/out transitions",
    },
    {
      value: CompositionType.PARALLAX,
      label: "Parallax",
      icon: Wind,
      description: "Mouse-driven parallax depth effect",
    },
    {
      value: CompositionType.COVERFLOW,
      label: "Coverflow",
      icon: Layers2,
      description: "Apple-style 3D card rotation",
    },
    {
      value: CompositionType.KEN_BURNS,
      label: "Ken Burns",
      icon: RotateCw,
      description: "Cinematic zoom and pan effect",
    },
    {
      value: CompositionType.FLIP,
      label: "Flip",
      icon: Repeat2,
      description: "Card flip animation transitions",
    },
    {
      value: CompositionType.CUBE_ROTATION,
      label: "Cube",
      icon: Cube,
      description: "3D cube rotation between slides",
    },
    {
      value: CompositionType.AUTO_GRID,
      label: "Auto Grid",
      icon: Grid,
      description: "Responsive grid layout",
    },
    {
      value: CompositionType.STORY,
      label: "Story",
      icon: Bookmark,
      description: "Instagram Stories-style with progress bars",
    },
    {
      value: CompositionType.FILMSTRIP,
      label: "Filmstrip",
      icon: Lightbulb,
      description: "Large preview with scrolling thumbnails",
    },
    {
      value: CompositionType.LIGHTBOX,
      label: "Lightbox",
      icon: Maximize,
      description: "Grid thumbnails with modal lightbox",
    },
    {
      value: CompositionType.MARQUEE,
      label: "Marquee",
      icon: ArrowRight,
      description: "Continuous horizontal scrolling",
    },
  ]


export function CompositionBuilder({ isDialogOpen, setIsDialogOpen, setSlides, selectedComposition, composition, slides, onCompositionChange, setSelectedComposition }: CompositionBuilderProps) {




  const handleCompositionChange = (value: CompositionType) => {
    setSelectedComposition(value)
    onCompositionChange(value)
  }

  return (
    <div className="space-y-6">

      <div>
        <Label className="text-base font-semibold mb-4 block">Choose Layout Composition</Label>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 max-h-[70vh] overflow-y-auto pr-2">
          {COMPOSITIONS.map((comp) => {
            const Icon = comp.icon
            return (
              <button
                key={comp.value}
                onClick={() => handleCompositionChange(comp.value as CompositionType)}
                className={`p-4 rounded-lg border-2 transition-all text-center space-y-2 ${selectedComposition === comp.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
                  }`}
              >
                <Icon className="h-6 w-6 mx-auto" />
                <div className="text-sm font-medium">{comp.label}</div>
                <div className="text-xs text-muted-foreground">{comp.description}</div>
              </button>
            )
          })}
        </div>
      </div>
      {
        slides.length > 0 &&
        <div className="border-t pt-6 mt-4">
          <ArrangeSlidesDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            slides={slides}
            setSlides={setSlides}
          />        
          </div>

      }
    </div>
  )
}
