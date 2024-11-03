"use client"

import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

export const useGetWorkspaces = () => {
  const query = useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const response = await client.api.workspaces.$get()

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
