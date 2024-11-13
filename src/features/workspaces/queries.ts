"use server"

import { Query } from 'node-appwrite'

import { DATABASES_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { createSessionClient } from "@/lib/appwrite";


export async function getWorkspaces() {
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
}
