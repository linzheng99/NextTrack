import { type Databases, Query } from "node-appwrite"

import { DATABASES_ID, MEMBERS_ID } from "@/config"

interface GetMemberProps {
  databases: Databases
  workspaceId: string
  userId: string
}

export const getMember = async ({ databases, workspaceId, userId }: GetMemberProps) => {
  try {
    const member = await databases.listDocuments(
      DATABASES_ID,
      MEMBERS_ID,
      [
        Query.equal('workspaceId', workspaceId),
        Query.equal('userId', userId)
      ]
    )
    return member.documents[0]
  } catch (error) {
    console.log(error)
    throw new Error('Failed to get member')
  }
}
