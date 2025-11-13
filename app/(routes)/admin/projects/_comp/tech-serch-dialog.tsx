"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2, Layers, Trash2, Upload } from "lucide-react"
import { useCreateTechnologyMutation } from "@/lib/store/api/tech-api"
import { useLazySearchTechnologiesQuery, useLazyGetTechnologiesByCategoryQuery, useLazyGetCategoriesQuery } from "@/lib/store/api/projects-api"
import { Technology } from "@/types/schema"
import { useDebounce } from "@/lib/store/hooks"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { InfiniteScrollSelect } from "@/app/_comp/infinty-select-scroller"

interface TechSearchDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onTechSelected: (tech: { id: string; name: string; category?: string; icon?: string }) => void
    onBulkTechSelected?: (techs: Technology[]) => void
}

const CATEGORIES = [
    "Frontend",
    "Backend",
    "Database",
    "DevOps",
    "Mobile",
    "Cloud",
    "Tools",
    "Other"
]


export function TechSearchDialog({ open, onOpenChange, onTechSelected, onBulkTechSelected }: TechSearchDialogProps) {
    const [createTechnology, { isLoading: isCreatingTech }] = useCreateTechnologyMutation()
    const [searchTechnologies, { isLoading: isSearching }] = useLazySearchTechnologiesQuery()
    const [getTechsByCategory, { isLoading: isLoadingCategory }] = useLazyGetTechnologiesByCategoryQuery()
    const [
        getCategories, { isLoading: isLoadingCategories }
    ] = useLazyGetCategoriesQuery()
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<Technology[]>([])
    const [categoryResults, setCategoryResults] = useState<Technology[]>([])
    const [selectedCategory, setSelectedCategory] = useState("")
    const [newTechCategory, setNewTechCategory] = useState("")
    const [newTechIcon, setNewTechIcon] = useState("")
    const [activeTab, setActiveTab] = useState<"search" | "category">("search")
    const [iconFile, setIconFile] = useState<File | null>(null)
    const [iconPreview, setIconPreview] = useState<string | null>(null)
    const newIconRef = useRef<HTMLInputElement | null>(null)
    const debouncedQuery = useDebounce(query, 300)
    const [newCategoryInp, setNewCategoryInp] = useState<string>("")

    // Search for individual technologies
    useEffect(() => {
        if (!debouncedQuery.trim() || activeTab !== "search") {
            setResults([])
            return
        }

        const search = async () => {
            try {
                const techs = await searchTechnologies({
                    q: debouncedQuery,
                    skip: 0,
                    take: 10,
                }).unwrap()
                setResults(techs.data as unknown as Technology[])
            } catch (error) {
                console.error("[v0] Search failed:", error)
            }
        }

        search()
    }, [debouncedQuery, searchTechnologies, activeTab])

    // Load technologies by category
    useEffect(() => {
        if (!selectedCategory || activeTab !== "category") {
            setCategoryResults([])
            return
        }

        const loadCategory = async () => {
            try {
                const techs = await getTechsByCategory({
                    category: selectedCategory,
                    skip: 0,
                    take: 50,
                }).unwrap()
                setCategoryResults(techs.data as unknown as Technology[])
            } catch (error) {
                console.error("[v0] Category load failed:", error)
            }
        }

        loadCategory()
    }, [selectedCategory, getTechsByCategory, activeTab])

    const handleSelectExisting = (tech: Technology) => {
        if (isCreatingTech) return
        onTechSelected(tech)
        setQuery("")
        onOpenChange(false)
    }

    const handleSelectAllCategory = () => {
        if (isCreatingTech || !onBulkTechSelected) return
        onBulkTechSelected(categoryResults)
        setSelectedCategory("")
        setCategoryResults([])
        onOpenChange(false)
    }

    const handleCreateNew = async () => {
        if (!query.trim() || isCreatingTech) return
        try {
            const formData = new FormData()
            if (iconFile) {
                formData.append("icon", iconFile)

            }
            formData.append("name", query)
            formData.append("category", newCategoryInp || newTechCategory || "")
            const newTech = await createTechnology(formData).unwrap()
            onTechSelected(newTech.data)
            setQuery("")
            setNewTechCategory("")
            setNewTechIcon("")
            onOpenChange(false)
            console.log({
                name: query,
                category: newCategoryInp || newTechCategory || undefined,
                icon: iconFile || undefined
            }
            )
        } catch (error) {
            // console.error("[v0] Create tech failed:", error)
        }
    }

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen && isCreatingTech) return
        if (!newOpen) {
            setQuery("")
            setSelectedCategory("")
            setResults([])
            setCategoryResults([])
            setNewTechCategory("")
            setNewTechIcon("")
        }
        onOpenChange(newOpen)
    }
    const fetchData = async (params: { q: string; skip: number; take: number }) => {
        const data = await getCategories(params).unwrap()
        return data
    }
    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                {isCreatingTech && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm font-medium">Creating technology...</p>
                        </div>
                    </div>
                )}

                <AlertDialogHeader>
                    <AlertDialogTitle>Add Technology</AlertDialogTitle>
                    <AlertDialogDescription>
                        Search for individual technologies or select entire categories
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "search" | "category")} className="flex-1 flex flex-col overflow-hidden">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="search">Search Individual</TabsTrigger>
                        <TabsTrigger value="category">Select by Category</TabsTrigger>
                    </TabsList>

                    <TabsContent value="search" className="flex-1 overflow-y-auto space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="tech-search" className="text-sm">Search Technology</Label>
                            <div className="relative">
                                <Input
                                    id="tech-search"
                                    placeholder="React, Node.js, PostgreSQL..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    autoFocus
                                    disabled={isCreatingTech}
                                />
                                {isSearching && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {isSearching && !results.length && query.trim() && (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                        )}

                        {!isSearching && results.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs text-muted-foreground font-medium">Existing Technologies</p>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {results.map((tech) => (
                                        <button
                                            key={tech.id}
                                            onClick={() => handleSelectExisting(tech)}
                                            disabled={isCreatingTech}
                                            className="w-full text-left px-3 py-2 rounded-lg border border-border hover:bg-secondary/50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {tech.icon && <Image src={tech.icon} alt={tech.name} width={20} height={20} className="text-lg"/>}
                                            <div className="flex-1">
                                                <div className="font-medium">{tech.name}</div>
                                                {tech.category && (
                                                    <Badge variant="outline" className="text-xs mt-1">
                                                        {tech.category}
                                                    </Badge>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!isSearching && query.trim() && results.length === 0 && (
                            <div className="py-4 space-y-4 border rounded-lg p-4">
                                <p className="text-sm text-muted-foreground text-center">No technologies found. Create a new one:</p>

                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="new-category" className="text-xs">Category (Optional)</Label>
                                        <div className="flex flex-col gap-3 flex-1 justify-start items-start w-full" >
                                            <InfiniteScrollSelect
                                                fetchData={() => fetchData({ q: "", skip: 0, take: 10 })}
                                                onValueChange={setNewTechCategory}
                                                value={newTechCategory}
                                                disabled={isCreatingTech || newCategoryInp.trim() !== "" || isLoadingCategories}
                                                pageSize={10}
                                                renderItem={(item) => {

                                                    return <>
                                                        <span>
                                                            {item}
                                                        </span>
                                                    </>
                                                }}
                                                getItemValue={(item) => item}
                                                getItemLabel={(item) => item}
                                            />
                                            <Input value={newCategoryInp} onChange={(e) => setNewCategoryInp(e.target.value)} placeholder="new Category...." disabled={isCreatingTech} />



                                        </div>
                                    </div>


                                    <div className="space-y-2 flex-col items-start justify-start flex-wrap">

                                        <Label htmlFor="new-icon" className="  text-xs">Icon (Optional)</Label>
                                        <div className="flex gap-3 flex-1 justify-start items-start w-full">

                                            <Button
                                                size={"sm"}
                                                onClick={() => {
                                                    if (newIconRef.current) newIconRef.current.click()
                                                }}
                                            >
                                                <Upload className="h-4 w-4 " />
                                            </Button>
                                            <Input
                                                accept="image/*"
                                                className="hidden"
                                                ref={newIconRef} id="new-icon" type="file" onChange={(e) => {
                                                    if (!e.target.files) return
                                                    const file = e.target.files[0]
                                                    if (!file) return
                                                    setIconFile(file)
                                                    setIconPreview(URL.createObjectURL(file))
                                                }} disabled={isCreatingTech} />
                                            {
                                                iconPreview && (

                                                    <div className="flex items-center gap-2">
                                                        <Image src={iconPreview} alt="new icon" width={24} height={24} className="w-8 h-8 rounded-md" />
                                                        <Button onClick={() => setIconPreview("")} variant="destructive" size="sm">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )
                                            }
                                        </div>

                                    </div>
                                </div>

                                <Button
                                    onClick={handleCreateNew}
                                    disabled={isCreatingTech}
                                    className="w-full"
                                    size="sm"
                                >
                                    {isCreatingTech ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Create "{query}"
                                </Button>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="category" className="flex-1 overflow-y-auto space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="category-select" className="text-sm">Select Category</Label>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={isCreatingTech}>
                                <SelectTrigger id="category-select">
                                    <SelectValue placeholder="Choose a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            <div className="flex items-center gap-2">
                                                <Layers className="h-4 w-4" />
                                                {cat}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {isLoadingCategory && (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                        )}

                        {!isLoadingCategory && categoryResults.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-muted-foreground font-medium">
                                        {categoryResults.length} technologies in {selectedCategory}
                                    </p>
                                    {onBulkTechSelected && (
                                        <Button
                                            onClick={handleSelectAllCategory}
                                            disabled={isCreatingTech}
                                            size="sm"
                                            variant="outline"
                                        >
                                            Add All
                                        </Button>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                                    {categoryResults.map((tech) => (
                                        <button
                                            key={tech.id}
                                            onClick={() => handleSelectExisting(tech)}
                                            disabled={isCreatingTech}
                                            className="text-left px-3 py-2 rounded-lg border border-border hover:bg-secondary/50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <div className="flex items-center gap-2">
                                                {tech.icon && <Image src={tech.icon} alt={tech.name} width={24} height={24} className="w-6 h-6" />} 
                                                <span className="font-medium truncate">{tech.name}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!isLoadingCategory && selectedCategory && categoryResults.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <p className="text-sm">No technologies found in {selectedCategory}</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 pt-4 border-t">
                    <AlertDialogCancel disabled={isCreatingTech}>Cancel</AlertDialogCancel>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}