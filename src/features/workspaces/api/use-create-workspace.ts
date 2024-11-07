import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type InferRequestType, type InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { client } from '@/lib/rpc'

type ResponseType = InferResponseType<typeof client.api.workspaces['$post']>
type RequestType = InferRequestType<typeof client.api.workspaces['$post']>

export const useCreateWorkspace = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.workspaces['$post']({ form })

      if (!response.ok) {
        throw new Error('创建失败...')
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      toast.success('创建成功！')
      router.push(`/workspaces/${data.$id}`)
      void queryClient.invalidateQueries({ queryKey: ['workspaces'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return mutation
}
