import { redirect } from "next/navigation"

import { getCurrent } from "@/features/auth/queries"

import TaskIdClient from "./client"

export default async function TaskIdPage() {
  const user = await getCurrent()
  if (!user) redirect('/sign-in')

  return <TaskIdClient />
}
