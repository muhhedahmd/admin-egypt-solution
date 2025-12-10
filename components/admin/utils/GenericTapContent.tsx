"use client"

import BlurredImage from "@/app/_comp/BlurredHashImage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useGetProjectsQuery, useLazySearchProjectsQuery } from "@/lib/store/api/projects-api"
import { useGetServicesQuery, useLazySearchServicesQuery } from "@/lib/store/api/services-api"
import { useDebounce } from "@/lib/store/hooks"
import { ServiceWithImage, ProjectWithRelations, ClientWithImages, TeamMemberWithImage, TestimonialWithImage } from "@/types/schema"
import { pagination } from "@/types/services"
import { Image as ImageDBType } from "@/types/schema"
import { useIntersectionObserver } from "@uidotdev/usehooks"
import { LucideGlasses, AlertCircle, X, Star } from "lucide-react"
import Image from "next/image"
import React, { type ChangeEvent, useEffect, useRef, useState } from "react"
import { useGetClientsQuery, useLazySearchClientsQuery } from "@/lib/store/api/client-api"
import { useGetTeamMembersQuery } from "@/lib/store/api/team-api"
import { useGetTestimonialsQuery } from "@/lib/store/api/testimonials-api"

const TAKE = 10

// Generic type for items that can be selected
type SelectableItem = ServiceWithImage | ProjectWithRelations | ClientWithImages | TestimonialWithImage | TeamMemberWithImage | TestimonialWithImage

// Configuration interface for different item types
interface ItemConfig<T extends SelectableItem> {
    getId: (item: T) => string
    getTitle: (item: T) => string
    getDescription: (item: T) => string
    getImageUrl: (item: T) => string | undefined
    getImageAlt: (item: T) => string
    getBlurHash: (item: T) => string,
    getRatting?: (item: T) => number
    getImageDimensions: (item: T) => { width: number; height: number }
    getIcon?: (item: T) => string | undefined
    getLogo?: (item: T) => ImageDBType | null
    getPosition?: (item: T) => string
    type: string
}

// Configurations for each item type
const serviceConfig: ItemConfig<ServiceWithImage> = {
    getId: (item) => item.id,
    getTitle: (item) => item.name,
    getDescription: (item) => item?.description || "",
    getImageUrl: (item) => item?.image?.url,
    getImageAlt: (item) => item?.image?.alt || `${item.name}-alt`,
    getBlurHash: (item) => item.image?.blurHash || "",
    getImageDimensions: (item) => ({
        width: item.image?.width || 400,
        height: item.image?.height || 400,
    }),
    getIcon: (item) => item?.icon || "",
    type: "service",
}

const clientConfig: ItemConfig<ClientWithImages> = {
    getId: (item) => item.client.id,
    getTitle: (item) => item.client.name,
    getDescription: (item) => item.client?.description || "",
    getImageUrl: (item) => item?.image?.url,
    getImageAlt: (item) => item?.image?.alt || `${item.client.name}-alt`,
    getBlurHash: (item) => item.image?.blurHash || "",
    getLogo: (item) => item?.logo || null,
    getImageDimensions: (item) => ({
        width: item.image?.width || 400,
        height: item.image?.height || 400,
    }),
    type: "client",
}
const projectConfig: ItemConfig<ProjectWithRelations> = {
    getId: (item) => item.project.id,
    getTitle: (item) => item.project.title,
    getDescription: (item) => item.project.description || "",
    getImageUrl: (item) => item.image?.url,
    getImageAlt: (item) => item.image?.alt || `${item.project.title}-alt`,
    getBlurHash: (item) => item.image?.blurHash || "",
    getImageDimensions: (item) => ({
        width: item.image?.width || 400,
        height: item.image?.height || 400,
    }),
    type: "project",
}


const teamMemberConfig: ItemConfig<TeamMemberWithImage> = {
    getId: (item) => item.id,
    getTitle: (item) => item.name,
    getDescription: (item) => item?.bio || "",
    getImageUrl: (item) => item?.image?.url,
    getImageAlt: (item) => item?.image?.alt || `${item.name}-alt`,
    getPosition: (item) => item?.position,
    getBlurHash: (item) => item.image?.blurHash || "",
    getImageDimensions: (item) => ({
        width: item.image?.width || 400,
        height: item.image?.height || 400,
    }),
    type: "team",
}
const testimonialConfig: ItemConfig<TestimonialWithImage> = {
    getId: (item) => item.id,
    getTitle: (item) => item.clientName || "name",
    getDescription: (item) => item?.content || "",
    getImageUrl: (item) => item?.avatar?.url,
    getRatting: (item) => item?.rating,
    getImageAlt: (item) => item?.avatar?.alt || `${item.clientName}-alt`,
    getPosition: (item) => item?.clientPosition || "",
    getBlurHash: (item) => item.avatar?.blurHash || "",
    getImageDimensions: (item) => ({
        width: item.avatar?.width || 400,
        height: item.avatar?.height || 400,
    }),
    type: "testimonial",
}

interface TabContentProps<T extends SelectableItem> {
    disabledItems ?: string[] 
    selectedItems: T[]
    setSelectedItems: React.Dispatch<React.SetStateAction<T[]>>
    tabType: string
    title: string
    placeholder?: string
    extraInputs?: boolean
    config: ItemConfig<T>
    useQuery: typeof useGetServicesQuery | typeof useGetProjectsQuery | typeof useGetClientsQuery | typeof useGetTeamMembersQuery | typeof useGetTestimonialsQuery
    useLazySearch: typeof useLazySearchServicesQuery | typeof useLazySearchProjectsQuery | typeof useLazySearchClientsQuery
    searchParamKey: string // 'q' for projects, 'search' for services
    dataExtractor: (data: any) => T[] // Extract data from API response
    paginationExtractor: (data: any) => pagination | undefined
}

const TabContent = <T extends SelectableItem>({
    disabledItems, 
    selectedItems,
    setSelectedItems,
    tabType,
    title,
    placeholder = "Search...",
    extraInputs = false,
    config,
    useQuery,
    useLazySearch,
    searchParamKey,
    dataExtractor,
    paginationExtractor,
}: TabContentProps<T>) => {
    const [skip, setSkip] = useState(0)
    const { data, isLoading, isError, refetch } = useQuery({
        skip,
        take: TAKE,
    } , {

    })

    const [fetchedItems, setFetchedItems] = useState<T[]>([])

    useEffect(() => {
        if (data) {
            const newData = dataExtractor(data)
            if (newData) {
                setFetchedItems((prev) => {
                    const existingIds = prev.map((item) => config.getId(item))
                    const newItems = newData?.filter(
                        (item) => !existingIds.includes(config.getId(item))
                    )
                    return [...prev, ...newItems]
                })
            }
        }
    }, [data, config, dataExtractor])

    const [searchTrigger, { data: searchRes, isLoading: searchLoading, isError: searchError }] =
        useLazySearch()

    const [searchInp, setSearchInp] = useState("")
    const debouncedSearchInp = useDebounce(searchInp, 2000)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchInp(e.target.value)
    }

    const handleSelectItem = (item: T) => {
        setSelectedItems((prev) => {
            const isSelected = prev.some((s) => config.getId(s) === config.getId(item))
            if (isSelected) {
                const updated = prev.filter((s) => config.getId(s) !== config.getId(item))
                return updated.map((s, index) => ({
                    ...s,
                    _order: index + 1,
                    type: config.type,
                    isVisible: true,
                })) as T[]
            } else {
                return [
                    ...prev,
                    {
                        ...item,
                        _order: prev.length + 1,
                        type: config.type,
                        customDesc: "",
                        customTitle: "",
                        isVisible: true,
                    },
                ] as T[]
            }
        })
    }

    const handleRemoveItem = (itemId: string) => {
        const updated = selectedItems.filter((s) => config.getId(s) !== itemId)
        setSelectedItems(
            updated.map((s, index) => ({ ...s, _order: index + 1 })) as T[]
        )
    }

    useEffect(() => {
        if (debouncedSearchInp.trim() !== "") {
            searchTrigger({ q: debouncedSearchInp, skip: 0, take: TAKE })
        }
    }, [debouncedSearchInp, searchTrigger, searchParamKey])

    const displayData = searchInp
        ? (searchRes ? dataExtractor(searchRes) : undefined)
        : fetchedItems

    const isLoadingData = searchInp ? searchLoading : isLoading
    const hasError = searchInp ? searchError : isError

    const currentTabSelected = selectedItems.filter((s: any) => s.type === tabType)

    return (
        <Card className="shadow-none">
            <CardHeader>
                <div className="flex gap-4">
                    <CardTitle className="w-1/2">
                        <p className="text-bold flex items-center gap-2 text-xl">{title}</p>
                    </CardTitle>
                    <div className="relative w-1/2">
                        <Input onChange={handleChange} type="search" placeholder={placeholder} className="full" />
                        <LucideGlasses className="absolute top-1 right-2" />
                    </div>
                </div>
                {currentTabSelected.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {currentTabSelected.map((item) => (
                            <div
                                key={config.getId(item)}
                                className="flex items-center gap-2 bg-primary/10 border border-primary rounded-full px-3 py-1"
                            >
                                <span className="text-sm font-medium">{config.getTitle(item)}</span>
                                <button
                                    onClick={() => handleRemoveItem(config.getId(item))}
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
                setSelectedItems={setSelectedItems}
                data={disabledItems ?  displayData?.filter((item) => !disabledItems.includes(config.getId(item))) : displayData}
                pagination={paginationExtractor(data)}
                isLoading={isLoadingData}
                hasError={hasError}
                selectedIds={currentTabSelected.map((s) => config.getId(s))}
                onSelect={handleSelectItem}
                selectedItems={currentTabSelected}
                extraInputs={extraInputs}
                config={config}
            />
        </Card>
    )
}

interface SelectContentTabSlideShowProps<T extends SelectableItem> {
    pagination: pagination | undefined
    setSkip: React.Dispatch<React.SetStateAction<number>>
    skip: number
    refetch: () => void
    extraInputs?: boolean
    setSelectedItems: React.Dispatch<React.SetStateAction<T[]>>
    data: T[] | undefined
    isLoading: boolean
    hasError: boolean
    selectedIds: string[]
    selectedItems?: T[]
    onSelect: (item: T) => void
    config: ItemConfig<T>
}

const SelectContentTabSlideShow = <T extends SelectableItem>({

    setSelectedItems,
    data,
    isLoading,
    hasError,
    selectedIds,
    onSelect,
    selectedItems,
    extraInputs = true,
    refetch,
    skip,
    setSkip,
    pagination,
    config,
}: SelectContentTabSlideShowProps<T>) => {
    const rootRef = useRef<HTMLDivElement>(null)
    const [ref, isIntersecting] = useIntersectionObserver({
        rootMargin: "20px",
        scrollMargin: "0px",
        root: rootRef.current,
        threshold: 0.1,
    })
    const [loadingRemainingItems, setLoadingRemainingItems] = useState(false)

    useEffect(() => {
        setLoadingRemainingItems(true)
        if (isIntersecting?.isIntersecting) {

            if (!pagination) return
            if (skip < pagination?.totalPages || pagination.remainingItems > 0)
                setSkip((prev) => prev + 1)
        }
        setLoadingRemainingItems(false)
    }, [isIntersecting, pagination])

    if (hasError) {
        return (
            <CardContent className="flex justify-center items-center gap-3 py-12">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <p className="text-destructive font-medium">Failed to load items. Please try again.</p>
            </CardContent>
        )
    }

    if (isLoading) {
        return <LoadingComponent />
    }

    if (!data || data.length === 0) {
        return (
            <CardContent className="flex justify-center items-center py-12">
                <p className="text-muted-foreground">No items found.</p>
            </CardContent>
        )
    }

    return (
        <>
            <CardContent
                ref={rootRef}
                className="flex min-h-50 justify-stretch items-start gap-4 flex-col max-h-100 overflow-y-scroll"
            >
                {data.map((item) => {

                    const isSelected = selectedIds.includes(config.getId(item))
                    const selectedItem = selectedItems?.find(
                        (s) => config.getId(s) === config.getId(item)
                    )
                    const dimensions = config.getImageDimensions(item)

                    return (
                        <div
                            key={config.getId(item)}
                            onClick={() => onSelect(item)}
                            className={`border p-3 shadow-sm rounded-md flex items-start w-full justify-start gap-3 cursor-pointer transition-all ${isSelected
                                ? "border-primary bg-primary/5"
                                : "border-gray-200 hover:border-primary/50"
                                }`}
                        >
                            <div className="w-24 h-24 flex-shrink-0">
                                <BlurredImage
                                    imageUrl={config.getImageUrl(item) || "/placeholder.svg"}
                                    alt={config.getImageAlt(item)}
                                    className="w-24 h-24 object-cover rounded-md"
                                    blurhash={config.getBlurHash(item)}
                                    quality={50}
                                    height={dimensions.height}
                                    width={dimensions.width}
                                />
                            </div>


                            <div className="flex-1">
                                <div className="flex items-center justify-start">
                                    {config.getIcon && config.getIcon(item) && (
                                        <span>{config.getIcon(item)}</span>
                                    )}
                                    <p className="font-bold text-lg">{config.getTitle(item)}
                                        {config?.getPosition ? <span className="font-medium text-muted-foreground">
                                            {` - ${config.getPosition(item)}`}
                                        </span> : ""}
                                    </p>
                                </div>


                                <div className="flex flex-col items-start justify-start">

                                    {isSelected && selectedItem ? (

                                        <div
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                            }}
                                        >
                                            <p className="text-sm text-muted-foreground">
                                                {config.getDescription(item)}
                                            </p>
                                            <div
                                                className=" flex justify-start items-center bg-muted-foreground/10 w-fit p-1 rounded-md shadow gap-2 mt-2"
                                            >

                                                <label className="text-xs font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    Visible
                                                </label>
                                                <Switch
                                                    className=""
                                                    color="#f5f5"
                                                    checked={(selectedItem as any).isVisible}
                                                    onCheckedChange={(checked) => {
                                                        setSelectedItems((prev) =>
                                                            prev.map((s) =>
                                                                config.getId(s) === config.getId(item)
                                                                    ? ({ ...s, isVisible: checked } as T)
                                                                    : s
                                                            )
                                                        )
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            {config.getDescription(item)}
                                        </p>
                                    )}
                                </div>

                                {extraInputs && isSelected && selectedItem && (
                                    <div
                                        className="flex w-1/2 flex-col items-center justify-start"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            e.preventDefault()
                                        }}
                                    >
                                        <Input
                                            placeholder="Custom title (optional)"
                                            value={(selectedItem as any).customTitle ?? ""}
                                            onChange={(e) => {
                                                setSelectedItems((prev) =>
                                                    prev.map((s) =>
                                                        config.getId(s) === config.getId(item)
                                                            ? ({ ...s, customTitle: e.target.value } as T)
                                                            : s
                                                    )
                                                )
                                            }}
                                            className="bg-white border p-2 rounded mt-2"
                                        />
                                        <Textarea
                                            placeholder="Custom Description (optional)"
                                            value={(selectedItem as any).customDesc ?? ""}
                                            onChange={(e) =>
                                                setSelectedItems((prev) =>
                                                    prev.map((s) =>
                                                        config.getId(s) === config.getId(item)
                                                            ? ({ ...s, customDesc: e.target.value } as T)
                                                            : s
                                                    )
                                                )
                                            }
                                            className="bg-white border p-2 rounded mt-2"
                                        />
                                    </div>
                                )}

                                {
                                    config.getRatting && config.getRatting(item) && (
                                        <div className="flex items-center justify-start gap-2">
                                           { Array.from({length: config.getRatting(item)}).map((_, idx) => (
                                               <Star key={idx} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                           ))}  <span className="text-xs text-muted-foreground">
                                            {config.getRatting(item)}/5
                                            </span>
                                        </div>
                                    )
                                }
                            </div>

                        </div>
                    )
                })}

                {pagination && data.length > 0 && (
                    <div ref={ref} className="flex items-center justify-center w-full p-2">
                        {loadingRemainingItems ? (
                            <LoadingComponent len={1} />
                        ) : pagination?.remainingItems > 0 ? (
                            <p className="text-sm text-muted-foreground">
                                + {pagination.remainingItems} more
                            </p>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                All items Loaded {pagination.totalItems}
                            </p>
                        )}
                    </div>
                )}
            </CardContent>
        </>
    )
}

const LoadingComponent = ({ len }: { len?: number }) => (
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

// Export wrapper components for easy usage
export const TabContentService = (props: Omit<TabContentProps<ServiceWithImage>, 'config'>) => (

    <TabContent {...props} config={serviceConfig} />
)

export const TabContentProject = (props: Omit<TabContentProps<ProjectWithRelations>, 'config'>) => (
    <TabContent {...props} config={projectConfig} />
)
export const TabContentClients = (props: Omit<TabContentProps<ClientWithImages>, 'config'>) => (
    <TabContent {...props} config={clientConfig} />
)
export const TabContentTeamMembers = (props: Omit<TabContentProps<TeamMemberWithImage>, 'config'>) => (
    <TabContent {...props} config={teamMemberConfig} />
)
export const TabContentTestimonial = (props: Omit<TabContentProps<TestimonialWithImage>, 'config'>) => (
    <TabContent {...props} config={testimonialConfig} />
)

export default TabContent