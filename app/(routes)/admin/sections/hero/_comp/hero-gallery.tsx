"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search } from "lucide-react"
import type { HeroData, IHero, Image } from "@/types/schema"
import { HeroCarousel } from "./hero.carousel"
import { useRouter } from "next/navigation"
import { useDebounce } from "@uidotdev/usehooks"
import { useLazyHeroesSearchQuery } from "@/lib/store/api/hero-api"
import HeroLoader from "./hero-loader"
import { useLanguage } from "@/providers/lang"
import { heroGalleryI18n } from "@/i18n/hero"

interface HeroGalleryProps {
  initialHeroes: {
    hero: IHero,
    backgroundImage: Image
  }[]

}

export const HeroGallery = React.memo(
  ({ initialHeroes, }: HeroGalleryProps) => {

    const router = useRouter()
    const { currentLang } = useLanguage()
    const t = heroGalleryI18n[currentLang?.toLowerCase() as "en" | "ar" || "en"]
    const [searchTerm, setSearchTerm] = useState("")
    const [filterVariant, setFilterVariant] = useState<string>("all")
    const [filterStatus, setFilterStatus] = useState<string>("all")

    const debouncedSearch = useDebounce(searchTerm, 300)
    const [search, { data, isLoading }] = useLazyHeroesSearchQuery()
    useEffect(() => {
      if (debouncedSearch) {
        search({
          q: debouncedSearch
        })
      }
    }, [debouncedSearch])


    const DToRender = data?.data.length && searchTerm ? data.data : initialHeroes
    console.log(DToRender, data, initialHeroes)
    return (

      <div className="w-full space-y-6 p-4 md:p-6">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
              <p className="text-sm text-muted-foreground mt-1">
              </p>
            </div>
            <Button onClick={() => router.push("/admin/sections/hero/new")} className="w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              {t.newHero}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterVariant} onValueChange={setFilterVariant}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by variant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.filters.allVariants}</SelectItem>
                <SelectItem value="CENTERED">{t.filters.variants["CENTERED"]}</SelectItem>
                <SelectItem value="SPLIT">{t.filters.variants["SPLIT"]}</SelectItem>
                <SelectItem value="IMAGE_BACKGROUND">{t.filters.variants["IMAGE_BACKGROUND"]}</SelectItem>
                <SelectItem value="MINIMAL">{t.filters.variants["MINIMAL"]}</SelectItem>
                <SelectItem value="VIDEO_BACKGROUND">{t.filters.variants["VIDEO_BACKGROUND"]}</SelectItem>
                <SelectItem value="FULL_SCREEN">{t.filters.variants["FULL_SCREEN"]}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.filters.allStatus}</SelectItem>
                <SelectItem value="active">{t.filters.status["active"]}</SelectItem>
                <SelectItem value="inactive">{t.filters.status["inactive"]}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {DToRender && DToRender.length > 0 ? (

          <HeroCarousel heroes={DToRender} />
        ) : (

          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground">
                {t.emptyState.title}
              </p>

              <p className="text-sm text-muted-foreground">
                {searchTerm || filterVariant !== "all" || filterStatus !== "all"
                  ? t.emptyState.filteredHint
                  : t.emptyState.emptyHint}
              </p>

              {!searchTerm && filterVariant === "all" && filterStatus === "all" && (
                <Button
                  onClick={() => router.push("/admin/sections/hero/new")}
                  variant="outline"
                  className="mt-4 bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t.emptyState.createHero}
                </Button>
              )}
            </div>
          </div>

        )}
        {
          isLoading && (
            <div className="space-y-4 p-4">
              <HeroLoader />
            </div>
          )
        }
      </div>
    )
  },
)

HeroGallery.displayName = "HeroGallery"
