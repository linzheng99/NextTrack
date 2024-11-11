import { MoreHorizontalIcon } from "lucide-react";

import DottedSeparator from "@/components/dotted-separator";
import MemberAvatar from "@/features/members/components/member-avatar";
import ProjectAvatar from "@/features/projects/components/project-avatar";

import { type Task } from "../types";
import TaskActions from "./task-actions";
import TaskDate from "./task-date";

interface KanbanCardProps {
  task: Task
}

export default function KanbanCard({ task }: KanbanCardProps) {
  return (
    <div className="bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-x-2">
        <p className="text-sm font-medium">{task.name}</p>
        <TaskActions id={task.$id} projectId={task.projectId}>
          <MoreHorizontalIcon className="size-5 text-neutral-500" />
        </TaskActions>
      </div>
      <DottedSeparator />
      <div className="flex items-center gap-x-1.5">
        <MemberAvatar name={task.assignee.name} fallbackClassName="size-[10px]" />
        <div className="size-1 rounded-full bg-neutral-300" />
        <TaskDate value={task.dueDate} className="text-xs" />
      </div>
      <div className="flex items-center gap-x-1">
        <ProjectAvatar name={task.project.name} image={task.project.image} />
        <span className="text-xs text-muted-foreground">{task.project.name}</span>
      </div>
    </div>
  )
}
