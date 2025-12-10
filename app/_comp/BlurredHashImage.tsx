"use client"

import type React from "react"
import { memo, useEffect, useState } from "react"
import { BlurhashCanvas } from "react-blurhash"
import Image from "next/image"
import { ImageIcon } from "lucide-react"

interface Props {
  imageUrl: string
  width: number
  height: number
  className: string
  alt: string
  quality: number
  blurhash?: string ,
  style ?: React.CSSProperties
}

const BlurredImage =  memo<Props>(({ style,  imageUrl, width, height, className, alt, quality, blurhash }: Props) => {
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    setIsError(false)
  }, [imageUrl])

  if (isError) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <ImageIcon className="w-6 h-6" />
      </div>
    )
  }

  return (
    <div style={style} className={`relative overflow-hidden  ${className}`}>
      {isLoading && blurhash && (
        <div className="absolute inset-0 w-full h-full">
          <BlurhashCanvas hash={blurhash} className="w-full h-full" />
        </div>
      )}

      <Image
        alt={alt}
        src={imageUrl || "/placeholder.svg"}
        quality={quality}
        width={width}
        height={height}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsError(true)
          setIsLoading(false)
        }}
      />
    </div>
  )
})

export default BlurredImage
BlurredImage.displayName = "BlurredImage"