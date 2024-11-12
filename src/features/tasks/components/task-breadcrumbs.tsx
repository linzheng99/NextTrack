import { ChevronRightIcon, TrashIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import ProjectAvatar from "@/features/projects/components/project-avatar"
import { type Project } from "@/features/projects/types"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { useConfirm } from "@/hooks/use-confirm"

import { useDeleteTask } from "../api/use-delete-task"
import { type Task } from "../types"

interface TaskBreadcrumbsProps {
  project: Project
  task: Task
}

export default function TaskBreadcrumbs({ project, task }: TaskBreadcrumbsProps) {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask()
  const [DeleteTaskDialog, deleteTaskConfirm] = useConfirm('警告', '此操作不能撤销!', 'destructive')

  async function handleDeleteTask() {
    const ok = await deleteTaskConfirm()
    if (!ok) {
      return
    }

    deleteTask({ param: { taskId: task.$id } }, {
      onSuccess: () => {
        router.push(`/workspaces/${workspaceId}/tasks`)
      }
    })
  }

  return (
    <div className="flex items-center justify-between">
      <DeleteTaskDialog />
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <ProjectAvatar
            className="size-6 lg:size-8"
            name={project.name}
            image={project.image}
          />
          <Link
            href={`/workspaces/${workspaceId}/projects/${project.$id}`}
            className="text-sm font-semibold text-muted-foreground hover:underline hover:opacity-75 transition">
            {project.name}
          </Link>
        </div>
        <ChevronRightIcon className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium">{task.name}</span>
      </div>
      <Button variant="destructive" size="sm" onClick={handleDeleteTask} disabled={isDeleting}>
        <TrashIcon className="size-4" />
        <span className="hidden lg:block text-bold">Delete task</span>
      </Button>
    </div>
  )
}
