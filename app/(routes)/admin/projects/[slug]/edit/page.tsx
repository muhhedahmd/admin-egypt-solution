
import { ProjectEditorForm } from "../../_comp/ProjectEditorForm"

export default function EditProjectPage({ params }: { params: { slug: string } }) {
  const projectSlug = params.slug



  return (
    <div className="min-h-screen bg-background flex items-start flex-col justify-start p-4 sm:p-6 lg:p-8">
      {/* Background Glow */}

         <div className=" border-b border-border w-fukk pb-3 mb-0 w-full">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Edit <span className="text-gradient">Project</span>
          </h1>
          <p className="text-muted-foreground">
            Update your project details, technologies, and services
          </p>
        </div>
        

      <ProjectEditorForm  projectSlug={projectSlug}  />
    </div>
  )
}
