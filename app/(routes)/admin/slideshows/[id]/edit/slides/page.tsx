
"use client"

import React from 'react'
import { RenderSlidesToEditExisting } from '../_comp/renderEditSlides'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Layers } from 'lucide-react'

const page = ({params} : { params: Promise<{ id: string }>}) => {
    const p = React.use(params)
    if(!p.id) return null
  return ( 
      <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/slideshows">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <div className='flex items-center justify-start gap-3'>

                    <Layers className="h-5 w-5 text-primary" />

                    <h1 className="text-3xl font-bold tracking-tight">Edit  Slides</h1>
                    </div>
                    <p className="text-muted-foreground">Update slideshow settings and slides</p>
                </div>
            </div>
            
            <RenderSlidesToEditExisting slideshowId={p.id} />
            
            </div>
  )
}

export default page
