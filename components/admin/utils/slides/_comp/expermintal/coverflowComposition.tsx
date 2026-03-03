"use client"
import { slide } from '@/types/schema'
import React, { memo, RefObject, useCallback, useMemo, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import GenricCoverFlow from '../cardProd/generic/coverFlow'
// import GenricCoverFlow from '../CardProd/generic/coverFlow'

const MemoizedCard = memo(GenricCoverFlow)

const CoverflowComposition = ({
    isInViewport,
    slides
}: {
    slides: slide[]
    isInViewport: boolean
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const refFirstCol = useRef<HTMLDivElement>(null)
    const refSecondCol = useRef<HTMLDivElement>(null)
    const refThirdCol = useRef<HTMLDivElement>(null)
    const refFourthCol = useRef<HTMLDivElement>(null)

    const [isHovering, setIsHovering] = useState(false)
    const context = useRef<gsap.Context | null>(null)
    const animationsRef = useRef<gsap.core.Tween[]>([])

    const col1Data = useMemo(() => {
        if (slides.length === 0) return []
        const col1Slides = slides.filter((_, idx) => idx % 4 === 0)
        return [...col1Slides, ...col1Slides ,...col1Slides, ...col1Slides ]
    }, [slides])
    
    const col2Data = useMemo(() => {
        if (slides.length === 0) return []
        const col2Slides = slides.filter((_, idx) => idx % 4 === 1)
        return [...col2Slides, ...col2Slides ,...col2Slides ,...col2Slides ]
    }, [slides])
    
    const col3Data = useMemo(() => {
        if (slides.length === 0) return []
        const col3Slides = slides.filter((_, idx) => idx % 4 === 2)
        return [...col3Slides, ...col3Slides ,...col3Slides , ...col3Slides ]
    }, [slides])
    
    const col4Data = useMemo(() => {
        if (slides.length === 0) return []
        const col4Slides = slides.filter((_, idx) => idx % 4 === 3)
        return [...col4Slides, ...col4Slides ,...col4Slides ,...col4Slides ]
    }, [slides])

    useGSAP(() => {
        if (!isInViewport) return
        if (!containerRef.current) return
        if (!refFirstCol.current || !refSecondCol.current || !refThirdCol.current || !refFourthCol.current) return
        
        context.current = gsap.context(() => {
            // Clear previous animations
            animationsRef.current = []

            // Column 1 animation
            const anim1 = gsap.to(refFirstCol.current, {
                y: "-50%",
                ease: "none",
                duration: 35,
                repeat: -1,
            })
            animationsRef.current.push(anim1)

            // Column 2 animation
            gsap.set(refSecondCol.current, { y: "-50%" })
            const anim2 = gsap.to(refSecondCol.current, {
                y: "0%",
                ease: "none",
                duration: 40,
                repeat: -1,
            })
            animationsRef.current.push(anim2)

            // Column 3 animation
            const anim3 = gsap.to(refThirdCol.current, {
                y: "-50%",
                ease: "none",
                duration: 45,
                repeat: -1,
            })
            animationsRef.current.push(anim3)

            // Column 4 animation
            gsap.set(refFourthCol.current, { y: "-50%" })
            const anim4 = gsap.to(refFourthCol.current, {
                y: "0%",
                ease: "none",
                duration: 38,
                repeat: -1,
            })
            animationsRef.current.push(anim4)
        }, containerRef)

        const handleMouseEnter = () => {
            setIsHovering(true)
            animationsRef.current.forEach(anim => {
                gsap.to(anim, { timeScale: 0.2, duration: 0.5 })
            })
        }

        const handleMouseLeave = () => {
            setIsHovering(false)
            animationsRef.current.forEach(anim => {
                gsap.to(anim, { timeScale: 1, duration: 0.5 })
            })
        }

        const container = containerRef.current
        container.addEventListener('mouseenter', handleMouseEnter)
        container.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            container.removeEventListener('mouseenter', handleMouseEnter)
            container.removeEventListener('mouseleave', handleMouseLeave)
            if (context.current) {
                context.current.revert()
                context.current = null
            }
            animationsRef.current = []
        }
    }, {
        dependencies: [isInViewport],
        scope: containerRef
    })

    const handlePointerDown = useCallback((colRef: RefObject<HTMLDivElement | null>) => {
        if (!colRef?.current) return
        
        const animation = animationsRef.current.find(anim => 
            anim.targets().includes(colRef.current)
        )
        
        if (animation) {
            gsap.to(animation, { timeScale: 0.1, duration: 0.3 })
        }
    }, [])

    const handlePointerOut = useCallback((colRef: RefObject<HTMLDivElement | null>) => {
        if (!colRef?.current) return
        
        const animation = animationsRef.current.find(anim => 
            anim.targets().includes(colRef.current)
        )
        
        if (animation) {
            const targetTimeScale = isHovering ? 0.2 : 1
            gsap.to(animation, { timeScale: targetTimeScale, duration: 0.3 })
        }
    }, [isHovering])

    return (
        <section
            ref={containerRef}
            className='mask-b-from-60% mask-t-from-60% w-full max-w-[95vw] lg:max-w-[90vw] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mx-auto h-[80vh] lg:h-screen overflow-hidden'
        >
            <div
                onPointerOver={() => handlePointerDown(refFirstCol)}
                onPointerOut={() => handlePointerOut(refFirstCol)}
                ref={refFirstCol} 
                className='flex flex-col gap-3 lg:gap-4 will-change-transform'
            >
                {col1Data.map((slide, idx) => (
                    <div key={`col1-${slide.id}-${idx}`} className='min-h-100 lg:min-h-[320px]'>
                        <MemoizedCard data={slide} idx={idx} />
                    </div>
                ))}
            </div>

            <div 
                onPointerOver={() => handlePointerDown(refSecondCol)}
                onPointerOut={() => handlePointerOut(refSecondCol)}
                ref={refSecondCol} 
                className='flex flex-col gap-3 lg:gap-4 will-change-transform'
            >
                {col2Data.map((slide, idx) => (
                    <div key={`col2-${slide.id}-${idx}`} className='min-h-[280px] lg:min-h-[320px]'>
                        <MemoizedCard data={slide} idx={idx} />
                    </div>
                ))}
            </div>

            <div 
                onPointerOver={() => handlePointerDown(refThirdCol)}
                onPointerOut={() => handlePointerOut(refThirdCol)}
                ref={refThirdCol} 
                className='hidden lg:flex flex-col gap-4 will-change-transform'
            >
                {col3Data.map((slide, idx) => (
                    <div key={`col3-${slide.id}-${idx}`} className='min-h-[320px]'>
                        <MemoizedCard data={slide} idx={idx} />
                    </div>
                ))}
            </div>

            <div 
                onPointerOver={() => handlePointerDown(refFourthCol)}
                onPointerOut={() => handlePointerOut(refFourthCol)}
                ref={refFourthCol} 
                className='hidden lg:flex flex-col gap-4 will-change-transform'
            >
                {col4Data.map((slide, idx) => (
                    <div key={`col4-${slide.id}-${idx}`} className='min-h-[320px]'>
                        <MemoizedCard data={slide} idx={idx} />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default CoverflowComposition