"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit2, Trash2 } from "lucide-react"
import Link from "next/link"

export default function SectionDetailPage({ params }: { params: { id: string } }) {
  const section = {
    id: params.id,
    title: "Hero Section",
    slug: "hero",
    type: "HERO",
    description: "Main hero section with featured slideshow",
    isActive: true,
    order: 1,
    slideshows: [{ id: "1", title: "Hero Slideshow", type: "HERO", slides: 5 }],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/sections">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{section.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">Section ID: {section.id}</p>
        </div>
        <Link href={`/admin/sections/${section.id}/edit`}>
          <Button>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Section Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <Badge className="mt-1">{section.type}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={section.isActive ? "default" : "secondary"} className="mt-1">
                    {section.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="mt-1">{section.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Display Order</p>
                  <p className="mt-1 font-medium">{section.order}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="mt-1 font-medium">{section.createdAt.toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attached Slideshows</CardTitle>
              <CardDescription>Slideshows displayed in this section</CardDescription>
            </CardHeader>
            <CardContent>
              {section.slideshows.length > 0 ? (
                <div className="space-y-3">
                  {section.slideshows.map((slideshow) => (
                    <div key={slideshow.id} className="p-4 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{slideshow.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Type: {slideshow.type} • {slideshow.slides} slides
                          </p>
                        </div>
                        <Link href={`/admin/slideshows/${slideshow.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No slideshows attached to this section</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/admin/sections/${section.id}/edit`} className="block">
                <Button className="w-full">Edit Section</Button>
              </Link>
              <Button variant="destructive" className="w-full">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
