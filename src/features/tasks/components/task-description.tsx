import { Pencil, X } from "lucide-react"
import { useState } from "react"

import DottedSeparator from "@/components/dotted-separator"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import { useUpdateTask } from "../api/use-update-task"
import { type Task } from "../types"

interface TaskDescriptionProps {
  task: Task
}

export default function TaskDescription({ task }: TaskDescriptionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [description, setDescription] = useState(task.description)

  const { mutate: updateTask, isPending } = useUpdateTask()

  const handleEditToggle = () => {
    if (isEditing) {
      setDescription(task.description)
    }
    setIsEditing(prev => !prev)
  }

  function handleSave() {
    updateTask({
      json: { description },
      param: { taskId: task.$id }
    },
      {
        onSuccess: () => {
          setIsEditing(false)
        }
      }
    )
  }

  return (
    <div className="border rounded-lg p-4 flex flex-col">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Description</p>
        <Button variant="outline" size="sm" onClick={handleEditToggle}>
          {isEditing ? <X className="size-4" /> : <Pencil className="size-4" />}
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>
      <DottedSeparator className="my-4" />
      {
        isEditing ? (
          <div className="w-full">
            <Textarea value={description || ''} placeholder="Add a description..." onChange={(e) => setDescription(e.target.value)} disabled={isPending} />
          </div>
        ) : (
          <div className="w-full">
            {
              description ? (
                <p className="text-sm">{description}</p>
              ) : (
                <p className="text-sm text-muted-foreground">No description</p>
              )
            }
          </div>
        )}
      {
        isEditing && (
          <Button variant="default" size="sm" onClick={handleSave} className="ml-auto mt-2" disabled={isPending}>
            Save
          </Button>
        )
      }
    </div>
  )
}
