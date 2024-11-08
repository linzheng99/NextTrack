"use client"

import { Plus } from "lucide-react"

import DottedSeparator from "@/components/dotted-separator"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import useCreateTaskModal from "../hooks/use-create-task-modal"

export default function TaskViewSwitcher() {
  const { open } = useCreateTaskModal()
  return (
    <Tabs className="w-full border rounded-lg">
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
        data filters
        <DottedSeparator className="my-4" />
        <TabsContent value="table">table</TabsContent>
        <TabsContent value="kanban">kanban</TabsContent>
        <TabsContent value="calendar">calendar</TabsContent>
      </div>
    </Tabs>

  )
}
