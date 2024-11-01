'use client'

import { Loader, LogOut } from 'lucide-react'

import DottedSeparator from '@/components/dotted-separator'
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useCurrent } from "../api/use-current"
import { useLogout } from '../api/use-logout'

export default function UserButton() {
  const { data: user, isLoading } = useCurrent()
  const { mutate } = useLogout()

  if (isLoading) {
    return (
      <Avatar className='size-10'>
        <AvatarFallback>
          <Loader className='size-4 animate-spin' />
        </AvatarFallback>
      </Avatar>
    )
  }

  if (!user) return null

  const { name, email } = user
  const avatarFallback = name ? name.charAt(0).toUpperCase() : email.charAt(0).toUpperCase()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Avatar className='size-10 hover:opacity-75 border'>
          <AvatarFallback>
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-60' sideOffset={10}>
        <div className='flex flex-col items-center justify-center p-3'>
          <Avatar className='size-10 border'>
            <AvatarFallback>
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          {name && <p className='font-semibold'>{name}</p>}
          {email && <p className='text-sm text-gray-500'>{email}</p>}
        </div>
        <DottedSeparator className='mb-1' />
        <DropdownMenuItem
          className='flex justify-center items-center gap-2 text-red-500'
          onClick={() => mutate()}
        >
          <LogOut />Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
