import { useGetSlideShowByIdQuery, usePaginatedSlidesMutation } from '@/lib/store/api/slideShow-api'
import React, { memo, useEffect, useState } from 'react'
import { EditAndRemoveExisitSlides } from './EditAndRemoveExisitSlides'
import { Card, CardContent } from '@/components/ui/card'

export const RenderSlidesToEditExisting = memo(({   slideshowId }: { slideshowId: string }) => {
    const [getSlides, {
        isLoading, isError,
        data: slides,
        error,

    }] = usePaginatedSlidesMutation()
        const { data: slideshow, isLoading : slideshowLoading } = useGetSlideShowByIdQuery(slideshowId)

    useEffect(() => {
        if (slideshowId) {
            getSlides({ id: slideshowId, page: 1, perPage: 100, pagesPerType: {} })
        }
    }, [slideshowId])

    const reFetch = () => {
        if (slideshowId) {
            getSlides({ id: slideshowId, page: 1, perPage: 100, pagesPerType: {} })
        }
    }

    if (isLoading || slideshowLoading) return <Card className='  overflow-y-auto h-[78vh]'>
        <CardContent  className='grid grid-cols-1  gap-4   sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 w-full'>
        {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className=" flex-col p-3  rounded-xl min-h-70  bg-muted  flex gap-4 pb-4">
                <div className="h-3/4 w-full rounded-md animate-wave" />
                <div className='flex gap-3 flex-col w-full mt-14 '>
                <div className="h-3 w-2/3 rounded-md animate-wave" />
                <div className="h-3 w-2/4 rounded-md animate-wave" />
                </div>
            </div>
        ))}
        </CardContent>

    </Card>
    if (!slideshowId || !slides) return null
    return <>
        <EditAndRemoveExisitSlides composititonType={slideshow?.data.composition} reFetch={reFetch} slidesData={slides.data} slideshowId={slideshowId} />
    </>
})

RenderSlidesToEditExisting.displayName = "RenderSlidesToEditExisting"
