
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
  Github,
  Calendar,
  Star,
  Layers,
  FileImage,
  Pencil,
  Trash2,
  Building2,
  User,
  Clock,
  CheckCircle2,
  Code2,
  Sparkles,
  TrendingUp,
  Globe,
  Link2,
  ClipboardIcon
} from "lucide-react"
import { DeleteDialog } from "@/components/admin/delete-dialog"
import { useGetProjectBySlugQuery } from "@/lib/store/api/projects-api"
import { toast } from "sonner"

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter()
  const p = React.use(params)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { data: projectData, isLoading, isError } = useGetProjectBySlugQuery(p.slug)

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
    console.log("Deleting project:", params.id)
    setDeleteDialogOpen(false)
    router.push('/admin/projects')
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (isError || !projectData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="rounded-full bg-destructive/10 p-6 mb-4 inline-block">
            <Trash2 className="h-12 w-12 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
          <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/admin/projects')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </div>
      </div>
    )
  }

  const { project, image, technologies } = projectData.data

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
                  onClick={() => router.push('/admin/projects')}
                  className="rounded-full"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <span>Projects</span>
                    <span>/</span>
                    <span className="text-foreground font-medium">{project.slug}</span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight">{project.title}</h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {project.projectUrl && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(project.projectUrl!, "_blank")}
                    className="gap-2"
                  >
                    <Globe className="h-4 w-4" />
                    Visit Site
                  </Button>
                )}
                {project.githubUrl && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(project.githubUrl!, "_blank")}
                    className="gap-2"
                  >
                    <Github className="h-4 w-4" />
                    Repository
                  </Button>
                )}
                <Button
                  onClick={() => router.push(`/admin/projects/${project.id}/edit`)}
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
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute top-6 left-6 flex flex-wrap gap-3">
                    {project.isFeatured && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 shadow-2xl text-base py-2 px-4">
                        <Star className="h-4 w-4 mr-2 fill-current" />
                        Featured
                      </Badge>
                    )}
                    <Badge
                      variant={
                        project.status === "COMPLETED" ? "default" :
                          project.status === "IN_PROGRESS" ? "secondary" : "outline"
                      }
                      className="shadow-2xl text-base py-2 px-4 backdrop-blur-sm bg-background/80"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {project.status}
                    </Badge>
                  </div>

                  <div className="absolute top-6 right-6">
                    <Badge variant="secondary" className="shadow-2xl text-base py-2 px-4 backdrop-blur-sm bg-background/80">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Order #{project.order}
                    </Badge>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-end justify-between">
                      <div>
                        <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                          {project.title}
                        </h2>
                        <code className="text-sm text-white/90 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
                          /{project.slug}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Description */}
              <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-card to-card/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">About This Project</h3>
                    <p className="text-sm text-muted-foreground">Overview and details</p>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {project.description}
                </p>

                {project.richDescription && (
                  <>
                    <Separator className="my-6" />
                    <div className="prose prose-sm max-w-none">
                      <div
                        className="text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: project.richDescription }}
                      />
                    </div>
                  </>
                )}
              </Card>

              {/* Technologies */}
              {technologies.length > 0 && (
                <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-card to-card/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <Code2 className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Technology Stack</h3>
                      <p className="text-sm text-muted-foreground">
                        {technologies.length} {technologies.length === 1 ? 'technology' : 'technologies'} used
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {technologies.map((tech, index) => (
                      <Card
                        key={index}
                        className="p-4 border-2 hover:border-primary/50 transition-all hover:shadow-lg group cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          {tech.icon && (
                            <div className="text-2xl group-hover:scale-110 transition-transform">
                              {tech.icon}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{tech.name}</p>
                            {tech.category && (
                              <p className="text-xs text-muted-foreground truncate">
                                {tech.category}
                              </p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              )}

              {/* Image Details */}
              {/* Services */}
              {projectData.data.servicesData && projectData.data.servicesData.length > 0 && (
                <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-card to-card/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <Layers className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Related Services</h3>
                      <p className="text-sm text-muted-foreground">
                        {projectData.data.servicesData.length} {projectData.data.servicesData.length === 1 ? 'service' : 'services'} associated
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projectData.data.servicesData.map((serviceData, index) => (
                      <Card
                        key={index}
                        className="overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-xl group py-0"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={serviceData.image.url}
                            alt={serviceData.image.alt}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                          <div className="absolute top-3 left-3 flex gap-2">
                            {serviceData.service.isFeatured && (
                              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 shadow-lg">
                                <Star className="h-3 w-3 mr-1 fill-current" />
                                Featured
                              </Badge>
                            )}
                            {serviceData.service.isActive && (
                              <Badge variant="secondary" className="shadow-lg backdrop-blur-sm bg-background/80">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            )}
                          </div>

                          <div className="absolute bottom-3 left-3 right-3">
                            <h4 className="text-lg font-bold text-white mb-1 line-clamp-1">
                              {serviceData.service.name}
                            </h4>
                            <code className="text-xs text-white/80 bg-white/10 backdrop-blur-md px-2 py-1 rounded">
                              /{serviceData.service.slug}
                            </code>
                          </div>
                        </div>

                        <div className="p-4">
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {serviceData.service.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {serviceData.service.icon && (
                                <img
                                  src={serviceData.service.icon}
                                  alt={`${serviceData.service.name} icon`}
                                  className="h-6 w-6 rounded"
                                />
                              )}
                              <span className="text-lg font-bold text-primary">
                                ${serviceData.service.price}
                              </span>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/admin/services/${serviceData.service.slug}`)}
                              className="gap-2"
                            >
                              View Details
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>

                          {serviceData.service.order !== 0 && (
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-xs text-muted-foreground">
                                Display Order: <span className="font-semibold">#{serviceData.service.order}</span>
                              </p>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>

                </Card>
              )}

            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Client */}
              {(project.clientName || project.clientCompany) && (
                <Card className="p-6 border-0 shadow-xl bg-gradient-to-br from-primary/5 to-primary/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">CLIENT</p>
                      <h3 className="text-xl font-bold">
                        {project.clientName || project.clientCompany}
                      </h3>
                    </div>
                  </div>

                  {project.clientName && (
                    <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg mb-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Contact Person</p>
                        <p className="font-medium">{project.clientName}</p>
                      </div>
                    </div>
                  )}

                  {project.clientCompany && (
                    <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                      <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Company</p>
                        <p className="font-medium">{project.clientCompany}</p>
                      </div>
                    </div>
                  )}
                </Card>
              )}

              {/* Timeline */}
              {(project.startDate || project.endDate) && (
                <Card className="p-6 border-0 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Timeline</h3>
                      <p className="text-xs text-muted-foreground">Project duration</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {project.startDate && (
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Start Date</p>
                          <p className="font-semibold">{formatDate(project.startDate)}</p>
                        </div>
                      </div>
                    )}

                    {project.endDate && (
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <CheckCircle2 className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">End Date</p>
                          <p className="font-semibold">{formatDate(project.endDate)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Quick Links */}
              <Card className="p-6 border-0 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <Link2 className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Quick Links</h3>
                    <p className="text-xs text-muted-foreground">External resources</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {project.projectUrl && (
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 h-12"
                      onClick={() => window.open(project.projectUrl!, "_blank")}
                    >
                      <Globe className="h-4 w-4" />
                      <span>Visit Website</span>
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>
                  )}

                  {project.githubUrl && (
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 h-12"
                      onClick={() => window.open(project.githubUrl!, "_blank")}
                    >
                      <Github className="h-4 w-4" />
                      <span>Repository</span>
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>
                  )}

                  {!project.projectUrl && !project.githubUrl && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No external links
                    </p>
                  )}
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
                    <p className="text-xs text-muted-foreground mb-1">Project ID</p>
                    <code className="text-xs bg-muted px-2 py-1 rounded block truncate">
                      {project.id}
                    </code>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Created</p>
                    <p className="text-sm font-medium">{formatDate(project.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
                    <p className="text-sm font-medium">{formatDate(project.updatedAt)}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Image ID</p>
                    <code className="text-xs bg-muted px-2 py-1 rounded block truncate">
                      {project.imageId}
                    </code>
                  </div>
                </div>
              </Card>


              <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-card to-card/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <FileImage className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Image Details</h3>
                    <p className="text-sm text-muted-foreground">Asset information</p>
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

                <div className="flex flex-col">
                  <div>

                    <p className="text-xs text-muted-foreground mb-2">Filename</p>
                    <code className="text-sm bg-muted px-3 py-1.5 rounded  truncate flex justify-between items-center ">
                      {image.filename}
                      <ClipboardCopyButton value={image.filename} />
                    </code>
                  </div>
                  <div>

                    <p className="text-xs text-muted-foreground mb-2">File Hash</p>
                    <code className="text-sm bg-muted px-3 py-1.5 rounded  truncate flex justify-between items-center ">
                      {image.fileHash}
                      <ClipboardCopyButton value={image.fileHash} />
                    </code>
                  </div>
                  <div>

                    <p className="text-xs text-muted-foreground mb-2">Blur Hash</p>
                    <code className="text-sm bg-muted px-3 py-1.5 rounded  truncate flex justify-between items-center ">
                      {image.blurHash}
                      <ClipboardCopyButton value={image.blurHash} />
                    </code>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Storage Key</p>
                    <code className="text-sm bg-muted px-3 py-1.5 rounded  truncate flex justify-between items-center ">
                      {image.key}
                      <ClipboardCopyButton value={image.key} />
                    </code>
                  </div>
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
              <div className="h-10 w-10 rounded-full animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
              <div className="space-y-2">
                <div className="h-4 w-32 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
                <div className="h-6 w-48 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-32 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
              <div className="h-10 w-10 animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="h-[500px] rounded-2xl animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
            <div className="h-64 rounded-2xl animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
            <div className="h-96 rounded-2xl animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
          </div>
          <div className="space-y-6">
            <div className="h-48 rounded-2xl animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
            <div className="h-64 rounded-2xl animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
            <div className="h-48 rounded-2xl animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
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
      aria-label="Copy blur hash"
      title="Copy blur hash"
      className="inline-flex items-center justify-center p-2 rounded-md bg-muted/20 hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-shadow duration-150 cursor-pointer shadow-sm hover:shadow-md border border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      onClick={copy}
    >
      <ClipboardIcon className="h-4 w-4" />
    </button>
  )
}