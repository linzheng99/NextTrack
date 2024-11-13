import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type InferRequestType, type InferResponseType } from 'hono'
import { toast } from 'sonner'

import { client } from '@/lib/rpc'

type ResponseType = InferResponseType<typeof client.api.projects[':projectId']['$patch'], 200>
type RequestType = InferRequestType<typeof client.api.projects[':projectId']['$patch']>

export const useUpdateProject = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.projects[':projectId']['$patch']({ form, param })

      if (!response.ok) {
        throw new Error('更新失败...')
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      toast.success('更新成功！')
      void queryClient.invalidateQueries({ queryKey: ['projects'] })
      void queryClient.invalidateQueries({ queryKey: ['project', data.$id] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return mutation
}
