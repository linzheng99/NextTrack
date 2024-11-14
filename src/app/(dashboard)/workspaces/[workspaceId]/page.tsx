import { redirect } from "next/navigation"

import { getCurrent } from "@/features/auth/queries"

import WorkspacesIdClient from "./client"

export default async function WorkspacePage() {
  const user = await getCurrent()
  if (!user) redirect('/sign-in')

  return <WorkspacesIdClient />
}
