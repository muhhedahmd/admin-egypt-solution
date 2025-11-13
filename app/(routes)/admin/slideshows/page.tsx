import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { SlideshowsTable } from "@/components/admin/slideshows-table"
import Link from "next/link"

export default function SlideshowsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Slideshows</h1>
          <p className="text-muted-foreground">Manage homepage and content slideshows</p>
        </div>
        <Button asChild>
          <Link href="/admin/slideshows/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Slideshow
          </Link>
        </Button>
      </div>

      <SlideshowsTable />
    </div>
  )
}
