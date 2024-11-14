import { useRouter } from "next/navigation";

import MemberAvatar from "@/features/members/components/member-avatar";
import { type Member } from "@/features/members/types";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import { type Project } from "@/features/projects/types";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";

import { TaskStatus } from "../types";

interface EventCardProps {
  id: string;
  title: string;
  project: Project;
  assignee: Member;
  status: TaskStatus;
}

const statusColorsMap: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: 'border-l-pink-500',
  [TaskStatus.TODO]: 'border-l-red-500',
  [TaskStatus.IN_PROGRESS]: 'border-l-yellow-500',
  [TaskStatus.IN_REVIEW]: 'border-l-blue-500',
  [TaskStatus.DONE]: 'border-l-emerald-500',
}

export default function EventCard({ id, title, project, assignee, status }: EventCardProps) {
  const router = useRouter()
  const workspaceId = useWorkspaceId()

  function handleClick() {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`)
  }

  return (
    <div className="px-2" onClick={handleClick}>
      <div className={cn("p-1.5 text-xs bg-white text-primary rounded-md border border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition", statusColorsMap[status])}>
        <p>{title}</p>
        <div className="flex items-center gap-x-1">
          <MemberAvatar name={assignee?.name} />
          <div className="size-1 rounded-full bg-neutral-300" />
          <ProjectAvatar name={project?.name} image={project?.image} />
        </div>
      </div>
    </div>
  )
}
