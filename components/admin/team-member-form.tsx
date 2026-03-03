"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { Save, X, User, Linkedin, Github, Twitter, Loader2 } from "lucide-react"
import Image from "next/image"
import { useCreateTeamMemberMutation, useUpdateTeamMemberMutation } from "@/lib/store/api/team-api"
import { toast } from "sonner"
import { useLanguage } from "@/providers/lang"
import { tTeamMemberForm } from "@/i18n/team"

const createTeamMemberFormSchema = (t: typeof tTeamMemberForm.en) =>
  
  z.object({
    name: z
      .string()
      .min(1, t.validation.nameRequired)
      .max(255, t.validation.nameTooLong),

    position: z
      .string()
      .min(1, t.validation.positionRequired)
      .max(255, t.validation.positionTooLong),

    bio: z.string().optional(),

    email: z
      .string()
      .email(t.validation.invalidEmail)
      .optional()
      .or(z.literal("")),

    phone: z.string().optional(),

    linkedin: z
      .string()
      .url(t.validation.invalidLinkedIn)
      .optional()
      .or(z.literal("")),

    github: z
      .string()
      .url(t.validation.invalidGithub)
      .optional()
      .or(z.literal("")),

    twitter: z
      .string()
      .url(t.validation.invalidTwitter)
      .optional()
      .or(z.literal("")),

    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),

    image: z.any().optional(),
    imageState: z.enum(["KEEP", "REMOVE", "UPDATE"]).optional(),
  })

type TeamMemberFormValues = z.infer<ReturnType<typeof createTeamMemberFormSchema>>

interface TeamMemberImage {
  id: string
  url: string
  alt?: string | null
}

interface TeamMemberFormProps {
  isLoadingFetchingToUpdate: boolean
  initialData?: {
    id: string
    name: string
    position: string
    bio?: string | null
    email?: string | null
    phone?: string | null
    linkedin?: string | null
    github?: string | null
    twitter?: string | null
    isActive: boolean
    isFeatured: boolean
    order: number
    image?: TeamMemberImage | null
  }
}

export function TeamMemberForm({ initialData, isLoadingFetchingToUpdate }:TeamMemberFormProps) {

  const router = useRouter()
  const isEditMode = !!initialData
  const { currentLang } = useLanguage()
  const t = tTeamMemberForm[currentLang?.toLowerCase() as 'en' | 'ar' || "en"]

  const [cerate, { isLoading: _isLoading,  }] = useCreateTeamMemberMutation()
  const [update, { isLoading: _isLoadingUpdate, }] = useUpdateTeamMemberMutation()
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image?.url || null
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TeamMemberFormValues>({

    resolver: zodResolver(createTeamMemberFormSchema(t)),
    defaultValues: {
      name: initialData?.name || "",
      position: initialData?.position || "",
      bio: initialData?.bio || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      linkedin: initialData?.linkedin || "",
      github: initialData?.github || "",
      twitter: initialData?.twitter || "",
      isActive: initialData?.isActive ?? true,
      isFeatured: initialData?.isFeatured ?? false,
      // order: initialData?.order ?? 0,
      imageState: "KEEP",
    },
  })

  useEffect(() => {
    setValue("name", initialData?.name || "")
    setValue("position", initialData?.position || "")
    setValue("bio", initialData?.bio || "")
    setValue("email", initialData?.email || "")
    setValue("phone", initialData?.phone || "")
    setValue("linkedin", initialData?.linkedin || "")
    setValue("github", initialData?.github || "")
    setValue("twitter", initialData?.twitter || "")
    setImagePreview(initialData?.image?.url || null)
    setValue("isActive", initialData?.isActive ?? true)
    setValue("isFeatured", initialData?.isFeatured ?? false)
  }, [initialData])

  const isActive = watch("isActive")
  const isFeatured = watch("isFeatured")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t.validation.fileTooLarge, {
        description: t.validation.fileTooLargeDesc,
      })
      return
    }

    if (!file.type.startsWith("image/")) {
      toast.error(t.validation.invalidFileType, {
        description: t.validation.invalidFileTypeDesc,
      })
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
      setValue("imageState", "UPDATE")
    }
    reader.readAsDataURL(file)

    setValue("image", file)
  }


  const removeImage = () => {
    setImagePreview(null)
    setValue("image", undefined)
    setValue("imageState", "REMOVE")
  }

  const onSubmit = async (data: TeamMemberFormValues) => {
    setIsSubmitting(true)

    try {
      const formData = new FormData()

      // Append all form fields
      formData.append("name", data.name)
      formData.append("position", data.position)
      if (data.bio) formData.append("bio", data.bio)
      if (data.email) formData.append("email", data.email)
      if (data.phone) formData.append("phone", data.phone)
      if (data.linkedin) formData.append("linkedin", data.linkedin)
      if (data.github) formData.append("github", data.github)
      if (data.twitter) formData.append("twitter", data.twitter)
      formData.append("isActive", String(data.isActive))
      formData.append("isFeatured", String(data.isFeatured))

      // Image state for edit mode
      if (isEditMode) {
        formData.append("imageState", data.imageState || "KEEP")
      }

      // Append image file
      if (data.image instanceof File) {
        formData.append("image", data.image)
      }

      if (isEditMode) {
        if (!initialData) return

        await update({
          id: initialData.id,
          body: formData,
        })

        toast.success(t.toast.successTitle, {
          description: t.toast.updated,
        })
      } else {
        await cerate(formData)

        toast.success(t.toast.successTitle, {
          description: t.toast.created,
        })
      }
    } catch (error) {
      console.error("Error saving team member:", error)

      toast.error(t.toast.errorTitle, {
        description:
          error instanceof Error
            ? error.message
            : t.toast.saveFailed,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLoading = _isLoading || isSubmitting || isLoadingFetchingToUpdate || _isLoadingUpdate

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 h-[calc(100vh-9rem)] ">
      {/* Basic Information Card */}
      <div className="flex items-start h-[87%] overflow-auto w-full justify-start gap-4 flex-col  md:flex-row">


        <Card style={{ height: "-webkit-fill-available " }} className="w-full  md:w-3/4  ">
          <CardHeader>
            <CardTitle>{t.titles.basicInfo}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex flex-col justify-between h-full ">
            <div className="flex flex-col w-full gap-5">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {t.labels.fullName}<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    disabled={isLoading}
                    id="name"
                    {...register("name")}
                    placeholder={t.placeholders.name}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">
                    {t.labels.position} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    disabled={isLoading}
                    id="position"
                    {...register("position")}
                    placeholder={t.placeholders.position}
                    className={errors.position ? "border-red-500" : ""}
                  />
                  {errors.position && (
                    <p className="text-sm text-red-500">{errors.position.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">{t.labels.biography}</Label>
                <Textarea
                className="resize-none  min-h-64"
                  id="bio"
                  {...register("bio")}
                  placeholder={t.placeholders.bio}
                  rows={20}
                />
                {errors.bio && (
                  <p className="text-sm text-red-500">{errors.bio.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t.labels.email}</Label>
                  <Input
                    disabled={isLoading}
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder={t.placeholders.email}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t.labels.phone}</Label>
                  <Input
                    disabled={isLoading}
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    placeholder={t.placeholders.phone}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>



            <div className="flex flex-col space-y-4 pt-4 border-t">

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isActive" className="cursor-pointer">
                    {t.labels.activeMember}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t.labels.activeNote}
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={(checked) => setValue("isActive", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isFeatured" className="cursor-pointer">
                    {t.labels.featuredMember}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t.labels.featuredNote}
                  </p>
                </div>
                <Switch
                  id="isFeatured"
                  checked={isFeatured}
                  onCheckedChange={(checked) => setValue("isFeatured", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 items-start justify-start flex-col md:w-1/2 w-full  h-full">

          <Card className="w-full">

            <CardHeader>
              <CardTitle>{t.titles.profileImage}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t.labels.teamMemberPhoto}</Label>
                <div className="flex flex-col space-y-4">
                  {imagePreview ? (
                    <div className="relative w-40 h-40 mx-auto border-2 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900">
                      <Image
                        src={imagePreview}
                        alt="Team member preview"
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 rounded-full shadow-lg"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        disabled={isLoading}
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center w-70 h-40 mx-auto border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <User className="h-16 w-16 text-slate-400 mb-3" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          {t.labels.clickToUpload}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                          {t.labels.uploadFormats}
                        </span>
                      </label>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {t.labels.recommended}
                </p>
              </div>
            </CardContent>
          </Card>
          {/* Social Media Card */}
          <Card className="h-full w-full ">

            <CardHeader>
              <CardTitle>{t.titles.socialLinks}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 h-full flex justify-between items-center flex-col w-full">

              <div className="space-y-4 w-full">
                <Label htmlFor="linkedin" className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-blue-600" />
                  {t.labels.linkedin}
                </Label>
                <Input
                  disabled={isLoading}
                  id="linkedin"
                  type="url"
                  {...register("linkedin")}
                  placeholder={t.placeholders.linkedin}
                  className={errors.linkedin ? "border-red-500" : ""}
                />
                {errors.linkedin && (
                  <p className="text-sm text-red-500">{errors.linkedin.message}</p>
                )}
              </div>

              <div className="space-y-2 w-full">
                <Label htmlFor="github" className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  {t.labels.github}
                </Label>
                <Input
                  disabled={isLoading}
                  id="github"
                  type="url"
                  {...register("github")}
                  placeholder={t.placeholders.github}
                  className={errors.github ? "border-red-500" : ""}
                />
                {errors.github && (
                  <p className="text-sm text-red-500">{errors.github.message}</p>
                )}
              </div>

              <div className="space-y-2 w-full">
                <Label htmlFor="twitter" className="flex items-center gap-2">
                  <Twitter className="h-4 w-4 text-sky-500" />
                  {t.labels.twitter}
                </Label>
                <Input
                  disabled={isLoading}
                  id="twitter"
                  type="url"
                  {...register("twitter")}
                  placeholder={t.placeholders.twitter}
                  className={errors.twitter ? "border-red-500" : ""}
                />
                {errors.twitter && (
                  <p className="text-sm text-red-500">{errors.twitter.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>


      </div>




      {/* Action Buttons */}
      <div className="  flex justify-end gap-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 rounded-lg border shadow-lg">

        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/team")}
          disabled={isSubmitting || isLoading}
        >
          {t.labels.cancel}
        </Button>
        <Button type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting || isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t.labels.saving}
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {isEditMode ? t.labels.updateMember : t.labels.addMember}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}