import { useMutation } from '@tanstack/react-query'
import { type InferRequestType, type InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { client } from '@/lib/rpc'

type ResponseType = InferResponseType<typeof client.api.workspaces['$post']>
type RequestType = InferRequestType<typeof client.api.workspaces['$post']>

export const useCreateWorkspace = () => {
  const router = useRouter()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.workspaces['$post']({ json })

      if (!response.ok) {
        throw new Error('创建失败...')
      }

      return await response.json()
    },
    onSuccess: () => {
      router.refresh()
      toast.success('创建成功！')
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return mutation
}
