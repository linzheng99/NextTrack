import { redirect } from "next/navigation"

import { getCurrent } from "@/features/auth/queries"
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher"

export default async function TasksPage() {
  const user = await getCurrent()
  if (!user) redirect('/sign-in')

  return (
    <div className="h-full">
      <TaskViewSwitcher />
    </div>
  )
}
