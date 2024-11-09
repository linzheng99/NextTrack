
import { FolderIcon, ListChecksIcon, UsersIcon } from "lucide-react";

import { DatePicker } from "@/components/date-picker";
import { Select, SelectContent, SelectGroup, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { useTaskFilters } from "../hooks/use-task-filters";
import { TaskStatus } from "../types";

export default function DataFilters() {
  const workspaceId = useWorkspaceId()
  const [{ projectId, status, assigneeId, dueDate }, setFilters] = useTaskFilters()
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId })
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId })

  const isLoading = isLoadingProjects || isLoadingMembers

  const memberOptions = members?.documents.map(member => ({
    value: member.$id,
    label: member.name
  }))

  const projectOptions = projects?.documents.map(project => ({
    value: project.$id,
    label: project.name
  }))

  async function handleStatusChange(value: string) {
    await setFilters({ status: value === 'all' ? null : (value as TaskStatus) })
  }

  async function handleProjectChange(value: string) {
    await setFilters({ projectId: value === 'all' ? null : value })
  }

  async function handleAssigneeChange(value: string) {
    await setFilters({ assigneeId: value === 'all' ? null : value })
  }

  async function handleDueDateChange(value: Date) {
    await setFilters({ dueDate: value.toISOString() })
  }

  if (isLoading) return null

  return (
    <div className="w-full flex flex-col lg:flex-row gap-2">
      <Select defaultValue={status ?? undefined} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-full lg:w-auto">
          <ListChecksIcon className="size-4 mr-2" />
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectGroup>
              <SelectItem value="all">All Status</SelectItem>
              <SelectSeparator />
              <SelectItem value={TaskStatus.BACKLOG}>{TaskStatus.BACKLOG}</SelectItem>
              <SelectItem value={TaskStatus.TODO}>{TaskStatus.TODO}</SelectItem>
              <SelectItem value={TaskStatus.IN_PROGRESS}>{TaskStatus.IN_PROGRESS}</SelectItem>
              <SelectItem value={TaskStatus.IN_REVIEW}>{TaskStatus.IN_REVIEW}</SelectItem>
              <SelectItem value={TaskStatus.DONE}>{TaskStatus.DONE}</SelectItem>
            </SelectGroup>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select defaultValue={projectId ?? undefined} onValueChange={handleProjectChange}>
        <SelectTrigger className="w-full lg:w-auto">
          <FolderIcon className="size-4 mr-2" />
          <SelectValue placeholder="All Projects" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem key="all" value="undefined">
              All Projects
            </SelectItem>
            {projectOptions?.map(project => (
              <SelectItem key={project.value} value={project.value}>
                <div className="flex items-center gap-2">
                  {project.label}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select defaultValue={assigneeId ?? undefined} onValueChange={handleAssigneeChange}>
        <SelectTrigger className="w-full lg:w-auto">
          <UsersIcon className="size-4 mr-2" />
          <SelectValue placeholder="All Members" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All Members</SelectItem>
            {memberOptions?.map(member => (
              <SelectItem key={member.value} value={member.value}>
                <div className="flex items-center gap-2">
                  {member.label}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <DatePicker className="w-full lg:w-auto" value={dueDate ? new Date(dueDate) : undefined} onChange={handleDueDateChange} placeholder="Select Due Date" />
    </div>
  )
}
