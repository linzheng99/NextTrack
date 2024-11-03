import { redirect } from "next/navigation"

import { getCurrent } from "@/features/auth/actions"
import { getWorkspace } from "@/features/workspaces/actions"
import UpdateWorkspaceForm from "@/features/workspaces/components/update-workspace-form"

interface WorkspaceIdSettingsPageProps {
  params: { workspaceId: string }
}

export default async function WorkspaceIdSettingsPage(
  {
    params
  }: WorkspaceIdSettingsPageProps
) {
  const user = await getCurrent()
  if (!user) redirect('/sign-in')

  const workspace = await getWorkspace({ workspaceId: params.workspaceId })

  if (!workspace) {
    return redirect(`/workspaces/${params.workspaceId}`)
  }

  return (
    <div className="w-full lg:max-w-xl">
      <UpdateWorkspaceForm initialValues={workspace} />
    </div>
  )
}

