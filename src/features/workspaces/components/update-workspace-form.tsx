"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, CopyIcon, ImageIcon } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React, { useRef } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { type z } from "zod"

import DottedSeparator from "@/components/dotted-separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
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

import { useDeleteWorkspace } from "../api/use-delete-workspace"
import { useResetInviteCode } from "../api/use-reset-invite-code"
import { useUpdateWorkspace } from "../api/use-update-workspace"
import { updateWorkspacesSchema } from "../schemas"
import { type Workspace } from "../types"

interface UpdateWorkspaceFormProps {
  onCancel?: () => void
  initialValues: Workspace
}

export default function UpdateWorkspaceForm({
  onCancel,
  initialValues
}: UpdateWorkspaceFormProps) {
  const router = useRouter()
  const { mutate, isPending } = useUpdateWorkspace()
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } = useDeleteWorkspace()

  const [DeleteDialog, confirmDelete] = useConfirm('警告', '此操作不能撤销!', 'destructive')
  const [ResetInviteCodeDialog, confirmResetInviteCode] = useConfirm('提示', '重置邀请码', 'destructive')
  const { mutate: resetInviteCode, isPending: isResettingInviteCode } = useResetInviteCode()

  const inviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`

  const inputRef = useRef<HTMLInputElement>(null)
  const form = useForm<z.infer<typeof updateWorkspacesSchema>>({
    resolver: zodResolver(updateWorkspacesSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.image || ''
    },
  })

  function onSubmit(values: z.infer<typeof updateWorkspacesSchema>) {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : ''
    }

    mutate(
      { form: finalValues, param: { workspaceId: initialValues.$id } },
      {
        onSuccess: ({ data }) => {
          form.reset()
          router.push(`/workspaces/${data.$id}`)
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

    if(!ok) return null

    deleteWorkspace({ param: { workspaceId: initialValues.$id } }, {
      onSuccess: () => {
        window.location.href = '/'
      }
    })
  }

  async function handleResetInviteCode() {
    const ok = await confirmResetInviteCode()

    if(!ok) return null

    resetInviteCode({ param: { workspaceId: initialValues.$id } }, {
      onSuccess: () => {
        router.refresh()
      }
    })

  }

  async function handleCopyInviteLink() {
    await navigator.clipboard.writeText(inviteLink)
    toast.success('复制成功！')
  }

  return (
    <div className="flex flex-col gap-4">
      <DeleteDialog />
      <ResetInviteCodeDialog />
      <Card className="border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <Button variant="outline" onClick={() => onCancel ? onCancel() : router.push(`/workspaces/${initialValues.$id}`)}>
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
                      <Input placeholder="请输入工作区名称" {...field} />
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
                          disabled={isPending}
                        />
                        {
                          field.value ? (
                            <Button
                              type="button"
                              size="sm"
                              className="w-fit"
                              variant="destructive"
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
                <Button type="submit" disabled={isPending}>Update</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="border-none">
        <CardHeader>
          <CardTitle>
            重置邀请码
          </CardTitle>
          <CardDescription>
            使用邀请码将成员添加到您的工作区
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input value={inviteLink} disabled />
            <CopyIcon className="size-5 cursor-pointer" onClick={handleCopyInviteLink} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col w-full gap-4 lg:flex-row justify-end">
          <Button variant="default" className="w-full lg:w-auto" onClick={handleResetInviteCode} disabled={isPending || isResettingInviteCode}>
            重置邀请码
          </Button>
        </CardFooter>
      </Card>
      <Card className="border-none">
        <CardHeader>
          <CardTitle>
            危险操作
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-400">
            删除工作区将删除所有数据
          </p>
        </CardContent>
        <CardFooter className="flex flex-col w-full gap-4 lg:flex-row justify-end">
          <Button variant="destructive" className="w-full lg:w-auto" onClick={handleDelete} disabled={isPending || isDeletingWorkspace}>
            删除工作区
          </Button>
        </CardFooter>
      </Card>
    </div>

  )
}
