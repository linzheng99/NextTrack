"use client"

import { Loader, Plus } from "lucide-react"
import { useQueryState } from "nuqs"
import { useCallback } from "react"

import DottedSeparator from "@/components/dotted-separator"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"

import { useBulkUpdateTask } from "../api/use-bulk-update-task"
import { useGetTasks } from "../api/use-get-tasks"
import useCreateTaskModal from "../hooks/use-create-task-modal"
import { useTaskFilters } from "../hooks/use-task-filters"
import { type TaskStatus } from "../types"
import { columns } from "./columns"
import DataCalendar from "./data-calendar"
import DataFilters from "./data-filters"
import DataKanban from "./data-kanban"
import { DataTable } from "./data-table"

export default function TaskViewSwitcher() {
  const [view, setView] = useQueryState('task-view', {
    defaultValue: "table",
  })
  const [{ projectId, status, assigneeId, dueDate }] = useTaskFilters()
  const workspaceId = useWorkspaceId()
  const { open } = useCreateTaskModal()

  const { data: tasks, isLoading: isTasksLoading } = useGetTasks({ workspaceId, projectId, status, assigneeId, dueDate })

  const { mutate: bulkUpdateTask } = useBulkUpdateTask()

  const handleKanbanChange = useCallback((tasks: { $id: string, position: number, status: TaskStatus }[]) => {
    bulkUpdateTask({ json: { tasks } })
  }, [bulkUpdateTask])

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
          <Button size="sm" variant="default" className="w-full lg:w-auto" onClick={() => open()}>
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
                <DataTable columns={columns} data={tasks?.documents ?? []} />
              </TabsContent>
              <TabsContent value="kanban">
                <DataKanban data={tasks?.documents ?? []} onChange={handleKanbanChange} />
              </TabsContent>
              <TabsContent value="calendar">
                <DataCalendar data={tasks?.documents ?? []} />
              </TabsContent>
            </>
          )
        }
      </div>
    </Tabs>

  )
}
