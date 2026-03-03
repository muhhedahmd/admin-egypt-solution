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
import { teamMemberTranslation, useDeleteTeamMemberMutation, useGetTeamMembersQuery } from "@/lib/store/api/team-api"
import { Image, TeamMember, TeamMemberWithImage } from "@/types/schema"
import { toast } from "sonner"
import { useLanguage } from "@/providers/lang"


export function TeamTable() {
  const router = useRouter()
  const [page, setPage] = useState(0)
  const [ref, entry] = useIntersectionObserver({
    rootMargin: "0px",
    threshold: 0.1
  })

  const { currentLang } = useLanguage()
  const {
    data: teamData,
    isLoading,
    isError,
    isFetching,
    refetch
  } = useGetTeamMembersQuery({
    skip: page,
    take: 10
  })

  const [allTeam, setAllTeam] = useState<{
    teamMember: TeamMember;
    image: Image | null;
    translation: teamMemberTranslation[];
  }[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [del, { isLoading: isLoadingDelete, isError: isErrorDelete }] = useDeleteTeamMemberMutation()
  useEffect(() => {
    if (teamData?.data) {
      setAllTeam((prev) => {
        const existing = prev.map((member) => member.teamMember.id)
        const newMembers = teamData.data.filter((member) => !existing.includes(member.teamMember.id))
        return [...prev, ...newMembers]
      })
    }
  }, [teamData])

  useEffect(() => {
    if (entry?.isIntersecting && !isFetching && teamData?.data) {
      const hasMore = allTeam.length < (teamData.pagination.totalItems || 0)
      if (hasMore) setPage(prev => prev + 1)
    }
  }, [entry, isFetching, teamData, allTeam.length])


  const handleDelete = async (id: string) => {
    try {
      console.log(id)
      await del(id
      ).then(res => {
        if (res.data) {
          toast.success("Service deleted successfully!")
          setAllTeam(prev => prev.filter(s => s.teamMember.id !== id))
          setDeleteId(null)
        }
      })
    } catch (error) {
      toast.error("Failed to delete service. Please try again.")
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
        <h3 className="text-xl font-semibold mb-2">Failed to load team members</h3>
        <p className="text-muted-foreground text-center max-w-md mb-4">
          There was an error loading your team. Please try again.
        </p>
        <Button onClick={() => refetch()} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  if (allTeam.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-6 mb-4">
          <Users className="h-10 w-10 text-slate-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No team members found</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Get started by adding your first team member.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allTeam.map((member) => {
          const currentTranslation = member?.translation?.find((t) => t.lang?.toLowerCase() === currentLang?.toLowerCase())
          console.log(member.teamMember)

          return <article
            key={member.teamMember.id}
            className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:shadow-lg transition-all duration-300"
          >
            {/* Card Header with Actions */}
            <div className="absolute top-3 right-3 z-10 flex gap-2">
              {member.teamMember.isFeatured && (
                <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-0 shadow-sm">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Featured
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
                  <DropdownMenuItem onClick={() => router.push(`/admin/team/${member.teamMember.id}`)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`/admin/team/${member.teamMember.id}/edit`)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Member
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                    onClick={() => setDeleteId(member.teamMember.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Member
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Profile Image */}
            <div className="relative h-64 overflow-hidden bg-slate-100 dark:bg-slate-900">
              {member.image ? (
                <Blurredimage
                  imageUrl={member.image.url}
                  alt={member.image.alt || currentTranslation?.name || ""}
                  className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                  height={member.image.height || 400}
                  width={member.image.width || 400}
                  blurhash={member.image.blurHash || ""}
                  quality={90}
                />
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
                  {currentTranslation?.name || ""}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                  {currentTranslation?.position || ""}
                </p>
              </div>

              {/* Slug */}
              <div className="flex items-center gap-2">
                <code className="text-xs bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">
                  /{member.teamMember.slug}
                </code>
                <Badge
                  variant={member.teamMember.isActive ? "default" : "secondary"}
                  className="text-xs"
                >
                  {member.teamMember.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              {/* Bio */}
              {currentTranslation?.bio && (
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {currentTranslation?.bio}
                </p>
              )}

              {/* Contact Info */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                {member.teamMember.email && (
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{member.teamMember.email}</span>
                  </div>
                )}
                {member.teamMember.phone && (
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{member.teamMember.phone}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {(member.teamMember.linkedin || member.teamMember.github || member.teamMember.twitter) && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {member.teamMember.linkedin && (
                    <a
                      href={member.teamMember.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-blue-100 dark:hover:bg-blue-950 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  {member.teamMember.github && (
                    <a
                      href={member.teamMember.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {member.teamMember.twitter && (
                    <a
                      href={member.teamMember.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-sky-100 dark:hover:bg-sky-950 text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  )}
                </div>
              )}


            </div>
          </article>
        })}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={ref} className="h-20 flex items-center justify-center mt-6">
        {isFetching && (
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 dark:border-slate-700 border-t-slate-600 dark:border-t-slate-400" />
            <span>Loading more team members...</span>
          </div>
        )}
        {teamData?.data &&
          allTeam.length >= (teamData.pagination.totalItems || 0) && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              All {teamData.pagination.totalItems} team members loaded
            </p>
          )}
      </div>
      <DeleteDialog
        isLoading={isLoadingDelete}
        isError={isErrorDelete}
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={async () => await handleDelete(deleteId!)}
        title="Delete Member"
        description="Are you sure you want to delete this Member? This action cannot be undone."
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
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
          </div>

          {/* Content skeleton */}
          <div className="p-5 space-y-4">
            {/* Name and Position */}
            <div className="space-y-2">
              <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
              <div className="h-4 w-1/2 rounded bg-slate-100 dark:bg-slate-900 animate-pulse" />
            </div>

            {/* Slug and badge */}
            <div className="flex items-center gap-2">
              <div className="h-6 w-20 rounded bg-slate-100 dark:bg-slate-900 animate-pulse" />
              <div className="h-6 w-16 rounded bg-slate-100 dark:bg-slate-900 animate-pulse" />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-900 animate-pulse" />
              <div className="h-4 w-4/5 rounded bg-slate-100 dark:bg-slate-900 animate-pulse" />
            </div>

            {/* Contact */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="h-4 w-2/3 rounded bg-slate-100 dark:bg-slate-900 animate-pulse" />
              <div className="h-4 w-1/2 rounded bg-slate-100 dark:bg-slate-900 animate-pulse" />
            </div>

            {/* Social */}
            <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-900 animate-pulse" />
              <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-900 animate-pulse" />
              <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-900 animate-pulse" />
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="h-4 w-16 rounded bg-slate-100 dark:bg-slate-900 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}