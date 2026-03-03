
// ============================================================================
// TEAM MEMBER CARD
// ============================================================================

import { TeamMemberWithImage } from "@/types/schema"
import Link from "next/link"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/dist/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import BlurredImage from "@/app/_comp/BlurredHashImage"

gsap.registerPlugin(ScrollTrigger)

interface TeamMemberCardProps {
  data: TeamMemberWithImage
  splitcarousel?: boolean,
}

export const TeamMemberCard = ({ splitcarousel, data }: TeamMemberCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const card = cardRef.current
    if (!card) return

    // Main card animation
    gsap.fromTo(
      card,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "play none none reverse"
        }
      }
    )

    // Animate children elements
    const title = card.querySelector(".member-title")
    const position = card.querySelector(".member-position")
    const bio = card.querySelector(".member-bio")
    const social = card.querySelector(".member-social")

    const elements = [
      { el: title, delay: 0.1, x: -10 },
      { el: position, delay: 0.2, x: -10 },
      { el: bio, delay: 0.3 },
      { el: social, delay: 0.4, y: 10 }
    ]

    elements.forEach(({ el, delay, x = 0, y = 0 }) => {
      if (el) {
        gsap.fromTo(
          el,
          { opacity: 0, x, y },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.5,
            delay,
            scrollTrigger: {
              trigger: card,
              start: "top 90%"
            }
          }
        )
      }
    })

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === card) {
          trigger.kill()
        }
      })
    }
  }, [])

  if (SplitcarouselTeam) return <SplitcarouselTeam data={data} />
  return (
    <div
      ref={cardRef}
      className="group relative h-full overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
    >
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden bg-muted">
        {data.image && (
          <BlurredImage
            imageUrl={data.image.url || ""}
            height={data.image.height || 400}
            width={data.image.width || 800}
            alt={data.image.alt || data.name}
            blurhash={data.image.blurHash || ""}
            quality={100}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Name & Position */}
        <div>
          <h3 className="member-title text-lg font-bold text-foreground font-sora">
            {data.name}
          </h3>
          <p className="member-position text-sm font-semibold text-primary font-inter">
            {data.position}
          </p>
        </div>

        {/* Bio */}
        {data.bio && (
          <p className="member-bio text-sm text-muted-foreground leading-relaxed font-inter">
            {data.bio}
          </p>
        )}

        {/* Social Links */}
        <div className="member-social flex gap-2 pt-3 border-t border-border">
          {data.linkedin && (
            <Link

              href={data.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              aria-label="LinkedIn"
            >
              in
            </Link>
          )}
          {data.github && (
            <Link
              href={data.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              aria-label="GitHub"
            >
              gh
            </Link>
          )}
          {data.twitter && (

            <Link
              href={data.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              aria-label="Twitter"
            >
              𝕏
            </Link>
          )}
          {data.email && (
            <Link
              href={`mailto:${data.email}`}
              className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              aria-label="Email"
            >
              ✉️
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}


const SplitcarouselTeam = ({ data }: { data: TeamMemberWithImage }) => {
  const cardRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={cardRef}
      className="group relative h-full  flex items-start justify-start overflow-hidden rounded-2xl md:flex-row flex-col  hover:border-primary/50 transition-all duration-300"
    >
      {/* Image Section */}
      <div className="relative h-120 w-220 overflow-hidden bg-muted flex-2">

        {data.image && (
          <BlurredImage
            imageUrl={data.image.url || ""}
            height={data.image.height || 400}
            width={data.image.width || 800}
            alt={data.image.alt || data.name}
            blurhash={data.image.blurHash || ""}
            quality={100}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4  flex-4 flex flex-col h-120 gap-3">


        {/* Name & Position */}
        <div className="mb-10  ">

          <h3 className="member-title text-xl font-bold text-foreground font-sora">
            {data.name}
          </h3>
          <p className="member-position text-md font-semibold text-primary font-inter">
            {data.position}
          </p>
          <div className="w-full border-t mt-2" />

        </div>

        {/* Bio */}
        {data.bio && (

          <p className="member-bio text-md font-bold text-muted-foreground leading-relaxed font-inter">
            {data.bio}
          </p>
        )}

        {/* Social Links */}
        <div className="member-social flex-3 gap-2 pt-3 flex-col flex w-full border-border justify-end items-end">
          <div className="w-full border-t " />
          <div className="flex justify-start items-end gap-3">

            {data.linkedin && (
              <Link

                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                aria-label="LinkedIn"
              >
                in
              </Link>
            )}
            {data.github && (
              <Link
                href={data.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                aria-label="GitHub"
              >
                gh
              </Link>
            )}
            {data.twitter && (

              <Link
                href={data.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                aria-label="Twitter"
              >
                𝕏
              </Link>
            )}
            {data.email && (
              <Link
                href={`mailto:${data.email}`}
                className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                aria-label="Email"
              >
                ✉️
              </Link>
            )}
          </div>

        </div>
      </div>
    </div>
  )
} 