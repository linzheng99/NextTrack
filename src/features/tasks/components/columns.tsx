"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreVerticalIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import MemberAvatar from "@/features/members/components/member-avatar"
import ProjectAvatar from "@/features/projects/components/project-avatar"
import { snakeCaseToTitleCase } from "@/lib/utils"

import { type Task, type TaskStatus } from "../types"
import TaskActions from "./task-actions"
import TaskDate from "./task-date"

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Task Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const name = row.original.name

      return <p className="line-clamp-1 truncate">{name}</p>
    },
  },
  {
    accessorKey: "project",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const project = row.original.project

      return (
        <div className="flex items-center gap-2 text-sm font-medium">
          <ProjectAvatar name={project.name} image={project.image} />
          <p className="line-clamp-1">{project.name}</p>
        </div>
      )
    },
  },
  {
    accessorKey: "assignee",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Assignee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const assignee = row.original.assignee

      return (
        <div className="flex items-center gap-2 text-sm font-medium">
          <MemberAvatar name={assignee.name} />
          <p className="line-clamp-1">{assignee.name}</p>
        </div>
      )
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const dueDate = row.original.dueDate

      return (
        <TaskDate value={dueDate} />
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.original.status as TaskStatus

      return (
        <Badge variant={status}>{snakeCaseToTitleCase(status)}</Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const taskId = row.original.$id
      const projectId = row.original.projectId

      return (
        <TaskActions id={taskId} projectId={projectId}>
          <Button variant="ghost" size="icon">
            <MoreVerticalIcon className="size-4" />
          </Button>
        </TaskActions>
      )
    }
  }
]