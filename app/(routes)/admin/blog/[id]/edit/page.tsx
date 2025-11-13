import { BlogPostForm } from "@/components/admin/blog-post-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const mockPost = {
    id: params.id,
    title: "10 Best Practices for Modern Web Development",
    slug: "10-best-practices-modern-web-development",
    excerpt: "Learn the essential practices that every web developer should follow",
    content: "In this comprehensive guide, we'll explore...",
    status: "PUBLISHED",
    featured: true,
    categoryId: "1",
    tags: ["Web Development", "Best Practices", "JavaScript"],
    publishedAt: "2024-03-15",
    metaTitle: "10 Best Practices for Modern Web Development",
    metaDescription: "Essential web development practices",
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/blog">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Blog Post</h1>
          <p className="text-muted-foreground">Update blog post content</p>
        </div>
      </div>

      <BlogPostForm initialData={mockPost} />
    </div>
  )
}
