"use client"

import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

interface UseGetProjectsProps {
  workspaceId: string
}

export const useGetProjects = ({ workspaceId }: UseGetProjectsProps) => {
  const query = useQuery({
    queryKey: ['projects', workspaceId],
    queryFn: async () => {
      const response = await client.api.projects.$get({
        query: {
          workspaceId
        }
      })

      if (!response.ok) {
        return {
          documents: [],
          total: 0,
        }
      }

      const { data } = await response.json()

      return {
        documents: data.documents,
        total: data.total,
      }
    }
  })
  return query
}
