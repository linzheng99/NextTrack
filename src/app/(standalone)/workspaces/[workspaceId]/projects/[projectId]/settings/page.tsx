import { redirect } from "next/navigation"

import { getCurrent } from "@/features/auth/queries"
import UpdateProjectForm from "@/features/projects/components/update-project-form"
import { getProject } from "@/features/projects/queries"

interface ProjectSettingsPageProps {
  params: Promise<{ projectId: string }>
}

export default async function ProjectSettingsPage({ params }: ProjectSettingsPageProps) {
  const user = await getCurrent()
  if (!user) redirect('/sign-in')

  const { projectId } = await params

  const initialValues = await getProject({ projectId })

  if (!initialValues) {
    throw new Error('Project not found')
  }

  return (
    <div className="w-full max-w-xl">
      <UpdateProjectForm initialValues={initialValues} />
    </div>
  )
}

