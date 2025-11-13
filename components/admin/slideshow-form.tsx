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
import { useToast } from "@/hooks/use-toast";

import { CompositionBuilder } from "./utils/CompositionBuilder";
import SlideShowSelect from "./utils/slideShowSelect";
import { CompositionPreview } from "./utils/compositionPreviw";
import {
  CompositionType,
  CreateAndAttachMany,
  ProjectWithRelations,
  ProjectWithRelationsSlide,
  ServiceWithImage,
  slide,
  SlideshowType,
} from "@/types/schema";
import {
  PaginatedSlidesResponse,
  useCreateSlideShowAndAttachManyMutation,
} from "@/lib/store/api/slideShow-api";
import { SlideShow } from "@/types/slideShows";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

const SLIDESHOW_TYPES = [
  { value: "HERO", label: "Hero Banner" },
  { value: "SERVICES", label: "Services Showcase" },
  { value: "PROJECTS", label: "Project Showcase" },
  { value: "CLIENTS", label: "Client Logos" },
  { value: "TEAM", label: "Team Members" },
  { value: "TESTIMONIALS", label: "Testimonials" },
  { value: "CUSTOM", label: "Custom" },
];

const COMPOSITION_TYPES = [
  { value: "CAROUSEL", label: "Carousel" },
  { value: "GRID", label: "Grid" },
  { value: "STACKED", label: "Stacked" },
  { value: "FADE", label: "Fade" },
  { value: "SINGLE", label: "Single" },
];

interface EnhancedSlideshowFormProps {
  initialData?: SlideShow;
  slidesForEdit?: PaginatedSlidesResponse;
}

export function SlideshowForm({
  initialData,
  slidesForEdit,
}: EnhancedSlideshowFormProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState(initialData?.title || "");
  const [Description, setDescription] = useState(initialData?.title || "");
  const [type, setType] = useState<SlideshowType>(SlideshowType.SERVICES);
  const [composition, setComposition] = useState<CompositionType>(
    CompositionType.CAROUSEL
  );
  const [status, setStatus] = useState(
    !initialData?.isActive ? "INACTIVE" : "ACTIVE"
  );
  const [autoplay, setAutoplay] = useState(initialData?.autoPlay ?? true);
  const [autoplayInterval, setAutoplayInterval] = useState(
    initialData?.interval || 5000
  );
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedComposition, setSelectedComposition] =
    useState<CompositionType>(composition);
  const [selectedServices, setSelectedServices] = useState<ServiceWithImage[]>(
    []
  );
  const [selectedProjects, setSelectedProjects] = useState<
    ProjectWithRelations[]
  >([]);
  const [openArrangDialog, setOpenArrangDialog] = useState(false);

  const [allSlides, SetAllSlides] = useState<slide[]>([]);

  const [Save, { isLoading, isSuccess, isError, error }] =
    useCreateSlideShowAndAttachManyMutation();

  useEffect(() => {
    if (slidesForEdit) {
      const FixedUpcomingData = [
        ...slidesForEdit.slides.map((s) => ({
          ...s.data,
          order: s.data.order,
          relationId: s.id,
          type: s.type.toLowerCase(),
          _order: s.order,
          tag: "existing",
        })),
      ];

      SetAllSlides(FixedUpcomingData);
    }
  }, [slidesForEdit]);

  useEffect(() => {
    SetAllSlides((slides: any) => {
      if (slides.length > 0) {
        const merged = [...slides, ...selectedServices];
        return merged.filter(
          (item, index, self) =>
            index === self.findIndex((s) => s.id === item.id)
        );
      }
      return [...selectedServices];
    });
  }, [selectedServices]);

  useEffect(() => {
    console.log(selectedProjects);
    SetAllSlides((slides) => {
      const fixed = selectedProjects.map((s) => ({
        ...s.project,
        type: "project",
        _order: slides.length + 1,
        tag: "new",
        image: s.image,
      })) as ProjectWithRelationsSlide[];
      console.log(fixed);
      if (slides.length > 0) {
        const merged = [...slides, ...fixed];
        console.log(merged);
        return merged.filter(
          (item, index, self) =>
            index === self.findIndex((s) => s.id === item.id)
        );
      }
      return [...fixed];
    });
  }, [selectedProjects]);

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Success",
        description: "Slideshow saved successfully",
      });
    }
  }, [isSuccess, toast]);

  useEffect(() => {
    if (isError) {
      const e = error as any;
      const errorMsg =
        e?.data?.message || e?.message || "Failed to save slideshow";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
        color: "white",
        className: "text-white",
      });
    }
  }, [isError, error, toast]);

  const validateForm = (): boolean => {
    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Slideshow title is required",
        variant: "destructive",
        color: "white",
        className: "text-white",
      });
      return false;
    }

    if (title.trim().length < 3) {
      toast({
        title: "Validation Error",
        description: "Title must be at least 3 characters",
        variant: "destructive",
        color: "white",
        className: "text-white",
      });
      return false;
    }

    if (!Description.trim()) {
      toast({
        title: "Validation Error",
        description: "Description is required",
        variant: "destructive",
        color: "white",
        className: "text-white",
      });
      return false;
    }

    if (allSlides.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one slide",
        variant: "destructive",
        color: "white",
        className: "text-white",
      });
      return false;
    }

    if (autoplay && autoplayInterval < 1000) {
      toast({
        title: "Validation Error",
        description: "Autoplay interval must be at least 1000ms",
        variant: "destructive",
        color: "white",
        className: "text-white",
      });
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const data: CreateAndAttachMany = {
      title,
      type: SlideshowType[type],
      autoPlay: autoplay,
      composition: CompositionType[composition],
      description: Description,
      interval: autoplayInterval,
      order: 1,
      isActive: status === "ACTIVE",
      slides: allSlides.map((slide: any): any => ({
        attachId: slide?.id || slide?.project?.id,
        isVisible: slide.isVisible || false,
        order: slide._order || 1,
        attachType: slide.type || "service",
        customTitle: slide.customTitle || "",
        customDesc: slide.customDesc || "",
      })),
    };

    Save(data);
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-lg font-semibold">Saving...</p>
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
              <h2 className="text-lg font-semibold">Basic Settings</h2>

              <div className="space-y-2">
                <Label htmlFor="title">Slideshow Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Homepage Hero"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="Description">Slideshow Description</Label>
                <Textarea
                  rows={2}
                  id="Description"
                  value={Description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Homepage Hero"
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={type}
                    onValueChange={(t) => setType(t as SlideshowType)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SLIDESHOW_TYPES.map((t) => (
                        <SelectItem
                          key={t.value}
                          value={t.value as SlideshowType}
                        >
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={status}
                    onValueChange={setStatus}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Autoplay Settings */}
            <div className="space-y-4 border-t pt-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Autoplay Settings
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
                  <span className="text-sm">Enable Autoplay</span>
                </label>
              </div>

              {autoplay && (
                <div className="space-y-2">
                  <Label htmlFor="interval">Autoplay Interval (ms)</Label>
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
                    {(autoplayInterval / 1000).toFixed(1)} seconds between
                    slides
                  </p>
                </div>
              )}
            </div>

            {/* Slides Management */}
            <div className="space-y-4 border-t pt-6 w-full">
              <div className="flex items-center justify-start w-full">
                <SlideShowSelect
                  selectedServices={selectedServices}
                  setSelectedServices={setSelectedServices}
                  selectedProjects={selectedProjects}
                  setSelectedProjects={setSelectedProjects}
                />
              </div>

              {/* <div className="border-t pt-6">
                <Label className="text-base font-semibold mb-4 block">
                  Preview
                </Label>
                <Card className="p-6 bg-muted/30">
                  {allSlides.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>Add slides to see preview</p>
                    </div>
                  ) : (
                    
                  )}
                </Card>
              </div> */}
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
                    Saving...
                  </>
                ) : (
                  "Save Slideshow"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setPreviewOpen(!previewOpen)}
                className="flex-1"
                disabled={isLoading}
              >
                <Eye className="h-4 w-4 mr-2" />
                {previewOpen ? "Hide" : "Show"} Preview
              </Button>
            </div>
          </Card>
        </div>

        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <Card className="p-2  px-5 sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Configuration</h2>
            <div className="space-y-4 text-sm grid grid-cols-1 md:grid-cols-2  lg:grid-cols-4 gap-4">
              <div>
                <p className="text-muted-foreground">Type</p>
                <p className="font-medium">
                  {SLIDESHOW_TYPES.find((t) => t.value === type)?.label}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Composition</p>
                <p className="font-medium">
                  {
                    COMPOSITION_TYPES.find((c) => c.value === composition)
                      ?.label
                  }
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Slides</p>
                <p className="font-medium">{allSlides.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <p className="font-medium capitalize">{status}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Autoplay</p>
                <p className="font-medium">
                  {autoplay
                    ? `Every ${(autoplayInterval / 1000).toFixed(1)}s`
                    : "Disabled"}
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
                  Arrange
                </span>
              </button>
              <Dialog >
                <DialogTrigger asChild className="w-1/2">
                  <button className="w-full  border-2 border-muted-foreground text-muted-foreground h-24 shadow-md flex items-center justify-center duration-300 group  rounded-md hover:bg-primary">
                    <Eye className=" group-hover:text-primary-foreground text-muted-foreground h-8 w-8 mr-2" />
                    <span className=" group-hover:text-primary-foreground text-muted-foreground ">
                      preview
                      {allSlides.length ? (
                        <span className="text-destructive font-semibold">
                          {` (${allSlides.length > 9 ? "9+" : allSlides.length})`}
                        </span>
                      ) : null}
                    </span>

                  </button>
                </DialogTrigger>
                <DialogContent className="min-w-[95vw] h-[90vh] ">
                  <DialogHeader className="px-6 py-4 border-b h-fit">
                    <DialogTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Eye className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <span className="block">Arrange Slides</span>
                        <span className="text-sm font-normal text-muted-foreground">
                          {allSlides.length} {allSlides.length === 1 ? 'slide' : 'slides'} • {selectedComposition}
                        </span>
                      </div>
                    </DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="overflow-auto cursor-default">

                    <CompositionPreview
                      composition={
                        selectedComposition as
                        | "CAROUSEL"
                        | "GRID"
                        | "STACKED"
                        | "FADE"
                        | "SINGLE"
                      }
                      slides={allSlides}
                    />
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
