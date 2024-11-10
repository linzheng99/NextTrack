"use client"

import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

interface UseGetTaskProps {
  taskId: string
}

export const useGetTask = ({ taskId }: UseGetTaskProps) => {
  const query = useQuery({
    queryKey: ['tasks', taskId],
    queryFn: async () => {
      const response = await client.api.tasks[':taskId'].$get({ param: { taskId } })

      if (!response.ok) {
        throw new Error('获取任务失败...')
      }

      const { data } = await response.json()

      return data
    }
  })
  return query
}
