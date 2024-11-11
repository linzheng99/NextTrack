import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type InferRequestType, type InferResponseType } from 'hono'
import { toast } from 'sonner'

import { client } from '@/lib/rpc'

type ResponseType = InferResponseType<typeof client.api.tasks['bulk-update']['$post'], 200>
type RequestType = InferRequestType<typeof client.api.tasks['bulk-update']['$post']>

export const useBulkUpdateTask = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks['bulk-update']['$post']({ json })

      if (!response.ok) {
        throw new Error('更新失败...')
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success('更新成功！')

      void queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return mutation
}
