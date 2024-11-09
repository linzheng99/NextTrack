"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { type z } from "zod"

import { DatePicker } from "@/components/date-picker"
import DottedSeparator from "@/components/dotted-separator"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import MemberAvatar from "@/features/members/components/member-avatar"
import ProjectAvatar from "@/features/projects/components/project-avatar"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { cn } from "@/lib/utils"

import { useCreateTask } from "../api/use-create-task"
import { createTaskSchema } from "../schemas"
import { TaskStatus } from "../types"

interface CreateTaskFormProps {
  onCancel?: () => void
  projectOptions: {
    id: string
    name: string
    image: string
  }[]
  memberOptions: {
    id: string
    name: string
  }[]
}

export default function CreateTaskForm({ onCancel, projectOptions, memberOptions }: CreateTaskFormProps) {
  const workspaceId = useWorkspaceId()

  const { mutate, isPending } = useCreateTask()

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema.omit({ workspaceId: true })),
    defaultValues: {
      name: '',
      workspaceId,
    },
  })

  function onSubmit(values: z.infer<typeof createTaskSchema>) {
    mutate(
      { json: { ...values, workspaceId } },
      {
        onSuccess: () => {
          form.reset()
          onCancel?.()
        }
      })
  }

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>创建新任务</CardTitle>
      </CardHeader>
      <CardContent>
        <DottedSeparator className="mb-4" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>名称</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入任务名称" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>截止日期</FormLabel>
                  <FormControl>
                    <DatePicker {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assigneeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>受托人</FormLabel>
                  <Select defaultValue={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="请选择项目" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {memberOptions.map(member => (
                          <SelectItem key={member.id} value={member.id}>
                            <div className="flex items-center gap-2">
                              <MemberAvatar name={member.name} className="size-6" />
                              {member.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>状态</FormLabel>
                  <Select defaultValue={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="请选择状态" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value={TaskStatus.BACKLOG}>{TaskStatus.BACKLOG}</SelectItem>
                        <SelectItem value={TaskStatus.TODO}>{TaskStatus.TODO}</SelectItem>
                        <SelectItem value={TaskStatus.IN_PROGRESS}>{TaskStatus.IN_PROGRESS}</SelectItem>
                        <SelectItem value={TaskStatus.IN_REVIEW}>{TaskStatus.IN_REVIEW}</SelectItem>
                        <SelectItem value={TaskStatus.DONE}>{TaskStatus.DONE}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>项目</FormLabel>
                  <Select defaultValue={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="请选择项目" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {projectOptions.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            <div className="flex items-center gap-2">
                              <ProjectAvatar name={project.name} image={project.image} className="size-6" />
                              {project.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DottedSeparator className="mb-4" />
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => onCancel?.()} className={cn(!onCancel && 'invisible')}>Cancel</Button>
              <Button type="submit" disabled={isPending}>Submit</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
