"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, ImageIcon } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React, { useRef } from "react"
import { useForm } from "react-hook-form"
import { type z } from "zod"

import DottedSeparator from "@/components/dotted-separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
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
import { useConfirm } from "@/hooks/use-confirm"
import { cn } from "@/lib/utils"

import { useDeleteProject } from "../api/use-delete-project"
import { useUpdateProject } from "../api/use-update-project"
import { updateProjectSchema } from "../schemas"
import { type Project } from "../types"

interface UpdateProjectFormProps {
  onCancel?: () => void
  initialValues: Project
}

export default function UpdateProjectForm({
  onCancel,
  initialValues
}: UpdateProjectFormProps) {
  const router = useRouter()
  const { mutate, isPending } = useUpdateProject()
  const { mutate: deleteProject, isPending: isDeletingProject } = useDeleteProject()

  const [DeleteDialog, confirmDelete] = useConfirm('警告', '此操作不能撤销!', 'destructive')

  const inputRef = useRef<HTMLInputElement>(null)
  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.image ?? ''
    },
  })

  function onSubmit(values: z.infer<typeof updateProjectSchema>) {
    const finalValues = {
      ...values,
      image: values.image || ''
    }

    mutate(
      { form: finalValues, param: { projectId: initialValues.$id } },
      {
        onSuccess: () => {
          form.reset(finalValues)
        }
      })
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue('image', file)
    }
  }

  async function handleDelete() {
    const ok = await confirmDelete()

    if (!ok) return null

    deleteProject({ param: { projectId: initialValues.$id } }, {
      onSuccess: () => {
        window.location.href = `/workspaces/${initialValues.workspaceId}`
      }
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <DeleteDialog />
      <Card className="border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <Button size="sm" variant="outline" onClick={() => onCancel ? onCancel() : router.push(`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`)}>
              <ArrowLeft className="size-4" />
              返回
            </Button>
            {initialValues.name}
          </CardTitle>
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
                      <Input placeholder="请输入项目名称" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">图标</FormLabel>
                    <div className="flex items-center gap-4">
                      {
                        field.value ? (
                          <div className="relative size-[72px] rounded-md overflow-hidden">
                            <Image src={field.value instanceof File ? URL.createObjectURL(field.value) : field.value} alt="picture" fill className="object-cover" />
                          </div>
                        ) : (
                          <Avatar className="size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px] text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )
                      }
                      <div className="flex flex-col gap-2">
                        <p className="text-sm text-neutral-400"> .jpg,.svg,.png,.jpeg, 小于 1 M</p>
                        <input
                          ref={inputRef}
                          type="file"
                          accept=".jpg,.svg,.png,.jpeg"
                          className="hidden"
                          onChange={handleImageChange}
                          disabled={isPending || isDeletingProject}
                        />
                        {
                          field.value ? (
                            <Button
                              type="button"
                              size="sm"
                              className="w-fit"
                              variant="destructive"
                              disabled={isPending || isDeletingProject}
                              onClick={() => {
                                field.onChange('')
                                if (inputRef.current) {
                                  inputRef.current.value = ''
                                }
                              }}
                            >
                              Remove image
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              size="sm"
                              className="w-fit"
                              disabled={isPending || isDeletingProject}
                              onClick={() => inputRef.current?.click()}
                            >
                              Upload image
                            </Button>
                          )
                        }
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <DottedSeparator className="mb-4" />
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => onCancel?.()} className={cn(!onCancel && 'invisible')}>Cancel</Button>
                <Button type="submit" disabled={isPending || isDeletingProject}>Update</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="border-none">
        <CardHeader>
          <CardTitle>
            危险操作
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-400">
            删除项目将删除所有数据
          </p>
        </CardContent>
        <CardFooter className="flex flex-col w-full gap-4 lg:flex-row justify-end">
          <Button variant="destructive" className="w-full lg:w-auto" onClick={handleDelete} disabled={isPending || isDeletingProject}>
            删除项目
          </Button>
        </CardFooter>
      </Card>
    </div>

  )
}
