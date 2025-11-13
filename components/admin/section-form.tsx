"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"

const SECTION_TYPES = [
  { value: "HERO", label: "Hero Section" },
  { value: "SERVICES", label: "Services" },
  { value: "PROJECTS", label: "Projects" },
  { value: "TEAM", label: "Team" },
  { value: "TESTIMONIALS", label: "Testimonials" },
  { value: "CLIENTS", label: "Clients" },
  { value: "CUSTOM", label: "Custom" },
]

const SLIDESHOWS = [
  { id: "1", title: "Hero Slideshow", type: "HERO" },
  { id: "2", title: "Services Carousel", type: "SERVICES" },
  { id: "3", title: "Portfolio Grid", type: "PROJECTS" },
  { id: "4", title: "Team Showcase", type: "TEAM" },
  { id: "5", title: "Testimonials Fade", type: "TESTIMONIALS" },
  { id: "6", title: "Clients Logo Wall", type: "CLIENTS" },
]

export function SectionForm() {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    type: "",
    isActive: true,
    order: 0,
    selectedSlideshows: [] as string[],
  })

  const handleAddSlideshow = (slideshowId: string) => {
    if (!formData.selectedSlideshows.includes(slideshowId)) {
      setFormData({
        ...formData,
        selectedSlideshows: [...formData.selectedSlideshows, slideshowId],
      })
    }
  }

  const handleRemoveSlideshow = (slideshowId: string) => {
    setFormData({
      ...formData,
      selectedSlideshows: formData.selectedSlideshows.filter((id) => id !== slideshowId),
    })
  }

  const handleGenerateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
    setFormData({ ...formData, slug })
  }

  const selectedSlideshowsData = SLIDESHOWS.filter((s) => formData.selectedSlideshows.includes(s.id))

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Section Information</CardTitle>
            <CardDescription>Basic details about this section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g., Hero Section"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <div className="flex gap-2">
                <Input
                  id="slug"
                  placeholder="e.g., hero-section"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateSlug}
                  className="whitespace-nowrap bg-transparent"
                >
                  Generate
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Section Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  {SECTION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe this section..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value) })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="active"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
              />
              <Label htmlFor="active" className="font-normal cursor-pointer">
                Active
              </Label>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Attach Slideshows</CardTitle>
            <CardDescription>Add slideshows to this section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select slideshow" />
              </SelectTrigger>
              <SelectContent>
                {SLIDESHOWS.filter((s) => !formData.selectedSlideshows.includes(s.id)).map((slideshow) => (
                  <SelectItem key={slideshow.id} value={slideshow.id} onSelect={() => handleAddSlideshow(slideshow.id)}>
                    {slideshow.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Attached Slideshows ({formData.selectedSlideshows.length})</Label>
              <div className="space-y-2">
                {selectedSlideshowsData.length > 0 ? (
                  selectedSlideshowsData.map((slideshow) => (
                    <div key={slideshow.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div>
                        <p className="text-sm font-medium">{slideshow.title}</p>
                        <p className="text-xs text-muted-foreground">{slideshow.type}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSlideshow(slideshow.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No slideshows attached</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Button className="w-full" size="lg">
          Create Section
        </Button>
      </div>
    </div>
  )
}
