"use client"

import { parseAsBoolean, useQueryStates } from 'nuqs';

export default function useCreateWorkspaceModal() {
  const [isOpen, setIsOpen] = useQueryStates({
    'create-workspace': parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  })

  function open() {
    setIsOpen({ 'create-workspace': true })
  }

  function close() {
    setIsOpen({ 'create-workspace': false })
  }

  function changeOpen(value: boolean) {
    setIsOpen({ 'create-workspace': value })
  }

  return {
    isOpen,
    open,
    close,
    setIsOpen,
    changeOpen
  }
}
