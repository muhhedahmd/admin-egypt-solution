import React from 'react'

import { Card } from "@/components/ui/card"
const ServiceNewLoader = () => {

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            {/* Header Skeleton */}
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
                <div className="  px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
                            <div className="space-y-2">
                                <div className="h-4 w-32 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
                                <div className="h-6 w-48 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
                            </div>
                        </div>
                        <div className="h-10 w-32 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
                    </div>
                </div>
            </header>

            {/* Form Content Skeleton */}
            <div className="   px-4 py-8">
                <div className="  flex flex-wrap w-full space-y-8">

                    {/* Basic Information Card */}
                    <div className='flex flex-col w-3/4 p-2'>

                        <Card className="p-6 w-full ">
                            <div className="space-y-6">
                                <div className="h-7 w-48 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Service Name */}
                                    <div className="space-y-2">
                                        <div className="h-4 w-24 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
                                        <div className="h-10 w-full animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
                                    </div>

                                    {/* Slug */}
                                    <div className="space-y-2">
                                        <div className="h-4 w-16 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
                                        <div className="h-10 w-full animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2 md:col-span-2">
                                        <div className="h-4 w-28 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
                                        <div className="h-24 w-full animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Rich Description Card */}
                        <Card className="p-6 w-full mt-2">
                            <div className="space-y-6">
                                <div className="h-7 w-40 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />

                                <div className="space-y-2">
                                    <div className="h-4 w-32 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
                                    <div className="h-48 w-full animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className='flex flex-col gap-2 p-2 w-1/4'>


                        {/* Image Upload Card */}
                        <Card className="p-6 w-full h-1/2">
                            <div className="space-y-6">
                                <div className="h-7 w-36 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />

                                <div className="border-2 border-dashed rounded-lg p-12">
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="h-12 w-12 rounded-full animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
                                        <div className="h-4 w-32 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
                                        <div className="h-3 w-48 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Icon Upload Card */}
                        <Card className="p-6 w-full h-1/2 ">
                            <div className="space-y-6">
                                <div className="h-7 w-32 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="border-2 border-dashed rounded-lg p-8">
                                        <div className="flex flex-col items-center space-y-3">
                                            <div className="h-10 w-10 rounded animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
                                            <div className="h-3 w-24 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>



                    <div className='flex w-full -mt-5 flex-wrap items-end justify-end gap-2'>


                    {/* Pricing & Settings Card */}
                    <Card className="p-6 w-full ">
                        <div className="space-y-6">
                            <div className="h-7 w-44 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Price */}
                                <div className="space-y-2">
                                    <div className="h-4 w-20 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
                                    <div className="h-10 w-full animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
                                </div>

                                {/* Display Order */}
                                <div className="space-y-2">
                                    <div className="h-4 w-28 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
                                    <div className="h-10 w-full animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
                                </div>

                                {/* Active Switch */}
                                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                    <div className="h-4 w-24 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
                                    <div className="h-6 w-11 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded-full" />
                                </div>

                                {/* Featured Switch */}
                                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                    <div className="h-4 w-32 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
                                    <div className="h-6 w-11 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded-full" />
                                </div>
                            </div>
                        </div>
                    </Card>



                    {/* Action Buttons */}
                    <div className="flex self-end items-center justify-end gap-4 pt-6">
                        <div className="h-10 w-24 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
                        <div className="h-10 w-32 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
                    </div>
                    </div>

                </div>
            </div>
        </div>
    )
}


export default ServiceNewLoader

