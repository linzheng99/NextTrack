"use client"

import { useQuery } from "@tanstack/react-query"
import { type InferResponseType } from "hono"

import { client } from "@/lib/rpc"

interface UseGetProjectAnalyticsProps {
  projectId: string
}

export type ProjectAnalyticsResponseType = InferResponseType<typeof client.api.projects[':projectId']['analytics']['$get'], 200>

export const useGetProjectAnalytics = ({ projectId }: UseGetProjectAnalyticsProps) => {
  const query = useQuery({
    queryKey: ['projects-analytics', projectId],
    queryFn: async () => {
      const response = await client.api.projects[':projectId']['analytics'].$get({ param: { projectId } })

      if (!response.ok) {
        throw new Error('获取项目分析失败...')
      }

      const { data } = await response.json()

      return data
    }
  })
  return query
}
