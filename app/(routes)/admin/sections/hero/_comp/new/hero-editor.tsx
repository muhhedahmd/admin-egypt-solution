"use client"

import dynamic from "next/dynamic"
import { useState, Suspense, useCallback, useEffect } from "react"
import { Save, X, Eye, EyeOff, Loader } from "lucide-react"
import { toast } from "sonner"
import { useCreateHeroMutation, useUpdateHeroMutation } from "@/lib/store/api/hero-api"
import { IHero, Image } from "@/types/schema"

const PreviewPanel = dynamic(() => import("./hero-preview").then((m) => m.HeroPreview), {
    loading: () => (
        <div className="flex items-center justify-center h-screen">
            <Loader className="animate-spin" />
        </div>
    ),
})

const ControlsPanel = dynamic(() => import("./hero-controls").then((m) => m.HeroControls), {
    loading: () => (
        <div className="space-y-4 p-4">
            <div className="h-40 bg-muted rounded animate-pulse" />
        </div>
    ),
})

interface ApiResponse {
    data: {
        hero: IHero
        backgroundImage?: Image
    }
    message: string
    success: boolean
}

interface HeroEditorProps {
    initialData?: ApiResponse["data"]
}

export const HeroEditor = ({ initialData }: HeroEditorProps) => {
    const [previewMode, setPreviewMode] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [createHero, { isLoading: isCreating }] = useCreateHeroMutation()
    const [updateHero, { isLoading: isUpdating }] = useUpdateHeroMutation()
    
    const isEditMode = !!initialData?.hero?.id
    const isSaving = isCreating || isUpdating

    const [heroData, setHeroData] = useState<Partial<IHero> & { backgroundImageUrl?: string }>({
        name: "Main Hero",
        title: "Welcome to Our Platform",
        subtitle: "Build Amazing Things",
        description: "Create stunning websites with our powerful tools and intuitive interface.",
        backgroundImageUrl: "",
        backgroundColor: "#1a1a2e",
        overlayColor: "#000000",
        overlayOpacity: 0.5,
        ctaText: "Get Started",
        ctaUrl: "/contact",
        ctaVariant: "PRIMARY",
        secondaryCtaText: "Learn More",
        secondaryCtaUrl: "/about",
        secondaryCtaVariant: "GHOST",
        alignment: "CENTER",
        variant: "CENTERED",
        minHeight: 600,
        titleSize: "4xl",
        titleColor: "#ffffff",
        subtitleColor: "#a0a0a0",
        descriptionColor: "#cccccc",
        showScrollIndicator: true,
        customCSS: "",
        styleOverrides: {},
        isActive: true,
    })

    const [newImage, setNewImage] = useState<File | null>(null)
    const [existingImage, setExistingImage] = useState<Image | undefined>(undefined)
    const [imageChanged, setImageChanged] = useState(false)

    // Initialize with existing data if editing
    useEffect(() => {
        if (initialData?.hero) {
            const hero = initialData.hero
            const bgImage = initialData.backgroundImage
            
            setHeroData({
                id: hero.id,
                name: hero.name,
                title: hero.title,
                subtitle: hero.subtitle,
                description: hero.description,
                backgroundImageId: hero.backgroundImageId,
                backgroundImageUrl: bgImage?.url || "",
                backgroundColor: hero.backgroundColor,
                backgroundVideo: hero.backgroundVideo,
                overlayColor: hero.overlayColor,
                overlayOpacity: hero.overlayOpacity,
                ctaText: hero.ctaText,
                ctaUrl: hero.ctaUrl,
                ctaVariant: hero.ctaVariant,
                secondaryCtaText: hero.secondaryCtaText,
                secondaryCtaUrl: hero.secondaryCtaUrl,
                secondaryCtaVariant: hero.secondaryCtaVariant,
                alignment: hero.alignment,
                variant: hero.variant,
                minHeight: hero.minHeight,
                titleSize: hero.titleSize,
                titleColor: hero.titleColor,
                subtitleColor: hero.subtitleColor,
                descriptionColor: hero.descriptionColor,
                showScrollIndicator: hero.showScrollIndicator,
                customCSS: hero.customCSS,
                styleOverrides: hero.styleOverrides,
                isActive: hero.isActive,
            })
            
            if (bgImage) {
                setExistingImage(bgImage)
            }
        }
    }, [initialData])

    const updateField = useCallback((field: string, value: any) => {
        setHeroData((prev) => ({ ...prev, [field]: value }))
    }, [])

    const handleImageUpload = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0]
            if (!file) return

            setUploadingImage(true)
            try {
                const reader = new FileReader()
                reader.onload = () => {
                    setNewImage(file)
                    setImageChanged(true)
                    updateField("backgroundImageUrl", URL.createObjectURL(file))
                }
                reader.readAsDataURL(file)
            } catch (error) {
                console.error("Error uploading image:", error)
                toast.error("Failed to upload image")
            } finally {
                setUploadingImage(false)
            }
        },
        [updateField],
    )

    const removeImage = useCallback(() => {
        setNewImage(null)
        setExistingImage(undefined)
        setImageChanged(true)
        updateField("backgroundImageUrl", "")
        updateField("backgroundImageId", null)
    }, [updateField])

    const prepareUpdateData = useCallback(() => {
        const updateData: any = {
            name: heroData.name,
            title: heroData.title,
            subtitle: heroData.subtitle || null,
            description: heroData.description || null,
            backgroundColor: heroData.backgroundColor || null,
            backgroundVideo: heroData.backgroundVideo || null,
            overlayColor: heroData.overlayColor || null,
            overlayOpacity: heroData.overlayOpacity ?? null,
            ctaText: heroData.ctaText || null,
            ctaUrl: heroData.ctaUrl || null,
            ctaVariant: heroData.ctaVariant || null,
            secondaryCtaText: heroData.secondaryCtaText || null,
            secondaryCtaUrl: heroData.secondaryCtaUrl || null,
            secondaryCtaVariant: heroData.secondaryCtaVariant || null,
            alignment: heroData.alignment || null,
            variant: heroData.variant,
            minHeight: heroData.minHeight ?? null,
            titleSize: heroData.titleSize || null,
            titleColor: heroData.titleColor || null,
            subtitleColor: heroData.subtitleColor || null,
            descriptionColor: heroData.descriptionColor || null,
            showScrollIndicator: heroData.showScrollIndicator ?? false,
            customCSS: heroData.customCSS || null,
            styleOverrides: heroData.styleOverrides || null,
            isActive: heroData.isActive ?? true,
        }

        // Handle background image changes
        if (imageChanged) {
            if (newImage) {
                // New image uploaded
                updateData.hasNewImage = true ,
                updateData.imageState = "UPDATE"
                
            } else {
                // Image removed
                updateData.backgroundImageId = null
                updateData.removeImage = true ,
                updateData.imageState = "REMOVE"
            }
        } else if (existingImage) {
            // Keep existing image
            updateData.imageState = "KEEP"
            updateData.backgroundImageId = existingImage.id
        }

        return updateData
    }, [heroData, newImage, existingImage, imageChanged])

    const handleSave = useCallback(async () => {
        try {
            if (isEditMode && initialData?.hero?.id) {
                // UPDATE MODE
                const updatePayload = prepareUpdateData()
                
                console.log("Update Payload:", updatePayload)
                console.log("Has new image?", !!newImage)
                console.log("Image changed?", imageChanged)
                
                // If there's a new image, use FormData
                if (newImage) {
                    const formData = new FormData()
                    
                    // Append all update fields
                    Object.entries(updatePayload).forEach(([key, value]) => {
                        if (value !== null && value !== undefined && key !== 'hasNewImage') {
                            if (typeof value === "object" && !(value instanceof File)) {
                                formData.append(key, JSON.stringify(value))
                            } else {
                                formData.append(key, String(value))
                            }
                        }
                    })
                    
                    // Append the new image
                    formData.append("backgroundImage", newImage)
                    
                    const result = await updateHero({ 
                        id: initialData.hero.id,
                        formData, 
                        // data: formData 
                    }).unwrap()
                    
                    console.log("Update result:", result)
                } else {
                    // No new image, send JSON
                    const result = await updateHero({ 
                        id: initialData.hero.id, 
                        formData: updatePayload 
                    }).unwrap()
                    
                    console.log("Update result:", result)
                }
                
                toast.success("Hero section updated successfully")
                setImageChanged(false)
            } else {
                // CREATE MODE
                const formData = new FormData()

                // Append all form fields
                Object.entries(heroData).forEach(([key, value]) => {
                    if (key === "backgroundImageUrl") return
                    if (key === "backgroundImageId" && value === null) return
                    
                    if (value !== null && value !== undefined) {
                        if (typeof value === "object" && !(value instanceof File)) {
                            formData.append(key, JSON.stringify(value))
                        } else {
                            formData.append(key, String(value))
                        }
                    }
                })

                // Append the image file if it exists
                if (newImage) {
                    formData.append("backgroundImage", newImage)
                }
                
                const result = await createHero(formData).unwrap()
                
                console.log("Create result:", result)
                toast.success("Hero section created successfully")
            }
        } catch (error) {
            console.error("Error saving:", error)
            toast.error(`Failed to ${isEditMode ? 'update' : 'save'} hero section`)
        }
    }, [heroData, newImage, isEditMode, initialData?.hero?.id, createHero, updateHero, prepareUpdateData, imageChanged])

    return (
        <div className="flex h-screen bg-background">
            {/* Controls Sidebar */}
            <div className="w-full md:w-96 bg-card border-r border-border overflow-y-auto shadow-lg flex flex-col">
                <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card/95 backdrop-blur z-10">
                    <h2 className="text-lg font-bold text-foreground">
                        Hero Editor {isEditMode && <span className="text-sm text-muted-foreground">(Edit Mode)</span>}
                    </h2>
                    <button
                        onClick={() => setPreviewMode(!previewMode)}
                        className="md:hidden p-2 hover:bg-muted rounded transition-colors"
                    >
                        {previewMode ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Loading controls...</div>}>
                        <ControlsPanel
                            heroData={heroData}
                            updateField={updateField}
                            handleImageUpload={handleImageUpload}
                            removeImage={removeImage}
                            uploadingImage={uploadingImage}
                            hasExistingImage={!!existingImage}
                            imageChanged={imageChanged}
                        />
                    </Suspense>
                </div>

                <div className="p-4 border-t border-border bg-card/95 backdrop-blur flex gap-2">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 font-medium"
                    >
                        {isSaving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
                        {isSaving ? "Saving..." : isEditMode ? "Update" : "Save"}
                    </button>
                </div>
            </div>

            {/* Preview */}
            <div className="hidden md:flex flex-1 bg-muted/30 overflow-auto p-8">
                <div className="w-full max-w-6xl flex items-center justify-center mx-auto">
                    <Suspense
                        fallback={
                            <div className="flex items-center justify-center w-full h-96">
                                <Loader className="animate-spin" />
                            </div>
                        }
                    >
                        <PreviewPanel heroData={heroData} bgImage={existingImage} />
                    </Suspense>
                </div>
            </div>

            {/* Mobile Preview Modal */}
            {previewMode && (
                <div className="fixed inset-0 md:hidden bg-black/50 z-50 overflow-auto">
                    <div className="p-4 flex flex-col h-full">
                        <button
                            onClick={() => setPreviewMode(false)}
                            className="self-end mb-4 p-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
                        >
                            <X size={24} />
                        </button>
                        <div className="flex-1 overflow-auto">
                            <Suspense
                                fallback={
                                    <div className="flex items-center justify-center w-full">
                                        <Loader className="animate-spin" />
                                    </div>
                                }
                            >
                                <PreviewPanel heroData={heroData} bgImage={existingImage} />
                            </Suspense>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}