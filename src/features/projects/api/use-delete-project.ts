import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type InferRequestType, type InferResponseType } from 'hono'
import { toast } from 'sonner'

import { client } from '@/lib/rpc'

type ResponseType = InferResponseType<typeof client.api.projects[':projectId']['$delete'], 200>
type RequestType = InferRequestType<typeof client.api.projects[':projectId']['$delete']>

export const useDeleteProject = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.projects[':projectId']['$delete']({ param })

      if (!response.ok) {
        throw new Error('删除失败...')
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      toast.success('删除成功！')
      void queryClient.invalidateQueries({ queryKey: ['projects'] })
      void queryClient.invalidateQueries({ queryKey: ['project', data.$id] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return mutation
}
