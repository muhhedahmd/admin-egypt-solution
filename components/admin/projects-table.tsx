"use client"

import { useState, useEffect, use, } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Pencil, Trash2, Eye, ExternalLink, Github, Calendar, Star, Layers, FileImage } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useDeleteProjectMutation, useGetProjectsQuery } from "@/lib/store/api/projects-api"
import { Project, Technology } from "@/types/schema"
import { Image } from "@/types/services"
import BlurredImage from "@/app/_comp/BlurredHashImage"
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { toast } from "sonner"
import { DeleteDialog } from "./delete-dialog"


export function ProjectsTable() {
  const router = useRouter()
  const [page, setPage] = useState(0)
  const [ref, entry] = useIntersectionObserver({
    rootMargin: "0px",
    threshold: .1
  })

  const {
    data: projectsData,
    isLoading,
    isError,
    isFetching,

  } = useGetProjectsQuery({
    skip: page,
    take: 10

  })

  const [allProjects, setAllProjects] = useState<{
    project: Project;
    image: Image | null;
    technologies: Partial<Technology>[];
  }[]>([]);

  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    if (projectsData?.data) {

      setAllProjects((prev: any) => {
        const existing = prev.map((p: any) => p.project.id)
        const newProjects = projectsData.data.filter(p => !existing.includes(p.project.id))
        return [...prev, ...newProjects]
      })
    }
  }, [projectsData])


  useEffect(() => {
    if (entry?.isIntersecting && !isFetching && projectsData?.pagination) {
      const { currentPage, totalPages } = projectsData.pagination
      if (currentPage < totalPages) setPage(prev => prev + 1)
    }
  }, [
    entry,
    isFetching,
    projectsData
  ])


  const [del, { isLoading: isLoadingDelete, isError: isErrorDelete }] = useDeleteProjectMutation()


  const handleDelete = async (id: string) => {
    try {
      console.log(id)
      // setAllServices(prev => prev.filter(s => s.id !== id))
      await del(  id
      ).then(res => {
        if (res.data) {
          toast.success("Service deleted successfully!")
          setDeleteId(null)
        }
      })


    } catch (error) {
      toast.error("Failed to delete service. Please try again.")
    }
  }

  const formatDate = (date: string | Date) => {
    if (!date) return null
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1048576).toFixed(1) + ' MB'
  }

  if (isLoading && page === 0) {
    return <LoadingSkeleton />
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="rounded-full bg-destructive/10 p-6 mb-4">
          <Trash2 className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Failed to load projects</h3>
        <p className="text-muted-foreground text-center max-w-md">
          There was an error loading your projects. Please try again later.
        </p>
      </div>
    )
  }

  if (allProjects.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Layers className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No projects found</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Get started by creating your first project.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {allProjects && allProjects.map((item) => (
          <article
            key={item.project.id}
            className="group relative overflow-hidden rounded-2xl border bg-gradient-to-br from-card to-card/50 backdrop-blur transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:border-primary/50"
          >
            {/* Header with Image */}
            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
              {
                item?.image &&

                <BlurredImage
                  imageUrl={item?.image?.url}
                  alt={item.image.alt || item.project.title + "alt"}
                  className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                  height={item.image.height || 200}
                  width={item.image.width || 200}
                  blurhash={item.image.blurHash || ""}
                  quality={90}
                />
              }

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {item.project.isFeatured && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 shadow-lg">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                )}
                <Badge
                  variant={
                    item.project.status === "COMPLETED" ? "default" :
                      item.project.status === "IN_PROGRESS" ? "secondary" : "outline"
                  }
                  className="shadow-lg"
                >
                  {item.project.status}
                </Badge>
              </div>

              <div className="absolute top-4 right-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-9 w-9 rounded-full shadow-lg backdrop-blur-sm bg-background/80 hover:bg-background"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => router.push(`/admin/projects/${item.project.slug}`)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/admin/projects/${item.project.slug}/edit`)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Project
                    </DropdownMenuItem>
                    {item.project.projectUrl && (
                      <DropdownMenuItem onClick={() => window.open(item.project.projectUrl!, "_blank")}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Visit Website
                      </DropdownMenuItem>
                    )}
                    {item.project.githubUrl && (
                      <DropdownMenuItem onClick={() => window.open(item.project.githubUrl!, "_blank")}>
                        <Github className="mr-2 h-4 w-4" />
                        View on GitHub
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setDeleteId(item.project.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Order badge */}
              <div className="absolute bottom-4 right-4">
                <Badge variant="secondary" className="shadow-lg backdrop-blur-sm bg-background/80">
                  Order #{item.project.order}
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Title and Slug */}
              <div>
                <h3 className="text-2xl font-bold tracking-tight mb-1 line-clamp-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  {item.project.title}
                </h3>
                <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  /{item.project.slug}
                </code>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {item.project.description}
              </p>

              {/* Rich Description Preview */}
              {item.project.richDescription && (
                <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div
                    className="line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: item.project.richDescription }}
                  />
                </div>
              )}

              {/* Client Info */}
              {(item.project.clientName || item.project.clientCompany) && (
                <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">
                      {(item.project.clientName || item.project.clientCompany || 'C').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">Client</p>
                    <p className="font-medium text-sm truncate">
                      {item.project.clientName}
                    </p>
                    {item.project.clientCompany && (
                      <p className="text-xs text-muted-foreground truncate">
                        {item.project.clientCompany}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Dates */}
              {(item.project.startDate || item.project.endDate) && (
                <div className="flex items-center gap-3 text-xs">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="flex items-center gap-2">
                    {item.project.startDate && (
                      <span className="text-muted-foreground">
                        {formatDate(item.project.startDate)}
                      </span>
                    )}
                    {item.project.startDate && item.project.endDate && (
                      <span className="text-muted-foreground">→</span>
                    )}
                    {item.project.endDate && (
                      <span className="text-muted-foreground">
                        {formatDate(item.project.endDate)}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Technologies */}
              {item.technologies.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">Technologies</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.technologies.map((tech, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs font-normal shadow-sm"
                      >
                        {tech.icon && <span className="mr-1.5">{tech.icon}</span>}
                        {tech.name}
                        {tech.category && (
                          <span className="ml-1.5 text-[10px] opacity-60">
                            • {tech.category}
                          </span>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Metadata */}
              {
                item.image &&

                <div className="pt-3 border-t border-border/50">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <FileImage className="h-3.5 w-3.5" />
                      <span>{item.image.width}×{item.image.height}</span>
                      <span>•</span>
                      <span>{formatFileSize(item?.image?.size || 0)}</span>
                    </div>
                    {
                      item.project.updatedAt &&
                      <div className="flex items-center gap-2">
                        <span>Updated {formatDate(item.project.updatedAt)}</span>
                      </div>
                    }

                  </div>
                </div>

              }
            </div>
          </article>
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={ref} className="h-20   flex items-center justify-center  ">

        {isFetching && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Loading more projects...</span>
          </div>
        )}
        {projectsData?.pagination &&
          projectsData.pagination.currentPage >= projectsData.pagination.totalPages && (
            <p className="text-sm text-muted-foreground">
              All {projectsData.pagination.totalItems} projects loaded
            </p>
          )}
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border bg-card"
        >
          {/* Image skeleton */}
          <div className="h-56 bg-muted relative overflow-hidden">
            <div className="absolute inset-0 animate-wave bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* Content skeleton */}
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="h-7 w-3/4 rounded animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
              <div className="h-5 w-32 rounded animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
            </div>

            <div className="space-y-2">
              <div className="h-4 w-full rounded animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
              <div className="h-4 w-5/6 rounded animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
            </div>

            <div className="h-20 rounded-lg animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />

            <div className="flex gap-2">
              {[1, 2, 3, 4].map((j) => (
                <div
                  key={j}
                  className="h-6 w-20 rounded-full animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted"
                />
              ))}
            </div>

            <div className="h-8 w-full rounded animate-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}

