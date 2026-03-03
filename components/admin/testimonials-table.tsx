"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Pencil, Trash2, Eye, Star, Mail, Phone, Users, Linkedin, Github, Twitter } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { DeleteDialog } from "@/components/admin/delete-dialog"
import Blurredimage from "@/app/_comp/BlurredHashImage"
import { useIntersectionObserver } from "@uidotdev/usehooks"
import { TestimonialWithTranslation, useDeleteTestimonialMutation, useGetTestimonialsQuery } from "@/lib/store/api/testimonials-api"
import { BlurhashCanvas } from "react-blurhash"
import { toast } from "sonner"
import { useLanguage } from "@/providers/lang"
import { tTestimonialsPagei18n , tTestimonialsTable } from "@/i18n/testimonals"


export function TestimonialsTable() {
const {currentLang } = useLanguage()
const t = tTestimonialsTable[currentLang?.toLowerCase() as 'en' | 'ar' || "en"]





  const router = useRouter()
  const [page, setPage] = useState(0)
  const [ref, entry] = useIntersectionObserver({
    rootMargin: "0px",
    threshold: 0.1
  })

  const {
    data: teamData,
    isLoading,
    isError,
    isFetching,
    refetch
  } = useGetTestimonialsQuery({
    skip: page,
    take: 10
  })

  const [allTestimonial, setAllTtestimonial] = useState<TestimonialWithTranslation[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [del, { isLoading: isLoadingDelete, isError: isErrorDelete }] = useDeleteTestimonialMutation()
  

  useEffect(() => {
    if (teamData?.data) {
      setAllTtestimonial((prev) => {
        const existing = prev.map((member) => member.testimonial.id)
        const newMembers = teamData?.data?.filter((member) => !existing.includes(member.testimonial.id))
        return [...prev, ...newMembers]
      })
    }
  }, [teamData])

  useEffect(() => {
    if (entry?.isIntersecting && !isFetching && teamData?.data) {
      const hasMore = allTestimonial.length < (teamData.pagination.totalItems || 0)
      if (hasMore) setPage(prev => prev + 1)
    }
  }, [entry, isFetching, teamData, allTestimonial.length])

  const handleDelete = async (id: string) => {
    try {
      await del(id
      ).then(res => {
        if (res.data) {
          toast.success(t.toast.deleteSuccess)
          setDeleteId(null)
          setAllTtestimonial(prev => prev.filter(s => s.testimonial.id !== id))
        }
      })
    } catch (error) {
      toast.error(t.toast.deleteSuccess)
    }
  }

  if (isLoading && page === 0) {
    return <LoadingSkeleton />
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="rounded-full bg-red-50 dark:bg-red-950 p-6 mb-4">
          <Trash2 className="h-10 w-10 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{t.errorTitle}</h3>
        <p className="text-muted-foreground text-center max-w-md mb-4">
          {t.errorDescription}
        </p>
        <Button onClick={() => refetch()} variant="outline">
          {t.retry}
        </Button>
      </div>
    )
  }

  if (allTestimonial.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-6 mb-4">
          <Users className="h-10 w-10 text-slate-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{t.emptyTitle}</h3>
        <p className="text-muted-foreground text-center max-w-md">
          {t.emptyDescription}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allTestimonial.map((testimonial) => {
          const currentTranslation = testimonial.translation?.find(t => t.lang?.toLocaleLowerCase() === currentLang?.toLocaleLowerCase())
         return  <article
            key={testimonial.testimonial.id}
            className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:shadow-lg transition-all duration-300"
          >
            {/* Card Header with Actions */}
            <div className="absolute top-3 right-3 z-10 flex gap-2">
              {testimonial.testimonial.isFeatured && (
                <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-0 shadow-sm">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  {t.card.featured}
                </Badge>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-900 shadow-sm"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">

                  <DropdownMenuItem onClick={() => router.push(`/admin/testimonials/${testimonial.testimonial.id}/edit`)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    {t.card.edit}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`/admin/testimonials/${testimonial.testimonial.id}`)}>
                    <Eye className="mr-2 h-4 w-4" />
                    {t.card.view}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                    onClick={() => setDeleteId(testimonial.testimonial.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t.card.delete}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Profile Image */}
            <div className="relative h-64 flex items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-900">
              {testimonial.avatar ? (
                <>
                  {
                    testimonial.avatar.blurHash &&
                    <BlurhashCanvas hash={testimonial.avatar.blurHash}  className=" absolute top-0 left-0 w-full h-full" />
                  }

                  <Blurredimage
                    imageUrl={testimonial.avatar.url}
                    alt={testimonial.avatar.alt || currentTranslation?.clientName || ""}
                    className="max-h-40 max-w-40 w-40 h-40 rounded-full object-cover transition-all duration-500 group-hover:scale-105"
                    height={testimonial.avatar.height || 400}
                    width={testimonial.avatar.width || 400}
                    blurhash={testimonial.avatar.blurHash || ""}
                    quality={90}
                  />
                </>
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
                  <Users className="h-20 w-20 text-slate-300 dark:text-slate-700" />
                </div>
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Name and Position */}
              <div className="space-y-1">
                <h3 className="font-semibold text-lg leading-tight line-clamp-1">
                  {currentTranslation?.clientName}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                  {currentTranslation?.clientPosition}
                </p>
              </div>

              {/* Bio */}
              {currentTranslation?.content && (
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {currentTranslation?.content}
                </p>
              )}

              {/* Contact Info */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => {

                  return <Star
                    key={star}
                    className={`h-5 w-5 ${star <= testimonial.testimonial.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-slate-300 dark:text-slate-700"
                      }`}
                  />
                })}
              </div>


         
            </div>
          </article>
        
        })}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={ref} className="h-20 flex items-center justify-center mt-6">
        {isFetching && (
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 dark:border-slate-700 border-t-slate-600 dark:border-t-slate-400" />
            <span>{t.loadingMore}</span>
          </div>
        )}
        {teamData?.data &&
          allTestimonial.length >= (teamData.pagination.totalItems || 0) && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t.allLoaded(teamData.pagination.totalItems)}
            </p>
          )}
      </div>

      <DeleteDialog
        isLoading={isLoadingDelete}
        isError={isErrorDelete}
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={async () => await handleDelete(deleteId!)}
        title="Delete testimonial"
        description="Are you sure you want to delete this testimonial? This action cannot be undone."
      />
    </>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
        >
          {/* Image skeleton */}
          <div className="h-64 bg-slate-100 dark:bg-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 animate-wave bg-liner-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
          </div>

          {/* Content skeleton */}
          <div className="p-5 space-y-4">
            {/* Name and Position */}
            <div className="space-y-2">
              <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800 animate-wave" />
              <div className="h-4 w-1/2 rounded bg-slate-100 dark:bg-slate-900 animate-wave" />
            </div>

            {/* Slug and badge */}
            <div className="flex items-center gap-2">
              <div className="h-6 w-20 rounded bg-slate-100 dark:bg-slate-900 animate-wave" />
              <div className="h-6 w-16 rounded bg-slate-100 dark:bg-slate-900 animate-wave" />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-900 animate-wave" />
              <div className="h-4 w-4/5 rounded bg-slate-100 dark:bg-slate-900 animate-wave" />
            </div>

            {/* Contact */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="h-4 w-2/3 rounded bg-slate-100 dark:bg-slate-900 animate-wave" />
              <div className="h-4 w-1/2 rounded bg-slate-100 dark:bg-slate-900 animate-wave" />
            </div>

            {/* Social */}
            <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-900 animate-wave" />
              <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-900 animate-wave" />
              <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-900 animate-wave" />
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="h-4 w-16 rounded bg-slate-100 dark:bg-slate-900 animate-wave" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}