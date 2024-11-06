import { DATABASES_ID, PROJECTS_ID } from "@/config"
import { getMember } from "@/features/members/utils"
import { createSessionClient } from "@/lib/appwrite"

import { type Project } from "./types"

interface GetProjectProps {
  projectId: string
}

export async function getProject({ projectId }: GetProjectProps) {
  const { account, databases } = await createSessionClient()
  const user = await account.get()

  const project = await databases.getDocument<Project>(
    DATABASES_ID,
    PROJECTS_ID,
    projectId,
  )

  const member = await getMember({
    databases,
    workspaceId: project.workspaceId,
    userId: user.$id,
  })

  if (!member) {
    throw new Error('Member not found')
  }

  return project
}
