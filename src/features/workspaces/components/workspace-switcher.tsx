"use client"

import { useRouter } from "next/navigation"
import { RiAddCircleFill } from "react-icons/ri"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useGetWorkspaces } from "../api/use-get-workspaces"
import useCreateWorkspaceModal from "../hooks/use-create-workspace-modal"
import { useWorkspaceId } from "../hooks/use-workspace-id"
import WorkspaceAvatar from "./workspace-avatar"

export default function WorkspaceSwitcher() {
  const workspaceId = useWorkspaceId()
  const { open } = useCreateWorkspaceModal()
  const router = useRouter()
  const { data: workspaces } = useGetWorkspaces()

  const handleSelect = (workspaceId: string) => {
    router.push(`/workspaces/${workspaceId}`)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">workspaces</p>
        <RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" onClick={() => open()} />
      </div>
      <Select onValueChange={handleSelect} value={workspaceId}>
        <SelectTrigger className="w-full h-full">
          <SelectValue placeholder="workspace" />
        </SelectTrigger>
        <SelectContent>
          {workspaces?.documents.map((workspace) => (
            <SelectItem key={workspace.$id} value={workspace.$id}>
              <div className="flex items-center gap-2 cursor-pointer font-medium">
                <WorkspaceAvatar name={workspace.name} image={workspace.image} />
                <span className="truncate">{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

