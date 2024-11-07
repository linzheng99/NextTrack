import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type InferRequestType, type InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { client } from '@/lib/rpc'

type ResponseType = InferResponseType<typeof client.api.projects['$post'], 200>
type RequestType = InferRequestType<typeof client.api.projects['$post']>

export const useCreateProject = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.projects['$post']({ form })

      if (!response.ok) {
        throw new Error('创建失败...')
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      toast.success('创建成功！')
      router.push(`/workspaces/${data.workspaceId}/projects/${data.$id}`)
      void queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return mutation
}
