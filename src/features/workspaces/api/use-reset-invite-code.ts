import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type InferRequestType, type InferResponseType } from 'hono'
import { toast } from 'sonner'

import { client } from '@/lib/rpc'

type ResponseType = InferResponseType<typeof client.api.workspaces[':workspaceId']['reset-invite-code']['$post'], 200>
type RequestType = InferRequestType<typeof client.api.workspaces[':workspaceId']['reset-invite-code']['$post']>

export const useResetInviteCode = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[':workspaceId']['reset-invite-code']['$post']({ param })

      if (!response.ok) {
        throw new Error('重置失败...')
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      toast.success('重置成功！')
      void queryClient.invalidateQueries({ queryKey: ['workspaces'] })
      void queryClient.invalidateQueries({ queryKey: ['workspaces', data.$id] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return mutation
}
