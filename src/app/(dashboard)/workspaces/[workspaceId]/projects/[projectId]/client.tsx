"use client"

import { Edit } from "lucide-react";
import Link from "next/link";

import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { useGetProject } from "@/features/projects/api/use-get-project";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";

export default function ProjectsIdClient() {
  const projectId = useProjectId()

  const { data, isLoading } = useGetProject({ projectId })

  if (isLoading) {
    return <PageLoader />
  }

  if (!data) {
    return <PageError message="Project not found" />
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 p-2.5 rounded-md font-medium "
        >
          <ProjectAvatar name={data?.name} image={data?.image} className="size-10" fallbackClassName="text-xl" />
          <span className="truncate font-semibold text-xl">{data?.name}</span>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/workspaces/${data?.workspaceId}/projects/${data?.$id}/settings`}>
            <Edit className="size-4" />
            Edit Project
          </Link>
        </Button>
      </div>
      <TaskViewSwitcher hideProjectFilter />
    </div>
  )
}
