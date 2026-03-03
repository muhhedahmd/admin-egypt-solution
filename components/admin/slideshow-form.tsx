"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Settings, Loader2, Expand } from "lucide-react";

import { CompositionBuilder } from "./utils/slides/CompositionBuilder";
import SlideShowSelect from "./utils/slideShowSelect";
import {
  ClientWithImages,
  COMPOSITION_TYPES_ARRAY,
  CompositionType,
  CreateAndAttachMany,
  ProjectWithRelations,
  ServiceWithImage,
  slide,
  SlideShow,
  SlideshowType,
  TeamMemberWithImage,
  TestimonialWithImage,
} from "@/types/schema";
import {
  PaginatedSlidesResponse,
  useCreateSlideShowAndAttachManyMutation,
} from "@/lib/store/api/slideShow-api";
// import { SlideShow } from "@/types/slideShows";
import { toast } from "sonner";
import { PreviwDialog } from "./utils/previwDialog";
import { useLanguage } from "@/providers/lang";
import { slideshowsFormI18n } from "@/i18n/slideShow";

const SLIDESHOW_TYPES = [
  { value: "SERVICES", label: "Services Showcase" },
  { value: "PROJECTS", label: "Project Showcase" },
  { value: "CLIENTS", label: "Client Logos" },
  { value: "TEAM", label: "Team Members" },
  { value: "TESTIMONIALS", label: "Testimonials" },
  { value: "CUSTOM", label: "Custom" },
];



interface EnhancedSlideshowFormProps {
  // slidesForEdit?: PaginatedSlidesResponse;
}

export function SlideshowForm({

}: EnhancedSlideshowFormProps) {

  const { currentLang } = useLanguage()
  const t = slideshowsFormI18n[(currentLang?.toLowerCase() as "en" | "ar") || 'en']
  const [title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [type, setType] = useState<SlideshowType>(SlideshowType.SERVICES);
  const [selectedClients, setSelectedclients] = useState<ClientWithImages[]>([])
  const [selectedTeam, setSelectedTeam] = useState<TeamMemberWithImage[]>([])
  const [selectedTestimonial, setSelectedTestimonial] = useState<TestimonialWithImage[]>([])
  const [selectedServices, setSelectedServices] = useState<ServiceWithImage[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<ProjectWithRelations[] >([]);

useEffect(() => {
  setSelectedclients(  [])
  setSelectedTeam( [])
  setSelectedTestimonial( [])
  setSelectedServices( [])
  setSelectedProjects( [])
  
} , [type])
  const [composition, setComposition] = useState<CompositionType>(
    CompositionType.CAROUSEL

  );
  const [status, setStatus] = useState( "ACTIVE");
  const [autoplay, setAutoplay] = useState( true);
  const [autoplayInterval, setAutoplayInterval] = useState(
     5000
  );
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedComposition, setSelectedComposition] =
    useState<CompositionType>(composition);
  const [openArrangDialog, setOpenArrangDialog] = useState(false);

  const [allSlides, SetAllSlides] = useState<slide[]>([]);

  const [Save, { isLoading, isSuccess, isError, error }] =
    useCreateSlideShowAndAttachManyMutation();
  useEffect(() => {
    const allSelected = [

      { items: selectedServices, type: 'service' },
      { items: selectedProjects.map(p => ({ ...p.project, image: p.image, isVisible: p.isVisible })), type: 'project' },
      { items: selectedClients.map(c => ({ ...c.client, logo: c.logo, image: c.image, isVisible: c.isVisible })), type: 'client' },
      { items: selectedTeam, type: 'team' },
      { items: selectedTestimonial.map(t => ({ ...t, avatar: t.avatar })), type: 'testimonial' },
    ];

    SetAllSlides((slides) => {
      // Start with slides that are NOT any of the types we are updating
      let filteredSlides = slides.filter(
        (s) => !allSelected.some((sel) => sel.type === s.type)
      );

      // Map each selected array to slides
      allSelected.forEach(({ items, type }) => {
        const mapped = items.map((item: any) => ({
          ...item,
          type,
          _order: filteredSlides.length + 1,
          tag: 'new',
        }));

        filteredSlides = [...filteredSlides, ...mapped];
      });

      // Remove duplicates just in case
      const uniqueSlides = filteredSlides.filter(
        (item, index, self) =>
          index === self.findIndex((s) => s.id === item.id)
      );
      console.log(uniqueSlides)
      return uniqueSlides;
    });
  }, [
    selectedServices,
    selectedProjects,
    selectedClients,
    selectedTeam,
    selectedTestimonial,
  ]);

  const validateForm = (): boolean => {
    if (!title.trim()) {
      toast.error(t.form.toasts.validationError(""), {
        description: t.form.validation.requiredDescription,
      });
      return false;
    }

    if (title.trim().length < 3) {
      toast.error(t.form.toasts.validationError(""), {
        description: t.form.validation.requiredTitle,
      });
      return false;
    }

    if (!Description.trim() || (Description.length < 10 || Description.length > 499)) {
      toast.error(t.form.toasts.validationError(""), {
        description: t.form.validation.requiredDescription,
      });
      return false;
    }

    if (allSlides.length === 0) {
      toast.error(t.form.toasts.validationError(""), {
        description: t.form.validation.minSlides,
      });
      return false;
    }

    if (autoplay && autoplayInterval < 1000) {
      toast.error(t.form.toasts.validationError(""), {
        description: t.form.validation.minInterval,
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const data: CreateAndAttachMany = {
        title,
        type: SlideshowType[type],
        autoPlay: autoplay,
        composition: CompositionType[composition as keyof typeof CompositionType] as any,
        description: Description,
        interval: autoplayInterval,
        order: 0,
        isActive: status === "ACTIVE",
        slides: allSlides.map((slide: any, i): any => ({
          attachId: slide?.id || slide?.project?.id,
          isVisible: slide.isVisible || false,
          order: i,
          attachType: slide.type === "team" ? "teamMember" : slide.type,
          customTitle: slide.customTitle || "",
          customDesc: slide.customDesc || "",
        })),
      };

      console.log(data);

      const res = await Save(data).unwrap();
      SetAllSlides([])
      setSelectedServices([])
      setSelectedProjects([])
      setSelectedclients([])
      setSelectedTeam([])
      setSelectedTestimonial([])
      setTitle("")
      setDescription("")
      if (res) {
        toast.success("Success", {
          description: "Slideshow saved successfully",
        });
      }



    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "Failed to save slideshow",

      })
    }
    // Save(data);
  };

  return (
    <>
      {isLoading && (
        <div className="fixed w-screen h-screen top-0 left-0  inset-0 bg-black/50 z-[9999] flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg font-semibold">{t.form.previews.loading}</p>
          </div>
        </div>
      )}

      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 opacity-50 pointer-events-none"
        style={{
          opacity: isLoading ? 0.5 : 1,
          pointerEvents: isLoading ? "none" : "auto",
        }}
      >
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-6">
            {/* Basic Settings */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">{t.form.headers.basicSettings}</h2>

              <div className="space-y-2">
                <Label htmlFor="title">{t.form.labels.title}</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t.form.placeholders.title}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="Description">{t.form.labels.description}</Label>
                <Textarea
                  rows={2}
                  id="Description"
                  value={Description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.form.placeholders.description}
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">{t.form.labels.type}</Label>
                  <Select
                    value={type}
                    onValueChange={(t) => setType(t as SlideshowType)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SLIDESHOW_TYPES.map((t) => {
                        if (t.value === SlideshowType.CUSTOM) return null;

                        return <SelectItem
                          key={t.value}
                          value={t.value as SlideshowType}
                        >
                          {t.label}
                        </SelectItem>
                      }
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">{t.form.labels.status}</Label>
                  <Select
                    value={status}
                    onValueChange={setStatus}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">{t.form.statuses.ACTIVE}</SelectItem>
                      <SelectItem value="INACTIVE">{t.form.statuses.INACTIVE}</SelectItem>
                      {/* <SelectItem value="DRAFT">Draft</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Autoplay Settings */}
            <div className="space-y-4 border-t pt-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Settings className="h-4 w-4" />
                {t.form.headers.autoplaySettings}
              </h2>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoplay}
                    onChange={(e) => setAutoplay(e.target.checked)}
                    disabled={isLoading}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{t.form.labels.autoplayEnabled}</span>
                </label>
              </div>

              {autoplay && (
                <div className="space-y-2">
                  <Label htmlFor="interval">{t.form.labels.autoplayInterval}</Label>
                  <Input
                    id="interval"
                    type="number"
                    value={autoplayInterval}
                    onChange={(e) =>
                      setAutoplayInterval(Number(e.target.value))
                    }
                    min="1000"
                    step="500"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t.form.misc.secondsLabel(+ (autoplayInterval / 1000).toFixed(1))}

                  </p>
                </div>
              )}
            </div>

            {/* Slides Management */}
            <div className="space-y-4 border-t pt-6 w-full">
              <div className="flex items-center justify-start w-full">
                <SlideShowSelect
                  type={type}
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
              </div>


            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 border-t pt-6">
              <Button
                onClick={handleSave}
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t.form.previews.loading}
                  </>
                ) : (
                  t.form.buttons.save
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setPreviewOpen(!previewOpen)}
                className="flex-1"
                disabled={isLoading}
              >
                <Eye className="h-4 w-4 mr-2" />

                {previewOpen ? t.form.buttons.previewHide : t.form.buttons.previewShow}
              </Button>
            </div>
          </Card>
        </div>

        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <Card className="p-2  px-5 sticky top-6">
            <h2 className="text-lg font-semibold mb-4">{t.form.headers.configuration}</h2>
            <div className="space-y-4 text-sm grid grid-cols-1 md:grid-cols-2  lg:grid-cols-4 gap-4">
              <div>
                <p className="text-muted-foreground">{t.form.labels.type}</p>
                <p className="font-medium">
                  {SLIDESHOW_TYPES.find((t) => t.value === type)?.label}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">{t.form.composition.title}</p>
                <p className="font-medium">
                  {
                    COMPOSITION_TYPES_ARRAY.find((c) => c === composition)

                  }
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">{t.form.labels.totalSlides}</p>
                <p className="font-medium">{allSlides.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t.form.labels.status}</p>
                <p className="font-medium capitalize">{status}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t.form.badges.autoplay}</p>
                <p className="font-medium">
                  {autoplay
                    ? t.form.misc.secondsLabel(autoplayInterval / 1000)
                    : t.form.misc.secondsLabel(0)}
                </p>
              </div>
            </div>
          </Card>
          <div className="space-y-4 border-t pt-6 mt-4 p-2 rounded-xl shadow-xs bg">
            <CompositionBuilder
              isDialogOpen={openArrangDialog}
              setIsDialogOpen={setOpenArrangDialog}
              setSlides={SetAllSlides}
              selectedComposition={selectedComposition}
              setSelectedComposition={setSelectedComposition}
              composition={composition}
              slides={allSlides}
              onCompositionChange={setComposition}
            />
            <div className="flex gap-3 border-t pt-6">
              <button
                disabled={allSlides.length === 0}
                onClick={() => setOpenArrangDialog(true)}
                className="w-1/2  border-2 border-muted-foreground text-muted-foreground h-24 shadow-md flex items-center justify-center duration-300 group  rounded-md hover:bg-primary">
                <Expand className=" group-hover:text-primary-foreground text-muted-foreground h-8 w-8 mr-2" />
                <span className="group-hover:text-primary-foreground text-muted-foreground ">
                  {t.form.buttons.arrange}
                </span>
              </button>
              <PreviwDialog title={t.form.previewDialog.title} autoPlay={autoplay} interval={autoplayInterval} allSlides={allSlides} selectedComposition={selectedComposition} />

            </div>
          </div>
        </div>
      </div>
    </>
  );
}


