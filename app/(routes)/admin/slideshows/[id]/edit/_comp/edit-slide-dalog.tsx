import { useState, useEffect, memo } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slide } from "@/lib/store/api/slideShow-api";
import { slide } from "@/types/schema";

interface EditSlideDialogProps {
    slide: Slide | slide | any;
    tag: 'new' | 'existing';
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (slideId: string, data: any, tag: 'new' | 'existing') => void;
}

export const EditSlideDialog = memo(({

    slide,
    tag,
    open,
    onOpenChange,
    onSave,
}: EditSlideDialogProps) => {
    const [formData, setFormData] = useState<any>({
        customTitle: "",
        customDescription: "",
        isVisible: true,
        type: ""
    });
    useEffect(() => {
        if (slide) {
            console.log(slide)
        
                // For NEW slides: custom fields are EMPTY (not from service table)
              setFormData({
                    customTitle: slide?.customTitle || "", 
                    customDescription: slide?.customDescption|| "",
                    isVisible: slide?.isVisible === false ? false : true,
                    type: slide.type,
                    // Keep original data for reference
                    originalName: slide?.title || slide?.name || slide?.clientName,
                    originalDescription:  slide?.content || slide?.description
                });
        }
    
    }, [slide, tag]);

    const handleSave = () => {
        if (slide) {
            const slideId = tag === 'existing' ? slide.id : slide.id;
            onSave(slideId, formData, tag);
            onOpenChange(false);
        }
    };

    if (!slide) return null;

    // Get slide data based on tag
    const image =  slide?.image || slide?.avatar || slide?.logo;
    const icon =  slide?.data?.icon || slide.icon;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl overflow-hidden border-border bg-card p-0">
                <div className="relative h-40 w-full overflow-hidden bg-muted">
                    <img
                        src={image?.url || "/placeholder.svg"}
                        alt={formData.originalName}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                    <div className="absolute bottom-4 left-6 flex items-center gap-3">
                        {icon && <span className="text-4xl drop-shadow-lg">{icon}</span>}
                        <div>
                            <DialogTitle className="font-display text-xl font-bold text-foreground">
                                {tag === 'new' ? 'Customize New Slide' : 'Edit Slide'}
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                {tag === 'new'
                                    ? 'Add custom title & description '
                                    : 'Update custom fields for existing slide'}
                            </DialogDescription>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 p-6">
                    {/* Show original data for reference */}
                    <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Original Data (from {formData.type}):</p>
                        <p className="text-sm"><strong>Name:</strong> {formData.originalName}</p>
                        <p className="text-sm"><strong>Description:</strong> {formData.originalDescription}</p>
                    </div>
                    {
                        slide?.type === "service" && (
                            <>
                                {/* Custom Title for join table */}

                                <div className="space-y-2">
                                    <Label htmlFor="customTitle" className="text-sm font-medium text-foreground">
                                        Custom Title <span className="text-muted-foreground">(Optional)</span>
                                    </Label>
                                    <Input
                                        id="customTitle"
                                        value={formData.customTitle}
                                        onChange={(e) => setFormData({ ...formData, customTitle: e.target.value })}
                                        placeholder="Leave empty to use original name"
                                        className="border-border bg-background focus:ring-primary"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {formData.customTitle
                                            ? `Will display: "${formData.customTitle}"`
                                            : `Will display original: "${formData.originalName}"`}
                                    </p>
                                </div>

                                {/* Custom Description for join table */}
                                <div className="space-y-2">
                                    <Label htmlFor="customDescription" className="text-sm font-medium text-foreground">
                                        Custom Description <span className="text-muted-foreground">(Optional , {slide?.customDescption})</span>
                                    </Label>
                                    <Input
                                        id="customDescription"
                                        value={formData.customDescription }
                                        onChange={(e) =>
                                            setFormData({ ...formData, customDescription: e.target.value })
                                        }
                                        placeholder="Leave empty to use original description"
                                        className="border-border bg-background focus:ring-primary"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {formData.customDescription
                                            ? `Will display: "${formData.customDescription}"`
                                            : `Will display original description`}
                                    </p>
                                </div>

                                {/* Visibility Toggle */}
                            </>
                        )
                    }
                    <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4">
                        <div className="flex items-center gap-3">
                            <div
                                className={cn(
                                    "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                                    formData.isVisible
                                        ? "bg-success/20 text-success"
                                        : "bg-muted text-muted-foreground"
                                )}
                            >
                                {formData.isVisible ? (
                                    <Eye className="h-5 w-5" />
                                ) : (
                                    <EyeOff className="h-5 w-5" />
                                )}
                            </div>
                            <div>
                                <p className="font-medium text-foreground">Visibility</p>
                                <p className="text-sm text-muted-foreground">
                                    {formData.isVisible
                                        ? "This slide is visible to visitors"
                                        : "This slide is hidden from visitors"}
                                </p>
                            </div>
                        </div>


                        <Switch
                            checked={formData.isVisible}
                            onCheckedChange={(checked) =>
                                setFormData({ ...formData, isVisible: checked })
                            }
                            className="data-[state=checked]:bg-emerald-500"
                        />
                    </div>
                </div>

                <DialogFooter className="border-t border-border bg-muted/30 px-6 py-4">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="gap-1.5"
                    >
                        <X className="h-4 w-4" />
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        <Save className="h-4 w-4" />
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
});

EditSlideDialog.displayName = "EditSlideDialog";