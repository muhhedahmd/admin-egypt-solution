"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Pencil, Trash2, Eye, Star } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const mockTestimonials = [
  {
    id: 1,
    author: "Jane Cooper",
    company: "TechCorp Inc.",
    position: "CEO",
    content: "Outstanding work! The team delivered beyond our expectations and the project was completed on time.",
    rating: 5,
    status: "APPROVED",
    featured: true,
  },
  {
    id: 2,
    author: "Robert Fox",
    company: "FinanceBank",
    position: "CTO",
    content: "Professional, efficient, and highly skilled. Would definitely recommend their services.",
    rating: 5,
    status: "APPROVED",
    featured: true,
  },
  {
    id: 3,
    author: "Kristin Watson",
    company: "MediCare Systems",
    position: "Product Manager",
    content: "Great communication throughout the project. The final product exceeded our requirements.",
    rating: 4,
    status: "APPROVED",
    featured: false,
  },
  {
    id: 4,
    author: "Cameron Williamson",
    company: "ShipFast Co.",
    position: "Operations Director",
    content: "Solid work and good attention to detail. Minor delays but overall satisfied with the outcome.",
    rating: 4,
    status: "PENDING",
    featured: false,
  },
]

export function TestimonialsTable() {
  const [testimonials] = useState(mockTestimonials)

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Author</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testimonials.map((testimonial) => (
            <TableRow key={testimonial.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={`/.jpg?height=40&width=40&query=${testimonial.author}`} />
                    <AvatarFallback>
                      {testimonial.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.position} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-md line-clamp-2 text-sm">{testimonial.content}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={testimonial.status === "APPROVED" ? "default" : "secondary"}>
                  {testimonial.status}
                </Badge>
              </TableCell>
              <TableCell>{testimonial.featured && <Badge variant="outline">Featured</Badge>}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View Full
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
