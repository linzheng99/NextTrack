
import { Calendar, Pencil } from "lucide-react"

import DottedSeparator from "@/components/dotted-separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import MemberAvatar from "@/features/members/components/member-avatar"

import useEditTaskModal from "../hooks/use-edit-task-modal"
import { type Task } from "../types"
import OverviewProperty from "./overview-property"
import TaskDate from "./task-date"

interface TaskOverviewProps {
  task: Task
}

export default function TaskOverview({ task }: TaskOverviewProps) {
  const { open } = useEditTaskModal()

  return (
    <div className="bg-muted rounded-lg p-4 flex flex-col">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Overview</p>
        <Button variant="outline" size="sm" onClick={() => open(task.$id)}>
          <Pencil className="size-4" />
          <span className="">Edit</span>
        </Button>
      </div>
      <DottedSeparator className="my-4" />
      <div className="flex flex-col gap-4">
        <OverviewProperty label="受托人">
          <MemberAvatar name={task.assignee.name} className="size-6" />
          <p className="text-sm">{task.assignee.name}</p>
        </OverviewProperty>
        <OverviewProperty label="截至日期">
          <Calendar className="size-4 text-muted-foreground" />
          <TaskDate value={task.dueDate} className="text-sm" />
        </OverviewProperty>
        <OverviewProperty label="状态">
          <Badge variant={task.status}>{task.status}</Badge>
        </OverviewProperty>
      </div>
    </div>
  )
}
