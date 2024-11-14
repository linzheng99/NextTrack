import { zValidator } from "@hono/zod-validator"
import { endOfMonth, startOfMonth, subMonths } from 'date-fns'
import { Hono } from "hono"
import { ID, Query } from "node-appwrite"
import { z } from "zod"

import { DATABASES_ID, IMAGES_BUCKET_ID, MEMBERS_ID, TASKS_ID, WORKSPACES_ID } from "@/config"
import { MemberRole } from "@/features/members/types"
import { getMember } from "@/features/members/utils"
import { TaskStatus } from "@/features/tasks/types"
import { createSessionClient } from "@/lib/appwrite"
import { sessionMiddleware } from "@/lib/session-middleware"
import { generateInviteCode } from "@/lib/utils"

import { carateWorkspacesSchema, updateWorkspacesSchema } from "../schemas"
import { type Workspace } from "../types"

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
  .get(
    '/:workspaceId',
    sessionMiddleware,
    async (c) => {
      const databases = c.get('databases')
      const user = c.get('user')
      const { workspaceId } = c.req.param()

      const workspace = await databases.getDocument<Workspace>(
        DATABASES_ID,
        WORKSPACES_ID,
        workspaceId
      )

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
      })
      if (!member) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      return c.json({ data: workspace })
    }
  )
  .get(
    '/:workspaceId/info',
    sessionMiddleware,
    async (c) => {
      const databases = c.get('databases')
      const { workspaceId } = c.req.param()

      const workspace = await databases.getDocument<Workspace>(
        DATABASES_ID,
        WORKSPACES_ID,
        workspaceId
      )

      return c.json({ data: { $id: workspace.$id, name: workspace.name, image: workspace.image } })
    }
  )
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
  .post(
    '/:workspaceId/join',
    sessionMiddleware,
    zValidator('json', z.object({ code: z.string() })),
    async (c) => {
      const { databases, account } = await createSessionClient()
      const user = await account.get()

      const { workspaceId } = c.req.param()
      const { code } = c.req.valid('json')

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
      })

      if (member) {
        return c.json({ error: '该用户已加入该工作空间' }, 400)
      }

      const workspace = await databases.getDocument<Workspace>(DATABASES_ID, WORKSPACES_ID, workspaceId)

      if (workspace.inviteCode !== code) {
        return c.json({ error: '邀请码错误' }, 400)
      }

      await databases.createDocument(DATABASES_ID, MEMBERS_ID, ID.unique(), {
        workspaceId,
        userId: user.$id,
        role: MemberRole.MEMBER
      })

      return c.json({ data: workspace })
    }
  )
  .get(
    '/:workspaceId/analytics',
    sessionMiddleware,
    async (c) => {
      const databases = c.get('databases')
      const user = c.get('user')
      const { workspaceId } = c.req.param()

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
      })

      if (!member) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const now = new Date()
      const thisMonthStart = startOfMonth(now)
      const thisMonthEnd = endOfMonth(now)
      const lastMonthStart = startOfMonth(subMonths(now, 1))
      const lastMonthEnd = endOfMonth(subMonths(now, 1))

      // This Month Tasks 当前月任务
      const thisMonthTasks = await databases.listDocuments(
        DATABASES_ID,
        TASKS_ID,
        [
          Query.equal('workspaceId', workspaceId),
          Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
          Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
        ]
      )

      // Last Month Tasks 上个月任务
      const lastMonthTasks = await databases.listDocuments(
        DATABASES_ID,
        TASKS_ID,
        [
          Query.equal('workspaceId', workspaceId),
          Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
          Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
        ]
      )

      const taskCount = thisMonthTasks.total
      const taskDifference = taskCount - lastMonthTasks.total

      // Assigned Tasks 这个月分配的任务
      const thisMonthAssignedTasks = await databases.listDocuments(
        DATABASES_ID,
        TASKS_ID,
        [
          Query.equal('workspaceId', workspaceId),
          Query.equal('assigneeId', member.$id),
          Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
          Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
        ]
      )
      // Last Month Assigned Tasks 上个月分配的任务
      const lastMonthAssignedTasks = await databases.listDocuments(
        DATABASES_ID,
        TASKS_ID,
        [
          Query.equal('workspaceId', workspaceId),
          Query.equal('assigneeId', member.$id),
          Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
          Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
        ]
      )

      const assignedTaskCount = thisMonthAssignedTasks.total
      const assignedTaskDifference = assignedTaskCount - lastMonthAssignedTasks.total

      // Incompleted Tasks 未完成
      const thisMonthInCompletedTasks = await databases.listDocuments(
        DATABASES_ID,
        TASKS_ID,
        [
          Query.equal('workspaceId', workspaceId),
          Query.equal('assigneeId', member.$id),
          Query.notEqual('status', TaskStatus.DONE),
          Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
          Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
        ]
      )

      // Last Month Incompleted Tasks 未完成
      const lastMonthInCompletedTasks = await databases.listDocuments(
        DATABASES_ID,
        TASKS_ID,
        [
          Query.equal('workspaceId', workspaceId),
          Query.equal('assigneeId', member.$id),
          Query.notEqual('status', TaskStatus.DONE),
          Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
          Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
        ]
      )

      const inCompletedTaskCount = thisMonthInCompletedTasks.total
      const inCompletedTaskDifference = inCompletedTaskCount - lastMonthInCompletedTasks.total

      // Completed Tasks 完成
      const thisMonthCompletedTasks = await databases.listDocuments(
        DATABASES_ID,
        TASKS_ID,
        [
          Query.equal('workspaceId', workspaceId),
          Query.equal('status', TaskStatus.DONE),
          Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
          Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
        ]
      )

      // Last Month Completed Tasks 完成
      const lastMonthCompletedTasks = await databases.listDocuments(
        DATABASES_ID,
        TASKS_ID,
        [
          Query.equal('workspaceId', workspaceId),
          Query.equal('status', TaskStatus.DONE),
          Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
          Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
        ]
      )

      const completedTaskCount = thisMonthCompletedTasks.total
      const completedTaskDifference = completedTaskCount - lastMonthCompletedTasks.total

      // This Month Overdue Tasks 当前月逾期任务
      const thisMonthOverdueTasks = await databases.listDocuments(
        DATABASES_ID,
        TASKS_ID,
        [
          Query.equal('workspaceId', workspaceId),
          Query.notEqual('status', TaskStatus.DONE),
          Query.lessThan('dueDate', now.toISOString()),
          Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
          Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
        ]
      )

      // Last Month Overdue Tasks 上个月月逾期任务
      const lastMonthOverdueTasks = await databases.listDocuments(
        DATABASES_ID,
        TASKS_ID,
        [
          Query.equal('workspaceId', workspaceId),
          Query.notEqual('status', TaskStatus.DONE),
          Query.lessThan('dueDate', now.toISOString()),
          Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
          Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
        ]
      )

      const overdueTaskCount = thisMonthOverdueTasks.total
      const overdueTaskDifference = overdueTaskCount - lastMonthOverdueTasks.total

      return c.json({
        data: {
          taskCount,
          taskDifference,
          assignedTaskCount,
          assignedTaskDifference,
          inCompletedTaskCount,
          inCompletedTaskDifference,
          completedTaskCount,
          completedTaskDifference,
          overdueTaskCount,
          overdueTaskDifference,
        }
      })
    }
  )

export default app
