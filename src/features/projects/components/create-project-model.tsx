"use client"

import ResponsiveModal from "@/components/responsive-modal";

import useCreateProjectModal from "../hooks/use-create-project-modal";
import CreateProjectForm from "./create-project-form";

export default function CreateProjectModel() {
  const { isOpen, changeOpen, close } = useCreateProjectModal()

  return (
    <ResponsiveModal open={isOpen['create-project']} onOpenChange={changeOpen}>
      <CreateProjectForm onCancel={close} />
    </ResponsiveModal>
  )
}
