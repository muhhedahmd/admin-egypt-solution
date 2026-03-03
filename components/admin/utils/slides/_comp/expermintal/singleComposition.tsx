import {  RefObject, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { slide } from "@/types/schema";
// import { TypeToRender } from "../TypeToRender";
import { useGSAP } from "@gsap/react";
import GenricSingle from "../cardProd/generic/Single";
// import { useSectionVisibility } from "@/composnents/contact/SectionVisibilityContext";
// import GenricSingle from "../CardProd/generic/Single";

gsap.registerPlugin(ScrollTrigger);
// const slides = mockSlides

const SingleComposition = ({  slides }: {  slides: slide[] }) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<(HTMLDivElement | null)[]>([]);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentRTL = (slides as any )?.[0]?.lang === "AR" ? "RTL" :"LTR"
  const isRTL = currentRTL === "RTL"


  useGSAP(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track || slides.length === 0) return;


    const scrollWidth =
  cardRef.current.reduce((acc, el) => acc + (el?.offsetWidth || 0), 0)
  - wrapper.offsetWidth;

    const st = gsap.to(track, {
      x: isRTL ? scrollWidth +300 :-scrollWidth -300,
      ease: "none",
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: () => `+=${scrollWidth +300}`,
        scrub: 1,
        pin: true,
        snap: 1 / (slides.length - 1),
      
        // markers: true,
      },
      // markers: true,
    });

    return () => {
      st.scrollTrigger?.kill();
      st.kill();
    };
  }, {
    dependencies: [slides.length , isRTL],
    scope: wrapperRef
  });

  // const goToIndex = (index: number) => {
  //   const wrapper = wrapperRef.current;
  //   const track = trackRef.current;
  //   if (!wrapper || !track) return;

  //   const scrollWidth = track.scrollWidth - wrapper.offsetWidth;
  //   const progress = index / Math.max(1, slides.length - 1);

  //   gsap.to(track, {
  //     x: -scrollWidth * progress,
  //     duration: 0.6,
  //     ease: "power2.out",
  //   });

  //   setActiveIndex(index);
  // };

  // const { setSingleCompositionVisible } = useSectionVisibility();

  // useEffect(() => {
  //   if (!wrapperRef.current) return;

  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
        
  //       setSingleCompositionVisible(entry.isIntersecting);
  //     },
  //     { threshold: 0.3 }
  //   );

  //   observer.observe(wrapperRef.current);

  //   return () => observer.disconnect();
  // }, [setSingleCompositionVisible , wrapperRef]);


  return (
    <div ref={wrapperRef} className=" relative w-screen  min-h-screen overflow-x-hidden">
     
      <div ref={trackRef}
      
      className="flex pr-40  justify-start items-center gap-20 h-screen will-change-transform">

        {slides.map((slideItem, i) => (
          <div
            ref={(ref) => { cardRef.current[i] = ref }}
            key={slideItem.id}
            className="shrink-0 h-full  flex items-end py-10 justify-start"
          >
            <div className=" w-0 md:w-40 h-screen md:pl-10 flex items-center justify-center">
            </div>
            {/* md:w-220 md:h-120 w-110  */}
            <div className="pointer-events-auto  w-screen h-full   overflow-hidden flex items-center justify-center" >

              <GenricSingle idx={i} data={slideItem}  />
            </div>


          </div>

        ))}


      </div>

      {/* Optional filler to allow scrolling */}
    </div>
  );
};

export default SingleComposition;

