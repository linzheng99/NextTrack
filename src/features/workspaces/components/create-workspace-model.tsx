"use client"

import ResponsiveModal from "@/components/responsive-modal";

import useCreateWorkspaceModal from "../hooks/use-create-workspace-modal";
import CreateWorkspaceForm from "./create-workspace-form";

export default function CreateWorkspaceModel() {
  const { isOpen, changeOpen, close } = useCreateWorkspaceModal()

  return (
    <ResponsiveModal open={isOpen['create-workspace']} onOpenChange={changeOpen}>
      <CreateWorkspaceForm onCancel={close} />
    </ResponsiveModal>
  )
}
