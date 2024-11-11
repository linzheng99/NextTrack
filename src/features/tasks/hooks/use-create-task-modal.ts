"use client"

import { parseAsBoolean, parseAsString, useQueryStates } from 'nuqs';

import { type TaskStatus } from '../types';

export default function useCreateTaskModal() {
  const [isOpen, setIsOpen] = useQueryStates({
    'create-task': parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }),
    'task-status': parseAsString.withOptions({ clearOnDefault: false })
  })

  async function open(status?: TaskStatus) {
    await setIsOpen({ 'create-task': true, 'task-status': status || null})
  }

  async function close() {
    await setIsOpen({ 'create-task': false, 'task-status': null })
  }

  async function changeOpen(value: boolean) {
    await setIsOpen({ 'create-task': value, 'task-status': null })
  }

  return {
    isOpen,
    open,
    close,
    setIsOpen,
    changeOpen
  }
}
