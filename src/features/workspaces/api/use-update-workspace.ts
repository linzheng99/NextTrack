import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type InferRequestType, type InferResponseType } from 'hono'
import { toast } from 'sonner'

import { client } from '@/lib/rpc'

type ResponseType = InferResponseType<typeof client.api.workspaces[':workspaceId']['$patch'], 200>
type RequestType = InferRequestType<typeof client.api.workspaces[':workspaceId']['$patch']>

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.workspaces[':workspaceId']['$patch']({ form, param })

      if (!response.ok) {
        throw new Error('更新失败...')
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      toast.success('更新成功！')
      void queryClient.invalidateQueries({ queryKey: ['workspaces'] })
      void queryClient.invalidateQueries({ queryKey: ['workspaces', data.$id] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return mutation
}
