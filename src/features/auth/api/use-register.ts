import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type InferRequestType, type InferResponseType } from 'hono'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { client } from '@/lib/rpc'

type ResponseType = InferResponseType<typeof client.api.auth.register['$post']>
type RequestType = InferRequestType<typeof client.api.auth.register['$post']>

export const useRegister = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.register['$post']({ json })

      if(!response.ok) {
        throw new Error('注册失败...')
      }

      return await response.json()
    },
    onSuccess: async () => {
      router.refresh()
      await queryClient.invalidateQueries({ queryKey: ['current'] })
      toast.success('注册成功!')
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return mutation
}
