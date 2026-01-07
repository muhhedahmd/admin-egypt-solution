"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    ArrowLeft,
    ExternalLink,
    Building2,
    Star,
    Globe,
    Clock,
    Pencil,
    Trash2,
    CheckCircle2,
    TrendingUp,
    Briefcase,
    Image as ImageIcon,
    Award,
    ClipboardIcon
} from "lucide-react"
import { DeleteDialog } from "@/components/admin/delete-dialog"
import { useGetClientByIdQuery } from "@/lib/store/api/client-api"
import { toast } from "sonner"
import BlurredImage from "@/app/_comp/BlurredHashImage"

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const p = React.use(params)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    const { data: clientData, isLoading, isError } = useGetClientByIdQuery(p.id)

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

    const handleDelete = () => {
        console.log("Deleting client:", p.id)
        setDeleteDialogOpen(false)
        router.push('/admin/clients')
    }

    if (isLoading) {
        return <LoadingSkeleton />
    }

    if (isError || !clientData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="rounded-full bg-destructive/10 p-6 mb-4 inline-block">
                        <Building2 className="h-12 w-12 text-destructive" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Client Not Found</h2>
                    <p className="text-muted-foreground mb-6">The client you're looking for doesn't exist.</p>
                    <Button onClick={() => router.push('/admin/clients')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Clients
                    </Button>
                </div>
            </div>
        )
    }

    const { client, image, logo } = clientData.data

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
                                    onClick={() => router.push('/admin/clients')}
                                    className="rounded-full"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                        <span>Clients</span>
                                        <span>/</span>
                                        <span className="text-foreground font-medium">{client.slug}</span>
                                    </div>
                                    <h1 className="text-2xl font-bold tracking-tight">{client.name}</h1>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {client.website && (
                                    <Button
                                        variant="outline"
                                        onClick={() => window.open(client.website!, "_blank")}
                                        className="gap-2"
                                    >
                                        <Globe className="h-4 w-4" />
                                        Visit Website
                                    </Button>
                                )}
                                <Button
                                    onClick={() => router.push(`/admin/clients/${client.id}/edit`)}
                                    className="gap-2"
                                >
                                    <Pencil className="h-4 w-4" />
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => setDeleteDialogOpen(true)}
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
                            {/* Hero Image */}
                            <Card className="overflow-hidden border-0 shadow-2xl">
                                <div className="relative h-[500px] group">
                                    {
                                        image &&
                                        <BlurredImage
                                            imageUrl={image.url || ""}
                                            alt={image.alt || ""}
                                            width={image.width || 0}
                                            height={image.height || 0}
                                            blurhash={image.blurHash || ""}
                                            quality={100}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    }
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                    <div className="absolute top-6 left-6 flex flex-wrap gap-3">
                                        {client.isFeatured && (
                                            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 shadow-2xl text-base py-2 px-4">
                                                <Star className="h-4 w-4 mr-2 fill-current" />
                                                Featured
                                            </Badge>
                                        )}
                                        {client.isActive && (
                                            <Badge
                                                variant="default"
                                                className="shadow-2xl text-base py-2 px-4 backdrop-blur-sm bg-background/80"
                                            >
                                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                                Active
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="absolute top-6 right-6">
                                        <Badge variant="secondary" className="shadow-2xl text-base py-2 px-4 backdrop-blur-sm bg-background/80">
                                            <TrendingUp className="h-4 w-4 mr-2" />
                                            Order #{client.order}
                                        </Badge>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-8">
                                        <div className="flex items-end justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-4">
                                                    {logo && (
                                                        <div className="h-16 w-16 rounded-xl bg-white/10 backdrop-blur-md p-2 border border-white/20">
                                                            <BlurredImage
                                                                imageUrl={logo.url || ""}
                                                                alt={logo.alt || ""}
                                                                width={logo.width || 0}
                                                                height={logo.height || 0}
                                                                blurhash={logo.blurHash || ""}
                                                                quality={100}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                                                            {client.name}
                                                        </h2>
                                                        <code className="text-sm text-white/90 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
                                                            /{client.slug}
                                                        </code>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Description */}
                            <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-card to-card/50">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Building2 className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">About {client.name}</h3>
                                        <p className="text-sm text-muted-foreground">Company overview</p>
                                    </div>
                                </div>

                                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                                    {client.description}
                                </p>

                                {client.richDescription && (
                                    <>
                                        <Separator className="my-6" />
                                        <div className="prose prose-sm max-w-none">
                                            <div
                                                className="text-muted-foreground leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: client.richDescription }}
                                            />
                                        </div>
                                    </>
                                )}
                            </Card>

                            {/* Industry */}
                            {client.industry && (
                                <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-card to-card/50">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                            <Briefcase className="h-6 w-6 text-blue-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold">Industry</h3>
                                            <p className="text-sm text-muted-foreground">Business sector</p>
                                        </div>
                                    </div>

                                    <Card className="p-6 border-2 hover:border-primary/50 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                                <Award className="h-8 w-8 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Operating in</p>
                                                <p className="text-2xl font-bold">{client.industry}</p>
                                            </div>
                                        </div>
                                    </Card>
                                </Card>
                            )}

                            {/* Image Details - Main Image */}
                            <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-card to-card/50">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                        <ImageIcon className="h-6 w-6 text-purple-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">Main Image Details</h3>
                                        <p className="text-sm text-muted-foreground">Hero image information</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="p-4 bg-muted/50 rounded-lg">
                                        <p className="text-xs text-muted-foreground mb-1">Dimensions</p>
                                        <p className="font-semibold">{image.width} × {image.height}</p>
                                    </div>
                                    <div className="p-4 bg-muted/50 rounded-lg">
                                        <p className="text-xs text-muted-foreground mb-1">File Size</p>
                                        <p className="font-semibold">{formatFileSize(image.size)}</p>
                                    </div>
                                    <div className="p-4 bg-muted/50 rounded-lg">
                                        <p className="text-xs text-muted-foreground mb-1">Format</p>
                                        <p className="font-semibold uppercase">{image.type.split('/')[1]}</p>
                                    </div>
                                    <div className="p-4 bg-muted/50 rounded-lg">
                                        <p className="text-xs text-muted-foreground mb-1">Type</p>
                                        <p className="font-semibold">{image.imageType}</p>
                                    </div>
                                </div>

                                {
                                    image &&

                                    <div className="space-y-3">

                                        <div>
                                            <p className="text-xs text-muted-foreground mb-2">Filename</p>
                                            <code className="text-sm bg-muted px-3 py-1.5 rounded flex justify-between items-center">
                                                <span className="truncate">{image.filename}</span>
                                                <ClipboardCopyButton value={image.filename} />
                                            </code>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-2">File Hash</p>
                                            <code className="text-sm bg-muted px-3 py-1.5 rounded flex justify-between items-center">
                                                <span className="truncate">{image.fileHash}</span>
                                                <ClipboardCopyButton value={image.fileHash} />
                                            </code>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-2">Blur Hash</p>
                                            <code className="text-sm bg-muted px-3 py-1.5 rounded flex justify-between items-center">
                                                <span className="truncate">{image.blurHash}</span>
                                                <ClipboardCopyButton value={image.blurHash || ""} />
                                            </code>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-2">Storage Key</p>
                                            <code className="text-sm bg-muted px-3 py-1.5 rounded flex justify-between items-center">
                                                <span className="truncate">{image.key}</span>
                                                <ClipboardCopyButton value={image.key} />
                                            </code>
                                        </div>
                                    </div>
                                }
                            </Card>

                            {/* Logo Details */}
                            {logo && (
                                <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-card to-card/50">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                                            <Award className="h-6 w-6 text-green-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold">Logo Details</h3>
                                            <p className="text-sm text-muted-foreground">Brand logo information</p>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <div className="h-32 w-32 rounded-xl bg-muted/50 p-4 mx-auto flex items-center justify-center">
                                            <BlurredImage
                                                imageUrl={logo.url || ""}
                                                alt={logo.alt || ""}
                                                width={logo.width || 0}
                                                height={logo.height || 0}
                                                blurhash={logo.blurHash || ""}
                                                quality={100}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        <div className="p-4 bg-muted/50 rounded-lg">
                                            <p className="text-xs text-muted-foreground mb-1">Dimensions</p>
                                            <p className="font-semibold">{logo.width} × {logo.height}</p>
                                        </div>
                                        <div className="p-4 bg-muted/50 rounded-lg">
                                            <p className="text-xs text-muted-foreground mb-1">File Size</p>
                                            <p className="font-semibold">{formatFileSize(logo?.size || 0)}</p>
                                        </div>
                                        <div className="p-4 bg-muted/50 rounded-lg">
                                            <p className="text-xs text-muted-foreground mb-1">Format</p>
                                            <p className="font-semibold uppercase">{logo.type.split('/')[1]}</p>
                                        </div>
                                        <div className="p-4 bg-muted/50 rounded-lg">
                                            <p className="text-xs text-muted-foreground mb-1">Type</p>
                                            <p className="font-semibold">{logo.imageType}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-2">Filename</p>
                                            <code className="text-sm bg-muted px-3 py-1.5 rounded flex justify-between items-center">
                                                <span className="truncate">{logo.filename}</span>
                                                <ClipboardCopyButton value={logo.filename} />
                                            </code>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-2">Storage Key</p>
                                            <code className="text-sm bg-muted px-3 py-1.5 rounded flex justify-between items-center">
                                                <span className="truncate">{logo.key}</span>
                                                <ClipboardCopyButton value={logo.key} />
                                            </code>
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <Card className="p-6 border-0 shadow-xl bg-gradient-to-br from-primary/5 to-primary/10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Building2 className="h-8 w-8 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">CLIENT STATUS</p>
                                        <h3 className="text-xl font-bold">
                                            {client.isActive ? 'Active Client' : 'Inactive'}
                                        </h3>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                                        <CheckCircle2 className={`h-5 w-5 ${client.isActive ? 'text-green-500' : 'text-muted-foreground'}`} />
                                        <div className="flex-1">
                                            <p className="text-xs text-muted-foreground">Status</p>
                                            <p className="font-medium">{client.isActive ? 'Active' : 'Inactive'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                                        <Star className={`h-5 w-5 ${client.isFeatured ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'}`} />
                                        <div className="flex-1">
                                            <p className="text-xs text-muted-foreground">Featured</p>
                                            <p className="font-medium">{client.isFeatured ? 'Yes' : 'No'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                                        <TrendingUp className="h-5 w-5 text-muted-foreground" />
                                        <div className="flex-1">
                                            <p className="text-xs text-muted-foreground">Display Order</p>
                                            <p className="font-medium">#{client.order}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Quick Links */}
                            {client.website && (
                                <Card className="p-6 border-0 shadow-xl">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                            <Globe className="h-6 w-6 text-orange-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold">Website</h3>
                                            <p className="text-xs text-muted-foreground">External link</p>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full justify-start gap-3 h-12"
                                        onClick={() => window.open(client.website!, "_blank")}
                                    >
                                        <Globe className="h-4 w-4" />
                                        <span>Visit Website</span>
                                        <ExternalLink className="h-3 w-3 ml-auto" />
                                    </Button>
                                </Card>
                            )}

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
                                        <p className="text-xs text-muted-foreground mb-1">Client ID</p>
                                        <code className="text-xs bg-muted px-2 py-1 rounded block truncate">
                                            {client.id}
                                        </code>
                                    </div>
                                    <Separator />
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Created</p>
                                        <p className="text-sm font-medium">{formatDate(client.createdAt as any )}</p>

                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
                                        <p className="text-sm font-medium">{formatDate(client.updatedAt as any)}</p>
                                    </div>
                                    <Separator />
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Image ID</p>
                                        <code className="text-xs bg-muted px-2 py-1 rounded block truncate">
                                            {client.imageId}
                                        </code>
                                    </div>
                                    {logo && (
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Logo ID</p>
                                            <code className="text-xs bg-muted px-2 py-1 rounded block truncate">
                                                {client.logoId}
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
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDelete}
                title="Delete Client"
                description="Are you sure you want to delete this client? This action cannot be undone."
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
                        <div className="h-[500px] rounded-2xl animate-pulse bg-muted" />
                        <div className="h-64 rounded-2xl animate-pulse bg-muted" />
                        <div className="h-96 rounded-2xl animate-pulse bg-muted" />
                    </div>
                    <div className="space-y-6">
                        <div className="h-48 rounded-2xl animate-pulse bg-muted" />
                        <div className="h-32 rounded-2xl animate-pulse bg-muted" />
                        <div className="h-64 rounded-2xl animate-pulse bg-muted" />
                    </div>
                </div>
            </div>
        </div>
    )
}

function ClipboardCopyButton({ value }: { value: string }) {
    const copy = () => {
        navigator.clipboard.writeText(value)
        toast("Copied to clipboard", {
            icon: "📋",
            description: value
        })
    }

    return (
        <button
            type="button"
            aria-label="Copy to clipboard"
            title="Copy to clipboard"
            className="inline-flex items-center justify-center p-2 rounded-md bg-muted/20 hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-all duration-150 cursor-pointer shadow-sm hover:shadow-md border border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            onClick={copy}
        >
            <ClipboardIcon className="h-4 w-4" />
        </button>
    )
}