"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { type z } from "zod"

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

  const form = useForm<z.infer<typeof carateWorkspacesSchema>>({
    resolver: zodResolver(carateWorkspacesSchema),
    defaultValues: {
      name: "",
    },
  })

  function onSubmit(values: z.infer<typeof carateWorkspacesSchema>) {
    mutate({ json: values })
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
            <Button type="submit" disabled={isPending}>Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>

  )
}
