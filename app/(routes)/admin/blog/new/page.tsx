import { BlogPostForm } from "@/components/admin/blog-post-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewBlogPostPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/blog">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Blog Post</h1>
          <p className="text-muted-foreground">Write a new blog post</p>
        </div>
      </div>

      <BlogPostForm />
    </div>
  )
}
