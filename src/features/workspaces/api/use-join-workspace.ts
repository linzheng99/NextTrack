import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type InferRequestType, type InferResponseType } from 'hono'
import { toast } from 'sonner'

import { client } from '@/lib/rpc'

type ResponseType = InferResponseType<typeof client.api.workspaces[':workspaceId']['join']['$post'], 200>
type RequestType = InferRequestType<typeof client.api.workspaces[':workspaceId']['join']['$post']>

export const useJoinWorkspace = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.workspaces[':workspaceId']['join']['$post']({ param, json })

      if (!response.ok) {
        throw new Error('加入失败...')
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      toast.success('加入成功！')
      void queryClient.invalidateQueries({ queryKey: ['workspaces'] })
      void queryClient.invalidateQueries({ queryKey: ['workspaces', data.$id] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return mutation
}
