
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
  ClipboardIcon,
  ArrowRight
} from "lucide-react"
import { DeleteDialog } from "@/components/admin/delete-dialog"
import { useDeleteProjectMutation, useGetProjectBySlugQuery } from "@/lib/store/api/projects-api"
import { toast } from "sonner"
import { Service, Technology } from "@/types/schema"
import BlurredImage from "@/app/_comp/BlurredHashImage"
import { Image } from "@/types/services"
import { useLanguage } from "@/providers/lang"
import { projectDetailsI18n } from "@/i18n/project"
import NextImage from "next/image"

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter()
  const p = React.use(params)
  const { currentLang , isRTL } = useLanguage()

  const { data: projectData, isLoading, isError } = useGetProjectBySlugQuery({projectSlug: p.slug  })
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [del, { isLoading: isLoadingDelete, isError: isErrorDelete }] = useDeleteProjectMutation()

  const t = projectDetailsI18n[currentLang ?.toLowerCase() as 'en' | 'ar' || "en"]

  const formatDate = (date: string | Date) => {
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

  const handleDelete = async (id: string) => {
    try {
      await del(id
      ).then(res => {
        if (res.data) {
          toast.success("Service deleted successfully!")
          setDeleteId(null)
          router.push('/admin/projects')
        }
      })


    } catch (error) {
      toast.error("Failed to delete service. Please try again.")
    }
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
          <h2 className="text-2xl font-bold mb-2">{t.states.notFound.title}</h2>
          <p className="text-muted-foreground mb-6">{t.states.notFound.description}</p>
          <Button onClick={() => router.push('/admin/projects')}>
            {
              isRTL ? 
              <ArrowRight className="mr-2 h-4 w-4" />
              :<ArrowLeft className="mr-2 h-4 w-4" />
            }
            {t.actions.back}
          </Button>
        </div>
      </div>
    )
  }

  const { project, image, technologies  , translation} = projectData.data
  const currentTranslation = translation.find((t) => t?.lang === currentLang)
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Sticky Header */}
        <div className=" border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push('/admin/projects')}
                  className="rounded-full"
                >
                  {
                    isRTL ? 
                    <ArrowRight className="h-5 w-5" />
                    :<ArrowLeft className="h-5 w-5" />
                  }
                  
                </Button>
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <span>{t.breadcrumb.projects}</span>
                    <span>/</span>
                    <span className="text-foreground font-medium">{project.slug}</span>
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight">{currentTranslation?.title}</h1>
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
                    {t.actions.visitSite}
                  </Button>
                )}
                {project.githubUrl && (
                  <Button
                  variant="outline"
                    onClick={() => window.open(project.githubUrl!, "_blank")}
                    className="gap-2"
                  >
                    <Github className="h-4 w-4" />
                    {t.actions.repository}
                  </Button>
                )}
                <Button
                  onClick={() => router.push(`/admin/projects/${project.slug}/edit`)}
                  className="gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  {t.actions.edit}
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => setDeleteId(project.id!)}
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
                    image && <BlurredImage
                      alt={image?.alt || `${currentTranslation?.title}-alt`}
                      imageUrl={image?.url}
                      height={image.height || 400}
                      width={image.width || 800}
                      quality={70}
                      blurhash={image?.blurHash
                      }
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"


                    />
                  }
                  <NextImage
                    src={image?.url || ""}
                    alt={image?.alt || ""}
                    width={image?.width || 800}
                    height={image?.height || 400}
                    quality={70}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute top-6 left-6 flex flex-wrap gap-3">
                    {project.isFeatured && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 shadow-2xl text-base py-2 px-4">
                        <Star className="h-4 w-4 mr-2 fill-current" />
                        {t.badges.featured}
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
                      { t.status[project.status]}
                    </Badge>
                  </div>

                

                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-end justify-between">
                      <div>
                        <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                          {currentTranslation?.title}
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
                    <h3 className="text-2xl font-bold">{t.sections.about.title}</h3>
                    <p className="text-sm text-muted-foreground">{t.sections.about.subtitle}</p>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {currentTranslation?.description}
                </p>

                {currentTranslation?.richDescription && (
                  <>
                    <Separator className="my-6" />
                    <div className="prose prose-sm max-w-none">
                      <div
                        className="text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: currentTranslation?.richDescription }}
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
                      <h3 className="text-2xl font-bold">{t.sections.technologies.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {technologies.length} {technologies.length === 1 ? t.sections.technologies.used(technologies.length): t.sections.technologies.used(technologies.length)} 
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {technologies?.map((tech: Technology, index: number) => (
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
              {projectData?.data?.servicesData && projectData?.data?.servicesData.length > 0 && (
                <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-card to-card/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <Layers className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{t.sections.services.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {projectData?.data?.servicesData.length} {t.sections.services.associated(projectData.data.servicesData.length) }
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projectData.data.servicesData.map((serviceData: { service: Service, image: Image }, index: number) => (
                      <Card
                        key={index}
                        className="overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-xl group py-0"
                      >
                        <div className="relative h-48 overflow-hidden">

                          {
                            serviceData.image &&
                            <BlurredImage
                              imageUrl={serviceData.image.url || ""}
                              alt={serviceData.image.alt || serviceData?.service.name || "Service Image"}
                              width={serviceData.image.width || 400}
                              height={serviceData.image.height || 400}
                              blurhash={serviceData.image.blurHash ||
                                ""
                              }
                              quality={100}

                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          }
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                          <div className="absolute top-3 left-3 flex gap-2">
                            {serviceData.service.isFeatured && (
                              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 shadow-lg">
                                <Star className="h-3 w-3 mr-1 fill-current" />
                                {t.badges.featured}
                              </Badge>
                            )}
                            {serviceData.service.isActive && (
                              <Badge variant="secondary" className="shadow-lg backdrop-blur-sm bg-background/80">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                {t.badges.active}
                                
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
                              {serviceData.service.icon?.startsWith && serviceData.service.icon.startsWith("http") ? (
                                <img
                                  src={serviceData.service.icon}
                                  alt={`${serviceData.service.name} icon`}
                                  className="h-6 w-6 rounded"
                                />
                              ) :
                                (
                                  <span>
                                    {serviceData.service.icon}
                                  </span>
                                )}
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate">{serviceData.service.name}</p>

                              </div>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/admin/services/${serviceData.service.slug}`)}
                              className="gap-2"
                            >
                              {t.actions.viewDetails}
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>

                       
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
                      <p className="text-xs text-muted-foreground"> { t.sections.client}</p>
                      <h3 className="text-xl font-bold">
                        {project.clientName || project.clientCompany}
                      </h3>
                    </div>
                  </div>

                  {project.clientName && (
                    <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg mb-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">{t.sections.client}</p>
                        <p className="font-medium">{project.clientName}</p>
                      </div>
                    </div>
                  )}

                  {project.clientCompany && (
                    <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                      <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">{t.badges.clientCompany}</p>
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
                      <h3 className="text-lg font-bold">{t.sections.timeline.title}</h3>
                      <p className="text-xs text-muted-foreground">{t.sections.timeline.subtitle}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {project.startDate && (
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{t.sections.timeline.start}</p>
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
                          <p className="text-xs text-muted-foreground">{t.sections.timeline.end}</p>
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
                    <h3 className="text-lg font-bold">{t.sections.links.title}</h3>
                    <p className="text-xs text-muted-foreground">{t.sections.links.subtitle}</p>
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
                      <span>{t.actions.visitSite}</span>
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
                      <span>{t.actions.repository}</span>
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>
                  )}

                  {!project.projectUrl && !project.githubUrl && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      {t.states.noLinks}
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
                    <h3 className="text-lg font-bold">{t.sections.metadata.title}</h3>
                    <p className="text-xs text-muted-foreground">{t.sections.metadata.subtitle}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{t.sections.metadata.projectId}</p>
                    <code className="text-xs bg-muted px-2 py-1 rounded block truncate">
                      {project.id}
                    </code>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{t.sections.metadata.created}</p>
                    <p className="text-sm font-medium">{formatDate(project.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{t.sections.metadata.updated}</p>
                    <p className="text-sm font-medium">{formatDate(project.updatedAt)}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{t.sections.metadata.imageId}</p>
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
                    <h3 className="text-2xl font-bold">{t.sections.image.title}</h3>
                    <p className="text-sm text-muted-foreground">{t.sections.image.subtitle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">{t.sections.image.dimensions}</p>
                    <p className="font-semibold">{image?.width} × {image?.height}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">{t.sections.image.size}</p>
                    <p className="font-semibold">{formatFileSize(image?.size || 0)}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">{t.sections.image.type}</p>
                    <p className="font-semibold uppercase">{image?.type.split('/')[1]}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">{t.sections.image.format}</p>
                    <p className="font-semibold">{image?.imageType || "Unknown"}</p>
                  </div>
                </div>
                {
                  image &&
                  <div className="flex flex-col">
                    <div>

                      <p className="text-xs text-muted-foreground mb-2">{t.sections.image.filename}</p>
                      <code className="text-sm bg-muted px-3 py-1.5 rounded  truncate flex justify-between items-center ">
                        {image.filename}
                        <ClipboardCopyButton value={image.filename} />
                      </code>
                    </div>
                    <div>

                      <p className="text-xs text-muted-foreground mb-2">{t.sections.image.fileHash}</p>
                      <code className="text-sm bg-muted px-3 py-1.5 rounded  truncate flex justify-between items-center ">
                        {image.fileHash}
                        <ClipboardCopyButton value={image.fileHash} />
                      </code>
                    </div>
                    <div>

                      <p className="text-xs text-muted-foreground mb-2">{t.sections.image.blurHash}</p>
                      <code className="text-sm bg-muted px-3 py-1.5 rounded  truncate flex justify-between items-center ">
                        {image.blurHash}
                        <ClipboardCopyButton value={image.blurHash || ""} />
                      </code>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">{t.sections.image.storageKey}</p>
                      <code className="text-sm bg-muted px-3 py-1.5 rounded  truncate flex justify-between items-center ">
                        {image.key}
                        <ClipboardCopyButton value={image.key} />
                      </code>
                    </div>
                  </div>
                }

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
        title={t.dialog.delete.title}
        description={t.dialog.delete.description}
        // description="Are you sure you want to delete this project? This action cannot be undone."
      />
    </>
  )
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className=" border-b bg-background/95 backdrop-blur">
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