"use client"

import { RiAddCircleFill } from "react-icons/ri"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useGetWorkspaces } from "../api/use-get-workspaces"
import WorkspaceAvatar from "./workspace-avatar"

export default function WorkspaceSwitcher() {
  const { data: workspaces } = useGetWorkspaces()

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">workspaces</p>
        <RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" />
      </div>
      <Select>
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

