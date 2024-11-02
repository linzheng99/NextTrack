"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ImageIcon } from "lucide-react"
import Image from "next/image"
import React, { useRef } from "react"
import { useForm } from "react-hook-form"
import { type z } from "zod"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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

import { useCreateWorkspace } from "../api/use-create-workspace"
import { carateWorkspacesSchema } from "../schemas"


export default function CreateWorkspacesForm() {
  const { mutate, isPending } = useCreateWorkspace()

  const inputRef = useRef<HTMLInputElement>(null)
  const form = useForm<z.infer<typeof carateWorkspacesSchema>>({
    resolver: zodResolver(carateWorkspacesSchema),
    defaultValues: {
      name: "",
    },
  })

  function onSubmit(values: z.infer<typeof carateWorkspacesSchema>) {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : ''
    }

    mutate(
      { form: finalValues },
      {
        onSuccess: () => {
          form.reset()
        }
      })
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue('image', file)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>创建工作区</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入工作区" {...field} />
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
                  <FormLabel className="text-sm font-semibold">封面</FormLabel>
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
                      <Button
                        type="button"
                        size="sm"
                        className="w-fit"
                        onClick={() => inputRef.current?.click()}
                      >
                        Upload
                      </Button>
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => form.reset()}>Reset</Button>
              <Button type="submit" disabled={isPending}>Submit</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>

  )
}
