"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { X, Plus, Loader2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  useLazySearchTechnologiesQuery,
  useLazyGetTechnologiesByCategoryQuery,
  useGetTechsQuery,
  useLazyGetTechsQuery,
  useLazyGetCategoriesQuery,
  useCerateProjectAndAssignTechnologiesMutation,
} from "@/lib/store/api/projects-api";
import { TechSearchDialog } from "@/app/(routes)/admin/projects/_comp/tech-serch-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateProjectDTO, ServiceWithImage, Technology } from "@/types/schema";
import { useDebounce } from "@/lib/store/hooks";
import Image from "next/image";
import ContolledImage from "@/app/_comp/contolledImage";
import TabContentService from "./utils/SlideShowSelectTapContent";
import z, { ZodError } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form"; // FIXED: Removed Form import
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form, // FIXED: Import Form from shadcn/ui
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

export const createSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters")
    .optional(),
  richDescription: z
    .string()
    .min(10, "Rich description must be at least 10 characters"),
  clientName: z.string().max(100).optional(),
  clientCompany: z.string().max(100).optional(),
  projectUrl: z.string().url("Invalid project URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  status: z
    .enum(["COMPLETED", "IN_PROGRESS", "PLANNING", "ON_HOLD"])
    .default("COMPLETED")
    .optional(),
  startDate: z.preprocess((val) => {
    if (typeof val === "string" && val) {
      return new Date(val).toISOString();
    }
    return val;
  }, z.string().datetime().optional().or(z.date().optional()).or(z.literal(""))),
  endDate: z.preprocess((val) => {
    if (typeof val === "string" && val) {
      return new Date(val).toISOString();
    }
    return val;
  }, z.string().datetime().optional().or(z.date().optional()).or(z.literal(""))),
  image: z.instanceof(Buffer).optional(),
  isFeatured: z.preprocess(
    (val) => val === "true" || val === true,
    z.boolean().default(false)
  ),
  order: z.number().int().min(0).optional().default(0),
});

export type FormDataSchema = z.infer<typeof createSchema>;

interface ProjectFormProps {
  initialData?: {
    id: string;
    title: string;
    description: string;
    richDescription: string;
    clientName: string;
    clientCompany: string;
    projectUrl: string;
    githubUrl: string;
    status: string;
    startDate: string;
    endDate: string;
    technologies: any[];
    isFeatured: boolean;
  };
}

export function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();

  const [selectedTechs, setSelectedTechs] = useState<any[]>(
    initialData?.technologies || []
  );
  const [openTechDialog, setOpenTechDialog] = useState(false);

  // Tech browsing states
  const [techTab, setTechTab] = useState<"skills" | "category">("skills");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [recentTechs, setRecentTechs] = useState<Technology[]>([]);
  const [categoryTechs, setCategoryTechs] = useState<Technology[]>([]);
  const [openCategorySelect, setOpenCategorySelect] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const [createProject] = useCerateProjectAndAssignTechnologiesMutation();
  const [searchTechnologies, { isLoading: isSearching }] =
    useLazySearchTechnologiesQuery();
  const [getTechsByCategory, { isLoading: isLoadingCategory }] =
    useLazyGetTechnologiesByCategoryQuery();
  const [getTechs, { isLoading: isLoadingLastTech }] = useLazyGetTechsQuery();

  const [selectedImageBlob, setSelectedImageBlob] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedServices, setSelectedServices] = useState<ServiceWithImage[]>(
    []
  );
  const [getCategories, { isLoading: isLoadingCategories, data }] =
    useLazyGetCategoriesQuery();

  const form = useForm<FormDataSchema>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      richDescription: initialData?.richDescription || "",
      clientName: initialData?.clientName || "",
      clientCompany: initialData?.clientCompany || "",
      projectUrl: initialData?.projectUrl || "",
      githubUrl: initialData?.githubUrl || "",
      status: (initialData?.status || "COMPLETED") as
        | "COMPLETED"
        | "IN_PROGRESS"
        | "PLANNING"
        | "ON_HOLD",
      startDate: initialData?.startDate || "",
      endDate: initialData?.endDate || "",
      isFeatured: initialData?.isFeatured || false,
      order: 0,
    },
  });

  useEffect(() => {
    if (openCategorySelect) {
      getCategories({ skip: 0, take: 100 })
        .unwrap()
        .then((res) => {
          console.log(res);
        });
    }
  }, [openCategorySelect, getCategories]);

  useEffect(() => {
    const loadRecent = async () => {
      try {
        const result = await getTechs({ skip: 0, take: 10 }).unwrap();
        setRecentTechs(result.data as unknown as Technology[]);
      } catch (error) {
        console.log("Failed to load recent techs:", error);
      }
    };
    loadRecent();
  }, [getTechs]);

  // Search technologies
  useEffect(() => {
    if (!debouncedSearch.trim() || techTab !== "skills") {
      if (techTab === "skills" && !debouncedSearch.trim()) {
        const loadRecent = async () => {
          try {
            const result = await getTechs({ skip: 0, take: 10 }).unwrap();
            setRecentTechs(result.data as unknown as Technology[]);
          } catch (error) {
            console.log("Failed to load recent techs:", error);
          }
        };
        loadRecent();
      }
      return;
    }

    const search = async () => {
      try {
        const result = await searchTechnologies({
          q: debouncedSearch,
          skip: 0,
          take: 20,
        }).unwrap();
        setRecentTechs(result.data as unknown as Technology[]);
      } catch (error) {
        console.error("Search failed:", error);
      }
    };
    search();
  }, [debouncedSearch, techTab, searchTechnologies, getTechs]);

  // Load technologies by category
  useEffect(() => {
    if (!selectedCategory || techTab !== "category") {
      setCategoryTechs([]);
      return;
    }

    const loadCategory = async () => {
      try {
        const result = await getTechsByCategory({
          category: selectedCategory,
          skip: 0,
          take: 50,
        }).unwrap();
        console.log(result);
        setCategoryTechs(result.data as unknown as Technology[]);
      } catch (error) {
        console.log("Category load failed:", error);
      }
    };
    loadCategory();
  }, [selectedCategory, techTab, getTechsByCategory]);

  const handleTechSelected = (tech: any) => {
    if (!selectedTechs.find((t) => t.id === tech.id)) {
      setSelectedTechs([...selectedTechs, tech]);
    }
  };

  const handleBulkTechSelected = (techs: Technology[]) => {
    const newTechs = techs.filter(
      (tech) => !selectedTechs.find((t) => t.id === tech.id)
    );
    setSelectedTechs([...selectedTechs, ...newTechs]);
  };

  const removeTechnology = (techId: string) => {
    setSelectedTechs(selectedTechs.filter((t) => t.id !== techId));
  };

  const addTechFromBrowser = (tech: Technology) => {
    if (!selectedTechs.find((t) => t.id === tech.id)) {
      setSelectedTechs([...selectedTechs, tech]);
    }
  };

  const addAllCategoryTechs = () => {
    const newTechs = categoryTechs.filter(
      (tech) => !selectedTechs.find((t) => t.id === tech.id)
    );
    setSelectedTechs([...selectedTechs, ...newTechs]);
  };

  const onSubmit = async (data: FormDataSchema) => {
    try {
      const formDataSubmit = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (typeof value === "boolean") {
            formDataSubmit.append(key, JSON.stringify(value));
          } else {
            formDataSubmit.append(key, value as string);
          }
        }
      });

      if (selectedImageFile) {
        formDataSubmit.append("image", selectedImageFile);
      }

      formDataSubmit.append("technologyIds", JSON.stringify(selectedTechs.map(t => t.id) as string[]) || "[]");
      formDataSubmit.append("serviceIds", JSON.stringify(selectedServices.map(s => s.id) as string[]) || "[]");

      // console.log( { 
      //   project : form.getValues() , 
      //   selectedTechs : selectedTechs.map(t => t.id) ,
      //   selectedServices : selectedServices.map(s => s.id)
      // })
      const result = await createProject(formDataSubmit).unwrap();
      toast.success("Project created successfully!");
      router.push("/admin/projects/" + result.data.createdProject.project.slug);
    } catch (error) {
      console.error("Submission failed:", error);
      // toast.error("Failed to create project");
    }
  };

  return (
    <section id="project-form" className="w-full h-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-start flex-col md:flex-row justify-start w-full h-max gap-3">
            {/* Project Information */}
            <div className="pb-3 w-full p-4 rounded-md shadow-sm">
              <h2 className="text-sm font-semibold text-foreground mb-4">
                Project Information
              </h2>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">
                        Project Title *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="E-Commerce Platform" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">
                        Short Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief project overview"
                          rows={2}
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="richDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">
                        Full Project Description *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed project description..."
                          rows={3}
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-3 bg-secondary/50 rounded-md border border-border">
                      <div>
                        <FormLabel className="text-xs font-medium cursor-pointer">
                          Featured Project
                        </FormLabel>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Display this project prominently
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Client & Links Section */}
            <div className="w-full flex flex-col justify-between items-center h-full p-4 rounded-md shadow-sm">
              <div className="pb-6 w-full h-1/2">
                <h2 className="text-sm font-semibold text-foreground mb-4">
                  Client Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">
                          Client Name
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clientCompany"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">
                          Client Company
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="ABC Corporation" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="w-full h-1/2">
                <h2 className="text-sm font-semibold text-foreground mb-4">
                  Links & Timeline
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="projectUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">
                            Project URL
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="url"
                              placeholder="https://example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="githubUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">
                            GitHub URL
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="url"
                              placeholder="https://github.com/..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  </div>
                    <FormField
                    
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-xs font-medium">

                            Status 
                          </FormLabel>
                          <Select
                          
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="PLANNING">Planning</SelectItem>
                              <SelectItem value="IN_PROGRESS">
                                In Progress
                              </SelectItem>
                              <SelectItem value="COMPLETED">
                                Completed
                              </SelectItem>
                              <SelectItem value="ON_HOLD">On Hold</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">
                            Start Date
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              value={
                                field.value instanceof Date
                                  ? field.value.toISOString().split("T")[0]
                                  : field.value
                              }
                              onChange={(e) => field.onChange(e.target.value)}
                              onBlur={field.onBlur}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">
                            End Date
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              value={
                                field.value instanceof Date
                                  ? field.value.toISOString().split("T")[0]
                                  : field.value
                              }
                              onChange={(e) => field.onChange(e.target.value)}
                              onBlur={field.onBlur}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technologies Section */}
          <div className="border-b border-border pb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">
                Technologies
              </h2>
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

            {selectedTechs.length > 0 && (
              <Card className="p-4 mb-4 relative">
                <label className="text-xs font-medium mb-2 block">
                  Selected Technologies ({selectedTechs.length})
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedTechs.map((tech, index) => (
                    <Badge
                      key={tech.id}
                      variant="secondary"
                      className="gap-1.5 px-2.5 py-1 text-xs"
                    >
                      {tech.icon && tech.icon.startsWith("http") ? (
                        <Image
                          src={tech.icon || ""}
                          alt={tech.name}
                          width={16}
                          height={16}
                        />
                      ) : (
                        <span>{tech.icon}</span>
                      )}
                      {tech.name}
                      {tech.category && (
                        <span className="text-muted-foreground">
                          ({tech.category})
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeTechnology(tech.id)}
                        className="hover:opacity-70 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}

                  <Button
                    type="button"
                    className="absolute top-4 right-4"
                    variant="destructive"
                    size="sm"
                    onClick={() => setSelectedTechs([])}
                  >
                    <span>Clear</span>
                    <X />
                  </Button>
                </div>
              </Card>
            )}

            {/* Technology Browser */}
            <Card className="p-4 flex justify-start w-full items-center">
              <CardContent className="flex p-0 justify-start w-full items-center">
                <Tabs
                  value={techTab}
                  className="w-full"
                  onValueChange={(v) => setTechTab(v as "skills" | "category")}
                >
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
                          {searchQuery
                            ? `Search results for "${searchQuery}"`
                            : "Recent technologies"}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {recentTechs.map((tech) => (
                            <Button
                              key={tech.id}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addTechFromBrowser(tech)}
                              disabled={selectedTechs.some(
                                (t) => t.id === tech.id
                              )}
                              className="justify-start cursor-pointer"
                            >
                              {tech.icon && tech.icon.startsWith("http") ? (
                                <Image
                                  src={tech.icon || ""}
                                  alt={tech.name}
                                  width={16}
                                  height={16}
                                />
                              ) : (
                                <span className="text-xs">{tech.icon}</span>
                              )}
                              <span className="truncate text-lg font-bold">
                                {tech.name}
                              </span>
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
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingCategories ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                          </div>
                        ) : (
                          data?.data.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))
                        )}
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
                            {categoryTechs.length} technologies in{" "}
                            {selectedCategory}
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
                        <div className="flex justify-start items-center gap-2 max-h-64 overflow-y-auto">
                          {categoryTechs.map((tech) => (
                            <Button
                              key={tech.id}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addTechFromBrowser(tech)}
                              disabled={selectedTechs.some(
                                (t) => t.id === tech.id
                              )}
                              className="justify-start"
                            >
                              {tech.icon && tech.icon.startsWith("http") ? (
                                <Image
                                  src={tech.icon || ""}
                                  alt={tech.name}
                                  width={16}
                                  height={16}
                                />
                              ) : (
                                <span className="text-xs">{tech.icon}</span>
                              )}
                              <span className="truncate text-lg font-bold">
                                {tech.name}
                              </span>
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

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Services</CardTitle>
              </CardHeader>
              <CardContent>
                <TabContentService
                  tabType={"service"}
                  title={"Services"}
                  placeholder={"Search Services..."}
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
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              {initialData ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </form>
      </Form>

      <TechSearchDialog
        open={openTechDialog}
        onOpenChange={setOpenTechDialog}
        onTechSelected={handleTechSelected}
        onBulkTechSelected={handleBulkTechSelected}
      />
    </section>
  );
}