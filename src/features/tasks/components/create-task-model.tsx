"use client"

import ResponsiveModal from "@/components/responsive-modal";

import useCreateTaskModal from "../hooks/use-create-task-modal";
import CreateTaskFormWrapper from "./create-task-form-wrapper";

export default function CreateTaskModel() {
  const { isOpen, changeOpen, close } = useCreateTaskModal()

  return (
    <ResponsiveModal open={isOpen['create-task']} onOpenChange={changeOpen}>
      <CreateTaskFormWrapper onCancel={close} />
    </ResponsiveModal>
  )
}
