"use client"

import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

import { type TaskStatus } from "../types"

interface UseGetTasksProps {
  workspaceId: string
  search?: string | null
  projectId?: string | null
  status?: TaskStatus | null
  assigneeId?: string | null
  dueDate?: string | null
}

export const useGetTasks = ({ workspaceId, search, projectId, status, assigneeId, dueDate }: UseGetTasksProps) => {
  const query = useQuery({
    queryKey: ['tasks', { workspaceId, search, projectId, status, assigneeId, dueDate }],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
          search: search ?? undefined,
          projectId: projectId ?? undefined,
          status: status ?? undefined,
          assigneeId: assigneeId ?? undefined,
          dueDate: dueDate ?? undefined,
        }
      })

      if (!response.ok) {
        throw new Error('获取任务失败...')
      }

      const { data } = await response.json()

      return data
    }
  })
  return query
}
