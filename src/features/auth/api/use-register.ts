import { useMutation } from '@tanstack/react-query'
import { type InferRequestType, type InferResponseType } from 'hono'

import { client } from '@/lib/rpc'

type ResponseType = InferResponseType<typeof client.api.auth.register['$post']>
type RequestType = InferRequestType<typeof client.api.auth.register['$post']>

export const useRegister = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.register['$post']({ json })
      return await response.json()
    }
  })

  return mutation
}
