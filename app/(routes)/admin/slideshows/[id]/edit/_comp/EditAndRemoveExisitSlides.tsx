
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { DoorClosed, Layers, Edit2, CloudFog, Loader2, } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { EditSlideDialog } from './edit-slide-dalog'
import SlideShowSelect from '@/components/admin/utils/slideShowSelect'
import { ClientWithImages,  ProjectWithRelations, ServiceWithImage, slide, TeamMemberWithImage, TestimonialWithImage } from '@/types/schema'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import { useEffect, useState } from 'react'
import { PaginatedSlidesResponse, useBulkOperationsMutation, useGetSlideShowByIdQuery } from '@/lib/store/api/slideShow-api'
import { Slide } from '@/lib/store/api/slideShow-api'
import { SlideCard } from './slide-card'
import { ArrangeSlidesDialog } from '@/components/admin/utils/slides/Arrange-slides'
import { toast } from 'sonner'
import { PreviwDialog } from '@/components/admin/utils/previwDialog'
import { CompositionType } from '@/types/slideShows'
// import { toast } from 'sonner'
// import { slideArrangeMinmal } from '@/components/admin/utils/ArrangMinmalCard'


interface EditAndRemoveExistSlidesProps {
    slidesData: PaginatedSlidesResponse
    slideshowId: string,
    composititonType?: CompositionType
    reFetch: () => void
}


export const EditAndRemoveExisitSlides = ({
    slidesData,
    slideshowId,
    composititonType,
    reFetch
}: EditAndRemoveExistSlidesProps) => {



    // Existing slides from database ( records)
    const [existingSlides, setExistingSlides] = useState<Slide[]>(slidesData.slides);

    // New slides to be added
    const [newSlides, setNewSlides] = useState<slide[]>([]);

    // Selection states
    const [selectedClients, setSelectedclients] = useState<ClientWithImages[]>([])
    const [selectedTeam, setSelectedTeam] = useState<TeamMemberWithImage[]>([])
    const [selectedTestimonial, setSelectedTestimonial] = useState<TestimonialWithImage[]>([])
    const [selectedServices, setSelectedServices] = useState<ServiceWithImage[]>([]);
    const [selectedProjects, setSelectedProjects] = useState<ProjectWithRelations[]>([]);
    const [isDialogOrderOpen, setIsDialogOrderOpen] = useState<boolean>(false)
    const [AllSlidesExisitORNew, setAllSlidesExisitORNew] = useState<any[]>([])
    const [Operate, { isLoading, data }] = useBulkOperationsMutation()





    // Track changes for NEW slides (to be inserted into )
    const [newSlideChanges, setNewSlideChanges] = useState<Map<string, {
        attachedId: string,  // service/project/client etc id
        type: string,
        customTitle: string,
        customDescription: string,
        isVisible: boolean,
        slideshowId: string
    }>>(new Map());

    // Track changes for EXISTING slides (update )
    const [existingSlideChanges, setExistingSlideChanges] = useState<Map<string, {
        mainSlideId: string,  // The id from the 
        customTitle: string,
        customDescription: string,
        isVisible: boolean,
        action: 'update' | 'delete'  // Track if updating or deleting
        _id: string,
        type: string
    }>>(new Map());

    useEffect(() => {

        // Format existing slides
        const formatExisting = existingSlides.map((slide: any) => {

            if (slide.type === "service") {

                return {
                    _id: slide.id,
                    id: slide.data.id,
                    type: "service",
                    name: slide.data.name,
                    // description: slide.data.description,
                    image: slide.data.image,
                    tag: "existing",
                    isVisible: slide.isVisible,
                    customDescption: slide.customDesc,
                    customTitle: slide.customTitle,
                    description: slide.customDesc || slide.data.description,

                    ...slide.data,
                }
            }
            if (slide.type === "project") {
                return {
                    _id: slide.id,
                    id: slide.data.id,
                    type: "project",
                    title: slide.data.name,
                    clientName: slide.data.description,
                    image: slide.data.image,
                    tag: "existing",
                    isVisible: slide.isVisible,

                    ...slide.data,

                }
            }
            if (slide.type === "client") {

                return {
                    _id: slide.id,
                    id: slide.data.id, type: "client",
                    name: slide.data.name,
                    industry: slide.data.industry || "",
                    logo: slide.data.logo,
                    tag: "existing",
                    isVisible: slide.isVisible,

                    ...slide.data,

                }
            }
            if (slide.type === "team") {
                return {

                    _id: slide.id,
                    id: slide.data.id, type: "team",
                    name: slide.data.name,
                    position: slide.data.position,
                    image: slide.data.image,
                    tag: "existing",
                    isVisible: slide.isVisible,

                    ...slide.data,

                }
            }
            if (slide.type === "testimonial") {

                return {
                    _id: slide.id,
                    id: slide.data.id,
                    type: "testimonial",
                    name: slide.clientName,
                    description: slide.content,
                    content: slide.content,
                    clientName: slide.clientName,
                    avatar: slide.data.avatar,
                    tag: "existing",
                    isVisible: slide.isVisible,

                    ...slide.data,

                }
            }
            return null;
        }).filter(Boolean);

        // Format new slides
        const formatNew = newSlides.map((slide: any) => {


            if (!slide) return null;

            if (slide.type === "service") {
                return {
                    id: slide.id,
                    type: "service",
                    name: slide.name,
                    description: slide.description,
                    image: slide.image,
                    tag: "new",  // Changed from "existing" to "new"
                    ...slide,
                }
            }
            if (slide.type === "project") {
                return {
                    id: slide.id,
                    type: "project",
                    title: slide.name,
                    clientName: slide.description,
                    image: slide.image,
                    tag: "new",
                    ...slide,
                }
            }
            if (slide.type === "client") {
                return {
                    id: slide.id,
                    type: "client",
                    name: slide.name,
                    industry: slide.industry || "",
                    logo: slide.logo,
                    tag: "new",
                    ...slide,
                }
            }
            if (slide.type === "team") {
                return {
                    id: slide.id,
                    type: "team",
                    name: slide.name,
                    position: slide.position,
                    image: slide.image,
                    tag: "new",
                    ...slide,
                }
            }
            if (slide.type === "testimonial") {
                return {
                    id: slide.id,
                    type: "testimonial",
                    name: slide.clientName,
                    description: slide.content,
                    content: slide.content,
                    clientName: slide.clientName,
                    avatar: slide.avatar,
                    tag: "new",
                    ...slide,
                }
            }
            return null;
        }).filter(Boolean);


        // Combine both into one unified array
        setAllSlidesExisitORNew([...formatExisting, ...formatNew]);


    }, [newSlides, existingSlides]);

    // Track deleted slides (keep old data to show what was deleted)
    const [deletedSlides, setDeletedSlides] = useState<Slide[]>([]);



    // Dialog state
    const [editingSlide, setEditingSlide] = useState<{
        slide: Slide | slide,
        tag: 'new' | 'existing'
    } | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Build new slides from selections
    useEffect(() => {
        const allSelected = [

            {
                items: selectedServices,
                type: 'service',
                isVisible: true
            },
            {
                items: selectedProjects.map(p => ({ ...p.project, image: p.image })),
                type: 'project',
                isVisible: true
            },
            {
                items: selectedClients.map(c => ({ ...c.client, logo: c.logo, image: c.image })),
                type: 'client',
                isVisible: true
            },
            {
                items: selectedTeam,
                type: 'team',
                isVisible: true
            },
            {
                items: selectedTestimonial.map(t => ({ ...t, avatar: t.avatar })),
                type: 'testimonial',
                isVisible: true
            },
        ];

        setNewSlides((prevSlides) => {
            // Remove all slides of types we're updating
            let filteredSlides = prevSlides.filter(
                (s) => !allSelected.some((sel) => sel.type === s.type)
            );

            // Add newly selected items
            allSelected.forEach(({ items, type, isVisible }) => {
                const mapped = items.map((item: any, idx: number) => ({
                    ...item,
                    type,
                    isVisible,
                    _order: filteredSlides.length + idx + 1,
                    tag: 'new',
                }));

                filteredSlides = [...filteredSlides, ...mapped];
            });

            // Remove duplicates
            const uniqueSlides = filteredSlides.filter(
                (item, index, self) =>
                    index === self.findIndex((s) => s.id === item.id)
            );

            return uniqueSlides;
        });
    }, [
        selectedServices,
        selectedProjects,
        selectedClients,
        selectedTeam,
        selectedTestimonial,
    ]);

    const handleEdit = (slide: Slide | slide, tag: 'new' | 'existing') => {
        setEditingSlide({ slide, tag });
        setDialogOpen(true);
    };

    const handleSave = (slideId: string, data: any, tag: 'new' | 'existing') => {
        if (tag === "new") {
            setAllSlidesExisitORNew((prev) => {
                return prev.map((slide) => {
                    if (slide.id === slideId) {
                        return {
                            ...slide,
                            ...data
                        }
                    }
                    return slide;
                })
            })

        }
        else {

            setAllSlidesExisitORNew((prev) => {

                return prev.map((slide) => {
                    if (slide.id === slideId) {
                        return {
                            ...slide,
                            ...data
                        }
                    }
                    return slide;
                })
            })

            const getSlide = AllSlidesExisitORNew.find((s) => s.id === slideId);
            setExistingSlideChanges((prev) => {
                const updated = new Map(prev);
                updated.set(data.id, {
                    mainSlideId: getSlide?.id,
                    customTitle: data?.customTitle || '',
                    customDescription: data.customDescription || '',
                    isVisible: data?.isVisible === false ? false : true,
                    action: 'update',
                    type: data.type,
                    _id: getSlide?._id // 
                });
                return updated;
            });
        }


    };

    const handleDelete = (slide: Slide & { tag: 'new' | 'existing' }) => {

        setExistingSlideChanges((prev) => {
            const updated = new Map(prev);
            updated.set(slide.id, {
                mainSlideId: slide?.id,
                customTitle: slide?.customTitle || '',
                customDescription: slide.customDescription || '',
                isVisible: slide?.isVisible === false ? false : true,
                action: 'delete',
                type: slide.type,
                _id: slide?._id,

            });
            return updated;
        });

        // Move to deleted array to keep track
        if (slide.tag === "new") return

        setDeletedSlides((prev) => [...prev, slide]);
        // Remove from existing slides UI
        setExistingSlides((prev) => prev.filter(s => s.id !== slide.id));



    };

    const handleSaveAll = async () => {


        try {


            const updateSlides = Array.from(existingSlideChanges.values())
                .filter(change => change.action === 'update')
                .map(item => {
                    if (item._id === undefined) return;
                    return {
                        id: item._id,
                        isVisible: item.isVisible,
                        customTitle: item.customTitle,
                        customDescription: item.customDescription,
                        type: item.type
                    };
                })
                .filter(Boolean);

            const deletedSlidesFormat = deletedSlides.map((s: any) => ({
                id: s._id,
                type: s.type
            }));

            const updatedOrder = AllSlidesExisitORNew
                .map((s, i) => {
                    const isinDeletedArr = deletedSlides.find((d) => d.id === s.id);
                    console.log(isinDeletedArr)
                    if (s.tag === "existing" && !isinDeletedArr) {
                        return {
                            id: s._id,
                            type: s.type,
                            order: i + 1
                        };
                    } else {
                        return null;
                    }
                })
                .filter(Boolean);

            const newSlides = AllSlidesExisitORNew
                .map((s, i) => {
                    if (s.tag === "new") {
                        return {
                            id: s.id,
                            type: s.type,
                            isVisible: s.isVisible,
                            customTitle: s.customTitle,
                            customDescription: s.customDescription,
                            order: i + 1
                        };
                    } else {
                        return null;
                    }
                })
                .filter(Boolean);

            const dataToSave = {
                newSlides,
                updateSlides,
                deletedSlides: deletedSlidesFormat,
                updatedOrder
            };

            const res = await Operate({
                id: slideshowId,
                data: dataToSave,
            }).unwrap()

            if (res) {

                toast.success("All changes saved", {
                    description: `${dataToSave.newSlides.length} added, ${dataToSave.updateSlides.length} updated, ${dataToSave.deletedSlides.length} deleted.`

                });
                // clear 
                reFetch()
                setNewSlides([])
                setDeletedSlides([])
                setExistingSlideChanges(new Map())
                setSelectedProjects([])
                setSelectedServices([])
                setSelectedclients([])
                setSelectedTeam([])
                setSelectedTestimonial([])

            }

        } catch (error) {
            console.error(error)
            toast.error("Failed to save changes", {
            });
        }
    };






    return (
        <>
            <Card className="pb-0 border-border relative max-h-[78vh] min-h-[78vh] flex w-full justify-between overflow-y-auto shadow-soft">
                <CardContent className="p-6">
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {/* Render existing slides */}


                        {AllSlidesExisitORNew && AllSlidesExisitORNew.map((slide, index) => {
                            const isDeleted = deletedSlides.find(s => (s.id === slide.id))
                            if (isDeleted) return null
                            return <SlideCard
                                key={slide.id}
                                slide={slide}
                                index={index}
                                onEdit={(s) => handleEdit(s, 'existing')}
                                onDelete={handleDelete}
                            />
                        }
                        )}


                    </div>

                    {existingSlides.length === 0 && newSlides.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Layers className="mb-4 h-12 w-12 text-muted-foreground/50" />
                            <p className="text-lg font-medium text-muted-foreground">
                                No slides yet
                            </p>
                            <p className="text-sm text-muted-foreground/70">
                                Create your first slide to get started
                            </p>
                        </div>
                    )}

                    {/* Show deleted slides for reference */}
                    {deletedSlides.length > 0 && (
                        <div className="mt-8 border-t pt-6">
                            <h3 className="text-lg font-semibold mb-4 text-destructive">
                                Deleted Slides (Will be removed on save)
                            </h3>
                            <div className="grid gap-6 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 opacity-50">
                                {deletedSlides.map((slide, index) => (
                                    <div key={slide.id} className="relative border-destructive border-2 rounded-lg p-4">
                                        <Badge className="absolute top-2 right-2 z-30 bg-destructive">
                                            DELETED
                                        </Badge>
                                        <SlideCard
                                            slide={slide}
                                            index={index}
                                            onEdit={() => { }}
                                            onDelete={() => { }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>

                <CardFooter className='bg-accent-foreground/10 justify-end sticky bottom-3 self-end flex rounded-2xl shadow-md p-2 h-16 w-fit flex-wrap gap-3'>
                    <Button
                        className='cursor-pointer'
                        variant={"secondary"}
                        onClick={handleSaveAll}
                        // existingSlideChanges.size === 0 && newSlideChanges.size === 0 || 
                        disabled={isLoading}
                    >
                        {
                            isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                :
                                <>
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Save Changes {(existingSlideChanges.size + newSlideChanges.size) > 0 && `(${existingSlideChanges.size + newSlideChanges.size})`}
                                </>
                        }
                    </Button>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className='cursor-pointer bg-gray-600 dark:bg-gray-400 '>
                                <Layers className="h-4 w-4 mr-2" />
                                Add New Slide
                            </Button>
                        </DialogTrigger>
                        <DialogContent className='md:min-w-200 max-w-200 md:w-200 w-150 min-w-150'>
                            <DialogHeader>
                                <DialogTitle>Add New Slide</DialogTitle>
                            </DialogHeader>
                            <SlideShowSelect
                                disabledItems={existingSlides?.map((s) => {
                                    return {
                                        id: String(s.data.id),
                                        type: s.type
                                    }
                                }) || undefined}
                                selectedServices={selectedServices}
                                setSelectedServices={setSelectedServices}
                                selectedProjects={selectedProjects}
                                setSelectedProjects={setSelectedProjects}
                                selectedClients={selectedClients}
                                setSelectedclients={setSelectedclients}
                                selectedTeam={selectedTeam}
                                setSelectedTeam={setSelectedTeam}
                                setSelectedTestimonial={setSelectedTestimonial}
                                selectedTestimonial={selectedTestimonial}
                            />
                        </DialogContent>
                    </Dialog>
                    <Button onClick={() => setIsDialogOrderOpen(true)} className='cursor-pointer bg-neutral-600 dark:bg-neutral-400'>
                        <CloudFog className="h-4 w-4 mr-2" />
                        Reorder
                    </Button>

                    <Button className='cursor-pointer' variant={"destructive"}>
                        <DoorClosed className="h-4 w-4 mr-2" />
                        Back to slide Show
                    </Button>
                    {
                        composititonType &&
                        <PreviwDialog minmalBtb={true} allSlides={AllSlidesExisitORNew} selectedComposition={ composititonType} />
                    }

                </CardFooter>
            </Card>

            <ArrangeSlidesDialog
                isOpen={isDialogOrderOpen}
                onClose={() => setIsDialogOrderOpen(false)}
                slides={AllSlidesExisitORNew}
                setSlides={setAllSlidesExisitORNew}
            />

            <EditSlideDialog
                slide={editingSlide?.slide || null}
                tag={editingSlide?.tag || 'existing'}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSave={handleSave}
            />


        </>
    );
}



