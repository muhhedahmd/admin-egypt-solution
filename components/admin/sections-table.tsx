"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit2, Trash2, Eye } from "lucide-react"
import Link from "next/link"

interface Section {
  id: string
  title: string
  slug: string
  type: string
  slideshows: number
  isActive: boolean
  order: number
  createdAt: Date
}

interface SectionsTableProps {
  sections: Section[]
  onDelete: (id: string) => void
}

export function SectionsTable({ sections, onDelete }: SectionsTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Slideshows</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sections.map((section) => (
            <TableRow key={section.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{section.title}</TableCell>
              <TableCell>
                <Badge variant="outline">{section.type}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{section.slideshows}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={section.isActive ? "default" : "secondary"}>
                  {section.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>{section.order}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{section.createdAt.toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/sections/${section.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/sections/${section.id}/edit`}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(section.id)} className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
