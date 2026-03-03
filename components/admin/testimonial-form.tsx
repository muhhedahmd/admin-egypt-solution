"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Save, X, Star, User, Building2, Briefcase, MessageSquare, Loader2, AlertCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useCreateTestimonialMutation, useUpdateTestimonialMutation } from "@/lib/store/api/testimonials-api"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { useLanguage } from "@/providers/lang"
import { tTestimonialForm } from "@/i18n/testimonals"

const testimonialSchema = (t: typeof tTestimonialForm.en) => {

  return z.object({
    clientName: z.string().min(1, t.validation.clientNameRequired),
    clientPosition: z.string().optional(),
    clientCompany: z.string().optional(),
    content: z.string().min(10, t.validation.contentMin),
    rating: z.number().min(1).max(5, t.validation.ratingRange),
    isActive: z.boolean(),
    isFeatured: z.boolean(),
    avatar: z.any().optional(),
    avatarState: z.enum(["KEEP", "REMOVE", "UPDATE"]).optional(),
  })
}

type TestimonialFormData = z.infer<ReturnType<typeof testimonialSchema>>

interface TestimonialFormProps {
  initialData?: {
    id: string
    clientName: string
    clientPosition?: string
    clientCompany?: string
    content: string
    rating: number
    isActive: boolean
    isFeatured: boolean
    avatar?: any
  }
}

export function TestimonialForm({ initialData }: TestimonialFormProps) {
  const router = useRouter()
  const isEditMode = !!initialData
  const { currentLang } = useLanguage()
  const t = tTestimonialForm[currentLang?.toLowerCase() as 'en' | 'ar' || "en"]
  const [createTestimonial, { isLoading: isCreating }] = useCreateTestimonialMutation()
  const [updateTestimonial, { isLoading: isUpdating }] = useUpdateTestimonialMutation()

  const form = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema(t)),
    defaultValues: {
      clientName: initialData?.clientName || "",
      clientPosition: initialData?.clientPosition || "",
      clientCompany: initialData?.clientCompany || "",
      content: initialData?.content || "",
      rating: initialData?.rating || 5,
      isActive: initialData?.isActive ?? true,
      isFeatured: initialData?.isFeatured ?? false,
      // order: initialData?.order || 0,
      avatarState: "KEEP",
    },
  })

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialData?.avatar?.url || null
  )
  useEffect(() => {
    form.setValue("avatarState", "KEEP")

    form.setValue("clientName", initialData?.clientName || "")
    form.setValue("clientPosition", initialData?.clientPosition)
    form.setValue("clientCompany", initialData?.clientCompany)
    form.setValue("content", initialData?.content || "")
    form.setValue("rating", initialData?.rating ?? 5)
    form.setValue("isActive", initialData?.isActive || true)
    form.setValue("isFeatured", initialData?.isFeatured || false)
    setAvatarPreview(initialData?.avatar?.url || null)
  }, [initialData])
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(t.toast.fileTooLargeTitle, {
          description: t.toast.fileTooLargeDesc
        })
        return
      }

      if (!file.type.startsWith('image/')) {
        toast.error(t.toast.invalidFileTypeTitle, {
          description: t.toast.invalidFileTypeDesc
        })
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
        form.setValue("avatarState", "UPDATE")
      }
      reader.readAsDataURL(file)
      form.setValue("avatar", file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t.toast.fileTooLargeTitle, {
          description: t.toast.fileTooLargeDesc
        })
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
        form.setValue("avatarState", "UPDATE")
      }
      reader.readAsDataURL(file)
      form.setValue("avatar", file)
    }
  }

  const removeAvatar = () => {
    setAvatarPreview(null)
    form.setValue("avatar", undefined)
    form.setValue("avatarState", "REMOVE")
  }

  const onSubmit = async (data: TestimonialFormData) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()

      // Append all form fields
      formData.append("clientName", data.clientName)
      if (data.clientPosition) formData.append("clientPosition", data.clientPosition)
      if (data.clientCompany) formData.append("clientCompany", data.clientCompany)
      formData.append("content", data.content)
      formData.append("rating", String(data.rating))
      formData.append("isActive", String(data.isActive))
      formData.append("isFeatured", String(data.isFeatured))
      // formData.append("order", String(data.order))

      // Handle avatar state
      if (isEditMode) {
        formData.append("avatarState", data.avatarState || "KEEP")
      }

      // Append file if present
      if (data.avatar instanceof File) {
        formData.append("avatar", data.avatar)
      }

      if (isEditMode) {
        await updateTestimonial({
          id: initialData.id,
          body: formData
        }).unwrap()

        toast.success("Success!", {
          description: t.toast.updateSuccess
        })
      } else {
        await createTestimonial(formData).unwrap()

        toast.success("Success!", {
          description: t.toast.createSuccess
        })
      }

      router.push("/admin/testimonials")
    } catch (error) {
      toast.error("Error", {
        description: error instanceof Error ? error.message : t.toast.saveFailed
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLoading = isCreating || isUpdating || isSubmitting
  const watchedValues = form.watch()

  return (
    <Form {...form}>
      <div className="space-y-6 p-6 h-[calc(100vh-9rem)]">
        {/* Preview Card */}
        <Card className="px-2 py-2 overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <div className="p-2">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">{t.preview.title}</h3>
              <div className="flex gap-2">
                {watchedValues.isFeatured && (
                  <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-0">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    {t.preview.featured}
                  </Badge>
                )}
                <Badge variant={watchedValues.isActive ? "default" : "secondary"}>
                  {watchedValues.isActive ? t.preview.active : t.preview.inactive}
                </Badge>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${star <= watchedValues.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-slate-300 dark:text-slate-700"
                      }`}
                  />
                ))}
              </div>

              <div className="relative">
                <MessageSquare className="absolute -left-1 -top-1 h-8 w-8 text-slate-200 dark:text-slate-800" />
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-6">
                  {watchedValues.content || "Your testimonial content will appear here..."}
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="relative h-12 w-12 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt={watchedValues.clientName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <User className="h-6 w-6 text-slate-400 dark:text-slate-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {watchedValues.clientName || t.preview.clientNameFallback}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                    {watchedValues.clientPosition || t.preview.positionFallback} {watchedValues.clientCompany && `at ${watchedValues.clientCompany}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Form */}
        <div className="flex items-start h-[80%] overflow-auto w-full justify-start gap-4 flex-col lg:flex-row">
          <Card className="w-full lg:w-3/4 h-full">
            <div className="p-6 space-y-6 h-full flex flex-col justify-between">
              <div className="space-y-6">
                <h3 className="font-semibold text-lg">{t.titles.clientInformation}</h3>

                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {t.labels.clientName} *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder={t.placeholders.clientName} {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="clientPosition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          {t.labels.clientPosition}
                        </FormLabel>
                        <FormControl>
                          <Input placeholder={t.placeholders.clientPosition} {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clientCompany"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          {t.labels.clientCompany}
                        </FormLabel>
                        <FormControl>
                          <Input placeholder={t.placeholders.clientCompany} {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.labels.content} *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Write the testimonial content here..." rows={8} className="resize-none" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormDescription>{field.value.length} { t.placeholders.content}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.labels.rating} *</FormLabel>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => field.onChange(star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                            disabled={isLoading}
                          >
                            <Star
                              className={`h-8 w-8 ${star <= field.value
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-slate-300 dark:text-slate-700"
                                }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
                          {field.value} / 5
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>{t.labels.activeStatus}</FormLabel>
                        <FormDescription>{t.labels.activeNote}</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>{t.labels.featuredTestimonial}</FormLabel>
                        <FormDescription>{t.labels.featuredNote}</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </Card>

          <div className="flex gap-4 items-start justify-start flex-col w-full lg:w-1/3 h-full">
            <Card className="w-full">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{t.titles.avatar}</h3>
                  {avatarPreview && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeAvatar}
                      className="text-red-600 hover:text-red-700"
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4 mr-1" />
                      {t.labels.remove}
                    </Button>
                  )}
                </div>

                {avatarPreview ? (
                  <div className="relative w-40 h-40 mx-auto border-2 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900">
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 rounded-full shadow-lg"
                      onClick={removeAvatar}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    className={`relative border-2 border-dashed rounded-xl p-8 transition-colors ${isDragging ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20" : "border-slate-300 dark:border-slate-700"
                      }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isLoading}
                    />

                    <div className="flex flex-col items-center gap-3">
                      <div className="h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <User className="h-10 w-10 text-slate-400 dark:text-slate-600" />
                      </div>

                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {t.upload.clickOrDrag}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{t.upload.formats}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>


          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 p-4 rounded-lg border shadow-lg">
          <Button type="button" variant="outline" size="lg" onClick={() => router.push("/admin/testimonials")} disabled={isLoading}>
            {t.buttons.cancel}
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} size="lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t.buttons.saving}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEditMode ? t.buttons.update : t.buttons.create}
              </>
            )}
          </Button>
        </div>
      </div>
    </Form>
  )
}