import { Edit } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { getCurrent } from "@/features/auth/queries"
import ProjectAvatar from "@/features/projects/components/project-avatar"
import { getProject } from "@/features/projects/queries"
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher"

interface ProjectsPageProps {
  params: Promise<{ projectId: string }>
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const user = await getCurrent()
  if (!user) redirect('/sign-in')

  const { projectId } = await params

  const initialValues = await getProject({ projectId })
  if (!initialValues) {
    throw new Error('Project not found')
  }


  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 p-2.5 rounded-md font-medium "
        >
          <ProjectAvatar name={initialValues.name} image={initialValues.image} className="size-10" fallbackClassName="text-xl" />
          <span className="truncate font-semibold text-xl">{initialValues.name}</span>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}/settings`}>
            <Edit className="size-4" />
            Edit Project
          </Link>
        </Button>
      </div>
      <TaskViewSwitcher />
    </div>
  )
}
