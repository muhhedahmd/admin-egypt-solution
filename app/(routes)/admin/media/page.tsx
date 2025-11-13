import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { MediaGrid } from "@/components/admin/media-grid"
import { MediaStats } from "@/components/admin/media-stats"

export default function MediaPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground">Manage images, videos, and other media files</p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Media
        </Button>
      </div>

      <MediaStats />

      <MediaGrid />
    </div>
  )
}
