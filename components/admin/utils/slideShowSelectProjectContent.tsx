
"use client"

import BlurredImage from "@/app/_comp/BlurredHashImage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {  useGetProjectsQuery, useLazySearchProjectsQuery } from "@/lib/store/api/projects-api"
import { useDebounce } from "@/lib/store/hooks"
import { Image as ImageType, Project, ProjectWithRelations,  Technology } from "@/types/schema"
import { pagination } from "@/types/services"
import { useIntersectionObserver } from "@uidotdev/usehooks"
import { LucideGlasses, AlertCircle, X } from "lucide-react"
import React, { type ChangeEvent, useEffect, useRef, useState } from "react"


const TAKE = 10

interface TabContentServiceProps {
    selectedServices: ProjectWithRelations[]
    setSelectedServices: React.Dispatch<React.SetStateAction<ProjectWithRelations[]>>
    tabType: string
    title: string
    placeholder?: string
    ExtraInputs?: boolean
}

const TabContentProject = ({
    selectedServices,
    setSelectedServices,
    tabType,
    title,
    placeholder = "Search...",

    ExtraInputs = false
}: TabContentServiceProps) => {
    const [skip, setSkip] = useState(0)
    const { data, isLoading, isError, refetch } = useGetProjectsQuery({
        skip,
        take: TAKE,
    })

    const [FetchedServices, allFetchedServices] = useState<{
        project: Project;
        image: ImageType | null;
        technologies: Partial<Technology>[];
    }[]>([])
    
    useEffect(() => {

        if (data?.data) {

            allFetchedServices(prev => {
                const existing = prev.map((p) => p.project.id)
                const newServices = data.data.filter((p) => !existing.includes(p.project.id))
                const returened = [...prev, ...newServices]
                return returened    
            })
        }
        // console.log({
        //     services: FetchedServices,
        //     data: data?.data.data
        // })

    }, [data?.data])

    const [searchTrigger, { data: searchRes, isLoading: searchLoading, isError: searchError }] =
        useLazySearchProjectsQuery()

    const [searchInp, setSearchInp] = useState("")
    const debouncedSearchInp = useDebounce(searchInp, 2000)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchInp(e.target.value)
    }

    const handleSelectService = (project: ProjectWithRelations) => {
        


        // console.log({ service })
        setSelectedServices((prev) => {
            const isSelected = prev.some((p) => p.project.id === project.project.id)
            if (isSelected) {
                console.log({ isSelected })
                const updated = selectedServices.filter((s) => s.project.id !== project.project.id)
                const UpdatedWithorder = updated.map((s, index) => ({
                    ...s,
                    _order: index + 1,
                    type: "project",
           
                    isVisible: true

                }))
                // console.log({ UpdatedWithorder })
                return UpdatedWithorder

            } else {
                return [
                    ...prev,
                    {
                        _order: prev.length + 1,
                        ...project,
                        type: "project", // or get from service object if available
                 
                        isVisible: true

                    },
                ]
            }
        })
    }

    const handleRemoveService = (serviceId: string) => {

        const updated = selectedServices.filter((s) => s.project.id !== serviceId)
        const UpdatedWithorder = updated.map((s, index) => ({ ...s, _order: index + 1 }))
        // console.log({ UpdatedWithorder })

        setSelectedServices(UpdatedWithorder)
    }

    useEffect(() => {
        if (debouncedSearchInp.trim() !== "") {
            searchTrigger({ q: debouncedSearchInp , skip: 0, take: TAKE })
        }
    }, [debouncedSearchInp, searchTrigger])

    console.log({ searchInp, searchRes, searchLoading, searchError })
    const displayData = searchInp ? searchRes?.data : FetchedServices
console.log({
    displayData
})
    const isLoadingData = searchInp ? searchLoading : isLoading
    const hasError = searchInp ? searchError : isError

    const currentTabSelected = selectedServices.filter((s) => s.type === tabType)
    // console.log({
    //     currentTabSelected,
    //     selectedServices
    // })
    return (
        <Card className="shadow-none">
            <CardHeader>
                <div className="flex gap-4">
                    <CardTitle className="w-1/2">
                        <p className="text-bold flex items-center gap-2 text-xl">{title}</p>
                    </CardTitle>
                    <div className="relative w-1/2">
                        <Input onChange={handleChange} type="search" placeholder={placeholder} className="full" />
                        <LucideGlasses className=" absolute top-1 right-2" />
                    </div>
                </div>
                {currentTabSelected.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {currentTabSelected.map((p) => (
                            <div
                                key={p.project.id}
                                className="flex items-center gap-2 bg-primary/10 border border-primary rounded-full px-3 py-1"
                            >
                                <span className="text-sm font-medium">{p.project.title}</span>
                                <button
                                    onClick={() => handleRemoveService(p.project.id)}
                                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </CardHeader>
            <SelectContentTabSlideShow
                skip={skip}
                setSkip={setSkip}
                refetch={refetch}
                setSelectedServices={setSelectedServices}
                data={displayData as any}
                pagination={data?.pagination}
                isLoading={isLoadingData}
                hasError={hasError}
                selectedIds={currentTabSelected.map((s) => s.project.id)}
                onSelect={handleSelectService}
                selectedItems={currentTabSelected}
                ExtraInputs={ExtraInputs}

            />
        </Card>
    )
}

export default TabContentProject

export const SelectContentTabSlideShow = ({


    setSelectedServices,
    data,
    isLoading,
    hasError,
    selectedIds,
    onSelect,
    selectedItems,
    ExtraInputs = true,
    refetch,
    skip,
    setSkip,

    pagination

}: {
    pagination: pagination | undefined
    setSkip: React.Dispatch<React.SetStateAction<number>>,
    skip: number,
    refetch: () => void
    ExtraInputs?: boolean
    setSelectedServices: React.Dispatch<React.SetStateAction<ProjectWithRelations[]>>
    data: ProjectWithRelations[] | undefined
    isLoading: boolean
    hasError: boolean
    selectedIds: string[],
    selectedItems?: ProjectWithRelations[],
    onSelect: (service: ProjectWithRelations) => void
}) => {

    console.log(data)

    const rootRef = useRef<HTMLDivElement>(null)
    const [
        ref,
        isIntersecting,
    ] = useIntersectionObserver({
        rootMargin: "20px",
        scrollMargin: "0px",
        root: rootRef.current,
        threshold: .1,
    })
    const [loadingRemingItems, setLoadingRemingItems] = useState(false)


    useEffect(() => {
        setLoadingRemingItems(true)
        if (isIntersecting?.isIntersecting) {
            if (!pagination) return
            if ((skip < pagination?.totalPages) || (pagination.remainingItems > 0))
                setSkip((prev) => prev + 1)
        }
        setLoadingRemingItems(false)
    }, [isIntersecting])


    if (hasError) {
        return (
            <CardContent className="flex justify-center items-center gap-3 py-12">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <p className="text-destructive font-medium">Failed to load services. Please try again.</p>
            </CardContent>
        )
    }

    if (isLoading) {

        return (
            <LoadingComponent />
        )
    }

    if (!data || data.length === 0) {
        return (
            <CardContent className="flex justify-center items-center py-12">
                <p className="text-muted-foreground">No services found.</p>
            </CardContent>
        )
    }

    // console.log({ data, selectedIds }, "data")

    return (
        <>

            <CardContent
                ref={rootRef}
                className="flex min-h-50 justify-stretch items-start gap-4 flex-col max-h-100 overflow-y-scroll">
                {data.map((p, idx, self) => {
                    const project = p.project
                    const image = p.image
                    const technologies = p.technologies
               

                    const isSelected = selectedIds.find((id) => id === project.id)

                    const SelectedService = selectedItems && selectedItems?.find((s) => s.project.id === project.id)
                    // console.log({ isSelected })
                    return <div
                        key={project.id}
                        onClick={() => onSelect({ project :project, image, technologies })}
                        className={`border p-3 shadow-sm rounded-md flex items-start w-full justify-start gap-3 cursor-pointer transition-all ${isSelected ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50"
                            }`}
                    >
                        <div className="w-24 h-24 flex-shrink-0">
                            <BlurredImage
                                imageUrl={image?.url || "/placeholder.svg"}
                                alt={image?.alt || project.title + "-alt"}
                                className="w-24 h-24 object-cover rounded-md"
                                blurhash={image?.blurHash || ""}
                                quality={50}
                                height={image?.height || 400}
                                width={image?.width || 400}
                            />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center justify-start">
                           
                                <p className="font-bold text-lg">{project.title}</p>
                            </div>
                            {
                                ExtraInputs && isSelected && SelectedService ?
                                    <div onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                    }}>
                                        <p className="text-sm text-muted-foreground">{project.description}</p>
                                        <Switch
                                            className="mt-2"
                                            checked={SelectedService.isVisible}
                                            onCheckedChange={(checked) => {
                                                setSelectedServices((prev) =>
                                                    prev.map((s) => (s.project.id === project.id ? { ...s, isVisible: checked } : s))
                                                )
                                            }}
                                        />
                                    </div>
                                    : <p className="text-sm text-muted-foreground">{project.description}</p>}
                        </div>

                        {
                            ExtraInputs && isSelected && SelectedService ?
                                <div
                                    className=" flex w-1/2 flex-col items-center justify-start"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        e.preventDefault()
                                    }}
                                >
                                    <Input
                                        placeholder="Custom title (optional)"

                                        value={SelectedService.customTitle ?? ""}
                                        onChange={(e) => {
                                            // console.log({ e }, SelectedService)

                                            setSelectedServices((prev) =>
                                                prev.map((s) => (s.project.id === project.id ? { ...s, customTitle: e.target.value } : s))
                                            )
                                        }
                                        }
                                        className="bg-white border p-2 rounded mt-2"
                                    />
                                    <Textarea
                                        placeholder="Custom Description (optional)"
                                        value={SelectedService.customDesc ?? ""}
                                        onChange={(e) =>
                                            setSelectedServices((prev) =>
                                                prev.map((s) => (s.project.id === project.id ? { ...s, customDesc: e.target.value } : s))
                                            )
                                        }
                                        className="bg-white border p-2 rounded mt-2"
                                    />
                                </div>
                                : null
                        }


                    </div>
                }
                )
                }


                {
                    pagination && data.length > 0 ?

                        <div ref={ref} className="flex items-center justify-center w-full p-2">

                            {
                                loadingRemingItems ? <LoadingComponent len={1} /> : pagination?.remainingItems > 0 ? <p className="text-sm text-muted-foreground"> + {pagination.remainingItems} more</p>
                                    : <p className="text-sm text-muted-foreground"> All items Loaded {pagination.totalItems}  </p>
                            }
                        </div> : null
                }
            </CardContent >
        </>
    )
}




const LoadingComponent = ({ len }:
    {
        len?: number
    }) => (
    <CardContent className="flex justify-stretch items-start gap-4 flex-col max-h-100 overflow-y-scroll">
        {Array.from({ length: len || 3 }).map((_, idx) => (
            <div
                key={idx}
                className="border border-gray-200 p-3 shadow-sm rounded-md flex items-start w-full justify-start gap-3"
            >
                <div className="w-24 h-24 bg-muted rounded-md animate-wave flex-shrink-0" />
                <div className="flex-1 space-y-2 w-full">
                    <div className="h-5 bg-muted rounded-md w-3/4 animate-wave" />
                    <div className="h-4 bg-muted rounded-md w-full animate-wave" />
                    <div className="h-4 bg-muted rounded-md w-5/6 animate-wave" />
                </div>
            </div>
        ))}
    </CardContent>

)