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
import { Save, Upload, X, User, Linkedin, Github, Twitter, Loader2 } from "lucide-react"
import Image from "next/image"
import { useCreateTeamMemberMutation, useUpdateTeamMemberMutation } from "@/lib/store/api/team-api"
import { toast } from "sonner"

// Zod validation schema matching the backend
const teamMemberFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  position: z.string().min(1, "Position is required").max(255, "Position is too long"),
  bio: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  github: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  twitter: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  // order: z.number().int().min(0, "Order must be 0 or greater").default(0),
  image: z.any().optional(),
  imageState: z.enum(["KEEP", "REMOVE", "UPDATE"]).optional(),
})

type TeamMemberFormValues = z.infer<typeof teamMemberFormSchema>

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

export function TeamMemberForm({ initialData, isLoadingFetchingToUpdate }: TeamMemberFormProps) {

  const router = useRouter()
  const isEditMode = !!initialData
  const [cerate, { isLoading: _isLoading, isError, isSuccess }] = useCreateTeamMemberMutation()
  const [update, { isLoading: _isLoadingUpdate, isError: isUpdatedError, isSuccess: isUpdated }] = useUpdateTeamMemberMutation()
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
    getValues,
  } = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberFormSchema),
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
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Please upload an image smaller than 10MB",
        })
        return
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type", {
          description: "Please upload an image file",
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
      // formData.append("order", String(data.order))

      // Handle image state for edit mode
      if (isEditMode) {
        formData.append("imageState", data.imageState || "KEEP")
      }

      // Append file if present
      if (data.image instanceof File) {
        formData.append("image", data.image)
      }

      const method = isEditMode ? "PUT" : "POST"

      if (method === "POST") {

        await cerate(formData)

        toast.success("Success!", {
          description: `Team member ${isEditMode ? "updated" : "created"} successfully`,
        })



      }
      if (method === "PUT") {
        if (!initialData) return
        await update({
          id: initialData.id,
          body: formData
        })

        toast.success("Success!", {
          description: `Team member ${isEditMode ? "updated" : "created"} successfully`,
        })


      }

    } catch (error) {
      console.error("Error saving team member:", error)
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Failed to save team member. Please try again.",
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


        <Card style={{ height: "-webkit-fill-available " }} className="w-full  md:w-3/4 ">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex flex-col justify-between h-full ">
            <div className="flex flex-col w-full gap-5">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    disabled={isLoading}
                    id="name"
                    {...register("name")}
                    placeholder="John Doe"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">
                    Position <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    disabled={isLoading}
                    id="position"
                    {...register("position")}
                    placeholder="Senior Developer"
                    className={errors.position ? "border-red-500" : ""}
                  />
                  {errors.position && (
                    <p className="text-sm text-red-500">{errors.position.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biography</Label>
                <Textarea
                  id="bio"
                  {...register("bio")}
                  placeholder="Brief bio about the team member..."
                  rows={5}
                />
                {errors.bio && (
                  <p className="text-sm text-red-500">{errors.bio.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    disabled={isLoading}
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="john@example.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    disabled={isLoading}
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    placeholder="+1 (555) 000-0000"
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
                    Active Team Member
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Inactive members won't be displayed on the website
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
                    Featured Team Member
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Featured members appear prominently on the team page
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
              <CardTitle>Profile Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Team Member Photo</Label>
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
                          Click to upload photo
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                          PNG, JPG, WebP up to 10MB
                        </span>
                      </label>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Recommended: Square image (1:1 ratio) for best results
                </p>
              </div>
            </CardContent>
          </Card>
          {/* Social Media Card */}
          <Card className="h-full w-full ">

            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 h-full flex justify-between items-center flex-col w-full">

              <div className="space-y-4 w-full">
                <Label htmlFor="linkedin" className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-blue-600" />
                  LinkedIn Profile
                </Label>
                <Input
                  disabled={isLoading}
                  id="linkedin"
                  type="url"
                  {...register("linkedin")}
                  placeholder="https://linkedin.com/in/johndoe"
                  className={errors.linkedin ? "border-red-500" : ""}
                />
                {errors.linkedin && (
                  <p className="text-sm text-red-500">{errors.linkedin.message}</p>
                )}
              </div>

              <div className="space-y-2 w-full">
                <Label htmlFor="github" className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  GitHub Profile
                </Label>
                <Input
                  disabled={isLoading}
                  id="github"
                  type="url"
                  {...register("github")}
                  placeholder="https://github.com/johndoe"
                  className={errors.github ? "border-red-500" : ""}
                />
                {errors.github && (
                  <p className="text-sm text-red-500">{errors.github.message}</p>
                )}
              </div>

              <div className="space-y-2 w-full">
                <Label htmlFor="twitter" className="flex items-center gap-2">
                  <Twitter className="h-4 w-4 text-sky-500" />
                  Twitter Profile
                </Label>
                <Input
                  disabled={isLoading}
                  id="twitter"
                  type="url"
                  {...register("twitter")}
                  placeholder="https://twitter.com/johndoe"
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
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting || isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {isEditMode ? "Update Team Member" : "Add Team Member"}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}