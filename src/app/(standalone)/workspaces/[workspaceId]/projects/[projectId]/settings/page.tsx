import { redirect } from "next/navigation"

import { getCurrent } from "@/features/auth/queries"

import ProjectsIdSettingsClient from "./client"

export default async function ProjectSettingsPage() {
  const user = await getCurrent()
  if (!user) redirect('/sign-in')

  return <ProjectsIdSettingsClient />
  
}

