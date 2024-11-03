"use client"

import ResponsiveModal from "@/components/responsive-modal";

import useCreateWorkspaceModal from "../hooks/use-create-workspace-modal";
import CreateWorkspacesForm from "./create-workspace-form";

export default function CreateWorkspaceModel() {
  const { isOpen, changeOpen } = useCreateWorkspaceModal()

  return (
    <ResponsiveModal open={isOpen['create-workspace']} onOpenChange={changeOpen}>
      <CreateWorkspacesForm />
    </ResponsiveModal>
  )
}
