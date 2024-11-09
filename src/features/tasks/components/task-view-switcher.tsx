"use client"

import { Loader, Plus } from "lucide-react"
import { useQueryState } from "nuqs"

import DottedSeparator from "@/components/dotted-separator"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"

import { useGetTasks } from "../api/use-get-tasks"
import useCreateTaskModal from "../hooks/use-create-task-modal"
import { useTaskFilters } from "../hooks/use-task-filters"
import DataFilters from "./data-filters"

export default function TaskViewSwitcher() {
  const [view, setView] = useQueryState('task-view', {
    defaultValue: "table",
  })
  const [{ projectId, status, assigneeId, dueDate }] = useTaskFilters()
  const workspaceId = useWorkspaceId()
  const { open } = useCreateTaskModal()

  const { data: tasks, isLoading: isTasksLoading } = useGetTasks({ workspaceId, projectId, status, assigneeId, dueDate })

  return (
    <Tabs
      className="w-full border rounded-lg"
      defaultValue={view}
      onValueChange={setView}
    >
      <div className="h-full w-full p-4">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-2">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger value="table" className="w-full lg:w-auto">Table</TabsTrigger>
            <TabsTrigger value="kanban" className="w-full lg:w-auto">Kanban</TabsTrigger>
            <TabsTrigger value="calendar" className="w-full lg:w-auto">Calendar</TabsTrigger>
          </TabsList>
          <Button size="sm" variant="default" className="w-full lg:w-auto" onClick={open}>
            <Plus className="size-4" />
            Add Task
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters />
        <DottedSeparator className="my-4" />
        {
          isTasksLoading ? (
            <div className="w-full h-[200px] flex items-center justify-center border rounded-lg">
              <Loader className="animate-spin size-5 text-muted-foreground" />
            </div>
          ) : (
            <>
              <TabsContent value="table" className="overflow-x-auto">
                {isTasksLoading ? <Skeleton className="w-full h-full" /> : JSON.stringify(tasks)}
              </TabsContent>
              <TabsContent value="kanban">kanban</TabsContent>
              <TabsContent value="calendar">calendar</TabsContent>
            </>
          )
        }
      </div>
    </Tabs>

  )
}
