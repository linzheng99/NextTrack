"use client"

import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react"
import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TaskActionsProps {
  id: string
  projectId: string
  children: React.ReactNode
}

export default function TaskActions({ id, projectId, children }: TaskActionsProps) {
  function handleTaskDetails() {
    console.log(id, projectId)
  }

  return (
    <DropdownMenu>
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
          onClick={() => { }}
          disabled={false}
          className="font-medium p-2.5"
        >
          <ExternalLinkIcon className="size-4 mr-2" />
          Open Project
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => { }}
          disabled={false}
          className="font-medium p-2.5"
        >
          <PencilIcon className="size-4 mr-2" />
          Edit Task
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => { }}
          disabled={false}
          className="font-medium p-2.5 text-red-500 focus:text-red-500"
        >
          <TrashIcon className="size-4 mr-2" />
          Delete Task
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
