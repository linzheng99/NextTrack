import { type Models } from 'node-appwrite'

export type Workspace = Models.Document & {
  name: string
  image: string
  userId: string
  inviteCode: string
}
