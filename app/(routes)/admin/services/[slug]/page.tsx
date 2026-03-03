"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  ExternalLink,
  Star,
  Layers,
  FileImage,
  Pencil,
  Trash2,
  Clock,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  DollarSign,
  Package,
  ClipboardIcon,
  ShoppingCart,
  ArrowRight,
  LucidePencilRuler
} from "lucide-react"
import { DeleteDialog } from "@/components/admin/delete-dialog"
import { useDeleteServiceMutation, useGetServiceBySlugQuery } from "@/lib/store/api/services-api"
import { toast } from "sonner"
import Image from "next/image"
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs"
import { TabsTrigger } from "@radix-ui/react-tabs"
import { useLanguage } from "@/providers/lang"
import { Translations_serviceDetails } from "@/i18n/services"

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter()
  const p = React.use(params)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [del, { isLoading: isLoadingDelete, isError: isErrorDelete, isSuccess }] = useDeleteServiceMutation()
  const { data: serviceData, isLoading, isError } = useGetServiceBySlugQuery(p.slug)
  const {isRTL , currentLang } = useLanguage()

  
  const currentTranaltion = serviceData?.data?.service?.serviceTranslation?.find((s: any) => s?.lang?.toLowerCase() === currentLang?.toLowerCase())
  const serviceTranslation = serviceData?.data?.service?.serviceTranslation
  const langs = serviceData?.data?.service?.serviceTranslation?.map((s: any) => s.lang)
  
  const t = Translations_serviceDetails[currentLang ?.toLowerCase() as 'en' | 'ar' || "en"]
  
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

  const handleDelete = async (id: string) => {
    try {

      // setAllServices(prev => prev.filter(s => s.id !== id))
      await del({
        id
      }).then(res => {
        if (res.data) {
          setDeleteId(null)
          toast.success("Service deleted successfully!")
        }
      })


    } catch (error) {
      toast.error("Failed to delete service. Please try again.")
    }
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (isError || !serviceData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="rounded-full bg-destructive/10 p-6 mb-4 inline-block">
            <Trash2 className="h-12 w-12 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Service Not Found</h2>
          <p className="text-muted-foreground mb-6">The service you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/admin/services')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Button>
        </div>
      </div>
    )
  }

  const { service, image, projects } = serviceData.data

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Sticky Header */}
        <div className=" z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">

          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push('/admin/services')}
                  className="rounded-full"
                >
                  {
                    isRTL? 
                    <ArrowRight className="h-5 w-5" />
                    :<ArrowLeft className="h-5 w-5" />
                  }
                </Button>
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <span>{t.servicesLabel}</span>
                    <span>/</span>
                    <span className="text-foreground font-medium">{service.slug}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {service.icon && service.icon.startsWith("http") ? (
                      <Image
                        src={service.icon}
                        alt={currentTranaltion?.name + "-icon"}
                        width={28}
                        height={28}
                        className="rounded-md"
                      />
                    ) : <span>
                      {service.icon}
                    </span>}
                    <div className="line-clamp-1"> 

                    <h1 className="text-2xl font-bold tracking-tight line-clamp-1">{currentTranaltion?.name}</h1>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => router.push(`/admin/services/${service.id}/edit`)}
                  className="gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  {t.editService}
                </Button>
                <Button
                  onClick={() => router.push(`/admin/services/${service.id}/edit`)}
                  className="gap-2"
                >
                  <LucidePencilRuler className="h-4 w-4" />
                  {
                    isRTL? "تعديل" : "Edit"
                  }
                    
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => setDeleteId(service.id)}
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
                    {service.isFeatured && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 shadow-2xl text-base py-2 px-4">
                        <Star className="h-4 w-4 mr-2 fill-current" />
                        Featured
                      </Badge>
                    )}
                    <Badge
                      variant={service.isActive ? "default" : "secondary"}
                      className="shadow-2xl text-base py-2 px-4 backdrop-blur-sm "
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {service.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-end justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {service.icon && service.icon.startsWith("http") ? (
                            <Image
                              src={service.icon}
                              alt={currentTranaltion?.name + "-icon"}
                              width={28}
                              height={28}
                              className="rounded-md"
                            />
                          ) : <span>
                            {service.icon}
                          </span>}
                          <h2 className="text-4xl font-bold text-white drop-shadow-lg">
                            {currentTranaltion?.name}
                          </h2>
                        </div>
                        <code className="text-sm text-white/90 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
                          /{service.slug}
                        </code>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white/80 mb-1">Price</p>
                        <p className="text-3xl font-bold text-white drop-shadow-lg">
                          {service.price}
                        </p>
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
                    <h3 className="text-2xl font-bold">{t.aboutHeading}</h3>
                    <p className="text-sm text-muted-foreground">{t.aboutSubtitle}</p>
                  </div>
                </div>
                <Tabs dir={isRTL ? "rtl" : "ltr"} className="w-full" defaultValue={langs[0]}>

                  <TabsList>
                    {langs.map((lang: string) => (
                      <TabsTrigger className="text-left p-2" key={lang} value={lang}>
                        {lang}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {langs.map((lang: string) => {
                    const translation = serviceTranslation.find((t: any) => t.lang === lang);

                    return (
                      <TabsContent key={lang} value={lang}>

                        {translation ? (
                          <>
                            <Card>

                              <CardContent>

                                <p className="text-lg  leading-relaxed mb-6">
                                  {translation.name}
                                </p>
                                <p className="text-md text-muted-foreground leading-relaxed mb-6">
                                  {translation.description}
                                </p>

                                {translation.richDescription && (
                                  <>
                                    <Separator className="my-6" />
                                    <div className="prose prose-sm max-w-none">
                                      <div
                                        className="text-muted-foreground leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: translation.richDescription }}
                                      />
                                    </div>
                                  </>
                                )}
                              </CardContent>
                            </Card>
                          </>
                        ) : (
                          <p className="text-muted-foreground">{t.noTranslation}</p>
                        )}
                      </TabsContent>
                    );
                  })}
                </Tabs>



              </Card>

              {/* Related Projects */}
              {projects && projects.length > 0 && (
                <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-card to-card/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <Layers className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{t.relatedProjectsHeading}</h3>
                      <p className="text-sm text-muted-foreground">
                        {projects.length} {projects.length === 1 ? 'project' : 'projects'} {t.relatedProjectsCount_one}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects?.map((projectData: any, index: number) => (
                      <Card
                        key={index}
                        className="overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-xl group"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={projectData?.image?.url}
                            alt={projectData?.image?.alt}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                          <div className="absolute top-3 left-3 flex gap-2">
                            {projectData.project.isFeatured && (
                              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 shadow-lg">
                                <Star className="h-3 w-3 mr-1 fill-current" />
                                Featured
                              </Badge>
                            )}
                            <Badge
                              variant={
                                projectData.project.status === "COMPLETED" ? "default" :
                                  projectData.project.status === "IN_PROGRESS" ? "secondary" : "outline"
                              }
                              className="shadow-lg backdrop-blur-sm bg-background/80"
                            >
                              {projectData.project.status}
                            </Badge>
                          </div>

                          <div className="absolute bottom-3 left-3 right-3">
                            <h4 className="text-lg font-bold text-white mb-1 line-clamp-1">
                              {projectData.project.title}
                            </h4>
                            <code className="text-xs text-white/80 bg-white/10 backdrop-blur-md px-2 py-1 rounded">
                              /{projectData.project.slug}
                            </code>
                          </div>
                        </div>

                        <div className="p-4">
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {projectData.project.description}
                          </p>

                          <div className="flex items-center justify-between">
                            {projectData.project.clientName && (
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-xs font-semibold text-primary">
                                    {projectData.project.clientName.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <span className="text-sm font-medium truncate">
                                  {projectData.project.clientName}
                                </span>
                              </div>
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/admin/projects/${projectData.project.slug}`)}
                              className="gap-2 ml-auto"
                            >
                              {t.viewProjectButton}
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>

                    
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              )}

              {/* Image Details */}
              <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-card to-card/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <FileImage className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{t.imageDetailsHeading}</h3>
                    <p className="text-sm text-muted-foreground">{t.imageDetailsSubtitle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">{t.dimensionsLabel}</p>
                    <p className="font-semibold">{image.width} × {image.height}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">{t.fileSizeLabel}</p>
                    <p className="font-semibold">{formatFileSize(image.size)}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">{t.formatLabel}</p>
                    <p className="font-semibold uppercase">{image.type.split('/')[1]}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">{t.typeLabel}</p>
                    <p className="font-semibold">{image.imageType}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">{t.filenameLabel}</p>
                    <code className="text-sm bg-muted px-3 py-1.5 rounded flex justify-between items-center">
                      <span className="truncate">{image.filename}</span>
                      <ClipboardCopyButton value={image.filename} />
                    </code>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">{t.fileHashLabel}</p>
                    <code className="text-sm bg-muted px-3 py-1.5 rounded flex justify-between items-center">
                      <span className="truncate">{image.fileHash}</span>
                      <ClipboardCopyButton value={image.fileHash} />
                    </code>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">{t.blurHashLabel}</p>
                    <code className="text-sm bg-muted px-3 py-1.5 rounded flex justify-between items-center">
                      <span className="truncate">{image.blurHash}</span>
                      <ClipboardCopyButton value={image.blurHash} />
                    </code>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">{t.storageKeyLabel}</p>
                    <code className="text-sm bg-muted px-3 py-1.5 rounded flex justify-between items-center">
                      <span className="truncate">{image.key}</span>
                      <ClipboardCopyButton value={image.key} />
                    </code>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pricing Card */}
              <Card className="p-6 border-0 shadow-xl bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <DollarSign className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t.pricingLabel}</p>
                    <h3 className="text-3xl font-bold text-primary">
                      {service.price}
                    </h3>
                  </div>
                </div>

      
              </Card>

              {/* Service Info */}
              <Card className="p-6 border-0 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{t.serviceInfoHeading}</h3>
                    <p className="text-xs text-muted-foreground">{t.serviceInfoSubtitle}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs  text-muted-foreground">{t.labelStatus}</p>
                      <p className="font-semibold">{service.isActive ? t.statusActive : t.statusInactive}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Star className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Featured</p>
                      <p className="font-semibold">{service.isFeatured ? t.yes : t.no}</p>
                    </div>
                  </div>

                  {/* <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
           
                  
                  </div> */}
                </div>
              </Card>

              {/* Metadata */}
              <Card className="p-6 border-0 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-gray-500/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{t.metadataHeading}</h3>
                    <p className="text-xs text-muted-foreground">System info</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{t.labelServiceId}</p>
                    <code className="text-xs bg-muted px-2 py-1 rounded block truncate">
                      {service.id}
                    </code>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{t.labelCreated}</p>
                    <p className="text-sm font-medium">{formatDate(service.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{t.labelLastUpdated}</p>
                    <p className="text-sm font-medium">{formatDate(service.updatedAt)}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{t.labelImageId}</p>
                    <code className="text-xs bg-muted px-2 py-1 rounded block truncate">
                      {service.imageId}
                    </code>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div >

      <DeleteDialog
        isLoading={isLoadingDelete}
        isError={isErrorDelete}
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={async () => await handleDelete(deleteId!)}
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone."
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
      aria-label="Copy to clipboard"
      title="Copy to clipboard"
      className="inline-flex items-center justify-center p-2 rounded-md bg-muted/20 hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-shadow duration-150 cursor-pointer shadow-sm hover:shadow-md border border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ml-2"
      onClick={copy}
    >
      <ClipboardIcon className="h-4 w-4" />
    </button>
  )
}