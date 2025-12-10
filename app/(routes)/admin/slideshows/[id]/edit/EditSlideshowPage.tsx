
"use client"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGetSlideShowByIdQuery, usePaginatedSlidesMutation } from "@/lib/store/api/slideShow-api"
import { SlideshowFormSkeleton } from "@/components/admin/utils/slide-show-loader"
import EditSlideShowForm from "./_comp/edit-slideshow-form"

export default function EditSlideshowPage({ params }
    : { params: { id: string } }) {

    const { data: slideshow, isLoading } = useGetSlideShowByIdQuery(params.id)


    if(!slideshow || isLoading) return <SlideshowFormSkeleton />
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/slideshows">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Slideshow</h1>
                    <p className="text-muted-foreground">Update slideshow settings and slides</p>
                </div>
            </div>

           {slideshow.data
           
           && <EditSlideShowForm SlideShow={slideshow?.data} />
           }

        </div>
    )
}

