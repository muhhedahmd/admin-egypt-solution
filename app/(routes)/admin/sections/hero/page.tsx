"use client"

import {  useMemo, useState } from "react"

import { HeroGallery } from "./_comp/hero-gallery"
import { useGetAllHeroesQuery } from "@/lib/store/api/hero-api"
import { IHero, Image } from "@/types/schema"
import HeroLoader from "./_comp/hero-loader"
import { Skeleton } from "@/components/ui/skeleton"


export default function Home() {
  const [selectedHero, setSelectedHero] = useState<IHero | null>(null)
  const [skip, setSkip] = useState(0)
  const {
    data: heroesData,
    isLoading: isLoadingHeroes

  } = useGetAllHeroesQuery({
    skip,
    take: 10
  })
  const [heroes, setHeroes] = useState<{ hero: IHero, backgroundImage: Image }[]>([])
  const MemoHeroes = useMemo(() => {
    if (heroesData?.data) {
      setHeroes(heroesData.data)
    }
  }, [heroesData])

  console.log(heroes)
 

  const handleDelete = (id: string) => {
    setHeroes((prev) => prev.filter((h) => h.hero.id !== id))
  }



  const handleAddNew = () => {
    // const newHero: IHero = {
    //   id: `new-${Date.now()}`,
    //   name: "New Hero",
    //   title: "Your Title Here",
    //   subtitle: "Your subtitle",
    //   backgroundColor: "#ffffff",
    //   titleColor: "#000000",
    //   variant: "CENTERED",
    //   minHeight: 600,
    //   isActive: true,
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // }
    // setSelectedHero(newHero)
    setView("editor")
  }


  if (isLoadingHeroes) return <div className="w-full space-y-6 p-4 md:p-6">
    {/* Header */}
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Skeleton className="w-32 h-8 animate-wave" />
        </div>
        <Skeleton className="w-32 h-8 animate-wave" />
      </div>


      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Skeleton className="w-full h-8 animate-wave" />
         
        </div>


        <Skeleton className=" animate-wave w-full sm:w-40" />

      </div>
    </div>
    <HeroLoader />


  </div>
  return (
    <div className="min-h-screen bg-background">

      <HeroGallery
        
        initialHeroes={heroes}
        // onEdit={handleEdit}
      // onDuplicate={handleDuplicate}
      />

    </div>
  )
}

// <div className="w-full h-screen">

//       <HeroEditor
//         initialHero={selectedHero}
//         onSave={(hero) => {
//           if (selectedHero?.id.startsWith("new-")) {
//             setHeroes((prev) => [...prev, hero])
//           } else {
//             setHeroes((prev) => prev.map((h) => (h.id === hero.id ? hero : h)))
//           }
//           setView("gallery")
//         }}
//         onCancel={() => setView("gallery")}
//       />
//     </div>