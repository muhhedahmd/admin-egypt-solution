import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { BlogTable } from "@/components/admin/blog-table"
import { BlogStats } from "@/components/admin/blog-stats"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BlogPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground">Manage your blog content, categories, and tags</p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      <BlogStats />

      <Tabs defaultValue="posts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="space-y-4">
          <BlogTable />
        </TabsContent>
        <TabsContent value="categories" className="space-y-4">
          <div className="text-center py-12 text-muted-foreground">Categories management coming soon</div>
        </TabsContent>
        <TabsContent value="tags" className="space-y-4">
          <div className="text-center py-12 text-muted-foreground">Tags management coming soon</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
