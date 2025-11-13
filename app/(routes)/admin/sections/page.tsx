"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import Link from "next/link"
import { SectionsTable } from "@/components/admin/sections-table"
import { DeleteDialog } from "@/components/admin/delete-dialog"

export default function SectionsPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const sections = [
    {
      id: "1",
      title: "Hero Section",
      slug: "hero",
      type: "HERO",
      slideshows: 1,
      isActive: true,
      order: 1,
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      title: "Services Showcase",
      slug: "services",
      type: "SERVICES",
      slideshows: 3,
      isActive: true,
      order: 2,
      createdAt: new Date("2024-01-20"),
    },
    {
      id: "3",
      title: "Portfolio Projects",
      slug: "portfolio",
      type: "PROJECTS",
      slideshows: 2,
      isActive: true,
      order: 3,
      createdAt: new Date("2024-01-25"),
    },
    {
      id: "4",
      title: "Team Members",
      slug: "team",
      type: "TEAM",
      slideshows: 1,
      isActive: true,
      order: 4,
      createdAt: new Date("2024-02-01"),
    },
    {
      id: "5",
      title: "Client Testimonials",
      slug: "testimonials",
      type: "TESTIMONIALS",
      slideshows: 2,
      isActive: false,
      order: 5,
      createdAt: new Date("2024-02-05"),
    },
  ]

  const filteredSections = sections.filter(
    (section) =>
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sections</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage website sections and attach slideshows</p>
        </div>
        <Link href="/admin/sections/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Section
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Sections</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by title or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      <SectionsTable sections={filteredSections} onDelete={(id) => setDeleteId(id)} />

      <DeleteDialog
        isOpen={!!deleteId}
        title="Delete Section"
        description="Are you sure you want to delete this section? This action cannot be undone."
        onConfirm={() => {
          setDeleteId(null)
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
