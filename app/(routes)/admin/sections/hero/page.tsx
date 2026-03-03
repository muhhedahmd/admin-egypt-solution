"use client";

import { useEffect, useState } from "react";

import { HeroGallery } from "./_comp/hero-gallery";
import { Hero_Image, useGetAllHeroesQuery } from "@/lib/store/api/hero-api";
import HeroLoader from "./_comp/hero-loader";
import { Skeleton } from "@/components/ui/skeleton";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { useLanguage } from "@/providers/lang";
import { Translations_landingHero } from "@/i18n/hero";

export default function Home() {
  const [skip, setSkip] = useState(0);
  const { currentLang } = useLanguage();
  const t =
    Translations_landingHero[
      (currentLang?.toLowerCase() as "en" | "ar") || "en"
    ];
  const {
    isFetching,
    data: heroesData,
    isLoading: isLoadingHeroes,
  } = useGetAllHeroesQuery({
    skip,
    take: 10,
  });

  const [ref, entry] = useIntersectionObserver({
    rootMargin: "0px",
    threshold: 0.1,
  });

  const [allHeros, setallHeros] = useState<Hero_Image[]>([]);

  useEffect(() => {
    if (heroesData?.data) {
      setallHeros((prev) => {
        const existing = prev.map((s: any) => s.id);
        const newServices = heroesData?.data?.filter(
          (s: any) => !existing.includes(s.id),
        );
        return [...prev, ...newServices];
      });
    }
  }, [heroesData]);
  useEffect(() => {
    if (entry?.isIntersecting && !isFetching && heroesData?.data) {
      console.log(allHeros.length, heroesData.pagination.totalItems);
      const hasMore = allHeros.length < (heroesData.pagination.totalItems || 0);
      if (hasMore) setSkip((prev) => prev + 1);
    }
  }, [entry, isFetching, heroesData, allHeros.length]);

  if (isLoadingHeroes)
    return (
      <div className="w-full space-y-6 p-4 md:p-6">
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
    );
  return (
    <div className="min-h-screen bg-background">
      <HeroGallery initialHeroes={allHeros as any} />

      <div ref={ref} className="h-20 flex items-center justify-center">
        {isFetching && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>{t.loadingMore}</span>
          </div>
        )}
        {heroesData?.data &&
          allHeros.length >= (heroesData.pagination.totalItems || 0) && (
            <p className="text-sm text-muted-foreground">
              {t.allLoaded} {heroesData.pagination.totalItems || 0}
            </p>
          )}
      </div>
    </div>
  );
}
