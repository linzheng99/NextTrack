'use client'

import { formatDistanceToNow } from "date-fns"
import { CalendarIcon, PlusIcon, SettingsIcon } from "lucide-react"
import Link from "next/link"

import Analytics from "@/components/analytics"
import DottedSeparator from "@/components/dotted-separator"
import PageError from "@/components/page-error"
import PageLoader from "@/components/page-loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useGetMembers } from "@/features/members/api/use-get-members"
import MemberAvatar from "@/features/members/components/member-avatar"
import { type Member } from "@/features/members/types"
import { useGetProjects } from "@/features/projects/api/use-get-projects"
import ProjectAvatar from "@/features/projects/components/project-avatar"
import useCreateProjectModal from "@/features/projects/hooks/use-create-project-modal"
import { type Project } from "@/features/projects/types"
import { useGetTasks } from "@/features/tasks/api/use-get-tasks"
import useCreateTaskModal from "@/features/tasks/hooks/use-create-task-modal"
import { type Task } from "@/features/tasks/types"
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"

export default function WorkspacesIdClient() {
  const workspaceId = useWorkspaceId()

  const { data: workspaceAnalytics, isLoading: isLoadingWorkspaceAnalytics } = useGetWorkspaceAnalytics({ workspaceId })
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({ workspaceId })
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId })
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId })

  if (isLoadingWorkspaceAnalytics || isLoadingTasks || isLoadingMembers || isLoadingProjects) {
    return <PageLoader />
  }

  if (!workspaceAnalytics || !tasks || !members || !projects) {
    return <PageError message="工作区分析数据获取失败..." />
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <Analytics data={workspaceAnalytics} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TasksList tasks={tasks.documents} total={tasks.total} />
        <ProjectsList projects={projects.documents} total={projects.total} />
        <MembersList members={members.documents} total={members.total} />
      </div>
    </div>
  )
}

interface TasksListProps {
  tasks: Task[]
  total: number
}

const TasksList = ({ tasks, total }: TasksListProps) => {
  const workspaceId = useWorkspaceId()
  const { open } = useCreateTaskModal()

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-muted-foreground">任务 ({total})</p>
          <Button variant="outline" size="sm" onClick={() => open()}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="flex flex-col gap-y-2">
          {tasks.map((task) => (
            <li key={task.$id}>
              <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="p-4">
                    <p className="text-lg font-medium truncate">{task.name}</p>
                    <div className="flex items-center gap-x-2">
                      <p>{task.project?.name}</p>
                      <div className="size-1 rounded-full bg-neutral-300" />
                      <div className="text-sm text-muted-foreground flex items-center gap-x-1">
                        <CalendarIcon className="size-3 mr-1" />
                        <span className="truncate">
                          {formatDistanceToNow(new Date(task.dueDate))}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            没有更多任务了...
          </li>
        </ul>
        {tasks.length > 0 && (
          <Button variant="default" asChild className="mt-4 w-full">
            <Link href={`/workspaces/${workspaceId}/tasks`}>查看所有任务</Link>
          </Button>
        )}
      </div>
    </div>
  )
}

interface ProjectsListProps {
  projects: Project[]
  total: number
}

const ProjectsList = ({ projects, total }: ProjectsListProps) => {
  const workspaceId = useWorkspaceId()
  const { open } = useCreateProjectModal()

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-muted-foreground">项目 ({total})</p>
          <Button variant="outline" size="sm" onClick={() => open()}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map((project) => (
            <li key={project.$id}>
              <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="p-4 flex items-center gap-x-2">
                    <ProjectAvatar name={project.name} image={project.image} className="size-12" fallbackClassName="text-lg" />
                    <p className="text-lg font-medium truncate">{project.name}</p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block col-span-2">
            没有更多项目了...
          </li>
        </ul>
        {projects.length > 0 && (
          <Button variant="default" asChild className="mt-4 w-full">
            <Link href={`/workspaces/${workspaceId}/projects`}>查看所有项目</Link>
          </Button>
        )}
      </div>
    </div>
  )
}

interface MembersListProps {
  members: Member[]
  total: number
}

const MembersList = ({ members, total }: MembersListProps) => {
  const workspaceId = useWorkspaceId()

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-muted-foreground">成员 ({total})</p>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/workspaces/${workspaceId}/members`}>
              <SettingsIcon className="size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <li key={member.$id}>
              <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                <CardContent className="p-3 flex flex-col items-center gap-x-2">
                  <MemberAvatar name={member.name} className="size-12" fallbackClassName="text-lg" />
                  <div className="flex flex-col items-center overflow-hidden">
                    <p className="text-lg font-medium truncate">{member.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            没有更多成员了...
          </li>
        </ul>
      </div>
    </div>
  )
}
