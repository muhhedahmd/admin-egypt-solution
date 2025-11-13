"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Briefcase, FolderKanban, Users, UserCircle, MessageSquare } from "lucide-react"

const relationshipData = {
  services: [
    { id: "1", name: "Web Development", slideshow: "Hero Slideshow", type: "HERO", slides: 5 },
    { id: "2", name: "Mobile Apps", slideshow: "Service Hero", type: "HERO", slides: 3 },
    { id: "3", name: "Cloud Solutions", slideshow: "Tech Showcase", type: "PORTFOLIO", slides: 4 },
  ],
  projects: [
    { id: "1", name: "E-commerce Platform", slideshow: "Project Gallery", type: "PROJECT", slides: 8 },
    { id: "2", name: "SaaS Dashboard", slideshow: "Portfolio Showcase", type: "PORTFOLIO", slides: 6 },
  ],
  team: [
    { id: "1", name: "Engineering Team", slideshow: "Team Showcase", type: "TEAM", slides: 12 },
    { id: "2", name: "Design Team", slideshow: "Team Members", type: "TEAM", slides: 8 },
  ],
  clients: [
    { id: "1", name: "Fortune 500 Corp", slideshow: "Client Logos", type: "CLIENT", slides: 15 },
    { id: "2", name: "Tech Startup", slideshow: "Client Testimonials", type: "TESTIMONIAL", slides: 5 },
  ],
  testimonials: [
    { id: "1", name: "Success Stories", slideshow: "Testimonials", type: "TESTIMONIAL", slides: 10 },
    { id: "2", name: "Client Reviews", slideshow: "Reviews Carousel", type: "TESTIMONIAL", slides: 7 },
  ],
}

export default function SlideshowRelationshipsPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const totalRelationships = Object.values(relationshipData).reduce((sum, arr) => sum + arr.length, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Slideshow Relationships</h1>
        <p className="text-muted-foreground mt-2">Manage slideshow attachments across all content types</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-blue-600" />
              Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{relationshipData.services.length}</div>
            <p className="text-xs text-muted-foreground mt-1">slideshows attached</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FolderKanban className="h-4 w-4 text-green-600" />
              Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{relationshipData.projects.length}</div>
            <p className="text-xs text-muted-foreground mt-1">slideshows attached</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{relationshipData.team.length}</div>
            <p className="text-xs text-muted-foreground mt-1">slideshows attached</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <UserCircle className="h-4 w-4 text-orange-600" />
              Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{relationshipData.clients.length}</div>
            <p className="text-xs text-muted-foreground mt-1">slideshows attached</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-red-600" />
              Testimonials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{relationshipData.testimonials.length}</div>
            <p className="text-xs text-muted-foreground mt-1">slideshows attached</p>
          </CardContent>
        </Card>
      </div>

      {/* Relationships by Type */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          <RelationshipCards items={relationshipData.services} type="service" />
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <RelationshipCards items={relationshipData.projects} type="project" />
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <RelationshipCards items={relationshipData.team} type="team" />
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <RelationshipCards items={relationshipData.clients} type="client" />
        </TabsContent>

        <TabsContent value="testimonials" className="space-y-4">
          <RelationshipCards items={relationshipData.testimonials} type="testimonial" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function RelationshipCards({
  items,
  type,
}: {
  items: Array<{ id: string; name: string; slideshow: string; type: string; slides: number }>
  type: string
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item) => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">{item.name}</CardTitle>
                <CardDescription className="mt-1">
                  <Badge variant="outline" className="mt-1">
                    {item.type}
                  </Badge>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Attached Slideshow</p>
              <p className="text-base font-semibold mt-1">{item.slideshow}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.slides} slides</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                View
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
