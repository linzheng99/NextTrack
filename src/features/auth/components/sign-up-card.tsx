"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from 'next/link'
import { useForm } from "react-hook-form"
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { type z } from "zod"

import DottedSeparator from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
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
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { useRegister } from '../api/use-register'
import { registerSchema } from '../schemas'


export default function SignUpCard() {
  const { mutate, isPending } = useRegister()
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    },
  })
  function onSubmit(values: z.infer<typeof registerSchema>) {
    mutate({ json: values })
  }
  return (
    <Card className="w-full md:w-[487px] h-full border-none shadow-none">
      <CardHeader className="p-7 text-center">
        <CardTitle className="text-2xl"> Sign Up </CardTitle>
      </CardHeader>
      <DottedSeparator className='px-7 mb-2' />
      <CardContent className='p-7'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="用户名" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="邮箱" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="密码" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size='lg' className='w-full' disabled={isPending}>Register</Button>
          </form>
        </Form>
      </CardContent>
      <DottedSeparator className='px-7 mb-2' />
      <CardContent className='flex flex-col gap-2 w-full p-7'>
        <Button variant={'outline'} disabled={isPending}>
          <FcGoogle />
          Login with Google
        </Button>
        <Button variant={'outline'} disabled={isPending}>
          <FaGithub />
          Login with Github
        </Button>
      </CardContent>
      <DottedSeparator className='px-7 mb-2' />
      <CardContent className='text-center p-7 text-sm'>
        <p>已经有帐号了？<Link href={'/sign-in'} className='text-blue-500'>Sign In</Link></p>
      </CardContent>
    </Card>
  )
}
