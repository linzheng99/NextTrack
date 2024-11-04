"use client"

import { parseAsBoolean, useQueryStates } from 'nuqs';

export default function useCreateWorkspaceModal() {
  const [isOpen, setIsOpen] = useQueryStates({
    'create-workspace': parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  })

  async function open() {
    await setIsOpen({ 'create-workspace': true })
  }

  async function close() {
    await setIsOpen({ 'create-workspace': false })
  }

  async function changeOpen(value: boolean) {
    await setIsOpen({ 'create-workspace': value })
  }

  return {
    isOpen,
    open,
    close,
    setIsOpen,
    changeOpen
  }
}
