import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'

import { client } from '@/lib/rpc'

type ResponseType = InferResponseType<typeof client.api.auth.logout['$post']>

export const useLogout = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.auth.logout['$post']()
      return await response.json()
    },
    onSuccess: async () => {
      router.push('/sign-in')
      // 退出成功 -> 去找 对应的 key 的 useQuery
      await queryClient.invalidateQueries({ queryKey: ['current'] })
      await queryClient.invalidateQueries({ queryKey: ['workspaces'] })
    }
  })

  return mutation
}
