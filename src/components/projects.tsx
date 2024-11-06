"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";

import { useGetProjects } from "@/features/projects/api/use-get-projects";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import useCreateProjectModal from "@/features/projects/hooks/use-create-project-modal";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";

export default function Projects() {
  const pathname = usePathname()
  const workspaceId = useWorkspaceId()
  const { data: projects } = useGetProjects({ workspaceId })
  const { open } = useCreateProjectModal()

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">projects</p>
        <RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" onClick={() => open()} />
      </div>
      <div className="flex flex-col gap-2">
        {projects?.documents.map((project) => {
          const href = `/workspaces/${workspaceId}/projects/${project.$id}`
          const isActive = pathname === href

          return (
            <Link href={href} key={project.$id}>
              <div className={cn(
                'flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500',
                isActive && 'bg-white shadow-sm hover:opacity-100 text-primary'
              )}>
                <ProjectAvatar name={project.name} image={project.image} />
                <span className="truncate">{project.name}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
