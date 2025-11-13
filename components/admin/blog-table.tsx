"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Pencil, Trash2, Eye, ExternalLink } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { DeleteDialog } from "@/components/admin/delete-dialog"

const mockPosts = [
  {
    id: 1,
    title: "Getting Started with Next.js 15",
    slug: "getting-started-nextjs-15",
    author: "John Smith",
    category: "Development",
    status: "PUBLISHED",
    featured: true,
    views: 2543,
    publishedAt: "2024-01-15",
  },
  {
    id: 2,
    title: "The Future of AI in Software Development",
    slug: "future-ai-software-development",
    author: "Sarah Johnson",
    category: "AI & ML",
    status: "PUBLISHED",
    featured: true,
    views: 3821,
    publishedAt: "2024-01-12",
  },
  {
    id: 3,
    title: "Building Scalable Cloud Applications",
    slug: "building-scalable-cloud-apps",
    author: "Michael Chen",
    category: "Cloud",
    status: "PUBLISHED",
    featured: false,
    views: 1654,
    publishedAt: "2024-01-10",
  },
  {
    id: 4,
    title: "Modern UI/UX Design Principles",
    slug: "modern-ui-ux-design-principles",
    author: "Emily Davis",
    category: "Design",
    status: "DRAFT",
    featured: false,
    views: 0,
    publishedAt: null,
  },
  {
    id: 5,
    title: "Microservices Architecture Best Practices",
    slug: "microservices-architecture-best-practices",
    author: "John Smith",
    category: "Architecture",
    status: "SCHEDULED",
    featured: false,
    views: 0,
    publishedAt: "2024-01-20",
  },
]

export function BlogTable() {
  const router = useRouter()
  const [posts, setPosts] = useState(mockPosts)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    console.log("[v0] Deleting blog post:", id)
    setPosts(posts.filter((p) => p.id !== id))
    setDeleteId(null)
  }

  return (
    <>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{post.title}</div>
                    <div className="text-sm text-muted-foreground font-mono">{post.slug}</div>
                    {post.featured && (
                      <Badge variant="outline" className="mt-1">
                        Featured
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={`/.jpg?height=24&width=24&query=${post.author}`} />
                      <AvatarFallback className="text-xs">
                        {post.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{post.author}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{post.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      post.status === "PUBLISHED" ? "default" : post.status === "DRAFT" ? "secondary" : "outline"
                    }
                  >
                    {post.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{post.views.toLocaleString()}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "-"}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/admin/blog/${post.id}`)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/admin/blog/${post.id}/edit`)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      {post.status === "PUBLISHED" && (
                        <DropdownMenuItem>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Live
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(post.id)}>
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

      <DeleteDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Delete Blog Post"
        description="Are you sure you want to delete this blog post? This action cannot be undone."
      />
    </>
  )
}
