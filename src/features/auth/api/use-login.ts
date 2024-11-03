import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type InferRequestType, type InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'
import { toast } from "sonner"

import { client } from '@/lib/rpc'

type ResponseType = InferResponseType<typeof client.api.auth.login['$post']>
type RequestType = InferRequestType<typeof client.api.auth.login['$post']>

export const useLogin = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.login['$post']({ json })

      if (!response.ok) {
        throw new Error('登录失败...')
      }

      return await response.json()
    },
    onSuccess: async () => {
      router.refresh()
      toast.success('登录成功！')
      // 去找 对应的 key 的 useQuery
      await queryClient.invalidateQueries({ queryKey: ['current'] })
      await queryClient.invalidateQueries({ queryKey: ['workspaces'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return mutation
}
