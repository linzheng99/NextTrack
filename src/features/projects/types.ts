import { type Models } from 'node-appwrite'

export type Project = Models.Document & {
  name: string
  image: string
  workspaceId: string
}
