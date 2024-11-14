"use client"

import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { useConfirm } from "@/hooks/use-confirm"

import { useDeleteTask } from "../api/use-delete-task"
import useEditTaskModal from "../hooks/use-edit-task-modal"

interface TaskActionsProps {
  id: string
  projectId: string
  children: React.ReactNode
}

export default function TaskActions({ id, projectId, children }: TaskActionsProps) {
  const workspaceId = useWorkspaceId()
  const router = useRouter()
  const [DeleteDialog, confirmDelete] = useConfirm('警告', '此操作不能撤销!', 'destructive')
  const { mutate: deleteTask, isPending: isDeletingPending } = useDeleteTask()
  const { open } = useEditTaskModal()

  function handleTaskDetails() {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`)
  }

  async function handleDeleteTask() {
    const ok = await confirmDelete()
    if (!ok) {
      return
    }

    deleteTask({ param: { taskId: id } })
  }

  return (
    <DropdownMenu>
      <DeleteDialog />
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem
          onClick={handleTaskDetails}
          disabled={false}
          className="font-medium p-2.5"
        >
          <ExternalLinkIcon className="size-4 mr-2" />
          Task Details
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/workspaces/${workspaceId}/projects/${projectId}`)}
          disabled={false}
          className="font-medium p-2.5"
        >
          <ExternalLinkIcon className="size-4 mr-2" />
          Open Project
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => open(id)}
          disabled={false}
          className="font-medium p-2.5"
        >
          <PencilIcon className="size-4 mr-2" />
          Edit Task
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDeleteTask}
          disabled={isDeletingPending}
          className="font-medium p-2.5 text-red-500 focus:text-red-500"
        >
          <TrashIcon className="size-4 mr-2" />
          Delete Task
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
