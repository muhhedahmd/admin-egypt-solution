import {
  useGetSlideShowsQuery,
} from "@/lib/store/api/slideShow-api";
import { SlideShow } from "@/types/slideShows";
import {  useRef, useState, useEffect } from "react";
import {  AnimatePresence } from "framer-motion";
import { SlideshowCard } from "./slideShowCard";




export function slideShowsDemoPreview({ onLoad }: { onLoad?: () => void }) {
  const [page, setPage] = useState(0);
  const [allSlides, setAllSlides] = useState<SlideShow[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const ITEMS_PER_PAGE = 10;
  const observerTarget = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const {
    data: slideshowsData,
    isLoading,
    isError,
  } = useGetSlideShowsQuery({
    skip: page,
    take: ITEMS_PER_PAGE,
  });

    useEffect(() => {
    if (!isLoading && slideshowsData) {
      onLoad?.()
    }
  }, [isLoading, slideshowsData])
  
  // Update slides when new data arrives
  useEffect(() => {
    if (!slideshowsData?.data) return;
    setIsLoadingMore(false);

    const newSlides = slideshowsData.data.filter(
      (newSlide) => !allSlides.some((existing) => existing.id === newSlide.id)
    );

    if (newSlides.length > 0) {
      setAllSlides((prev) => [...prev, ...newSlides]);
    }

    if (slideshowsData.pagination) {
      const { currentPage, totalPages } = slideshowsData.pagination;
      setHasMore(currentPage < totalPages);
    }
    
  }, [slideshowsData]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isLoading &&
          !loadingRef.current
        ) {
          loadingRef.current = true;
          setIsLoadingMore(true);
          setPage((prev) => prev + 1);

          setTimeout(() => {
            loadingRef.current = false;
          }, 500);
        }
      },
      {
        rootMargin: "500px",
        threshold: 0.1,
      }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading]);

  if (isError && allSlides.length === 0) {
    return (
      <div className="min-h-screen ">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-gray-600 mb-6 text-lg">
              Failed to load slideshows
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-muted text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <AnimatePresence mode="popLayout">
        <div className="space-y-6">
          {allSlides.map((item, index) => (
            <SlideshowCard
             autoPlay={item.autoPlay}
             interval={item.interval}
              key={item.id}
              item={item}
              index={index}
              bgColor={item.background || ""}
              textColor={""}
            />
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}

