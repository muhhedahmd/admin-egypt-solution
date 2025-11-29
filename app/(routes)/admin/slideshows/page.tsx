"use client"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { SlideshowsTable } from "@/components/admin/slideshows-table"
import Link from "next/link"
import { useGetAllSlideShowsMinmalQuery } from "@/lib/store/api/slideShow-api"
import { Skeleton } from "@/components/ui/skeleton"
import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SlideshowReorderDialog } from "./_composnents/ReorderSlideShowDialog"
export default function SlideshowsPage() {

  const { 
    isError ,
    data , 
    isLoading ,
    
  }= useGetAllSlideShowsMinmalQuery()
  const senesor =  useSensors( 
    useSensor( PointerSensor, { activationConstraint: { distance: 8 } } )
  )
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Slideshows</h1>
          <p className="text-muted-foreground">Manage homepage and content slideshows</p>
        </div>
        <Button asChild>
          <Link href="/admin/slideshows/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Slideshow
          </Link>
        </Button>
        {
          isLoading  ? <Skeleton className="w-20 h-6 animate-wave"/>  :
          <SlideshowReorderDialog
            allSlideshows={data?.data}

            onDragEnd={() => { }}
            sensors={senesor}
          // onDragEnd={onDragEnd}
          />

        }

        
      </div>

      <SlideshowsTable />
    </div>
  )
}
