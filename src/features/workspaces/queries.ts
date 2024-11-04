"use server"

import { Query } from 'node-appwrite'

import { DATABASES_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { MemberRole } from "@/features/members/types";
import { getMember } from "@/features/members/utils";

import { type Workspace } from "./types";
import { createSessionClient } from "@/lib/appwrite";

export async function getWorkspaces() {
  try {
    const { account, databases } = await createSessionClient()
    const user = await account.get()

    const member = await databases.listDocuments(
      DATABASES_ID,
      MEMBERS_ID,
      [Query.equal('userId', user.$id)]
    )

    if (member.total === 0) {
      return { documents: [], total: 0 }
    }

    const workspaceIds = member.documents.map((m) => m.workspaceId as string)

    const workspaces = await databases.listDocuments(
      DATABASES_ID,
      WORKSPACES_ID,
      [
        Query.contains('$id', workspaceIds),
        Query.orderDesc('$createdAt')
      ]
    )

    return workspaces

  } catch (error) {
    console.log(error)
    return { documents: [], total: 0 }
  }
}

export async function getWorkspace({ workspaceId }: { workspaceId: string }) {
  try {
    const { account, databases } = await createSessionClient()
    const user = await account.get()

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id
    })

    if (!member || member.role !== MemberRole.ADMIN) {
      return null
    }

    const workspace = await databases.getDocument<Workspace>(
      DATABASES_ID,
      WORKSPACES_ID,
      workspaceId,
    )

    return workspace
  } catch (error) {
    console.log(error)
    return null
  }
}
