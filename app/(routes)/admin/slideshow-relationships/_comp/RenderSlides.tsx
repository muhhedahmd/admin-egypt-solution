"use client";
import { CompositionPreview } from "@/components/admin/utils/slides/compositionPreviw";
import { usePaginatedSlidesMutation } from "@/lib/store/api/slideShow-api";
import { CompositionType } from "@/types/schema";
import { useEffect, useRef } from "react";


export const RenderSlides = ({

  id,
  composition,
}: {
  id: string;
  composition: CompositionType;
}) => {
  const [triggerGetSlides, { data: slidesData, isLoading: slidesLoading }] =
    usePaginatedSlidesMutation();

  const hasTriggered = useRef(false);

  useEffect(() => {
    if (!hasTriggered.current) {
      hasTriggered.current = true;
      triggerGetSlides({
        id,
        page: 1,
        perPage: 50,
      });
    }
  }, [id, triggerGetSlides]);

  if (slidesLoading) {
    return <div className="h-96 rounded-lg animate-pulse" />;
  }

  if (!slidesData?.data.slides || slidesData.data.slides.length === 0) {
    return null;
  }

  const transformedSlides = slidesData.data.slides.map((item) => ({
    ...item.data,
    type: item.type,
    order: item.order,
  }));

  return (
    <CompositionPreview

        composition={composition}
        slides={transformedSlides as any}

    />
  );
};