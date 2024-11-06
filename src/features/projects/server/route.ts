import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { ID, Query } from "node-appwrite"
import { z } from "zod"

import { DATABASES_ID, IMAGES_BUCKET_ID, PROJECTS_ID } from "@/config"
import { getMember } from "@/features/members/utils"
import { sessionMiddleware } from "@/lib/session-middleware"

import { createProjectSchema } from "../schemas"

const app = new Hono()
  .post('/',
    sessionMiddleware,
    zValidator('form', createProjectSchema),
    async (c) => {
      const databases = c.get('databases')
      const user = c.get('user')
      const sotrage = c.get('storage')

      const { name, image, workspaceId } = c.req.valid('form')

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
      })

      if (!member) {
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
      }

      const project = await databases.createDocument(
        DATABASES_ID,
        PROJECTS_ID,
        ID.unique(),
        {
          name,
          image: uploadedImageUrl,
          workspaceId
        }
      );

      return c.json({ data: project })
    }
  )
  .get(
    '/',
    sessionMiddleware,
    zValidator('query', z.object({ workspaceId: z.string() })),
    async (c) => {
      const databases = c.get('databases')
      const user = c.get('user')
      const { workspaceId } = c.req.valid('query')

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
      })

      if (!member) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const projects = await databases.listDocuments(
        DATABASES_ID,
        PROJECTS_ID,
        [
          Query.equal('workspaceId', workspaceId),
          Query.orderDesc('$createdAt')
        ]
      )

      return c.json({ data: projects })

    }
  )

export default app
