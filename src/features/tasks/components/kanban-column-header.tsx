import { CircleCheckIcon, CircleDashedIcon, CircleDotDashedIcon, CircleDotIcon, CircleIcon, PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { snakeCaseToTitleCase } from '@/lib/utils';

import useCreateTaskModal from '../hooks/use-create-task-modal';
import { TaskStatus } from "../types"

interface KanbanColumnHeaderProps {
  board: TaskStatus
  taskCount: number
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.BACKLOG]: (
    <CircleDashedIcon className="size-[18px] text-pink-400" />
  ),
  [TaskStatus.TODO]: (
    <CircleIcon className="size-[18px] text-red-400" />
  ),
  [TaskStatus.IN_PROGRESS]: (
    <CircleDotDashedIcon className="size-[18px] text-yellow-400" />
  ),
  [TaskStatus.IN_REVIEW]: (
    <CircleDotIcon className="size-[18px] text-blue-400" />
  ),
  [TaskStatus.DONE]: (
    <CircleCheckIcon className="size-[18px] text-emerald-400" />
  )
}


export default function KanbanColumnHeader({ board, taskCount }: KanbanColumnHeaderProps) {
  const icon = statusIconMap[board]

  const { open } = useCreateTaskModal()

  return (
    <div className='flex items-center justify-between'>
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-sm font-semibold">{snakeCaseToTitleCase(board)}</h2>
        <div className="text-xs size-5 flex items-center justify-center rounded-md bg-neutral-200 text-neutral-700 font-medium">{taskCount}</div>
      </div>
      <Button size="icon" variant="ghost" onClick={() => open(board)}>
        <PlusIcon className="size-5 text-neutral-500" />
      </Button>
    </div>
  )
}
