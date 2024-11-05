import { redirect } from "next/navigation"

import { getCurrent } from "@/features/auth/queries"
import JoinWorkspaceForm from "@/features/workspaces/components/join-workspace-form"
import { getWorkspaceInfo } from "@/features/workspaces/queries"

interface WorkspaceIdJoinPageProps {
  params: Promise<{ workspaceId: string, invitecode: string }>
}

export default async function WorkspaceIdJoinPage({ params }: WorkspaceIdJoinPageProps) {
  const user = await getCurrent()
  if (!user) redirect('/sign-in')

  const { workspaceId } = await params

  const workspaceInfo = await getWorkspaceInfo({ workspaceId })

  if (!workspaceInfo) redirect('/')

  return (
    <div className="w-full lg:max-w-xl mx-auto">
      <JoinWorkspaceForm initialValues={workspaceInfo} />
    </div>
  )
}
