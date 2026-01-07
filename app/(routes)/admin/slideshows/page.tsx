"use client"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { minimalSlide, useGetAllSlideShowsMinmalQuery } from "@/lib/store/api/slideShow-api"
import { Skeleton } from "@/components/ui/skeleton"
import { DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SlideshowReorderDialog } from "./_composnents/ReorderSlideShowDialog"

import dynamic from "next/dynamic"
import { useEffect, useMemo, useState } from "react"
import { arrayMove } from "@dnd-kit/sortable"
const SlideShowTable = dynamic(
  () => import("@/components/admin/slideshows-table").then((mod) => mod.SlideshowsTable),
  { ssr: false }
);

export default function SlideshowsPage() {

  const {
    data,
    isLoading,
  } = useGetAllSlideShowsMinmalQuery()


  const senesor = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )
  const [slidesShowToOrder, setSlidesShowToOrder] = useState<minimalSlide[]>([])
  const [isDragging, setIsDragging] = useState(false);
  const [draggingSlide, setDraggingSlide] = useState<any | null>(null);

  useEffect(() => {


    if (data?.data) setSlidesShowToOrder(data?.data)
  }, [data?.data])

  const handleDragEnd = (event: DragEndEvent) => {


    setIsDragging(false);
    setDraggingSlide(null);

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSlidesShowToOrder((prevSlides) => {
      const oldIndex = prevSlides.findIndex(s => String(s.id) === String(active.id));
      const newIndex = prevSlides.findIndex(s => String(s.id) === String(over.id));

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        return prevSlides;
      }

      const updatedSlides = arrayMove(prevSlides, oldIndex, newIndex);
      return updatedSlides.map((s, index) => ({ ...s, order: index + 1 }));
    });
  };


  const orderChanges = useMemo(() => {
     if (!slidesShowToOrder || !data?.data) return
    const orderChanges = data.data.map((item)=>{
      const currentChanged = slidesShowToOrder.find(s => s.id === item.id)
      if(!currentChanged) return []
      const isOrderChanged = currentChanged?.order !== item.order
      if(isOrderChanged) {
        return { id: item.id, order: currentChanged.order }
      }
      return []
    }).flat()
    return orderChanges
  } , [slidesShowToOrder])

  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Slideshows</h1>
          <p className="text-muted-foreground">Manage homepage and content slideshows</p>
        </div>
        <div className="flex items-center justify-start gap-4">

          <Button asChild>
            <Link href="/admin/slideshows/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Slideshow
            </Link>
          </Button>
          {
            isLoading || !slidesShowToOrder ? <Skeleton className="w-20 h-6 animate-wave" /> :
              <SlideshowReorderDialog
                allSlideshows={slidesShowToOrder}
                onDragEnd={handleDragEnd}
                orderChanges={orderChanges} 
                sensors={senesor}
              />

          }

        </div>


      </div>

      <SlideShowTable />
    </div>
  )
}
