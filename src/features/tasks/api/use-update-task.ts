import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type InferRequestType, type InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { client } from '@/lib/rpc'

type ResponseType = InferResponseType<typeof client.api.tasks[':taskId']['$post'], 200>
type RequestType = InferRequestType<typeof client.api.tasks[':taskId']['$post']>

export const useUpdateTask = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.tasks[':taskId']['$post']({ json, param })

      if (!response.ok) {
        throw new Error('更新失败...')
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      toast.success('更新成功！')
      router.refresh()
      void queryClient.invalidateQueries({ queryKey: ['tasks'] })
      void queryClient.invalidateQueries({ queryKey: ['task', data.$id] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return mutation
}
