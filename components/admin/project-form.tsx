"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { X, Plus, Loader2, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useLazySearchTechnologiesQuery, useLazyGetTechnologiesByCategoryQuery, useGetTechsQuery, useLazyGetTechsQuery, useLazyGetCategoriesQuery, useCerateProjectAndAssignTechnologiesMutation } from "@/lib/store/api/projects-api"
import { TechSearchDialog } from "@/app/(routes)/admin/projects/_comp/tech-serch-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ServiceWithImage, Technology } from "@/types/schema"
import { useDebounce } from "@/lib/store/hooks"
import Image from "next/image"
import ContolledImage from "@/app/_comp/contolledImage"
import ServiceSelect from "@/app/(routes)/admin/services/_comp/service-select"
import TabContentService from "./utils/SlideShowSelectTapContent"



interface ProjectFormProps {
  initialData?: {
    id: string
    title: string
    description: string
    richDescription: string
    clientName: string
    clientCompany: string
    projectUrl: string
    githubUrl: string
    status: string
    startDate: string
    endDate: string
    technologies: any[]
    isFeatured: boolean
  }
}

export function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    richDescription: initialData?.richDescription || "",
    clientName: initialData?.clientName || "",
    clientCompany: initialData?.clientCompany || "",
    projectUrl: initialData?.projectUrl || "",
    githubUrl: initialData?.githubUrl || "",
    status: initialData?.status || "COMPLETED",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    isFeatured: initialData?.isFeatured || false,
  })

  const [selectedTechs, setSelectedTechs] = useState<any[]>(initialData?.technologies || [])
  const [openTechDialog, setOpenTechDialog] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Tech browsing states
  const [techTab, setTechTab] = useState<"skills" | "category">("skills")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [recentTechs, setRecentTechs] = useState<Technology[]>([])
  const [categoryTechs, setCategoryTechs] = useState<Technology[]>([])
  const [openCategorySelect, setOpenCategorySelect] = useState(false)
  const debouncedSearch = useDebounce(searchQuery, 300)

  const [createProject] = useCerateProjectAndAssignTechnologiesMutation()
  const [searchTechnologies, { isLoading: isSearching }] = useLazySearchTechnologiesQuery()
  const [getTechsByCategory, { isLoading: isLoadingCategory }] = useLazyGetTechnologiesByCategoryQuery()
  const [getTechs, { isLoading: isLoadingLastTech }] = useLazyGetTechsQuery()


  const [selectedImageBlob, setSelectedImageBlob] = useState("")
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [selectedServices, setSelectedServices] = useState<ServiceWithImage[]>([])
  const [getCategories, { isLoading: isLoadingCategories, data }] = useLazyGetCategoriesQuery()

  useEffect(() => {
    if (openCategorySelect) {
      getCategories({ skip: 0, take: 100 }).unwrap().then((res) => {
        console.log(res)
      })
    }
  }, [openCategorySelect])



  useEffect(() => {
    const loadRecent = async () => {

      try {

        const result = await getTechs({ skip: 0, take: 10 }).unwrap()
        setRecentTechs(result.data as unknown as Technology[])
      } catch (error) {
        console.log("Failed to load recent techs:", error)
      }
    }
    loadRecent()
  }, [searchTechnologies])

  // Search technologies
  useEffect(() => {
    if (!debouncedSearch.trim() || techTab !== "skills") {
      if (techTab === "skills" && !debouncedSearch.trim()) {
        // Show recent when no search
        const loadRecent = async () => {

          try {

            const result = await getTechs({ skip: 0, take: 10 }).unwrap()
            setRecentTechs(result.data as unknown as Technology[])
          } catch (error) {
            console.log("Failed to load recent techs:", error)
          }
        }
        loadRecent()
      }
      return
    }

    const search = async () => {
      try {
        const result = await searchTechnologies({ q: debouncedSearch, skip: 0, take: 20 }).unwrap()
        setRecentTechs(result.data as unknown as Technology[])
      } catch (error) {
        console.error("Search failed:", error)
      }
    }
    search()
  }, [debouncedSearch, techTab, searchTechnologies])

  // Load technologies by category
  useEffect(() => {
    if (!selectedCategory || techTab !== "category") {
      setCategoryTechs([])
      return
    }

    const loadCategory = async () => {
      try {
        const result = await getTechsByCategory({ category: selectedCategory, skip: 0, take: 50 }).unwrap()
        console.log(result)
        setCategoryTechs(result.data as unknown as Technology[])
      } catch (error) {
        console.log("Category load failed:", error)
      }
    }
    loadCategory()
  }, [selectedCategory, techTab, getTechsByCategory])

  const handleTechSelected = (tech: any) => {
    if (!selectedTechs.find((t) => t.id === tech.id)) {
      setSelectedTechs([...selectedTechs, tech])
    }
  }

  const handleBulkTechSelected = (techs: Technology[]) => {
    const newTechs = techs.filter(tech => !selectedTechs.find(t => t.id === tech.id))
    setSelectedTechs([...selectedTechs, ...newTechs])
  }

  const removeTechnology = (techId: string) => {
    setSelectedTechs(selectedTechs.filter((t) => t.id !== techId))
  }

  const addTechFromBrowser = (tech: Technology) => {
    if (!selectedTechs.find((t) => t.id === tech.id)) {
      setSelectedTechs([...selectedTechs, tech])
    }
  }

  const addAllCategoryTechs = () => {
    const newTechs = categoryTechs.filter(tech => !selectedTechs.find(t => t.id === tech.id))
    setSelectedTechs([...selectedTechs, ...newTechs])
  }

  const handleSubmit = async () => {
    console.log(" Project form submitted:", formData)
    console.log(" Selected technologies:", selectedTechs)
    console.log(" Selected technologies:", selectedServices.map((s) => s.id))
    // setSubmitting(true)

    const formDataSubmit = new FormData()

    Object.entries(formData)
      .forEach(([key, value]) => {
        if (typeof value === "boolean") formDataSubmit.append(key, JSON.stringify(value))
        formDataSubmit.append(key, value as string)
      }
      )
    formDataSubmit.append("image", selectedImageFile || "")
    formDataSubmit.append("technologies", JSON.stringify(selectedTechs.map((tech) => tech.id)))
    formDataSubmit.append("services", JSON.stringify(selectedServices.map((service) => service.id)))
    try {
      const result = await createProject(
        formDataSubmit
      ).unwrap()

      console.log(result)
      router.push("/admin/projects/" + result.data.project.slug)
    } catch (error) {
      // console.error(" Project creation failed:", error.status)
      console.log(error)

    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="">
      <div className="space-y-6">
        <div className="flex items-start flex-col md:flex-row justify-start w-full h-max gap-3">
          {/* Project Information */}
          <div className=" pb-3 w-full bg-white p-4 rounded-md shadow-sm">
            <h2 className="text-sm font-semibold text-foreground mb-4">Project Information</h2>
            <div className="space-y-4 flex flex-col justify-between gap-[1.2rem] ">

              <div className="">
                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-xs font-medium">Project Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="E-Commerce Platform"
                    required
                  />
                </div>

              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-medium">Short Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief project overview"
                  rows={2}
                  className="resize-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="richDescription" className="text-xs font-medium">Full Project Description</Label>
                <Textarea
                  id="richDescription"
                  value={formData.richDescription}
                  onChange={(e) => setFormData({ ...formData, richDescription: e.target.value })}
                  placeholder="Detailed project description, challenges, solutions, outcomes..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md border border-border">
                <div>
                  <Label htmlFor="featured" className="text-xs font-medium cursor-pointer">Featured Project</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">Display this project prominently</p>
                </div>
                <Switch
                  id="featured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                />
              </div>

            </div>
          </div>

          <div className="w-full flex flex-col justify-between items-center h-full  bg-white p-4 rounded-md shadow-sm">
            {/* Client Information */}
            <div className=" pb-6 w-full h-1/2">
              <h2 className="text-sm font-semibold text-foreground mb-4">Client Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="clientName" className="text-xs font-medium">Client Name</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="clientCompany" className="text-xs font-medium">Client Company</Label>
                  <Input
                    id="clientCompany"
                    value={formData.clientCompany}
                    onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                    placeholder="ABC Corporation"
                  />
                </div>
              </div>
            </div>

            {/* Links & Timeline */}
            <div className="  w-full h-1/2">
              <h2 className="text-sm font-semibold text-foreground mb-4">Links & Timeline</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="projectUrl" className="text-xs font-medium">Project URL</Label>
                    <Input
                      id="projectUrl"
                      type="url"
                      value={formData.projectUrl}
                      onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="githubUrl" className="text-xs font-medium">GitHub URL</Label>
                    <Input
                      id="githubUrl"
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                  <div className="space-y-1.5">
                    <Label htmlFor="startDate" className="text-xs font-medium">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="endDate" className="text-xs font-medium">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="status" className="text-xs font-medium">Status *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PLANNING">Planning</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="ON_HOLD">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>

                  <div className="space-y-1.5 w-full ">
                    <ContolledImage className={"w-full h-32 flex justify-center items-center overflow-hidden hover:bg-amber-50 transition-all duration-200 cursor-pointer bg-amber-50 border-dashed border-2 border-black rounded-xl"} selectedImageBlob={selectedImageBlob} setSelectedImageBlob={setSelectedImageBlob} setSelectedImageFile={setSelectedImageFile} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technologies Section */}
        <div className="border-b border-border pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Technologies</h2>
            <Button
              type="button"
              onClick={() => setOpenTechDialog(true)}
              size="sm"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Technology
            </Button>
          </div>

          {/* Selected Technologies */}
          {selectedTechs.length > 0 && (
            <Card className="p-4 mb-4 relative">
              <Label className="text-xs font-medium mb-2 block">Selected Technologies ({selectedTechs.length})</Label>
              <div className="flex flex-wrap gap-2">
                {selectedTechs.map((tech, index) => (

                  <div key={index}>

                    <Badge key={tech.id} variant="secondary" className="gap-1.5 px-2.5 py-1 text-xs">
                      {tech.icon && <Image src={tech.icon || ""} alt={tech.name} width={16} height={16} />}
                      {tech.name}
                      {tech.category && <span className="text-muted-foreground">({tech.category})</span>}
                      <button
                        type="button"
                        onClick={() => removeTechnology(tech.id)}
                        className="hover:opacity-70 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  </div>
                ))}

                <Button className="absolute top-4 right-4" variant="destructive" size="sm" onClick={() => setSelectedTechs([])}>
                  <span>Clear</span>
                  <X />
                </Button>
              </div>

            </Card>
          )}

          {/* Technology Browser */}
          <Card className="p-4 flex justify-start w-full items-center">
            <CardContent className="flex  p-0 justify-start w-full items-cente">
              <Tabs value={techTab} className="w-full" onValueChange={(v) => setTechTab(v as "skills" | "category")}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="skills">Browse Skills</TabsTrigger>
                  <TabsTrigger value="category">By Category</TabsTrigger>
                </TabsList>

                <TabsContent value="skills" className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                    <Input
                      placeholder="Search technologies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  {isSearching ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        {searchQuery ? `Search results for "${searchQuery}"` : "Recent technologies"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recentTechs.map((tech) => (
                          <Button
                            key={tech.id}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addTechFromBrowser(tech)}
                            disabled={selectedTechs.some(t => t.id === tech.id)}
                            className="justify-start cursor-pointer"
                          >
                            {tech.icon && <Image src={tech.icon} alt={tech.name} width={16} height={16} className="mr-2" />}
                            <span className="truncate">{tech.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="category" className="space-y-3">
                  <Select
                    open={openCategorySelect}
                    onOpenChange={setOpenCategorySelect}
                    value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {
                        isLoadingCategory ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                          </div>
                        ) : (
                          data?.data.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))
                        )
                      }

                    </SelectContent>
                  </Select>

                  {isLoadingLastTech || isLoadingCategory ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : categoryTechs.length > 0 ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {categoryTechs.length} technologies in {selectedCategory}
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={addAllCategoryTechs}
                        >
                          Add All
                        </Button>
                      </div>
                      <div className=" flex justify-start items-center gap-2 max-h-64 overflow-y-auto">
                        {categoryTechs.map((tech) => (

                          <Button
                            key={tech.id}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addTechFromBrowser(tech)}
                            disabled={selectedTechs.some(t => t.id === tech.id)}
                            className="justify-start"
                          >
                            {tech.icon && <Image src={tech.icon} alt={tech.name} width={16} height={16} className="mr-2" />}
                            <span className="truncate">{tech.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : selectedCategory ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No technologies in {selectedCategory}
                    </div>
                  ) : null}
                </TabsContent>

              </Tabs>


            </CardContent>

          </Card>

          <Card className="mt-4" >
            <CardHeader>
              <CardTitle>
                Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TabContentService
                tabType={"service"}
                title={"Services"}
                placeholder={"Search Services..."}
                skip={0}
                take={10}
                setSelectedServices={setSelectedServices}
                selectedServices={selectedServices}
                ExtraInputs={false}
              />
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/projects")}
            className="text-sm h-auto py-2"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting} className="gap-2 text-sm h-auto py-2">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {initialData ? "Update Project" : "Create Project"}
          </Button>
        </div>
      </div>

      {/* Tech Search Dialog */}
      <TechSearchDialog
        open={openTechDialog}
        onOpenChange={setOpenTechDialog}
        onTechSelected={handleTechSelected}
        onBulkTechSelected={handleBulkTechSelected}
      />
    </div>
  )
}