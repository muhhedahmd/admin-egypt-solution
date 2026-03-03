"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Trash2, Languages } from "lucide-react"
import type { IHero, Image } from "@/types/schema"
import { useRouter } from "next/navigation"
import BlurredImage from "@/app/_comp/BlurredHashImage"
import { Switch } from "@/components/ui/switch"
import { useToggleActiveMutation, useUpdateHeroMutation } from "@/lib/store/api/hero-api"
import { toast } from "sonner"
import { HeroTranslation } from "./hero.carousel"
import { useLanguage } from "@/providers/lang"

interface HeroCardProps {
  hero: {
    hero: IHero,
    transition: HeroTranslation[]
    backgroundImage?: Image
  }
}

export const HeroCard = React.memo(({ hero }: HeroCardProps) => {
  const router = useRouter()
  const { currentLang } = useLanguage()
  // const [edit, { isLoading }] = useUpdateHeroMutation()
  const [toggle, { isLoading }] = useToggleActiveMutation()

  const currentTranslation = React.useMemo(() => {
    return hero.transition?.find(t => t.lang === currentLang) || {
      id: "",
      name: "",
      ctaText: "",
      description: "",
      secondaryCtaText: "",
      lang: currentLang,
      subtitle: "",
      title: ""
    }
  }, [hero.transition, currentLang])


  const [isActive, setIsActive] = React.useState(hero.hero.isActive)

  const handleChangeActive = async () => {
    try {
      const formData = new FormData()
      formData.append("isActive", String(!hero.hero.isActive))
      const res = await  toggle({
        id: hero.hero.id,
      }).unwrap()
      setIsActive(res.data?.isActive)
      toast.success("Hero updated successfully!")
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <Card className="p-3 group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 w-full">
      <div
        className="w-full h-40 rounded-md relative"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {hero.hero.backgroundColor && (
          <BlurredImage
            alt={hero.backgroundImage?.alt || `${currentTranslation?.name || hero.hero.name}-alt`}
            imageUrl={hero.backgroundImage?.url || ""}
            width={hero.backgroundImage?.width || 0}
            height={hero.backgroundImage?.height || 0}
            className="rounded-md w-full h-full object-cover"
            blurhash={hero.backgroundImage?.blurHash || ""}
            quality={100}
          />
        )}

        {/* Overlay effect */}
        <div
          className="absolute rounded-md z-30 top-0 left-0 w-full h-full flex items-center justify-center"
          style={{
            backgroundColor: hero.hero.overlayColor || "",
            opacity: hero.hero.overlayOpacity || 0,
          }}
        />

        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <p
            className="text-sm font-medium truncate px-2"
            style={{
              color: hero.hero.titleColor || "",
            }}
          >
            {currentTranslation?.title || hero.hero.title}
          </p>
        </div>

        {/* Language indicator badge */}

      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">
              {currentTranslation?.name || hero.hero.name}
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              {hero.hero.variant || "CENTERED"} • {hero.hero.minHeight}px
            </CardDescription>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/admin/sections/hero/${hero.hero.id}/edit`)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              {/* <DropdownMenuItem onClick={() => handleDelete(hero.hero.id)} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="rounded-xl">
        <div className="space-y-2 text-sm">
          <div>
            <p className="text-muted-foreground line-clamp-2">
              {currentTranslation?.description || currentTranslation?.subtitle || hero.hero.description || hero.hero.subtitle || "No description"}
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            {(currentTranslation?.ctaText || hero.hero.ctaText) && (
              <span className="inline-flex items-center px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
                {currentTranslation?.ctaText || hero.hero.ctaText}
              </span>
            )}

            {isActive ? (
              <span className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">
                Active
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium">
                Inactive
              </span>
            )}
            <div className="flex-1 w-full flex items-center justify-end">
              <Switch
                className="bg-emerald-300"
                checked={isActive}
                onCheckedChange={handleChangeActive}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

HeroCard.displayName = "HeroCard"