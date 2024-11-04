import { redirect } from "next/navigation"

import { getCurrent } from "@/features/auth/queries"
import UpdateWorkspaceForm from "@/features/workspaces/components/update-workspace-form"
import { getWorkspace } from "@/features/workspaces/queries"

interface WorkspaceIdSettingsPageProps {
  params: Promise<{ workspaceId: string }>
}

export default async function WorkspaceIdSettingsPage(
  {
    params
  }: WorkspaceIdSettingsPageProps
) {
  const user = await getCurrent()
  if (!user) redirect('/sign-in')

  const { workspaceId } = await params
  const workspace = await getWorkspace({ workspaceId })

  if (!workspace) {
    return redirect(`/workspaces/${workspaceId}`)
  }

  return (
    <div className="w-full lg:max-w-xl">
      <UpdateWorkspaceForm initialValues={workspace} />
    </div>
  )
}

