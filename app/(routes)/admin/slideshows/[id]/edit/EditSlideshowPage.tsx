
"use client"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SlideshowForm } from "@/components/admin/slideshow-form"
import { useGetSlideShowByIdQuery, usePaginatedSlidesMutation } from "@/lib/store/api/slideShow-api"
import { SlideShow } from "@/types/slideShows"
import { useEffect } from "react"
import { SlideshowFormSkeleton } from "@/components/admin/utils/slide-show-loader"

export default function EditSlideshowPage({ params }
    : { params: { id: string } }) {



    const { data: slideshow , isLoading } = useGetSlideShowByIdQuery(params.id)
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

            <RenderSlides isLoadingSlideShow={isLoading} slideshow={slideshow?.data} />
        </div>
    )
}

const RenderSlides = ({ slideshow  , isLoadingSlideShow}: { isLoadingSlideShow: boolean, slideshow: SlideShow | undefined }) => {

    const [getSlides, {
        isLoading, isError,
        data : slides,
        error

    }] = usePaginatedSlidesMutation()

    useEffect(() => {
        if (slideshow && slideshow.id) {
            getSlides({ id: slideshow.id, page: 1, perPage: 100, pagesPerType: {} })
        }
    }, [slideshow])
    if (!slideshow) return null
    if (isLoading || isLoadingSlideShow)  return <div> <SlideshowFormSkeleton /></div>
    
    return <>
        <SlideshowForm initialData={slideshow} slidesForEdit={slides?.data} />

    </>

}