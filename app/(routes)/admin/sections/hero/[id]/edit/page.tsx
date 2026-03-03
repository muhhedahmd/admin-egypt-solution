"use client"

import React from 'react'
import { useGetHeroByIdQuery } from '@/lib/store/api/hero-api'
import { HeroEditor } from '../../_comp/new/hero-editor'
import { useLanguage } from '@/providers/lang'

interface PageProps {
    params: Promise<{ id: string }>
}

const Page = ({ params }: PageProps) => {
    const p = React.use(params)
    const {currentLang }= useLanguage()
    const { data, isLoading, error } = useGetHeroByIdQuery({id : p.id , lang :  currentLang})
    console.log(
        data
    )

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-destructive mb-2">Error Loading Hero</h2>
                    <p className="text-muted-foreground">Failed to load hero data</p>
                </div>
            </div>
        )
    }

    return <HeroEditor initialData={data?.data as any} />
}

export default Page