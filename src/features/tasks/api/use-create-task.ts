import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type InferRequestType, type InferResponseType } from 'hono'
import { toast } from 'sonner'

import { client } from '@/lib/rpc'

type ResponseType = InferResponseType<typeof client.api.tasks['$post'], 200>
type RequestType = InferRequestType<typeof client.api.tasks['$post']>

export const useCreateTask = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks['$post']({ json })

      if (!response.ok) {
        throw new Error('创建失败...')
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success('创建成功！')
      void queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return mutation
}
