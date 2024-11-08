"use client"

import { parseAsBoolean, useQueryStates } from 'nuqs';

export default function useCreateTaskModal() {
  const [isOpen, setIsOpen] = useQueryStates({
    'create-task': parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  })

  async function open() {
    await setIsOpen({ 'create-task': true })
  }

  async function close() {
    await setIsOpen({ 'create-task': false })
  }

  async function changeOpen(value: boolean) {
    await setIsOpen({ 'create-task': value })
  }

  return {
    isOpen,
    open,
    close,
    setIsOpen,
    changeOpen
  }
}
