


import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import { Trash2, GripVertical, ArrowUpDown, CloudFog } from "lucide-react"
import { DndContext, closestCorners } from "@dnd-kit/core"
import { SortableContext, useSortable, rectSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from '@dnd-kit/utilities'
import { SlideShow } from "@/types/slideShows"
import { restrictToParentElement } from "@dnd-kit/modifiers"
import { useState } from "react"
import { toast } from "sonner"
import { useReorderBulkMutation } from "@/lib/store/api/slideShow-api"


export const SlideshowReorderDialog = ({ allSlideshows, onDragEnd, sensors, orderChanges }: {
  orderChanges?: { id: string, order: number }[]
  allSlideshows: Partial<SlideShow>[] | undefined,
  onDragEnd: any,
  sensors: any
}) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [Reorder, {
    isLoading,
    error,

  }] = useReorderBulkMutation()

  const handleSave = async () => {
    try {
      if (!orderChanges?.length) {
        toast.error("No changes made")
        return;
      }
      console.log(orderChanges)

      const res = await Reorder(orderChanges).unwrap()
      if (res.data) {
        toast.success("Slideshows reordered successfully")
        console.log(res.data)
      }

    } catch (error) {
      console.log(error)
      toast.error("Failed to reorder slideshows")
    }
  }

  if (!allSlideshows) return null
  return (
    <Dialog open={dialogOpen || isLoading} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"} className="w-fit min-w-fit cursor-pointer" >
          <GripVertical className="w-5 h-5" /> Arrange
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">

        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5" />
            Reorder Slideshows
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          {allSlideshows.length &&
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragEnd={onDragEnd}
              modifiers={[restrictToParentElement]}

            >
              <SortableContext
                items={allSlideshows.map((s) => s.id!)}
                strategy={rectSortingStrategy}
              >
                <div className="space-y-2">
                  {allSlideshows.map((item) => (
                    <SortableItem key={item.id} slideshow={{ ...item, id: item.id! }} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          }
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button disabled={isLoading} variant="outline" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleSave}>

            {
              isLoading ?
                <CloudFog className="w-5 h-5 animate-spin" /> :
                (
                  <div className="flex items-center gap-2"> 

                    <ArrowUpDown className="w-5 h-5" />
                    save
                  </div>
                )
            }
          </Button>
        </div>
      </DialogContent>

    </Dialog>
  )
}

const SortableItem = ({ slideshow }: {

  slideshow: any
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slideshow.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-3 ${isDragging ? 'shadow-lg' : ''}`}
    >
      <div className="flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded transition-colors"
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs">
              #{slideshow.order}
            </Badge>
            <h4 className="font-semibold truncate">
              {slideshow.title}
            </h4>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {slideshow.type}
            </Badge>

          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            Edit
          </Button>
          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
