import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { Query } from "node-appwrite"
import { z } from "zod"

import { DATABASES_ID, MEMBERS_ID } from "@/config"
import { createAdminClient } from "@/lib/appwrite"
import { sessionMiddleware } from "@/lib/session-middleware"

import { type Member, MemberRole } from "../types"
import { getMember } from "../utils"

const app = new Hono()
  .get(
    '/',
    sessionMiddleware,
    zValidator('query', z.object({ workspaceId: z.string() })),
    async (c) => {
      const { users } = await createAdminClient()
      const databases = c.get('databases')
      const user = c.get('user')
      const { workspaceId } = c.req.query()

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      })

      if (!member) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const members = await databases.listDocuments<Member>(
        DATABASES_ID,
        MEMBERS_ID,
        [Query.equal('workspaceId', workspaceId)]
      )

      // 通过整个用户表去寻找成员们
      const populatedMembers = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId)
          return { ...member, name: user.name, email: user.email }
        })
      )

      return c.json({ data: { ...members, documents: populatedMembers } })
    })
  .delete(
    '/:memberId',
    sessionMiddleware,
    async (c) => {
      const databases = c.get('databases')
      const { memberId } = c.req.param()
      const user = c.get('user')

      const memberToDelete = await databases.getDocument(DATABASES_ID, MEMBERS_ID, memberId)
      // 获取当前用户在当前工作空间中的角色
      const member = await getMember({
        databases,
        workspaceId: memberToDelete.workspaceId,
        userId: user.$id,
      })

      if (!member) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      // 如果当前用户不是管理员，并且要删除的成员不是当前用户，则无权限
      if (member?.$id !== memberToDelete.$id && member?.role !== MemberRole.ADMIN) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      // 获取当前工作空间中的所有成员
      const allMembersInWorkspace = await databases.listDocuments(
        DATABASES_ID,
        MEMBERS_ID,
        [Query.equal('workspaceId', memberToDelete.workspaceId as string)]
      )

      if (allMembersInWorkspace.total === 1) {
        return c.json({ error: '不能操作工作空间中最后一个成员' }, 400)
      }

      await databases.deleteDocument(DATABASES_ID, MEMBERS_ID, memberId)

      return c.json({ data: { $id: memberId } })
    })
  .patch(
    '/:memberId',
    sessionMiddleware,
    zValidator('json', z.object({ role: z.nativeEnum(MemberRole) })),
    async (c) => {
      const databases = c.get('databases')
      const { memberId } = c.req.param()
      const user = c.get('user')
      const { role } = await c.req.json()

      const memberToUpdate = await databases.getDocument(DATABASES_ID, MEMBERS_ID, memberId)

      const member = await getMember({
        databases,
        workspaceId: memberToUpdate.workspaceId,
        userId: user.$id,
      })

      if (!member) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      if (member?.role !== MemberRole.ADMIN) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const allMembersInWorkspace = await databases.listDocuments(
        DATABASES_ID,
        MEMBERS_ID,
        [Query.equal('workspaceId', memberToUpdate.workspaceId as string)]
      )

      if (allMembersInWorkspace.total === 1) {
        return c.json({ error: '不能操作工作空间中最后一个成员' }, 400)
      }

      await databases.updateDocument(DATABASES_ID, MEMBERS_ID, memberId, { role })

      return c.json({ data: { $id: memberToUpdate.$id } })
    }
  )


export default app
