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
    Star,
    FileImage,
    Pencil,
    Trash2,
    Clock,
    CheckCircle2,
    User,
    Mail,
    Phone,
    Linkedin,
    Github,
    Twitter,
    TrendingUp,
    Users,
    ClipboardIcon,
    Briefcase,
    MapPin
} from "lucide-react"
import { DeleteDialog } from "@/components/admin/delete-dialog"
import { useGetTeamMemberByIdQuery } from "@/lib/store/api/team-api"
import { toast } from "sonner"
import Image from "next/image"

export default function TeamMemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const p = React.use(params)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    const { data: memberData, isLoading, isError } = useGetTeamMemberByIdQuery(p.id)
console.log({
    memberData
})
    const formatDate = (date?: string) => {
        if (!date) return null
        return new Date(date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const formatFileSize = (bytes: number) => {
        if (!bytes) return '0 B'
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / 1048576).toFixed(1) + ' MB'
    }

    const handleDelete = () => {
        console.log("Deleting team member:", memberData?.data.teamMember.id)
        setDeleteDialogOpen(false)
        router.push('/admin/team')
    }

    if (isLoading) {
        return <LoadingSkeleton />
    }

    if (isError || !memberData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="rounded-full bg-red-50 dark:bg-red-950 p-6 mb-4 inline-block">
                        <Users className="h-12 w-12 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Team Member Not Found</h2>
                    <p className="text-muted-foreground mb-6">The team member you're looking for doesn't exist.</p>
                    <Button onClick={() => router.push('/admin/team')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Team
                    </Button>
                </div>
            </div>
        )
    }

    const {
        Image : memberImage,
        teamMember
    } = memberData.data

    return (
        <>
            <div className="min-h-screen bg-background">
                {/* Sticky Header */}
                <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => router.push('/admin/team')}
                                    className="rounded-full"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                        <span>Team</span>
                                        <span>/</span>
                                        <span className="text-foreground font-medium">{teamMember.slug}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-2xl font-bold tracking-tight">{teamMember.name}</h1>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => router.push(`/admin/team/${teamMember.id}/edit`)}
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
                            {/* Profile Card */}
                            <Card className="overflow-hidden border shadow-sm">
                                <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-8">
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        {teamMember.isFeatured && (
                                            <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-0 shadow-sm">
                                                <Star className="h-3 w-3 mr-1 fill-current" />
                                                Featured
                                            </Badge>
                                        )}
                                        <Badge
                                            variant={teamMember.isActive ? "default" : "secondary"}
                                            className="shadow-sm"
                                        >
                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                            {teamMember.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                        {/* Avatar */}
                                        <div className="relative">
                                            <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-background shadow-xl">
                                                {memberImage ? (
                                                    <Image
                                                        src={memberImage.url}
                                                        alt={memberImage.alt || teamMember.name}
                                                        width={128}
                                                        height={128}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center bg-slate-200 dark:bg-slate-700">
                                                        <User className="h-16 w-16 text-slate-400 dark:text-slate-500" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1">
                                            <h2 className="text-3xl font-bold mb-2">{teamMember.name}</h2>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                                                <p className="text-lg text-muted-foreground">{teamMember.position}</p>
                                            </div>
                                            <code className="text-sm bg-background px-3 py-1.5 rounded border">
                                                /{teamMember.slug}
                                            </code>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact & Social */}
                                <div className="p-6 space-y-4">
                                    {/* Contact Info */}
                                    {(teamMember.email || teamMember.phone) && (
                                        <div className="space-y-3">
                                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Contact</h3>
                                            {teamMember.email && (
                                                <a
                                                    href={`mailto:${teamMember.email}`}
                                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group"
                                                >
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Email</p>
                                                        <p className="font-medium">{teamMember.email}</p>
                                                    </div>
                                                </a>
                                            )}
                                            {teamMember.phone && (
                                                <a
                                                    href={`tel:${teamMember.phone}`}
                                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group"
                                                >
                                                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Phone</p>
                                                        <p className="font-medium">{teamMember.phone}</p>
                                                    </div>
                                                </a>
                                            )}
                                        </div>
                                    )}

                                    {/* Social Links */}
                                    {(teamMember.linkedin || teamMember.github || teamMember.twitter) && (
                                        <>
                                            <Separator />
                                            <div className="space-y-3">
                                                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Social Media</h3>
                                                <div className="flex gap-3">
                                                    {teamMember.linkedin && (
                                                        <a
                                                            href={teamMember.linkedin}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-950 hover:bg-blue-200 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 transition-all hover:scale-110"
                                                        >
                                                            <Linkedin className="h-5 w-5" />
                                                        </a>
                                                    )}
                                                    {teamMember.github && (
                                                        <a
                                                            href={teamMember.github}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all hover:scale-110"
                                                        >
                                                            <Github className="h-5 w-5" />
                                                        </a>
                                                    )}
                                                    {teamMember.twitter && (
                                                        <a
                                                            href={teamMember.twitter}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-center h-12 w-12 rounded-full bg-sky-100 dark:bg-sky-950 hover:bg-sky-200 dark:hover:bg-sky-900 text-sky-600 dark:text-sky-400 transition-all hover:scale-110"
                                                        >
                                                            <Twitter className="h-5 w-5" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </Card>

                            {/* Biography */}
                            {teamMember.bio && (
                                <Card className="p-8 border shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                                            <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold">About</h3>
                                            <p className="text-sm text-muted-foreground">Biography</p>
                                        </div>
                                    </div>

                                    <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                        {teamMember.bio}
                                    </p>
                                </Card>
                            )}

                            {/* Image Details */}
                            {memberImage && (
                                <Card className="p-8 border shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">
                                            <FileImage className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold">Image Details</h3>
                                            <p className="text-sm text-muted-foreground">Profile photo information</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        {memberImage.width && memberImage.height && (
                                            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                                <p className="text-xs text-muted-foreground mb-1">Dimensions</p>
                                                <p className="font-semibold">{memberImage.width} × {memberImage.height}</p>
                                            </div>
                                        )}
                                        {memberImage.size && (
                                            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                                <p className="text-xs text-muted-foreground mb-1">File Size</p>
                                                <p className="font-semibold">{formatFileSize(memberImage.size)}</p>
                                            </div>
                                        )}
                                        {memberImage.type && (
                                            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                                <p className="text-xs text-muted-foreground mb-1">Format</p>
                                                <p className="font-semibold uppercase">{memberImage.type.split('/')[1]}</p>
                                            </div>
                                        )}
                                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                            <p className="text-xs text-muted-foreground mb-1">Type</p>
                                            <p className="font-semibold">{memberImage.imageType || 'TEAM'}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {memberImage.filename && (
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-2">Filename</p>
                                                <code className="text-sm bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded flex justify-between items-center">
                                                    <span className="truncate">{memberImage.filename}</span>
                                                    <ClipboardCopyButton value={memberImage.filename} />
                                                </code>
                                            </div>
                                        )}
                                        {memberImage.fileHash && (
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-2">File Hash</p>
                                                <code className="text-sm bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded flex justify-between items-center">
                                                    <span className="truncate">{memberImage.fileHash}</span>
                                                    <ClipboardCopyButton value={memberImage.fileHash} />
                                                </code>
                                            </div>
                                        )}
                                        {memberImage.blurHash && (
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-2">Blur Hash</p>
                                                <code className="text-sm bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded flex justify-between items-center">
                                                    <span className="truncate">{memberImage.blurHash}</span>
                                                    <ClipboardCopyButton value={memberImage.blurHash} />
                                                </code>
                                            </div>
                                        )}
                                        {memberImage.key && (
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-2">Storage Key</p>
                                                <code className="text-sm bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded flex justify-between items-center">
                                                    <span className="truncate">{memberImage.key}</span>
                                                    <ClipboardCopyButton value={memberImage.key} />
                                                </code>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Member Info */}
                            <Card className="p-6 border shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                                        <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">Member Info</h3>
                                        <p className="text-xs text-muted-foreground">Quick details</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                        <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-950 flex items-center justify-center">
                                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Status</p>
                                            <p className="font-semibold">{teamMember.isActive ? "Active" : "Inactive"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                        <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
                                            <Star className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Featured</p>
                                            <p className="font-semibold">{teamMember.isFeatured ? "Yes" : "No"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                        <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                                            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Display Order</p>
                                            <p className="font-semibold">#{teamMember.order}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Metadata */}
                            <Card className="p-6 border shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                                        <Clock className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">Metadata</h3>
                                        <p className="text-xs text-muted-foreground">System info</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Member ID</p>
                                        <code className="text-xs bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded block truncate">
                                            {teamMember.id}
                                        </code>
                                    </div>
                                    <Separator />
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Created</p>
                                        <p className="text-sm font-medium">{formatDate(teamMember.createdAt as unknown as string)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
                                        <p className="text-sm font-medium">{formatDate(teamMember.updatedAt as unknown as string )}</p>
                                    </div>
                                    {teamMember.imageId && (
                                        <>
                                            <Separator />
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Image ID</p>
                                                <code className="text-xs bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded block truncate">
                                                    {teamMember.imageId}
                                                </code>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </Card>

                            {/* Quick Actions */}
                            <Card className="p-6 border shadow-sm">
                                <h3 className="font-bold mb-4">Quick Actions</h3>
                                <div className="space-y-2">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start gap-2"
                                        onClick={() => router.push(`/admin/team/${teamMember.id}/edit`)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                        Edit Member
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start gap-2 text-red-600 hover:text-red-600 dark:text-red-400 dark:hover:text-red-400"
                                        onClick={() => setDeleteDialogOpen(true)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Delete Member
                                    </Button>
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
                isLoading={isLoading}
                isError={isError}
                title="Delete Team Member"
                description={`Are you sure you want to delete ${teamMember.name}? This action cannot be undone.`}
            />
        </>
    )
}

function LoadingSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full animate-pulse bg-slate-200 dark:bg-slate-800" />
                            <div className="space-y-2">
                                <div className="h-4 w-32 animate-pulse bg-slate-200 dark:bg-slate-800 rounded" />
                                <div className="h-6 w-48 animate-pulse bg-slate-200 dark:bg-slate-800 rounded" />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="h-10 w-24 animate-pulse bg-slate-200 dark:bg-slate-800 rounded" />
                            <div className="h-10 w-10 animate-pulse bg-slate-200 dark:bg-slate-800 rounded" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="h-80 rounded-xl animate-pulse bg-slate-200 dark:bg-slate-800" />
                        <div className="h-64 rounded-xl animate-pulse bg-slate-200 dark:bg-slate-800" />
                        <div className="h-96 rounded-xl animate-pulse bg-slate-200 dark:bg-slate-800" />
                    </div>
                    <div className="space-y-6">
                        <div className="h-64 rounded-xl animate-pulse bg-slate-200 dark:bg-slate-800" />
                        <div className="h-48 rounded-xl animate-pulse bg-slate-200 dark:bg-slate-800" />
                        <div className="h-32 rounded-xl animate-pulse bg-slate-200 dark:bg-slate-800" />
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
            className="inline-flex items-center justify-center p-2 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-all duration-150 cursor-pointer ml-2"
            onClick={copy}
        >
            <ClipboardIcon className="h-4 w-4" />
        </button>
    )
}