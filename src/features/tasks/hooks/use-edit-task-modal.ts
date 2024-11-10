"use client"

import { parseAsString, useQueryState } from 'nuqs';

export default function useEditTaskModal() {
  const [taskId, setTaskId] = useQueryState(
    'edit-task',
    parseAsString
  )

  async function open(id: string) {
    await setTaskId(id)
  }

  async function close() {
    await setTaskId(null)
  }

  return {
    taskId,
    open,
    close,
    setTaskId,
  }
}
