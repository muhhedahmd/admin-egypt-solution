import { ProjectForm } from "@/components/admin/project-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const mockProject = {
    id: params.id,
    title: "E-Commerce Platform",
    slug: "ecommerce-platform",
    description: "Modern e-commerce solution with advanced features",
    content: "Built a comprehensive e-commerce platform...",
    status: "PUBLISHED",
    featured: true,
    clientId: "1",
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    technologies: ["React", "Node.js", "PostgreSQL"],
    teamMembers: ["1", "2"],
    category: "Web Application",
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/projects">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
          <p className="text-muted-foreground">Update project information</p>
        </div>
      </div>

      <ProjectForm initialData={mockProject} />
    </div>
  )
}
