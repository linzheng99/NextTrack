"use client"

import { parseAsBoolean, useQueryStates } from 'nuqs';

export default function useCreateProjectModal() {
  const [isOpen, setIsOpen] = useQueryStates({
    'create-project': parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  })

  async function open() {
    await setIsOpen({ 'create-project': true })
  }

  async function close() {
    await setIsOpen({ 'create-project': false })
  }

  async function changeOpen(value: boolean) {
    await setIsOpen({ 'create-project': value })
  }

  return {
    isOpen,
    open,
    close,
    setIsOpen,
    changeOpen
  }
}
