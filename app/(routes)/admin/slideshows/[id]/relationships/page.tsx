"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Plus, Trash2 } from "lucide-react"

const slideshowData = {
  id: "1",
  title: "Hero Slideshow",
  type: "HERO",
  slides: 5,
  status: "ACTIVE",
  attachments: {
    services: [
      { id: "1", name: "Web Development", type: "SERVICE" },
      { id: "2", name: "Mobile Apps", type: "SERVICE" },
    ],
    projects: [{ id: "1", name: "E-commerce Platform", type: "PROJECT" }],
    team: [],
    clients: [],
    testimonials: [],
  },
}

export default function SlideshowRelationshipsDetailPage({ params }: { params: { id: string } }) {
  const totalAttachments = Object.values(slideshowData.attachments).reduce((sum, arr) => sum + arr.length, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/slideshows">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{slideshowData.title}</h1>
          <p className="text-muted-foreground mt-1">Manage slideshow attachments</p>
        </div>
      </div>

      {/* Slideshow Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Slideshow Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Type</p>
            <Badge className="mt-2">{slideshowData.type}</Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Slides</p>
            <p className="text-lg font-semibold mt-2">{slideshowData.slides}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant="default" className="mt-2">
              {slideshowData.status}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Attachments</p>
            <p className="text-lg font-semibold mt-2">{totalAttachments}</p>
          </div>
        </CardContent>
      </Card>

      {/* Attachments by Type */}
      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="services">Services ({slideshowData.attachments.services.length})</TabsTrigger>
          <TabsTrigger value="projects">Projects ({slideshowData.attachments.projects.length})</TabsTrigger>
          <TabsTrigger value="team">Team ({slideshowData.attachments.team.length})</TabsTrigger>
          <TabsTrigger value="clients">Clients ({slideshowData.attachments.clients.length})</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials ({slideshowData.attachments.testimonials.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          <AttachmentList items={slideshowData.attachments.services} type="service" />
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <AttachmentList items={slideshowData.attachments.projects} type="project" />
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <AttachmentList items={slideshowData.attachments.team} type="team" />
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <AttachmentList items={slideshowData.attachments.clients} type="client" />
        </TabsContent>

        <TabsContent value="testimonials" className="space-y-4">
          <AttachmentList items={slideshowData.attachments.testimonials} type="testimonial" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AttachmentList({
  items,
  type,
}: {
  items: Array<{ id: string; name: string; type: string }>
  type: string
}) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No attachments for this type</p>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Attachment
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <Card key={item.id} className="hover:shadow-sm transition-shadow">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-muted-foreground mt-1">ID: {item.id}</p>
            </div>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
