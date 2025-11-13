"use client"

import type React from "react"
import { useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
// import '@boomslag/nextjs-richtext/styles/';


import { useRouter } from "next/navigation"
import { Check, Cloud, Loader2, Plus, Save, X, AlertCircle, Replace, Trash2, ReplaceIcon, DeleteIcon, SaveIcon, Delete } from "lucide-react"
import { useCreateServiceMutation, useLazyCheckOrderQuery } from "@/lib/store/api/services-api"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { useToast } from "@/hooks/use-toast"
import { Service } from "@/types/schema"
import { Image as ImageSchemaType } from "@/types/services"
import BlurredImage from "@/app/_comp/BlurredHashImage"
import { Badge } from "../ui/badge"



// type initialData  = {

// } & Service
interface ServiceFormProps {
  initialData?: Service & {
    iconImage?: File | null
    image?: File | null
  }
  initalImage?: ImageSchemaType | null
}

interface ValidationErrors {
  title?: string
  // slug?: string
  description?: string
  richDescription?: string
  price?: string
  order?: string
}

const validateForm = (formData: any): ValidationErrors => {
  const errors: ValidationErrors = {}

  if (!formData.title?.trim()) {
    errors.title = "Title is required"
  }

  // if (!formData.slug?.trim()) {
  //   errors.slug = "Slug is required"
  // } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) {
  //   errors.slug = "Slug must be lowercase with hyphens only"
  // }

  if (!formData.description?.trim()) {
    errors.description = "Short description is required"
  } else if (formData.description.length < 10) {
    errors.description = "Description must be at least 10 characters"
  }

  if (!formData.richDescription?.trim()) {
    errors.richDescription = "Full description is required"
  } else if (formData.richDescription.length < 20) {
    errors.richDescription = "Full description must be at least 20 characters"
  }

  if (formData.price && !/^\d+(\.\d{1,2})?$/.test(formData.price)) {
    errors.price = "Price must be a valid number (e.g., 99.99)"
  }

  if (formData.order < 0) {
    errors.order = "Order must be a positive number"
  }

  return errors
}

export function ServiceForm({ initialData, initalImage }: ServiceFormProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [cerateService, { isLoading: isCreating }] = useCreateServiceMutation()


  const [formData, setFormData] = useState({
    name: initialData?.name || "Modern Business Theme",
    description: initialData?.description || "A responsive Shopify theme designed for agencies and startups.",
    richDescription:
      initialData?.richDescription ||
      `
    hello
  `,
    order: initialData?.order ?? 1,
    icon: initialData?.icon || "/icons/theme.svg",
    iconImage: initialData?.iconImage || null,
    image: initialData?.image || null,
    // slug: initialData?.slug || "modern-business-theme",
    id: initialData?.id || "theme_001",
    price: initialData?.price || "149.00",
    isActive: initialData?.isActive ?? true,
    isFeatured: initialData?.isFeatured ?? false,
    imageTag: "Keep",
    iconTag: "Keep"
  })

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  const [selectedImageBlob, setSelectedImageBlob] = useState("")
  const [selectedIconBlob, setSelectedIconBlob] = useState("")
  const inputImageRef = useRef<HTMLInputElement>(null)
  // const iconInputRef = useRef<HTMLInputElement>(null)
  // const [autoOrder, setAutoOrder] = useState(false)


  // const generateSlug = (title: string) => {
  //   return title
  //     .toLowerCase()
  //     .replace(/[^a-z0-9]+/g, "-")
  //     .replace(/(^-|-$)/g, "")
  // }

  // const CheckOrderTaken = async () => {
  //   try {
  //     const result = await fetch({ order: formData.order }).unwrap()

  //     if (result?.data?.isValid) {

  //       toast({
  //         title: "Order Available",
  //         description: `Order position ${formData.order} is available`,
  //         variant: "default",
  //       })
  //     } else {
  //       toast({
  //         title: "Order Taken",
  //         description: `Order position ${formData.order} is already taken`,
  //         variant: "destructive",
  //       })
  //     }
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to check order availability",
  //       variant: "destructive",
  //     })
  //     console.error("Order check error:", error)
  //   }
  // }

  const handleInputChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImageBlob(URL.createObjectURL(e.target.files[0]))
      setFormData({ ...formData, image: e.target.files[0] })
      if (initialData?.image) {
        setFormData({ ...formData, imageTag: "Replaced" })
      }
    }
  }

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedIconBlob(URL.createObjectURL(e.target.files[0]))
      setFormData({ ...formData, iconImage: e.target.files[0] })
      if (initialData?.icon) {
        setFormData({ ...formData, iconTag: "Replaced" })
      }

    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const errors = validateForm(formData)
    setValidationErrors(errors)

    if (Object.keys(errors).length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fix all errors before submitting",
        variant: "destructive",
      })
      return
    }

    try {
      // Create FormData for file uploads
      const submitData = new FormData()
      submitData.append("name", formData.name)
      // submitData.append("slug", formData.slug)
      submitData.append("description", formData.description)
      submitData.append("richDescription", formData.richDescription)
      submitData.append("price", formData.price || "")
      submitData.append("order", formData.order.toString())
      submitData.append("isActive", formData?.isActive ? "true" : "false")
      submitData.append("isFeatured", formData?.isFeatured ? "true" : "false")
      submitData.append("icon", formData?.icon || "")

      if (formData.image) {
        submitData.append("image", formData.image)
      }
      if (formData.iconImage) {
        submitData.append("iconImage", formData.iconImage)
      }

      const result = await cerateService(submitData).unwrap()

      toast({
        title: "Success",
        description: initialData?.id ? "Service updated successfully" : "Service created successfully",
        variant: "default",
      })

      // Redirect after successful submission
      // setTimeout(() => {
      //   router.push("/admin/services")
      // }, 1500)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to save service",
        variant: "destructive",
      })
      console.error("Submit error:", error)
    }
  }

  return (
    <div className="w-full space-y-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        {/* ===== FORM SECTION (2/3 width on desktop, full on mobile) ===== */}
        <div className="lg:col-span-2 space-y-6">
          {Object.keys(validationErrors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold mb-2">Please fix the following errors:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {Object.entries(validationErrors).map(([field, error]) => (
                    <li key={field}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      // slug: generateSlug(e.target.value),
                    })
                    // Clear error on change
                    if (validationErrors.title) {
                      setValidationErrors({ ...validationErrors, title: undefined })
                    }
                  }}
                  placeholder="Web Development"
                  className={validationErrors.title ? "border-red-500" : ""}
                />
                {validationErrors.title && <p className="text-sm text-red-500">{validationErrors.title}</p>}
              </div>



              <div className="space-y-2">
                <Label htmlFor="description">Short Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value })
                    if (validationErrors.description) {
                      setValidationErrors({ ...validationErrors, description: undefined })
                    }
                  }}
                  placeholder="Brief description of the service"
                  rows={3}
                  className={validationErrors.description ? "border-red-500" : ""}
                />
                {validationErrors.description && <p className="text-sm text-red-500">{validationErrors.description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="richDescription">Full Description *</Label>


                <Textarea
                  id="richDescription"
                  value={formData.richDescription}
                  onChange={(e) => {
                    setFormData({ ...formData, richDescription: e.target.value })
                    if (validationErrors.richDescription) {
                      setValidationErrors({ ...validationErrors, richDescription: undefined })
                    }
                  }}
                  placeholder="Detailed service information..."
                  rows={4}
                  className={validationErrors.richDescription ? "border-red-500" : ""}
                />
                {validationErrors.richDescription && (
                  <p className="text-sm text-red-500">{validationErrors.richDescription}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => {
                      setFormData({ ...formData, price: e.target.value })
                      if (validationErrors.price) {
                        setValidationErrors({ ...validationErrors, price: undefined })
                      }
                    }}
                    placeholder="$99.99"
                    className={validationErrors.price ? "border-red-500" : ""}
                  />
                  {validationErrors.price && <p className="text-sm text-red-500">{validationErrors.price}</p>}
                </div>
                <div className="space-y-2">
                  {/* <Label htmlFor="order">Display Order *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      disabled={autoOrder}
                      id="order"
                      type="number"
                      value={formData.order || 0}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          order: Number.parseInt(e.target.value),
                        })
                        if (validationErrors.order) {
                          setValidationErrors({ ...validationErrors, order: undefined })
                        }
                      }}
                      min="0"
                      className={validationErrors.order ? "border-red-500" : ""}
                    />
                    <Button

                      className={cn(
                        "flex items-center justify-center cursor-pointer",
                        order?.data?.isValid
                          ? "bg-green-500 hover:bg-green-600"
                          : order?.data?.isValid === false
                            ? "bg-red-500 hover:bg-red-600"
                            : "",
                      )}
                      onClick={CheckOrderTaken}
                      disabled={isFetching || isLoading || autoOrder}
                      type="button"
                      variant={order?.data?.isValid === undefined ? "outline" : "default"}
                    >
                      {isLoading || isFetching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : order?.data?.isValid === true ? (
                        <Check className="h-4 w-4" />
                      ) : order?.data?.isValid === false ? (
                        <X className="h-4 w-4" />
                      ) : (
                        "Check"
                      )}
                    </Button>
                    <Button variant="outline" type="button" onClick={() => {
                      setAutoOrder((prev) => !prev)
                      setFormData({ ...formData, order: 0 })
                    }}>
                      {
                        autoOrder ? "Auto " : "Manual"
                      }
                    </Button>
                  </div> */}
                  {/* {validationErrors.order && <p className="text-sm text-red-500">{validationErrors.order}</p>} */}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.isFeatured || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                />
                <Label htmlFor="featured">Featured Service</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="Active"
                  checked={formData.isActive || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="Active">Active Service</Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/services")}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {initialData?.id ? "Update Service" : "Create Service"}
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1 sticky top-6">
          <div className="space-y-4">
            {/* Service Card Preview */}
            <Card className="overflow-hidden shadow-lg p-0">
              <div className=" relative h-32 bg-gradient-to-br from-gray-200 to-gray-600  overflow-hidden">
                {
                  formData.imageTag === "Replace" ? (
                    <Badge className="absolute z-100 bg-secondary rounded-tr-none rounded-bl-none" variant={"outline"}>
                      <Replace className="w-4 h-4 " />
                      Replaced
                    </Badge>
                  ) : formData.imageTag === "Keep" ? (
                    <Badge className="absolute z-100 bg-primary text-secondary rounded-tr-none rounded-bl-none" variant={"default"}>
                      <Save className="w-4 h-4 " />
                      Keep
                    </Badge>
                  ) : formData.imageTag === "removed" ? (
                    <Badge className=" dark:bg-[#4f1116] absolute z-100 bg-secondary rounded-tr-none rounded-bl-none" variant={"destructive"}>
                      <Delete className="w-4 h-4 " />
                      removed
                    </Badge>
                  ) : null
                }

                {selectedImageBlob ? (


                  <Image
                    src={selectedImageBlob || "/placeholder.svg"}
                    alt="Service"
                    width={300}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : initalImage && (formData?.imageTag && !(formData?.imageTag === "removed")) ? (
                  <BlurredImage
                    imageUrl={initalImage.url || "/placeholder.svg"}
                    blurhash={initalImage.blurHash || ""}
                    alt={initalImage.alt || "Service-alt"}
                    width={initalImage.width || 300}
                    height={initalImage.height || 128}
                    quality={100}
                    className="w-full h-full object-cover rounded-b-none"
                  />
                ) : null}
              </div>

              <CardContent className="p-4 space-y-3">
                <div className=" relative flex items-center gap-2">

                  {
                    (initialData?.icon && formData.iconTag === "Replaced") ? (
                      <Badge variant={"default"} className=" h-8">
                        <ReplaceIcon className="w-4 h-4" />
                        Replaced
                      </Badge>
                    ) : (initialData?.icon && formData.iconTag === "removed") ? (
                      <Badge variant={"destructive"} className=" h-8">
                        <DeleteIcon className="w-4 h-4" />
                        Removed
                      </Badge>
                    ) : (initialData?.icon && formData.iconTag === "Keep") ? (
                      <Badge variant={"secondary"} className="h-8">
                        <SaveIcon className="w-4 h-4" />
                        Keep
                      </Badge>
                    ) : null
                  }
                  {(formData.icon || selectedIconBlob) ?

                    <Image
                      src={formData.icon || selectedIconBlob || "/placeholder.svg"}
                      width={32}
                      height={32}
                      alt="Icon"
                      className="w-8 h-8 rounded-md shadow-md object-cover"
                    />
                    : null}
                  <div className="flex-1">
                    <h3 className="font-bold text-sm ">{formData.name || "Service Title"}</h3>
                  </div>
                </div>

                <p className="text-xs line-clamp-2">{formData.description || "Description here..."}</p>

                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Full Content</AccordionTrigger>
                    <AccordionContent >
                      <div dangerouslySetInnerHTML={{ __html: formData.richDescription || "" }} >

                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {formData.price && (
                  <div className="pt-2 border-t">
                    <p className="text-sm font-bold ">${formData.price}</p>
                  </div>
                )}

                <div className="flex gap-1 flex-wrap">
                  {formData.isFeatured && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">⭐ Featured</span>
                  )}
                  {formData.isActive && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">✓ Active</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Service Image</CardTitle>
            </CardHeader>
            <CardContent className="relative">

              {
                selectedImageBlob || (initalImage?.url && !(formData?.imageTag === "removed")) ? (

                  <Button variant="destructive"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setSelectedImageBlob("")
                      setFormData((prev) => ({ ...prev, image: null }))
                      if (initalImage) {
                        setFormData((prev) => ({ ...prev, imageTag: "removed" }))
                      }
                    }}
                    className="absolute cursor-pointer rounded-tr-none rounded-bl-none " size="icon-sm" >

                    <Trash2 className="w-4 h-4" />
                  </Button>

                ) : null
              }
              <button

                type="button"
                onClick={() => inputImageRef.current?.click()}
                className="w-full h-32 flex justify-center items-center overflow-hidden hover:bg-amber-50 transition-all duration-200 cursor-pointer bg-amber-50 border-dashed border-2 border-black rounded-xl"
              >
                <Input
                  ref={inputImageRef}
                  onChange={handleInputChangeImage}
                  id="image-Service-uploader"
                  type="file"
                  className="hidden"
                />
                {selectedImageBlob ? (
                  <Image
                    src={selectedImageBlob || "/placeholder.svg"}
                    alt="Service Image"
                    width={500}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Plus className="text-muted w-12 h-12" />
                )}
              </button>
            </CardContent>
          </Card>

          {/* Icon Upload */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Service Icon (File or Link)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 w-full flex items-center justify-center gap-3 pr-8">
              <Input
                className="m-0 w-full"

                id="icon"
                value={formData.icon}
                disabled={selectedIconBlob !== ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    icon: e.target.value,
                  })
                }}
                placeholder="Add link for an icon or upload"
              />

              <div className="flex items-center gap-2">

                <input
                  id="icon-uploader"
                  onChange={handleIconChange}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={formData.icon !== ""}
                />

                {
                  (selectedIconBlob || formData.icon) && (

                    <Button
                      onClick={() => {
                        if (initialData?.icon) {


                          setFormData((prev) => {
                            return {
                              ...prev,
                              icon: "",
                              iconTag: "removed"
                            }
                          })
                          setSelectedIconBlob("")
                        }
                        else {
                          setSelectedIconBlob("")
                          setFormData((prev) => ({ ...prev, icon: "" }))
                        }
                      }}
                      variant="destructive" size="icon-sm" >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )
                }

                <label
                  className={cn(
                    "text-center flex items-center justify-center shadow-sm min-w-8 min-h-8 rounded-md bg-amber-100 hover:bg-amber-50 transition-all duration-200 cursor-pointer",
                    formData.icon !== "" && "bg-amber-50/55 cursor-default",
                  )}
                  htmlFor="icon-uploader"
                >
                  <Cloud className="text-gray-700 w-4 h-4" />
                </label>


                {formData.icon ?
                  <Image
                    src={formData.icon || "/placeholder.svg"}
                    width={32}
                    height={32}
                    alt="Icon"
                    className="w-8 h-8 rounded"
                  />
                  : selectedIconBlob ? (
                    <Image
                      src={selectedIconBlob || "/placeholder.svg"}
                      width={32}
                      height={32}
                      alt="Icon"
                      className="w-8 h-8 rounded"
                    />
                  ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
