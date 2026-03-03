"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
// import '@boomslag/nextjs-richtext/styles/';

import { useRouter } from "next/navigation";
import {
  Check,
  Cloud,
  Loader2,
  Plus,
  Save,
  X,
  AlertCircle,
  Replace,
  Trash2,
  ReplaceIcon,
  DeleteIcon,
  SaveIcon,
  Delete,
} from "lucide-react";
import {
  useCreateServiceMutation,
  useLazyCheckOrderQuery,
  useUpdateServiceMutation,
} from "@/lib/store/api/services-api";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Service } from "@/types/schema";
import { Image as ImageSchemaType } from "@/types/services";
import BlurredImage from "@/app/_comp/BlurredHashImage";
import { Badge } from "../ui/badge";
import { serviceFormI18n } from "@/i18n/services";
import { useLanguage } from "@/providers/lang";
import { toast } from "sonner";

interface ServiceFormProps {
  initialData?: Service & {
    iconImage?: File | null;
    image?: File | null;
  };
  initalImage?: ImageSchemaType | null;
}

interface ValidationErrors {
  title?: string;
  // slug?: string
  description?: string;
  richDescription?: string;
  price?: string;
  order?: string;
}

const validateForm = (formData: any): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!formData.name?.trim()) {
    errors.title = "Title is required";
  }

  if (!formData.description?.trim()) {
    errors.description = "Short description is required";
  } else if (formData.description.length < 10) {
    errors.description = "Description must be at least 10 characters";
  }

  if (!formData.richDescription?.trim()) {
    errors.richDescription = "Full description is required";
  } else if (formData.richDescription.length < 20) {
    errors.richDescription = "Full description must be at least 20 characters";
  }

  if (formData.price && isNaN(+formData.price)) {
    errors.price = "Price must be a valid number (e.g., 99.99)";
  }

  if (formData.order < 0) {
    errors.order = "Order must be a positive number";
  }

  return errors;
};

export function ServiceForm({ initialData, initalImage }: ServiceFormProps) {
  const [cerateService, { isLoading: isLoading }] = useCreateServiceMutation();
  const [updateService, { isLoading: isupdating }] = useUpdateServiceMutation();
  const isCreating = isLoading || isupdating;
  const { currentLang } = useLanguage();
  const t =
    serviceFormI18n[(currentLang?.toLowerCase() as "en" | "ar") || "en"];

  const [formData, setFormData] = useState({

    name: initialData?.name || "",
    description: initialData?.description || "",
    richDescription:
      initialData?.richDescription ||
      `
  `,
    order: initialData?.order ?? 1,
    icon: initialData?.icon || "/icons/theme.svg",
    iconImage: initialData?.iconImage || null,
    image: initialData?.image || null,
    // slug: initialData?.slug || "modern-business-theme",
    // id: initialData?.id || "",
    price: initialData?.price || "149.00",
    isActive: initialData?.isActive ?? true,
    isFeatured: initialData?.isFeatured ?? false,
    imageTag: "Keep",
    iconTag: "Keep",
  });

  useEffect(() => {
    setFormData({

      name: initialData?.name || "",
      description: initialData?.description || "",
      richDescription:
        initialData?.richDescription || ``,
      order: initialData?.order ?? 1,
      icon: initialData?.icon || "/icons/theme.svg",
      iconImage: initialData?.iconImage || null,
      image: initialData?.image || null,
      price: initialData?.price || "149.00",
      isActive: initialData?.isActive ?? true,
      isFeatured: initialData?.isFeatured ?? false,
      imageTag: "Keep",
      iconTag: "Keep",
    })



  }, [initialData])

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const [selectedImageBlob, setSelectedImageBlob] = useState("");
  const [selectedIconBlob, setSelectedIconBlob] = useState("");
  const inputImageRef = useRef<HTMLInputElement>(null);

  const handleInputChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImageBlob(URL.createObjectURL(e.target.files[0]));
      setFormData({ ...formData, image: e.target.files[0] });
      if (initialData?.image) {
        setFormData({ ...formData, imageTag: "Replaced" });
      }
    }
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedIconBlob(URL.createObjectURL(e.target.files[0]));
      setFormData({ ...formData, iconImage: e.target.files[0] });
      if (initialData?.icon) {
        setFormData({ ...formData, iconTag: "Replaced" });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm(formData);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Validation Error", {
        description: "Please fix all errors before submitting",
        // variant: "destructive",
      });
      return;
    }

    try {
      // Create FormData for file uploads
      const submitData = new FormData();
      submitData.append("name", formData.name);
      // submitData.append("slug", formData.slug)
      submitData.append("description", formData.description);
      submitData.append("richDescription", formData.richDescription);
      submitData.append("price", formData.price?.toString() || "");
      submitData.append("order", formData.order.toString());
      submitData.append("isActive", formData?.isActive ? "true" : "false");
      submitData.append("isFeatured", formData?.isFeatured ? "true" : "false");
      submitData.append("icon", formData?.icon || "");

      if (formData.image) {
        submitData.append("image", formData.image);
      }
      if (formData.iconImage) {
        submitData.append("iconImage", formData.iconImage);
      }

      if (initialData?.id) {
        updateService({
          id: initialData?.id!,
          body: submitData,
        });
      } else {
        await cerateService(submitData).unwrap();
      }

      toast.success(
        initialData?.id ? t.toast.updateSuccess : t.toast.createSuccess,
        {
          description: initialData?.id
            ? t.toast.updateSuccess
            : t.toast.createSuccess,
          //  action  :<> </>
        }
      );

      // Redirect after successful submission
      // setTimeout(() => {
      //   router.push("/admin/services")
      // }, 1500)
    } catch (error: any) {
      toast.error("Error", {
        description: error?.message || "Failed to save service",
      });
      console.error("Submit error:", error);
    }
  };

  return (
    <div className="w-full space-y-6">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative"
      >
        <div className="lg:col-span-2 space-y-6">
          {Object.keys(validationErrors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold mb-2">
                  {t["messages"]["validationError"]}
                </p>
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
              <CardTitle>{t["page"]["basicInfo"]}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t["fields"]["title"]}*</Label>
                <Input
                  id="title"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    });
                    if (validationErrors.title) {
                      setValidationErrors({
                        ...validationErrors,
                        title: undefined,
                      });
                    }
                  }}
                  placeholder="Web Development"
                  className={validationErrors.title ? "border-red-500" : ""}
                />
                {validationErrors.title && (
                  <p className="text-sm text-red-500">
                    {validationErrors.title}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  {t["fields"]["shortDescription"]} *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (validationErrors.description) {
                      setValidationErrors({
                        ...validationErrors,
                        description: undefined,
                      });
                    }
                  }}
                  placeholder="Brief description of the service"
                  rows={3}
                  className={
                    validationErrors.description ? "border-red-500" : ""
                  }
                />
                {validationErrors.description && (
                  <p className="text-sm text-red-500">
                    {validationErrors.description}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="richDescription">
                  {t["fields"]["fullDescription"]} *
                </Label>

                <Textarea
                  id="richDescription"
                  value={formData.richDescription}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      richDescription: e.target.value,
                    });
                    if (validationErrors.richDescription) {
                      setValidationErrors({
                        ...validationErrors,
                        richDescription: undefined,
                      });
                    }
                  }}
                  placeholder="Detailed service information..."
                  rows={4}
                  className={
                    validationErrors.richDescription ? "border-red-500" : ""
                  }
                />
                {validationErrors.richDescription && (
                  <p className="text-sm text-red-500">
                    {validationErrors.richDescription}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">{t["fields"]["price"]}</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => {
                      setFormData({ ...formData, price: e.target.value });
                      if (validationErrors.price) {
                        setValidationErrors({
                          ...validationErrors,
                          price: undefined,
                        });
                      }
                    }}
                    placeholder="$99.99"
                    className={validationErrors.price ? "border-red-500" : ""}
                  />
                  {validationErrors.price && (
                    <p className="text-sm text-red-500">
                      {validationErrors.price}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>{t["page"]["settings"]}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.isFeatured || false}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isFeatured: checked })
                  }
                />
                <Label htmlFor="featured">{t["states"]["featured"]}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="Active"
                  checked={formData.isActive || false}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label htmlFor="Active">{t["states"]["active"]}</Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Button type="submit" disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t["actions"]["saving"]}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {initialData?.id
                    ? `${t["actions"]["update"]}`
                    : `${t["actions"]["create"]}`}
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
                {formData.imageTag === "Replace" ? (
                  <Badge
                    className="absolute z-100 bg-secondary rounded-tr-none rounded-bl-none"
                    variant={"outline"}
                  >
                    <Replace className="w-4 h-4 " />
                    Replaced
                  </Badge>
                ) : formData.imageTag === "Keep" ? (
                  <Badge
                    className="absolute z-100 bg-primary text-secondary rounded-tr-none rounded-bl-none"
                    variant={"default"}
                  >
                    <Save className="w-4 h-4 " />
                    Keep
                  </Badge>
                ) : formData.imageTag === "removed" ? (
                  <Badge
                    className=" dark:bg-[#4f1116] absolute z-100 bg-secondary rounded-tr-none rounded-bl-none"
                    variant={"destructive"}
                  >
                    <Delete className="w-4 h-4 " />
                    removed
                  </Badge>
                ) : null}

                {selectedImageBlob ? (
                  <Image
                    src={selectedImageBlob || "/placeholder.svg"}
                    alt="Service"
                    width={300}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : initalImage &&
                  formData?.imageTag &&
                  !(formData?.imageTag === "removed") ? (
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
                  {initialData?.icon && formData.iconTag === "Replaced" ? (
                    <Badge variant={"default"} className=" h-8">
                      <ReplaceIcon className="w-4 h-4" />
                      Replaced
                    </Badge>
                  ) : initialData?.icon && formData.iconTag === "removed" ? (
                    <Badge variant={"destructive"} className=" h-8">
                      <DeleteIcon className="w-4 h-4" />
                      Removed
                    </Badge>
                  ) : initialData?.icon && formData.iconTag === "Keep" ? (
                    <Badge variant={"secondary"} className="h-8">
                      <SaveIcon className="w-4 h-4" />
                      Keep
                    </Badge>
                  ) : null}
                  {formData.icon || selectedIconBlob ? (
                    formData.icon.startsWith("http") ||
                      selectedIconBlob.startsWith("http") ? (
                      <Image
                        src={
                          formData.icon ||
                          selectedIconBlob ||
                          "/placeholder.svg"
                        }
                        width={32}
                        height={32}
                        alt="Icon"
                        className="w-8 h-8 rounded-md shadow-md object-cover"
                      />
                    ) : (
                      <span className="w-4 h-4  text-center  flex items-center justify-center rounded-md overflow-hidden text-sm ">
                        {" "}
                        {formData.icon || selectedIconBlob}
                      </span>
                    )
                  ) : null}
                  <div className="flex-1">
                    <h3 className="font-bold text-sm ">
                      {formData.name || "Service Title"}
                    </h3>
                  </div>
                </div>

                <p className="text-xs line-clamp-2">
                  {formData.description || "Description here..."}
                </p>

                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      {t["page"]["fullContent"]}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: formData.richDescription || "",
                        }}
                      ></div>
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
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                      ⭐ {t["states"]["featured"]}
                    </span>
                  )}
                  {formData.isActive && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      ✓ {t["states"]["active"]}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>{t["page"]["serviceImage"]}</CardTitle>
            </CardHeader>
            <CardContent className="relative">
              {selectedImageBlob ||
                (initalImage?.url && !(formData?.imageTag === "removed")) ? (
                <Button
                  variant="destructive"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedImageBlob("");
                    setFormData((prev) => ({ ...prev, image: null }));
                    if (initalImage) {
                      setFormData((prev) => ({ ...prev, imageTag: "removed" }));
                    }
                  }}
                  className="absolute cursor-pointer rounded-tr-none rounded-bl-none  z-10"
                  size="icon-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              ) : null}
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
                    alt="Service"
                    width={300}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : initalImage &&
                  formData?.imageTag &&
                  !(formData?.imageTag === "removed") ? (
                  <BlurredImage
                    imageUrl={initalImage.url || "/placeholder.svg"}
                    blurhash={initalImage.blurHash || ""}
                    alt={initalImage.alt || "Service-alt"}
                    width={initalImage.width || 300}
                    height={initalImage.height || 128}
                    quality={100}
                    className="w-full h-full object-cover rounded-b-none"
                  />
                ) : (
                  <div className="w-full h-full text-lg text-secondary  flex items-center justify-center">
                    <Plus />
                  </div>
                )}
              </button>
            </CardContent>
          </Card>

          {/* Icon Upload */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>{t["page"]["serviceIcon"]} (File or Link)</CardTitle>
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
                  });
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

                {(selectedIconBlob || formData.icon) && (
                  <Button
                    onClick={() => {
                      if (initialData?.icon) {
                        setFormData((prev) => {
                          return {
                            ...prev,
                            icon: "",
                            iconTag: "removed",
                          };
                        });
                        setSelectedIconBlob("");
                      } else {
                        setSelectedIconBlob("");
                        setFormData((prev) => ({ ...prev, icon: "" }));
                      }
                    }}
                    variant="destructive"
                    size="icon-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}

                <label
                  className={cn(
                    "text-center flex items-center justify-center shadow-sm min-w-8 min-h-8 rounded-md bg-amber-100 hover:bg-amber-50 transition-all duration-200 cursor-pointer",
                    formData.icon !== "" && "bg-amber-50/55 cursor-default"
                  )}
                  htmlFor="icon-uploader"
                >
                  <Cloud className="text-gray-700 w-4 h-4" />
                </label>

                {formData.icon || selectedIconBlob ? (
                  formData.icon.startsWith("http") ||
                    selectedIconBlob.startsWith("http") ? (
                    <Image
                      src={
                        formData.icon || selectedIconBlob || "/placeholder.svg"
                      }
                      width={32}
                      height={32}
                      alt="Icon"
                      className="w-8 h-8 rounded-md shadow-md object-cover"
                    />
                  ) : (
                    <span className="w-4 h-4  text-center  flex items-center justify-center rounded-md overflow-hidden text-sm ">
                      {" "}
                      {formData.icon || selectedIconBlob}
                    </span>
                  )
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
