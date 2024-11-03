"use Server"

import { cookies } from "next/headers";
import { Account, Client, Databases, Query } from 'node-appwrite'

import { DATABASES_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { AUTH_COOKIE } from "@/features/auth/constants";
import { MemberRole } from "@/features/members/types";
import { getMember } from "@/features/members/utils";

import { type Workspace } from "./types";

export async function getWorkspaces() {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = (await cookies()).get(AUTH_COOKIE)

    if (!session || !session?.value) return { documents: [], total: 0 }

    client.setSession(session.value);

    const databases = new Databases(client)
    const account = new Account(client)
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
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = (await cookies()).get(AUTH_COOKIE)

    if (!session || !session?.value) return null

    client.setSession(session.value);

    const databases = new Databases(client)
    const account = new Account(client)
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
