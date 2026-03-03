import { JSX, useRef } from "react";
import gsap from "gsap/dist/gsap";
import { slide } from "@/types/schema";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import Cube from "../cardProd/generic/cube";

gsap.registerPlugin(ScrollTrigger);

const CubeComposition = ({ slides }: {
  HeaderSlideShow?: JSX.Element | null
  , slides: slide[]
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const addCardRef = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };


  useGSAP(
    () => {
      const cards = cardsRef.current;
      if (!cards.length) return;

      const spacer = 20;
      const minScale = 0.8;

      const distributor = gsap.utils.distribute({
        base: minScale,
        amount: 0.2,
      });

      cards.forEach((card, index) => {
        const scaleVal = distributor(index, card, cards);

        gsap.to(card, {
          scale: scaleVal,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        ScrollTrigger.create({
          trigger: card,
          start: () => `top top+=${200 + index * spacer}`,
          endTrigger: cards[cards.length - 1],
          end: `bottom top+=${200 + cards.length * spacer}`,
          pin: true,
          pinSpacing: false,
          scrub: true,
          invalidateOnRefresh: true,
          onEnter: () => {
            gsap.to(card, {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            });
          },
        });
      });

      return () => {
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    },
    {
      dependencies: [slides],
      scope: rootRef,
    }
  );

  return (
    <div
      ref={rootRef}
      className="min-h-screen h-screen relative px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10 md:py-12 font-light"
    >
      {/* Cards container */}

      <div className="flex  items-start justify-center pt-4 sm:pt-16 md:pt-10 lg:pt-32 xl:pt-40">
        <div className="cards relative flex items-start justify-start flex-col w-full max-w-7xl">


          {slides.map((n, i) => {


            return <div
              key={i}
              ref={addCardRef}
              className="relative mb-8  h-100 sm:mb-10 md:mb-12 flex w-full max-w-full items-start justify-start rounded-xl sm:rounded-2xl overflow-hidden"
            >
              
       

              <Cube data={n} />
            </div>
          }
          )}
        </div>
      </div>

      {/* Spacer section */}
      <div className="mt-8 sm:mt-10 md:mt-12 h-[60vh] sm:h-[40vh] md:h-[50vh] w-full border-t " />
    </div>
  );
};

export default CubeComposition;