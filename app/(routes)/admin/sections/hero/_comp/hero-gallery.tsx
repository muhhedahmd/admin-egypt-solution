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

interface HeroGalleryProps {
  initialHeroes: {
    hero: IHero,
    backgroundImage: Image
  }[]

}

export const HeroGallery = React.memo(
  ({ initialHeroes, }: HeroGalleryProps) => {

    const router = useRouter()
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
    console.log({ data :data })


    const filteredHeroes = useMemo(() => {
      // return initialHeroes.filter((hero) => {
      //   const matchesSearch =
      //     hero.hero.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      //     hero.hero.title.toLowerCase().includes(debouncedSearch.toLowerCase())
      //   const matchesVariant = filterVariant === "all" || hero.hero.variant === filterVariant
      //   const matchesStatus = filterStatus === "all" || (filterStatus === "active" ? hero.hero.isActive : !hero.hero.isActive)
      //   return matchesSearch && matchesVariant && matchesStatus
      // })
    }, [initialHeroes, debouncedSearch, filterVariant, filterStatus])

    const handleDelete = (id: string) => {
      // setHeroes((prev) => prev.filter((h) => h.hero.id !== id))
    }

    const handleDuplicate = (hero: HeroData) => {
      const newHero: HeroData = {
        ...hero,
        id: `${hero.id}-${Date.now()}`,
        name: `${hero.name} (Copy)`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }

    const DToRender = data?.data.length && searchTerm ? data.data : initialHeroes 

    return (

      <div className="w-full space-y-6 p-4 md:p-6">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Hero Sections</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {/* {filteredHeroes.length} hero{filteredHeroes.length !== 1 ? "s" : ""} */}
              </p>
            </div>
            <Button onClick={() => router.push("/admin/sections/hero/new")} className="w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              New Hero
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search heroes by name or title..."
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
                <SelectItem value="all">All Variants</SelectItem>
                <SelectItem value="CENTERED">Centered</SelectItem>
                <SelectItem value="SPLIT">Split</SelectItem>
                <SelectItem value="IMAGE_BACKGROUND">Image Background</SelectItem>
                <SelectItem value="MINIMAL">Minimal</SelectItem>
                <SelectItem value="VIDEO_BACKGROUND">Video</SelectItem>
                <SelectItem value="FULL_SCREEN">Full Screen</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        { DToRender && DToRender.length> 0 ? (
          
          <HeroCarousel heroes={DToRender} />
        ) : (



          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground">No heroes found</p>
              <p className="text-sm text-muted-foreground">
                {searchTerm || filterVariant !== "all" || filterStatus !== "all"
                  ? "Try adjusting your filters or search term"
                  : "Create your first hero section to get started"}
              </p>
              {!searchTerm && filterVariant === "all" && filterStatus === "all" && (
                <Button onClick={() => router.push("/admin/sections/hero/new")} variant="outline" className="mt-4 bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Hero
                </Button>
              )}
            </div>
          </div>
        )} 
        {
        isLoading && (
          <div className="space-y-4 p-4">
            <HeroLoader/>
          </div>
        )
      }
      </div>
    )
  },
)

HeroGallery.displayName = "HeroGallery"
