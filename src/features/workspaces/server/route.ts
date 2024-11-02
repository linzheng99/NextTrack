import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { ID } from "node-appwrite"

import { DATABASES_ID, WORKSPACES_ID } from "@/config"
import { sessionMiddleware } from "@/lib/session-middleware"

import { carateWorkspacesSchema } from "../schemas"

const app = new Hono()
  .post(
    '/',
    zValidator('json', carateWorkspacesSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get('databases')
      const user = c.get('user')

      const { name } = c.req.valid('json')

      const workspace = await databases.createDocument(
        DATABASES_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name,
          userId: user.$id
        }
      );

      return c.json({ data: workspace })
    }
  )

export default app
