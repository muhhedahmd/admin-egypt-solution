"use client"
import { useState, useEffect } from "react";
import { X, Plus, Save, ChevronLeft, ChevronRight, Loader2, Search, StepBack, StepBackIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useGetProjectBySlugQuery, useLazySearchTechnologiesQuery, useLazyGetTechnologiesByCategoryQuery, useLazyGetTechsQuery, useLazyGetCategoriesQuery, useUpdateProjectMutation, useUpdateProjectBulkMutation } from "@/lib/store/api/projects-api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSchema, FormDataSchema } from "@/components/admin/project-form";
import { Card, CardContent } from "@/components/ui/card";
import TabContentService from "@/components/admin/utils/SlideShowSelectTapContent";
import Image from "next/image";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TechSearchDialog } from "@/app/(routes)/admin/projects/_comp/tech-serch-dialog";
import { useDebounce } from "@/lib/store/hooks";
import { Technology, ServiceWithImage } from "@/types/schema";
import { useRouter } from "next/navigation";
import ContolledImage from "@/app/_comp/contolledImage";
import { useLanguage } from "@/providers/lang";
import { projectEditorI18n } from "@/i18n/project";

export const ProjectEditorForm = ({ projectSlug }: { projectSlug: string }) => {
    const router = useRouter();
    const { currentLang, } = useLanguage()
    const t = projectEditorI18n[currentLang?.toLowerCase() as 'en' | 'ar' || "en"]
    const { data: projectData, isLoading, isError } = useGetProjectBySlugQuery({projectSlug ,currentLang}, { skip: !projectSlug });
    const [updateProject] = useUpdateProjectBulkMutation();

    const [selectedTechs, setSelectedTechs] = useState<Technology[]>([]);
    // const [service, setService] = useState<ServiceWithImage[]>([]);
    const [openTechDialog, setOpenTechDialog] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [techTab, setTechTab] = useState<"skills" | "category">("skills");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [recentTechs, setRecentTechs] = useState<Technology[]>([]);
    const [categoryTechs, setCategoryTechs] = useState<Technology[]>([]);
    const [openCategorySelect, setOpenCategorySelect] = useState(false);
    const debouncedSearch = useDebounce(searchQuery, 300);
    const [selectedImageBlob, setSelectedImageBlob] = useState("");
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

    const [searchTechnologies, { isLoading: isSearching }] = useLazySearchTechnologiesQuery();
    const [getTechsByCategory, { isLoading: isLoadingCategory }] = useLazyGetTechnologiesByCategoryQuery();
    const [getTechs] = useLazyGetTechsQuery();



    const [getCategories, { isLoading: isLoadingCategories, data: categoriesData }] = useLazyGetCategoriesQuery();

    const project = projectData?.data.project;
    const image = projectData?.data.image;
    const technologies = projectData?.data.technologies;
    const servicesData: any[] | undefined = projectData?.data.servicesData;
    const [selectedServices, setSelectedServices] = useState<ServiceWithImage[]>([]);

    useEffect(() => {

        if (image) {
            setSelectedImageBlob(image.url)
            setSelectedImageFile(null)
        }
    }, [image])




    const form = useForm<FormDataSchema>({
        resolver: zodResolver(createSchema),
        defaultValues: {
            title: projectData?.data.project?.title || "",
            description: projectData?.data.project.description || "",
            richDescription: projectData?.data.project?.richDescription || "",
            clientName: projectData?.data.project?.clientName || "",
            clientCompany: projectData?.data.project?.clientCompany || "",
            projectUrl: projectData?.data.project?.projectUrl || ""
            , githubUrl: projectData?.data.project?.githubUrl || "",
            status: projectData?.data.project?.status || "COMPLETED",
            startDate: projectData?.data.project?.startDate || ""
            , endDate: projectData?.data.project?.endDate || "",
            isFeatured: false, order: 0,
        },
    });

    useEffect(() => {
        if (!servicesData) return;

        const formattedServices: ServiceWithImage[] = servicesData?.map((s, index) => ({
            ...s.service,
            image: s.image,
            _order: index + 1,
            type: "service",
            customDesc: "",
            customTitle: "",
            isVisible: true
        }));

        setSelectedServices(formattedServices);
    }, [servicesData]);


    useEffect(() => {
        if (projectData?.data.project)
            form.setValue("status", projectData?.data.project?.status)

    }, [projectData])


    useEffect(() => {
        if (project) {
            form.reset({
                title: project.title || "", description: project.description || "",
                richDescription: project.richDescription || "", clientName: project.clientName || "",
                clientCompany: project.clientCompany || "", projectUrl: project.projectUrl || "",
                githubUrl: project.githubUrl || "", status: project.status as any || "COMPLETED",
                startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : "",
                endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : "",
                isFeatured: project.isFeatured || false, order: project.order || 0,
            });
        }
    }, [project, form]);

    useEffect(() => { if (technologies) setSelectedTechs(technologies as Technology[]); }, [technologies]);

    ;

    useEffect(() => { if (openCategorySelect) getCategories({ skip: 0, take: 100 }); }, [openCategorySelect, getCategories]);
    useEffect(() => { getTechs({ skip: 0, take: 10 }).unwrap().then(res => setRecentTechs(res.data as Technology[])).catch(() => { }); }, [getTechs]);

    useEffect(() => {
        if (!debouncedSearch.trim() || techTab !== "skills") {
            if (techTab === "skills" && !debouncedSearch.trim()) {
                getTechs({ skip: 0, take: 10 }).unwrap().then(res => setRecentTechs(res.data as Technology[])).catch(() => { });
            }
            return;
        }
        searchTechnologies({ q: debouncedSearch, skip: 0, take: 20 }).unwrap().then(res => setRecentTechs(res.data as any[])).catch(() => { });
    }, [debouncedSearch, techTab, searchTechnologies, getTechs]);

    useEffect(() => {
        if (!selectedCategory || techTab !== "category") { setCategoryTechs([]); return; }

        getTechsByCategory({ category: selectedCategory, skip: 0, take: 50 }).unwrap().then(res => setCategoryTechs(res.data as Technology[])).catch(() => { });
    }, [selectedCategory, techTab, getTechsByCategory]);


    const handleTechSelected = (tech: Technology) => { if (!selectedTechs.find(t => t.id === tech.id)) setSelectedTechs([...selectedTechs, tech]); };
    const handleBulkTechSelected = (techs: Technology[]) => { const newTechs = techs.filter(tech => !selectedTechs.find(t => t.id === tech.id)); setSelectedTechs([...selectedTechs, ...newTechs]); };
    const removeTechnology = (techId: string) => setSelectedTechs(selectedTechs.filter(t => t.id !== techId));
    const addTechFromBrowser = (tech: Technology) => { if (!selectedTechs.find(t => t.id === tech.id)) setSelectedTechs([...selectedTechs, tech]); };
    const addAllCategoryTechs = () => { const newTechs = categoryTechs.filter(tech => !selectedTechs.find(t => t.id === tech.id)); setSelectedTechs([...selectedTechs, ...newTechs]); };

    const handleNextStep = async () => {
        if (currentStep === 0) {
            await form.trigger();
            if (!form.formState.isValid) return;
        }
        setCurrentStep(prev => prev + 1)

    }


    const onSubmit = async (data: FormDataSchema) => {
        if (!project) return;
        try {
            const formDataSubmit = new FormData();



            const formattedServices = servicesData?.map((s, index) => ({
                ...s.service,
                image: s.image,
                _order: index + 1,
                type: "service",
                customDesc: "",
                customTitle: "",
                isVisible: true
            }));

            // deleted services & technologies
            const deletedService = formattedServices?.filter(s => !selectedServices.find(ss => ss.id === s.id));
            const deletedTech = technologies.filter(t => !selectedTechs.find((tt) => tt.id === t.id));
            formDataSubmit.append("deletedServiceIds", JSON.stringify(deletedService?.map(s => s.id)));
            formDataSubmit.append("deletedTechIds", JSON.stringify(deletedTech.map(t => t.id)));

            // new services & technologies
            const newService = selectedServices.filter(s => !formattedServices?.find(ss => ss.id === s.id));
            const newTech = selectedTechs.filter(t => !technologies.find((tt) => tt.id === t.id));
            formDataSubmit.append("newServiceIds", JSON.stringify(newService.map(s => s.id)));
            formDataSubmit.append("newTechIds", JSON.stringify(newTech.map(t => t.id)));

            // image State
            let imageState: "KEEP" | "REMOVE" | "UPDATE" = "KEEP"

            if (selectedImageFile !== null) {
                formDataSubmit.append("image", selectedImageFile);
                imageState = "UPDATE"
            }
            if (!selectedImageBlob) imageState = "REMOVE"

            formDataSubmit.append("imageState", imageState)

            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    formDataSubmit.append(key, typeof value === "boolean" ? JSON.stringify(value) : value as string);
                }
            });

            await updateProject({
                id: project.id,
                data: formDataSubmit
            }).unwrap();
            toast.success("Project updated successfully!");

            router.push("/admin/projects");
        } catch (error) {
            toast.error("Failed to update project");
        }
    };


    if (isLoading) return <div className="flex items-center justify-center h-[400px]"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    if (isError || !project) return <div className="flex items-center justify-center h-[400px]"><p className="text-destructive">Failed to load project</p></div>;

    const steps = t?.editProject?.steps  || [ "Project Info", "Services", "Technologies"]

    return (
        <div className="w-full md:p-4 sm:p-6">
            <div className="flex border-b border-border mb-6">
                {steps?.map((step, index) => (
                    <button key={step}  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${currentStep === index ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                        {step}
                    </button>
                ))}
            </div>

            <div className="bg-card rounded-lg p-0 lg:p-6 min-h-[calc(100vh-400px)]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {currentStep === 0 && (
                            <div className="flex flex-col lg:flex-row gap-3">
                                <div className="w-full p-4 rounded-md shadow-sm">

                                    <h2 className="text-sm font-semibold mb-4">{t.editProject.headings.projectInfo}</h2>
                                    <div className="space-y-4">
                                        <FormField control={form.control} name="title" render={({ field }) => (
                                            <FormItem><FormLabel className="text-xs font-medium">{t.editProject.fields.title} *</FormLabel>
                                                <FormControl><Input placeholder={t.editProject.placeholders.title} {...field} /></FormControl>
                                                <FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="description" render={({ field }) => (
                                            <FormItem><FormLabel className="text-xs font-medium">{t.editProject.fields.shortDescription}</FormLabel>
                                                <FormControl><Textarea placeholder={t.editProject.placeholders.shortDescription} rows={2} className="resize-none" {...field} /></FormControl>
                                                <FormMessage /></FormItem>
                                        )} />

                                        <FormField control={form.control} name="richDescription" render={({ field }) => (
                                            <FormItem><FormLabel className="text-xs font-medium">{t.editProject.fields.fullDescription} *</FormLabel>
                                                <FormControl><Textarea placeholder={t.editProject.placeholders.fullDescription} rows={3} className="resize-none" {...field} /></FormControl>
                                                <FormMessage /></FormItem>
                                        )} />
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-foreground mb-1">{t.editProject.headings.projectImage}</label>

                                            <ContolledImage
                                                orginalUrl={image?.url || ""}
                                                selectedImageBlob={selectedImageBlob}
                                                setSelectedImageBlob={setSelectedImageBlob}
                                                setSelectedImageFile={setSelectedImageFile}
                                                className="w-full h-35 md:h-40  border-2 border-dashed border-primary/50 rounded-md flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-all"
                                            />
                                        </div>
                                        <FormField control={form.control} name="isFeatured" render={({ field }) => (
                                            <FormItem className="flex items-center justify-between p-3 bg-secondary/50 rounded-md border">
                                                <div><FormLabel className="text-xs font-medium">{t.editProject.fields.featured}</FormLabel>
                                                    <p className="text-xs text-muted-foreground">{t.editProject.fields.featuredHint}</p></div>
                                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                </div>

                                <div className="w-full p-4 rounded-md shadow-sm h-full" >
                                    <h2 className="text-sm font-semibold mb-4">{t.editProject.headings.clientInfo}</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <FormField control={form.control} name="clientName" render={({ field }) => (
                                            <FormItem><FormLabel className="text-xs font-medium">{t.editProject.fields.clientName   }</FormLabel>
                                                <FormControl><Input placeholder={t.editProject.placeholders.clientName} {...field} /></FormControl>
                                                <FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="clientCompany" render={({ field }) => (
                                            <FormItem><FormLabel className="text-xs font-medium">{ t.editProject.fields.clientCompany}</FormLabel>
                                                <FormControl><Input placeholder={t.editProject.placeholders.clientCompany} {...field} /></FormControl>
                                                <FormMessage /></FormItem>
                                        )} />
                                    </div>

                                    <h2 className="text-sm font-semibold mb-4">{t.editProject.headings.linksTimeline}</h2>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField control={form.control} name="projectUrl" render={({ field }) => (
                                                <FormItem><FormLabel className="text-xs font-medium">{t.editProject.fields.projectUrl}</FormLabel>
                                                    <FormControl><Input type="url" placeholder={t.editProject.placeholders.projectUrl} {...field} /></FormControl>
                                                    <FormMessage /></FormItem>
                                            )} />
                                            <FormField control={form.control} name="githubUrl" render={({ field }) => (
                                                <FormItem><FormLabel className="text-xs font-medium">{t.editProject.fields.githubUrl}</FormLabel>
                                                    <FormControl><Input type="url" placeholder={t.editProject.placeholders.githubUrl} {...field} /></FormControl>
                                                    <FormMessage /></FormItem>
                                            )} />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="status"
                                            render={({ field }) => {
                                                return <FormItem className="w-full">
                                                    <FormLabel className="text-xs font-medium">
                                                        {t.editProject.fields.status}
                                                    </FormLabel>
                                                    <Select

                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder={t.editProject.placeholders.selectCategory} />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="PLANNING">{t.editProject.status.PLANNING}</SelectItem>
                                                            <SelectItem value="IN_PROGRESS">
                                                                {t.editProject.status.IN_PROGRESS}
                                                            </SelectItem>
                                                            <SelectItem value="COMPLETED">
                                                                {t.editProject.status.COMPLETED}
                                                            </SelectItem>
                                                            <SelectItem value="ON_HOLD">{t.editProject.status.ON_HOLD}</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            }
                                            }
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField control={form.control} name="startDate" render={({ field }) => (
                                                <FormItem><FormLabel className="text-xs font-medium">{t.editProject.fields.startDate}</FormLabel>
                                                    <FormControl><Input type="date" {...field} value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value || ''} /></FormControl>
                                                    <FormMessage /></FormItem>
                                            )} />
                                            <FormField control={form.control} name="endDate" render={({ field }) => (
                                                <FormItem><FormLabel className="text-xs font-medium">{t.editProject.fields.endDate}</FormLabel>
                                                    <FormControl><Input type="date" {...field} value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value || ''} /></FormControl>
                                                    <FormMessage /></FormItem>
                                            )} />
                                        </div>
                                    </div>

                                </div>

                            </div>
                        )}

                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm font-semibold">{t.editProject.headings.technologies}</h2>
                                    <Button type="button" onClick={() => setOpenTechDialog(true)} size="sm" variant="outline">
                                        <Plus className="h-4 w-4 mr-2" />{t.editProject.technologiesUI.addButton}
                                    </Button>
                                </div>

                                {selectedTechs.length > 0 && (
                                    <Card className="p-4 relative">
                                        <p className="text-xs font-medium mb-2">{t.editProject.technologiesUI.selectedCount(selectedTechs.length)}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedTechs.map(tech => (
                                                <Badge key={tech.id} variant="secondary" className="gap-1.5 px-2.5 py-1">
                                                    {tech.icon?.startsWith("http") ? <Image src={tech.icon} alt={tech.name} width={16} height={16} /> : <span>{tech.icon}</span>}
                                                    {tech.name}
                                                    <button type="button" onClick={() => removeTechnology(tech.id)}>
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                            <Button type="button" className="absolute top-4 right-4" variant="destructive" size="sm" onClick={() => setSelectedTechs([])}>{t.editProject.technologiesUI.clearAll }</Button>
                                        </div>
                                    </Card>
                                )}

                                <Card className="p-4">
                                    <Tabs value={techTab} onValueChange={(v) => setTechTab(v as "skills" | "category")}>
                                        <TabsList className="grid w-full grid-cols-2 mb-4">
                                            <TabsTrigger value="skills">{t.editProject.technologiesUI.browseSkills}</TabsTrigger>
                                            <TabsTrigger value="category">{t.editProject.technologiesUI.byCategory}</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="skills" className="space-y-3">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input placeholder={t.editProject.placeholders.searchTech}value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
                                            </div>
                                            {isSearching ? <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin" /></div> : (
                                                <div className="space-y-2">
                                                    <p className="text-xs text-muted-foreground">{searchQuery ? `Results for "${searchQuery}"` : "Recent technologies"}</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {recentTechs.map(tech => (
                                                            <Button key={tech.id} type="button" variant="outline" size="sm" onClick={() => addTechFromBrowser(tech)} disabled={selectedTechs.some(t => t.id === tech.id)}>
                                                                {tech.icon?.startsWith("http") ? <Image src={tech.icon} alt={tech.name} width={16} height={16} /> : <span>{tech.icon}</span>}
                                                                {tech.name}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </TabsContent>
                                        <TabsContent value="category" className="space-y-3">
                                            <Select open={openCategorySelect} onOpenChange={setOpenCategorySelect} value={selectedCategory} onValueChange={setSelectedCategory}>
                                                <SelectTrigger><SelectValue placeholder={t.editProject.placeholders.selectCategory} /></SelectTrigger>
                                                <SelectContent>
                                                    {isLoadingCategories ? <Loader2 className="h-5 w-5 animate-spin m-4" /> : categoriesData?.data.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            {isLoadingCategory ? <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin" /></div> : categoryTechs.length > 0 && (
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <p className="text-xs text-muted-foreground">{categoryTechs.length} in {selectedCategory}</p>
                                                        <Button type="button" size="sm" variant="outline" onClick={addAllCategoryTechs}>{t.editProject.technologiesUI.addAll}</Button>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                                                        {categoryTechs.map(tech => (
                                                            <Button key={tech.id} type="button" variant="outline" size="sm" onClick={() => addTechFromBrowser(tech)} disabled={selectedTechs.some(t => t.id === tech.id)}>
                                                                {tech.icon?.startsWith("http") ? <Image src={tech.icon} alt={tech.name} width={16} height={16} /> : <span>{tech.icon}</span>}
                                                                {tech.name}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </TabsContent>
                                    </Tabs>
                                </Card>
                            </div>
                        )}

                        {currentStep === 2 && (

                            <TabContentService tabType="service" title={ t.editProject.servicesUI.titleForProject+" " + form.getValues("title") || project?.title} placeholder={t.editProject.servicesUI.searchPlaceholder } setSelectedServices={setSelectedServices} selectedServices={selectedServices} ExtraInputs={false} />
                        )}
                    </form>
                </Form>
            </div>

            <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setCurrentStep(prev => prev - 1)} disabled={currentStep === 0}>
                    <ChevronLeft className="h-4 w-4 mr-1" />{t.editProject.actions.previous}
                </Button>
                <div className="flex gap-2">
                    {currentStep < steps.length - 1 ? (
                        <Button onClick={() => handleNextStep()}>{t.editProject.actions.next} <ChevronRight className="h-4 w-4 ml-1" /></Button>
                    ) : (
                        <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            <Save className="h-4 w-4 mr-1" />{t.editProject.actions.save}
                        </Button>
                    )}
                </div>
            </div>

            <TechSearchDialog open={openTechDialog} onOpenChange={setOpenTechDialog} onTechSelected={handleTechSelected} onBulkTechSelected={handleBulkTechSelected} />
        </div>
    );
};