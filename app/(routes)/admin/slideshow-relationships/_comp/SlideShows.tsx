import {
  useGetSlideShowsQuery,
} from "@/lib/store/api/slideShow-api";
import { CompositionType, SlideshowType } from "@/types/schema";
import { SlideShow } from "@/types/slideShows";
import { useMemo, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { SlideHeader } from "@/components/admin/utils/slides/CastomHeaderSlideShow";

import dynamic from "next/dynamic";

const RenderSlides = dynamic(
  () => import("./RenderSlides").then((mod) => mod.RenderSlides),
  { ssr: false }
);

export function slideShowsDemoPreview() {
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
    skip: page * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
  });

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

          // Reset flag after a small delay to prevent duplicate requests
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

const SlideshowCard = ({
  item,
  index,
  bgColor,
  textColor,
}: {
  item: SlideShow;
  index: number;
  bgColor?: string;
  textColor?: string;
}) => {
  const compositionType = useMemo(
    () => CompositionType[item.composition as keyof typeof CompositionType],
    [item.composition]
  );

  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      viewport={{ once: true, margin: "100px" }}
      className="w-full"
    >
      <div
        style={{
          backgroundColor: bgColor,
          color: textColor,
        }}
        className="rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
      >
        <SlideHeader
          compositionType={
            CompositionType[item.composition as keyof typeof CompositionType]
          }
          title={item.title}
          description={item.description || ""}
          slideShowType={SlideshowType[item.type as keyof typeof SlideshowType]}
        />
        <div className="p-6">
          <RenderSlides id={item.id} composition={compositionType} />
        </div>
      </div>
    </motion.div>
  );
};

// {/* <Header />
// <HeroSection />

// <main className=" container mx-auto px-4 py-12">
//   {/* Initial Loading State */}
//   {isLoading && allSlides.length === 0 ? (
//     <div className="space-y-8">
//       {[...Array(3)].map((_, i) => (
//         <div
//           key={i}
//           className=" rounded-lg shadow-sm overflow-hidden"
//         >
//           <div className="h-20  animate-pulse" />
//           <div className="p-6 space-y-4">
//             <div className="h-96 animate-pulse rounded" />
//           </div>
//         </div>
//       ))}
//     </div>
//   ) : (
//     <>
//       {/* Slideshows Grid */}

//       {/* Empty State */}
//       {!isLoading && allSlides.length === 0 && (
//         <div className="text-center py-16">
//           <p className=" text-lg">No slideshows available</p>
//         </div>
//       )}

//       {/* Load More Trigger */}
//       {hasMore && (
//         <div ref={observerTarget} className="h-10 flex items-center justify-center mt-12">
//           {isLoadingMore && (
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 bg-muted rounded-full animate-bounce" />
//               <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
//               <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
//             </div>
//           )}
//         </div>
//       )}

//       {/* End of List */}
//       {!hasMore && allSlides.length > 0 && (
//         <div className="text-center py-12">
//           <p className="text-muted-foreground">You've reached the end</p>
//         </div>
//       )}
//     </>
//   )}
// </main>

// <ContactForm />
// <Footer /> */}
