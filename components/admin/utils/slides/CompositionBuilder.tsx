
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
import React, { useState } from "react"
import { Label } from "@/components/ui/label"
import {  GripVertical,  } from "lucide-react"
import { ClientWithRelationsSlide, CompositionType, ProjectWithRelationsSlide, ServiceWithImage, slide, TeamMemberWithImage, TestimonialWithImage,  } from "@/types/schema"
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, UniqueIdentifier, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ClientCard, ProjectCard, ServiceCard, TeamMemberCard, TestimonialCard } from "./compositionBuliderCards"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import TypeToSquareRender from "../ArrangMinmalCard"



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
          />        </div>

      }
    </div>
  )
}

const ArrangeSlidesDialog = ({

  isOpen,
  onClose,
  slides,
  setSlides
}: {
  isOpen: boolean;
  onClose: () => void;
  slides: any[];
  setSlides: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggingSlide, setDraggingSlide] = useState<any | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    setDraggingSlide(null);

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSlides((prevSlides) => {
      const oldIndex = prevSlides.findIndex(s => String(s.id) === String(active.id));
      const newIndex = prevSlides.findIndex(s => String(s.id) === String(over.id));

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        return prevSlides;
      }

      const updatedSlides = arrayMove(prevSlides, oldIndex, newIndex);
      return updatedSlides.map((s, index) => ({ ...s, _order: index + 1 }));
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
    const found = slides.find(s => s.id === event.active.id);
    if (found) setDraggingSlide(found);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>

      <DialogContent className="w-[95vw] min-w-[95vw] h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Grid3x3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="block">Arrange Slides</span>
              <span className="text-sm font-normal text-muted-foreground">
                {slides.length} {slides.length === 1 ? 'slide' : 'slides'} • Drag to reorder
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="w-full mx-auto">
            {slides.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Grid3x3 className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-medium">No slides to arrange</p>
              </div>
            ) : (
              <DndContext

                modifiers={[restrictToParentElement]}
                sensors={sensors}
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
              >
                <SortableContext
                  items={slides.map(s => s.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
                    {slides.map((slide, index) => (
                      <SortableItem key={slide.id} slide={slide}>
                        <TypeToSquareRender slide={slide} index={index} />
                      </SortableItem>
                    ))}
                  </div>
                </SortableContext>

                <DragOverlay>
                  {isDragging && draggingSlide ? (
                    <div className="w-32 opacity-95">
                      <SortableItem key={draggingSlide.id} slide={draggingSlide}>
                        <TypeToSquareRender slide={draggingSlide} index={slides.indexOf(draggingSlide)} />

                      </SortableItem>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-muted/30">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};




function SortableItem({


  slide,
  children
}: { slide: slide, children: React.ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: slide.id,
    transition: {
      duration: 150, // milliseconds
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <SortableRow
      setNodeRef={setNodeRef}
      attributes={attributes}
      listeners={listeners}
      style={style}
    >
      {children}
    </SortableRow>
  );
}





const SortableRow: React.FC<{

  setNodeRef: (el: HTMLElement | null) => void;
  style?: React.CSSProperties;
  attributes?: any;
  listeners?: any;
  children: React.ReactNode;
}> = ({ setNodeRef, style, attributes, listeners, children }) => {
  return (
    <div
      ref={setNodeRef}
      style={style}
      className=" relative flex items-center w-full gap-3 p-2 rounded-lg hover:bg-muted transition"
    >
      <button
        type="button"
        aria-label="Drag to reorder"
        title="Drag to reorder"
        {...attributes}
        {...listeners} className="z-20  top-[15%] left-[18%] -translate-x-1/2 -translate-y-1/2 absolute flex items-center justify-center p-1 rounded-md bg-muted/80 duration-150 transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary cursor-grab active:cursor-grabbing"
      >
        <GripVertical />
      </button>

      {/* Content: full-width so the handle is the only drag activator */}
      <div

        className="flex-1 w-full">
        {children}
      </div>
    </div>
  );
};


export const TypeToRender = ({ slide  , imaged , minmal , split , index , story }: {
  slide: slide ,
  imaged ?: boolean ,
  minmal ?: boolean, 
  split ?: boolean,
  index ?: number,
  story?:boolean
}) => {


  if (slide?.type === "service") {
    return <ServiceCard data={slide as ServiceWithImage} imaged={imaged} story={story} />
  }
  if (slide?.type === "project") {
    return <ProjectCard  imagePosition="left" data={slide as ProjectWithRelationsSlide} split={split}  index={index || 0} story={story} />
  }
  if (slide.type === "client") {
    return <ClientCard data={slide as ClientWithRelationsSlide} />
  }
  if (slide.type === "testimonial") {
    return <TestimonialCard data={slide as TestimonialWithImage} minmal={minmal} />
  }
  if (slide.type === "team") {
    return <TeamMemberCard data={slide as TeamMemberWithImage} />
  }
  return <div />
}
