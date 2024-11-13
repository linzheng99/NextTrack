import { redirect } from "next/navigation"

import { getCurrent } from "@/features/auth/queries"

import ProjectsIdClient from "./client"

export default async function ProjectsPage() {
  const user = await getCurrent()
  if (!user) redirect('/sign-in')

  return <ProjectsIdClient />
}
