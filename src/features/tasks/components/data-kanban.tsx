"use client"

import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd'
import { useCallback, useEffect, useState } from "react"

import { type Task, TaskStatus } from "../types"
import KanbanCard from './kanban-card'
import KanbanColumnHeader from './kanban-column-header'


interface DataKanbanProps {
  data: Task[]
  onChange: (tasks: { $id: string, position: number, status: TaskStatus }[]) => void
}

type TasksState = {
  [key in TaskStatus]: Task[]
}

const boards: TaskStatus[] = [TaskStatus.BACKLOG, TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.IN_REVIEW, TaskStatus.DONE]



export default function DataKanban({ data, onChange }: DataKanbanProps) {
  const [tasks, setTasks] = useState<TasksState>(() => {
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

  useEffect(() => {
    const newTasks: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: []
    }

    data.forEach(task => {
      newTasks[task.status].push(task)
    })

    Object.keys(newTasks).forEach(key => {
      newTasks[key as TaskStatus].sort((a, b) => a.position - b.position)
    })
    setTasks(newTasks)
  }, [data])

  const handleDragEnd = useCallback((result: DropResult) => {
    const { source, destination } = result
    if (!destination) return

    const sourceStatus = source.droppableId as TaskStatus
    const destinationStatus = destination.droppableId as TaskStatus

    // 收集更新任务数据
    let updatesPayload: { $id: string, position: number, status: TaskStatus }[] = []

    setTasks(prevTasks => {
      const newTasks = { ...prevTasks }

      // 获取移除源列中的任务
      const sourceColumn = [...newTasks[sourceStatus]]

      // 获取移动任务
      const [movedTask] = sourceColumn.splice(source.index, 1)
      if (!movedTask) {
        console.error('movedTask is undefined')
        return prevTasks
      }

      // 判断是不是需要做更新数据
      const updatedMovedTask = sourceStatus !== destinationStatus ? { ...movedTask, status: destinationStatus } : movedTask

      // 更新源列
      newTasks[sourceStatus] = sourceColumn

      // 更新目标列
      const destinationColumn = [...newTasks[destinationStatus]]
      destinationColumn.splice(destination.index, 0, updatedMovedTask)
      newTasks[destinationStatus] = destinationColumn

      updatesPayload = []

      // // 更新任务数据
      updatesPayload.push({
        $id: updatedMovedTask.$id,
        position: Math.min((destination.index + 1) * 1000, 1_000_000),
        status: destinationStatus
      })

      // 更新目标列中其他任务的位置
      newTasks[destinationStatus].forEach((task, index) => {
        // 排除移动任务
        if (task && task.$id !== updatedMovedTask.$id) {
          const newPosition = Math.min((index + 1) * 1000, 1_000_000)
          // 判断是否需要更新原先任务的位置
          if (newPosition !== task.position) {
            updatesPayload.push({
              $id: task.$id,
              position: newPosition,
              status: destinationStatus
            })
          }
        }
      })

      // 更新源列中其他任务的位置
      if (sourceStatus !== destinationStatus) {
        newTasks[sourceStatus].forEach((task, index) => {
          if (task) {
            const newPosition = Math.min((index + 1) * 1000, 1_000_000)
            if (task.position !== newPosition) {
              updatesPayload.push({
                $id: task.$id,
                position: newPosition,
                status: sourceStatus
              })
            }
          }
        })
      }

      return newTasks
    })

    onChange(updatesPayload)
  }, [onChange])

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex overflow-x-auto">
        {
          boards.map(board => {
            return (
              <div key={board} className='flex-1 mx-2 bg-muted rounded-lg p-1.5 min-w-[200px]'>
                <KanbanColumnHeader board={board} taskCount={tasks[board].length} />
                <Droppable droppableId={board}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className='min-h-[200px] py-1.5'>
                      {
                        tasks[board].map((task, index) => (
                          <Draggable key={task.$id} draggableId={task.$id} index={index}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <KanbanCard task={task} />
                              </div>
                            )}
                          </Draggable>
                        ))
                      }
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            )
          })
        }
      </div>
    </DragDropContext>
  )
}
