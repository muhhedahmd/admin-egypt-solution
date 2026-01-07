"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    ArrowLeft,
    User,
    Star,
    Clock,
    Pencil,
    Trash2,
    CheckCircle2,
    Briefcase,
    Building2,
    Quote,
    Award,
    Sparkles
} from "lucide-react"
import { DeleteDialog } from "@/components/admin/delete-dialog"
import { toast } from "sonner"
import BlurredImage from "@/app/_comp/BlurredHashImage"
import { useDeleteTestimonialMutation, useGetTestimonialByIdQuery } from "@/lib/store/api/testimonials-api"

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const p = React.use(params)

    const { data: testimonialData, isLoading, isError } = useGetTestimonialByIdQuery(p.id)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    const formatDate = (date: string) => {
        if (!date) return null
        return new Date(date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / 1048576).toFixed(1) + ' MB'
    }

    const [del, { isLoading: isLoadingDelete, isError: isErrorDelete }] = useDeleteTestimonialMutation()

    const handleDelete = async (id: string) => {
        try {
            await del(id
            ).then(res => {
                if (res.data) {
                    setDeleteId(null)
                    router.push('/admin/testimonials')
                    toast.success("Service deleted successfully!")
                    //   setAllClient(prev => prev.filter(s => s.client.id !== id))
                }
            })
        } catch (error) {
            toast.error("Failed to delete service. Please try again.")
        }
    }


    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-5 w-5 ${i < rating
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-muted-foreground/30'
                    }`}
            />
        ))
    }

    if (isLoading) {
        return <LoadingSkeleton />
    }

    if (isError || !testimonialData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="rounded-full bg-destructive/10 p-6 mb-4 inline-block">
                        <User className="h-12 w-12 text-destructive" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Testimonial Not Found</h2>
                    <p className="text-muted-foreground mb-6">The testimonial you're looking for doesn't exist.</p>
                    <Button onClick={() => router.push('/admin/testimonials')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Testimonials
                    </Button>
                </div>
            </div>
        )
    }

    const { testimonial, Avatar } = testimonialData.data

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
                {/* Sticky Header */}
                <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => router.push('/admin/testimonials')}
                                    className="rounded-full"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                        <span>Testimonials</span>
                                        <span>/</span>
                                        <span className="text-foreground font-medium">{testimonial.clientName}</span>
                                    </div>
                                    <h1 className="text-2xl font-bold tracking-tight">{testimonial.clientName}</h1>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => router.push(`/admin/testimonials/${testimonial.id}/edit`)}
                                    className="gap-2"
                                >
                                    <Pencil className="h-4 w-4" />
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => setDeleteId(testimonial.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Hero Card */}
                            <Card className="overflow-hidden border-0 shadow-2xl">
                                <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background p-12">
                                    <div className="absolute top-6 left-6 flex flex-wrap gap-3">
                                        {testimonial.isFeatured && (
                                            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 shadow-2xl text-base py-2 px-4">
                                                <Star className="h-4 w-4 mr-2 fill-current" />
                                                Featured
                                            </Badge>
                                        )}
                                        {testimonial.isActive && (
                                            <Badge
                                                variant="default"
                                                className="shadow-2xl text-base py-2 px-4 backdrop-blur-sm "
                                            >
                                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                                Active
                                            </Badge>
                                        )}
                                    </div>



                                    <div className="flex flex-col items-center text-center pt-16">
                                        {Avatar && (
                                            <div className="mb-6 relative">
                                                <div className="h-32 w-32 rounded-full ring-4 ring-background shadow-2xl overflow-hidden">
                                                    <BlurredImage
                                                        imageUrl={Avatar.url || ""}
                                                        alt={Avatar.alt || ""}
                                                        width={Avatar.width || 0}
                                                        height={Avatar.height || 0}
                                                        blurhash={Avatar.blurHash || ""}
                                                        quality={100}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="absolute -bottom-2 -right-2 h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-xl">
                                                    <Quote className="h-6 w-6 text-primary-foreground" />
                                                </div>
                                            </div>
                                        )}

                                        <h2 className="text-4xl font-bold mb-2">{testimonial.clientName}</h2>
                                        <p className="text-lg text-muted-foreground mb-1">{testimonial.clientPosition}</p>
                                        <p className="text-md text-muted-foreground/80 mb-4">{testimonial.clientCompany}</p>

                                        <div className="flex items-center gap-1 mb-6">
                                            {renderStars(testimonial.rating)}
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Testimonial Content */}
                            <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-card to-card/50">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Quote className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">Testimonial</h3>
                                        <p className="text-sm text-muted-foreground">Client feedback</p>
                                    </div>
                                </div>

                                <div className="relative">
                                    <Quote className="absolute -top-4 -left-2 h-16 w-16 text-primary/10" />
                                    <blockquote className="text-lg text-muted-foreground leading-relaxed italic pl-8">
                                        "{testimonial.content}"
                                    </blockquote>
                                </div>
                            </Card>

                            {/* Rating Breakdown */}
                            <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-card to-card/50">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                        <Sparkles className="h-6 w-6 text-amber-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">Rating</h3>
                                        <p className="text-sm text-muted-foreground">Customer satisfaction</p>
                                    </div>
                                </div>

                                <Card className="p-6 border-2 hover:border-primary/50 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col items-center">
                                            <div className="text-6xl font-bold text-primary mb-2">
                                                {testimonial.rating}.0
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {renderStars(testimonial.rating)}
                                            </div>
                                        </div>
                                        <Separator orientation="vertical" className="h-20" />
                                        <div className="flex-1">
                                            <p className="text-sm text-muted-foreground mb-2">Overall Rating</p>
                                            <div className="space-y-2">
                                                {[5, 4, 3, 2, 1].map((star) => (
                                                    <div key={star} className="flex items-center gap-2">
                                                        <span className="text-xs w-8">{star} ★</span>
                                                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-amber-500 transition-all"
                                                                style={{
                                                                    width: star <= testimonial.rating ? '100%' : '0%'
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Card>

                            {/* Client Information */}
                            <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-card to-card/50">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                        <User className="h-6 w-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">Client Information</h3>
                                        <p className="text-sm text-muted-foreground">Professional details</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card className="p-6 border-2 hover:border-primary/50 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                                <Briefcase className="h-6 w-6 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Position</p>
                                                <p className="font-semibold">{testimonial.clientPosition}</p>
                                            </div>
                                        </div>
                                    </Card>

                                    <Card className="p-6 border-2 hover:border-primary/50 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                                                <Building2 className="h-6 w-6 text-green-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Company</p>
                                                <p className="font-semibold">{testimonial.clientCompany}</p>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </Card>

                            {/* Avatar Details */}
                            {Avatar && (
                                <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-card to-card/50">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                            <Award className="h-6 w-6 text-purple-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold">Avatar Details</h3>
                                            <p className="text-sm text-muted-foreground">Profile image information</p>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <div className="h-32 w-32 rounded-full bg-muted/50 mx-auto overflow-hidden ring-4 ring-muted/20">
                                            <BlurredImage
                                                imageUrl={Avatar.url || ""}
                                                alt={Avatar.alt || ""}
                                                width={Avatar.width || 0}
                                                height={Avatar.height || 0}
                                                blurhash={Avatar.blurHash || ""}
                                                quality={100}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        <div className="p-4 bg-muted/50 rounded-lg">
                                            <p className="text-xs text-muted-foreground mb-1">Dimensions</p>
                                            <p className="font-semibold">{Avatar.width} × {Avatar.height}</p>
                                        </div>
                                        <div className="p-4 bg-muted/50 rounded-lg">
                                            <p className="text-xs text-muted-foreground mb-1">File Size</p>
                                            <p className="font-semibold">{formatFileSize(Avatar?.size || 1)}</p>
                                        </div>
                                        <div className="p-4 bg-muted/50 rounded-lg">
                                            <p className="text-xs text-muted-foreground mb-1">Format</p>
                                            <p className="font-semibold uppercase">{Avatar.type.split('/')[1]}</p>
                                        </div>
                                        <div className="p-4 bg-muted/50 rounded-lg">
                                            <p className="text-xs text-muted-foreground mb-1">Type</p>
                                            <p className="font-semibold">{Avatar.imageType}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-2">Filename</p>
                                            <code className="text-sm bg-muted px-3 py-1.5 rounded flex justify-between items-center">
                                                <span className="truncate">{Avatar.filename}</span>
                                                {/* <ClipboardCopyButton value={Avatar.filename} /> */}
                                            </code>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-2">File Hash</p>
                                            <code className="text-sm bg-muted px-3 py-1.5 rounded flex justify-between items-center">
                                                <span className="truncate">{Avatar.fileHash}</span>
                                                {/* <ClipboardCopyButton value={Avatar.fileHash} /> */}
                                            </code>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-2">Blur Hash</p>
                                            <code className="text-sm bg-muted px-3 py-1.5 rounded flex justify-between items-center">
                                                <span className="truncate">{Avatar.blurHash}</span>
                                                {/* <ClipboardCopyButton value={Avatar.blurHash || ""} /> */}
                                            </code>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-2">Storage Key</p>
                                            <code className="text-sm bg-muted px-3 py-1.5 rounded flex justify-between items-center">
                                                <span className="truncate">{Avatar.key}</span>
                                                {/* <ClipboardCopyButton value={Avatar.key} /> */}
                                            </code>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {/* Slideshow Associations */}
                            {/* {testimonial.slideShows && testimonial.slideShows.length > 0 && (
                                <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-card to-card/50">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                            <Sparkles className="h-6 w-6 text-indigo-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold">Slideshow Associations</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {testimonial.slideShows.length} slideshow{testimonial.slideShows.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>


                                </Card>
                            )} */}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Status */}
                            <Card className="p-6 border-0 shadow-xl bg-gradient-to-br from-primary/5 to-primary/10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                                        <User className="h-8 w-8 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">TESTIMONIAL STATUS</p>
                                        <h3 className="text-xl font-bold">
                                            {testimonial.isActive ? 'Active' : 'Inactive'}
                                        </h3>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 rounded-lg">
                                        <CheckCircle2 className={`h-5 w-5 ${testimonial.isActive ? 'text-green-500' : 'text-muted-foreground'}`} />
                                        <div className="flex-1">
                                            <p className="text-xs text-muted-foreground">Status</p>
                                            <p className="font-medium">{testimonial.isActive ? 'Active' : 'Inactive'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                                        <Star className={`h-5 w-5 ${testimonial.isFeatured ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'}`} />
                                        <div className="flex-1">
                                            <p className="text-xs text-muted-foreground">Featured</p>
                                            <p className="font-medium">{testimonial.isFeatured ? 'Yes' : 'No'}</p>
                                        </div>
                                    </div>



                                    <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                                        <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                                        <div className="flex-1">
                                            <p className="text-xs text-muted-foreground">Rating</p>
                                            <p className="font-medium">{testimonial.rating} / 5 Stars</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Metadata */}
                            <Card className="p-6 border-0 shadow-xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-12 w-12 rounded-xl bg-gray-500/10 flex items-center justify-center">
                                        <Clock className="h-6 w-6 text-gray-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">Metadata</h3>
                                        <p className="text-xs text-muted-foreground">System info</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Testimonial ID</p>
                                        <code className="text-xs bg-muted px-2 py-1 rounded block truncate">
                                            {testimonial.id}
                                        </code>
                                    </div>
                                    <Separator />
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Created</p>
                                        <p className="text-sm font-medium">{formatDate(testimonial.createdAt as any)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
                                        <p className="text-sm font-medium">{formatDate(testimonial.updatedAt as any)}</p>
                                    </div>
                                    <Separator />
                                    {Avatar && (
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Avatar ID</p>
                                            <code className="text-xs bg-muted px-2 py-1 rounded block truncate">
                                                {testimonial.avatarId}
                                            </code>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteDialog
                isLoading={isLoadingDelete}
                isError={isErrorDelete}
                open={deleteId !== null}
                onOpenChange={(open) => !open && setDeleteId(null)}
                onConfirm={async () => await handleDelete(deleteId!)}
                title="Delete Project"
                description="Are you sure you want to delete this project? This action cannot be undone."
            />
        </>
    )
}

function LoadingSkeleton() {

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full animate-pulse bg-muted" />
                            <div className="space-y-2">
                                <div className="h-4 w-32 animate-pulse bg-muted rounded" />
                                <div className="h-6 w-48 animate-pulse bg-muted rounded" />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="h-10 w-32 animate-pulse bg-muted rounded" />
                            <div className="h-10 w-10 animate-pulse bg-muted rounded" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="h-96 rounded-2xl animate-pulse bg-muted" />
                        <div className="h-64 rounded-2xl animate-pulse bg-muted" />
                        <div className="h-48 rounded-2xl animate-pulse bg-muted" />
                    </div>
                    <div className="space-y-6">
                        <div className="h-64 rounded-2xl animate-pulse bg-muted" />
                        <div className="h-48 rounded-2xl animate-pulse bg-muted" />
                    </div>
                </div>
            </div>
        </div>
    )
}