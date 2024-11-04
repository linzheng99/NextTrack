import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { ID, Query } from "node-appwrite"

import { DATABASES_ID, IMAGES_BUCKET_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config"
import { MemberRole } from "@/features/members/types"
import { getMember } from "@/features/members/utils"
import { sessionMiddleware } from "@/lib/session-middleware"
import { generateInviteCode } from "@/lib/utils"

import { carateWorkspacesSchema, updateWorkspacesSchema } from "../schemas"
import { createSessionClient } from "@/lib/appwrite"

const app = new Hono()
  .get('/', sessionMiddleware, async (c) => {
    const databases = c.get('databases')
    const user = c.get('user')

    const member = await databases.listDocuments(
      DATABASES_ID,
      MEMBERS_ID,
      [Query.equal('userId', user.$id)]
    )

    if (member.total === 0) {
      return c.json({ data: { documents: [], total: 0 } })
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

    return c.json({ data: workspaces })
  })
  .post(
    '/',
    zValidator('form', carateWorkspacesSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get('databases')
      const user = c.get('user')
      const sotrage = c.get('storage')

      const { name, image } = c.req.valid('form')
      let uploadedImageUrl: string = ''

      if (image instanceof File) {
        const file = await sotrage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        )
        const arrayBuffer = await sotrage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        )
        const mimeType = image.type || 'image/png'
        uploadedImageUrl = `data:${mimeType};base64,${Buffer.from(arrayBuffer).toString('base64')}`
      }

      const workspace = await databases.createDocument(
        DATABASES_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          image: uploadedImageUrl,
          inviteCode: generateInviteCode()
        }
      );

      await databases.createDocument(
        DATABASES_ID,
        MEMBERS_ID,
        ID.unique(),
        {
          workspaceId: workspace.$id,
          userId: user.$id,
          role: MemberRole.ADMIN,
        })

      return c.json({ data: workspace })
    }
  )
  .patch(
    '/:workspaceId',
    sessionMiddleware,
    zValidator('form', updateWorkspacesSchema),
    async (c) => {
      const databases = c.get('databases')
      const sotrage = c.get('storage')
      const user = c.get('user')

      const { workspaceId } = c.req.param()
      const { name, image } = c.req.valid('form')

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
      })

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      let uploadedImageUrl: string = ''
      if (image instanceof File) {
        const file = await sotrage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        )
        const arrayBuffer = await sotrage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        )
        const mimeType = image.type || 'image/png'
        uploadedImageUrl = `data:${mimeType};base64,${Buffer.from(arrayBuffer).toString('base64')}`
      } else {
        uploadedImageUrl = image || ''
      }

      const workspace = await databases.updateDocument(
        DATABASES_ID,
        WORKSPACES_ID,
        workspaceId,
        {
          name,
          image: uploadedImageUrl,
        }
      );

      return c.json({ data: workspace })
    }
  )
  .delete(
    '/:workspaceId',
    sessionMiddleware,
    async (c) => {
      const { databases, account } = await createSessionClient()
      const user = await account.get()

      const { workspaceId } = c.req.param()

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
      })

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      await databases.deleteDocument(DATABASES_ID, WORKSPACES_ID, workspaceId)

      return c.json({ data: { $id: workspaceId } })
    }
  )
  .post(
    '/:workspaceId/reset-invite-code',
    sessionMiddleware,
    async (c) => {
      const { databases, account } = await createSessionClient()
      const user = await account.get()

      const { workspaceId } = c.req.param()

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
      })

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const workspace = await databases.updateDocument(DATABASES_ID, WORKSPACES_ID, workspaceId, {
        inviteCode: generateInviteCode()
      })

      return c.json({ data: workspace })
    }
  )

export default app
