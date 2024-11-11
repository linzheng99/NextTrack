import { Loader } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { useGetMembers } from "@/features/members/api/use-get-members"
import { useGetProjects } from "@/features/projects/api/use-get-projects"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"

import useCreateTaskModal from "../hooks/use-create-task-modal"
import { type TaskStatus } from "../types"
import CreateTaskForm from "./create-task-form"

interface CreateTaskFormWrapperProps {
  onCancel?: () => void
}

export default function CreateTaskFormWrapper({
  onCancel
}: CreateTaskFormWrapperProps) {
  const workspaceId = useWorkspaceId()

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId })

  const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId })

  const projectOptions = projects?.documents.map(project => ({
    id: project.$id,
    name: project.name,
    image: project.image
  }))

  const memberOptions = members?.documents.map(member => ({
    id: member.$id,
    name: member.name,
  }))

  const { isOpen } = useCreateTaskModal()

  const isLoading = isLoadingProjects || isLoadingMembers

  if (isLoading) {
    return (
      <Card className='w-full h-[714px] border-none shadow-none'>
        <CardContent className="flex justify-center items-center h-full">
          <Loader className='size-5 animate-spin text-muted-foreground' />
        </CardContent>
      </Card>
    )
  }


  return (
    <CreateTaskForm onCancel={onCancel} projectOptions={projectOptions ?? []} memberOptions={memberOptions ?? []} status={isOpen['task-status'] as TaskStatus} />
  )
}
