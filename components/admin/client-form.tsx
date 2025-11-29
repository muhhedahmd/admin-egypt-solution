"use client"

import type React from "react"
import { useState } from "react"
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
import { Save, Upload, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { clientRespons, useCreateClientMutation, useUpdateClientMutation } from "@/lib/store/api/client-api"

// Zod validation schema matching the backend
const clientFormSchema = z.object({
  name: z.string().min(1, "Company name is required").max(255, "Name is too long"),
  slug: z.string().optional(),
  industry: z.string().optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  description: z.string().optional(),
  richDescription: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  order: z.number().int().min(0, "Order must be 0 or greater").default(0),
  image: z.any().optional(),
  logo: z.any().optional(),
  imageState: z.enum(["KEEP", "REMOVE", "UPDATE"]).optional(),
  logoState: z.enum(["KEEP", "REMOVE", "UPDATE"]).optional(),
})

type ClientFormValues = z.infer<typeof clientFormSchema>

interface ClientFormProps {
  initialData?: clientRespons
}

export function ClientForm({ initialData }: ClientFormProps) {
  const router = useRouter()
  const isEditMode = !!initialData

  const client = initialData?.client
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image?.url || null
  )
  const [logoPreview, setLogoPreview] = useState<string | null>(
    initialData?.logo?.url || null
  )
  console.log({ imagePreview, logoPreview, logo: initialData?.Logo, image: initialData?.Image })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: client?.name || "",
      slug: client?.slug || "",
      industry: client?.industry || "",
      website: client?.website || "",
      description: client?.description || "",
      richDescription: client?.richDescription || "",
      isActive: client?.isActive ?? true,
      isFeatured: client?.isFeatured ?? false,
      order: client?.order ?? 0,
      imageState: "KEEP",
      logoState: "KEEP",
    },
  })


  const isActive = watch("isActive")
  const isFeatured = watch("isFeatured")

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "logo"
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (type === "image") {
          setImagePreview(reader.result as string)
          setValue("imageState", "UPDATE")
        } else {
          setLogoPreview(reader.result as string)
          setValue("logoState", "UPDATE")
        }
      }
      reader.readAsDataURL(file)
      setValue(type, file)
    }
  }

  const removeImage = (type: "image" | "logo") => {
    if (type === "image") {
      setImagePreview(null)
      setValue("image", undefined)
      setValue("imageState", "REMOVE")
    } else {
      setLogoPreview(null)
      setValue("logo", undefined)
      setValue("logoState", "REMOVE")
    }
  }
  const [cerateClient, { isLoading, data, isError }] = useCreateClientMutation()
  const [updateClient, { isLoading: updateLoading, data: updateData, isError: updateError }] = useUpdateClientMutation()

  const onSubmit = async (data: ClientFormValues) => {

    setIsSubmitting(true)
    try {
      const formData = new FormData()

      // Append all form fields
      formData.append("name", data.name)
      if (data.industry) formData.append("industry", data.industry)
      if (data.website) formData.append("website", data.website)
      if (data.description) formData.append("description", data.description)
      if (data.richDescription) formData.append("richDescription", data.richDescription)
      formData.append("isActive", String(data.isActive))
      formData.append("isFeatured", String(data.isFeatured))
      formData.append("order", String(data.order))

      // Handle image states for edit mode
      if (isEditMode) {
        formData.append("imageState", data.imageState || "KEEP")
        formData.append("logoState", data.logoState || "KEEP")
      }

      // Append files if present
      if (data.image instanceof File) {
        formData.append("image", data.image)
      }
      if (data.logo instanceof File) {
        formData.append("logo", data.logo)
      }

      // API call


      const method = isEditMode ? "PUT" : "POST"


      if (method === "POST") {


        const response = await cerateClient(formData).unwrap()
        if (!response.data) {
          throw new Error("Failed to save client")
        }

        const result = response.data
        console.log("Client saved:", result)
      }
      if (method === "PUT" && isEditMode && client?.id) {
        console.log(data)
        const response = await updateClient({ id: client?.id, formData }).unwrap()
        if (!response.data) {
          throw new Error("Failed to save client")
        }

        const result = await response.data
        console.log("Client saved:", result)
      }

    } catch (error) {
      console.error("Error saving client:", error)
      // alert("Failed to save client. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Main Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex w-full gap-4 justify-start items-start">


            <div className="flex w-full gap-8 flex-col ">


              <div className="space-y-2">
                <Label htmlFor="name">
                  Company Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="TechCorp Inc"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    {...register("industry")}
                    placeholder="Technology"
                  />
                  {errors.industry && (
                    <p className="text-sm text-red-500">{errors.industry.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    {...register("website")}
                    placeholder="https://techcorp.com"
                    className={errors.website ? "border-red-500" : ""}
                  />
                  {errors.website && (
                    <p className="text-sm text-red-500">{errors.website.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Brief description of the client"
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>
            </div>



            {/* Images Card */}
            <Card className="w-2/5 p-1 py-4 shadow-none">


              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">

                <div className="space-y-2 flex items-center gap-4 justify-start">

                  <Label >Company Logo</Label>
                  <div className="flex flex-col space-y-4">

                    {logoPreview ? (

                      <div className="flex justify-start items-center gap-4">
                        <Image
                          src={logoPreview}
                          alt="Logo preview"
                          width={100}
                          height={100}
                          className=" object-cover  w-8 h-8 static shadow-md rounded-md"
                        />
                        <Button

                          type="button"

                          variant="destructive"
                          size="icon-sm"
                          className=" top-2 right-2 cursor-pointer"
                          onClick={() => removeImage("logo")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-8 h-8 border-2 border-dashed rounded-lg transition-colors">
                        <label
                          htmlFor="logo-upload"
                          className="flex flex-col items-center cursor-pointer"
                        >
                          <Upload className="h-4 w-4 " />

                        </label>
                        <input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageChange(e, "logo")}
                        />
                      </div>
                    )}
                  </div>
                </div>
                {/* Main Image */}
                <div className="space-y-2">

                  <Label>Main Image</Label>
                  <div className="flex flex-col space-y-4">

                    {imagePreview ? (
                      <div className="relative w-full h-30 border rounded-lg overflow-hidden bg-gray-50">
                        <Image
                          src={imagePreview}
                          alt="Client preview"
                          fill
                          className="object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => removeImage("image")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full h-30 border-2 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <label
                          htmlFor="image-upload"
                          className="flex flex-col items-center cursor-pointer"
                        >
                          <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />

                        </label>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageChange(e, "image")}
                        />
                      </div>
                    )}
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>


          <div className="space-y-2 mb-2">


            <Label htmlFor="richDescription">Full Description</Label>
            <Textarea
              id="richDescription"
              {...register("richDescription")}
              placeholder="Detailed description of the client and their business"
              rows={20}
            />
            {errors.richDescription && (
              <p className="text-sm text-red-500">
                {errors.richDescription.message}
              </p>
            )}
          </div>

          <div className="space-y-2 mb-4">
            <Label htmlFor="order">Display Order</Label>
            <Input
              id="order"
              type="number"
              {...register("order", { valueAsNumber: true })}
              placeholder="0"
              min="0"
              className={errors.order ? "border-red-500" : ""}
            />
            {errors.order && (
              <p className="text-sm text-red-500">{errors.order.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Lower numbers appear first in lists
            </p>
          </div>

          <div className="flex flex-col space-y-4 mb-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setValue("isActive", checked)}
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Active Client
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isFeatured"
                checked={isFeatured}
                onCheckedChange={(checked) => setValue("isFeatured", checked)}
              />
              <Label htmlFor="isFeatured" className="cursor-pointer">
                Featured Client
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>



      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/clients")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting
            ? "Saving..."
            : isEditMode
              ? "Update Client"
              : "Add Client"}
        </Button>
      </div>
    </form>
  )
}