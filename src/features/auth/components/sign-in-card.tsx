import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import Link from 'next/link'


export default function SignInCard() {
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, {
      message: "最少需要8位",
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }
  return (
    <Card className="w-full md:w-[487px] h-full border-none shadow-none">
      <CardHeader className="p-7 text-center">
        <CardTitle className="text-2xl"> Welcome !</CardTitle>
      </CardHeader>
      <DottedSeparator className='px-7 mb-2' />
      <CardContent className='p-7'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
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
            <Button type="submit" size='lg' className='w-full' >登录</Button>
          </form>
        </Form>
      </CardContent>
      <DottedSeparator className='px-7 mb-2' />
      <CardContent className='flex flex-col gap-2 w-full p-7'>
        <Button variant={'outline'}>
          <FcGoogle />
          Login with Google
        </Button>
        <Button variant={'outline'}>
          <FaGithub />
          Login with Github
        </Button>
      </CardContent>
      <DottedSeparator className='px-7 mb-2' />
      <CardContent className='text-center p-7 text-sm'>
        <p>还没有帐号？<Link href={'/sign-up'} className='text-blue-500'>Sign Up</Link></p>
      </CardContent>
    </Card>
  )
}
