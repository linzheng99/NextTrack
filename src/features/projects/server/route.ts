import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { ID, Query } from "node-appwrite"
import { z } from "zod"

import { DATABASES_ID, IMAGES_BUCKET_ID, PROJECTS_ID } from "@/config"
import { getMember } from "@/features/members/utils"
import { createSessionClient } from "@/lib/appwrite"
import { sessionMiddleware } from "@/lib/session-middleware"

import { createProjectSchema, updateProjectSchema } from "../schemas"

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
  .patch(
    '/:projectId',
    sessionMiddleware,
    zValidator('form', updateProjectSchema),
    async (c) => {
      const databases = c.get('databases')
      const sotrage = c.get('storage')
      const user = c.get('user')

      const { projectId } = c.req.param()
      const { name, image } = c.req.valid('form')

      const existingProject = await databases.getDocument(
        DATABASES_ID,
        PROJECTS_ID,
        projectId
      )

      const member = await getMember({
        databases,
        workspaceId: existingProject.workspaceId,
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
      } else {
        uploadedImageUrl = image || ''
      }

      const project = await databases.updateDocument(
        DATABASES_ID,
        PROJECTS_ID,
        projectId,
        {
          name,
          image: uploadedImageUrl,
          workspaceId: existingProject.workspaceId
        }
      );

      return c.json({ data: project })
    }
  )
  .delete(
    '/:projectId',
    sessionMiddleware,
    async (c) => {
      const { databases, account } = await createSessionClient()
      const user = await account.get()

      const { projectId } = c.req.param()

      const existingProject = await databases.getDocument(
        DATABASES_ID,
        PROJECTS_ID,
        projectId
      )

      const member = await getMember({
        databases,
        workspaceId: existingProject.workspaceId,
        userId: user.$id
      })

      if (!member) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      await databases.deleteDocument(DATABASES_ID, PROJECTS_ID, projectId)

      return c.json({ data: { $id: existingProject.$id } })
    }
  )

export default app
