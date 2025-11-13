

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, X } from 'lucide-react'
import Image from 'next/image'
import React, { useRef,  } from 'react'

const ContolledImage = ({
    setSelectedImageBlob,
    setSelectedImageFile,
    selectedImageBlob,
    className
}: {
    className: string,
    selectedImageBlob: string
    setSelectedImageBlob: React.Dispatch<React.SetStateAction<string>>,
    setSelectedImageFile: React.Dispatch<React.SetStateAction<File | null>>
}) => {


    const inputImageRef = useRef<HTMLInputElement>(null)

    const handleInputChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedImageBlob(URL.createObjectURL(e.target.files[0]))
            setSelectedImageFile(e.target.files[0])
        }
    }

    return (
        <>
            <div
                role='button'
                onClick={() => inputImageRef.current?.click()}
                className={className + " relative"}
            >
                <Input
                    ref={inputImageRef}
                    onChange={handleInputChangeImage}
                    id="image-Service-uploader"
                    type="file"
                    className="hidden"
                />
                {selectedImageBlob ? (
                    <Image
                        src={selectedImageBlob || "/placeholder.svg"}
                        alt="Service Image"
                        width={500}
                        height={200}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <Plus className="text-gray-700 w-12 h-12" />
                )}
                {
                    selectedImageBlob &&
                    <div className="absolute top-1 right-1">
                        <Button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setSelectedImageFile(null)
                                setSelectedImageBlob("")
                            }}
                            className='cursor-pointer' size={"sm"} variant={"destructive"}>

                            <X className=" w-5 h-5" />
                        </Button>
                    </div>
                }
            </div>
        </>
    )
}

export default ContolledImage