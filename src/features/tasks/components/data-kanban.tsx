import { DragDropContext } from '@hello-pangea/dnd'
import { useState } from "react"

import { type Task, TaskStatus } from "../types"
import KanbanColumnHeader from './kanban-column-header'


interface DataKanbanProps {
  data: Task[]
}

type TasksState = {
  [key in TaskStatus]: Task[]
}



export default function DataKanban({ data }: DataKanbanProps) {
  const [boards, setBoards] = useState<TasksState>(() => {

    const initialValues: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: []
    }

    data.forEach(task => {
      initialValues[task.status].push(task)
    })

    Object.keys(initialValues).forEach(key => {
      initialValues[key as TaskStatus].sort((a, b) => a.position - b.position)
    })

    return initialValues
  })
  return (
    <DragDropContext onDragEnd={() => { }}>
      <div className="flex overflow-x-auto">
        {
          Object.keys(boards).map(border => {
            return (
              <div key={border} className='flex-1 mx-2 bg-muted rounded-lg p-1.5 min-w-[200px]'>
                <KanbanColumnHeader status={border as TaskStatus} taskCount={boards[border as TaskStatus].length} />
              </div>
            )
          })
        }
      </div>
    </DragDropContext>
  )
}
