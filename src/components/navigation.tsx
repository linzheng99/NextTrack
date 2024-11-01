import { SettingsIcon, UsersIcon } from 'lucide-react'
import Link from 'next/link'
import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill } from 'react-icons/go'

import { cn } from '@/lib/utils'

const routes = [
  {
    label: 'Home',
    href: '/',
    icon: GoHome,
    activeIcon: GoHomeFill
  },
  {
    label: 'My Tasks',
    href: '/tasks',
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: SettingsIcon,
    activeIcon: SettingsIcon
  },
  {
    label: 'Members',
    href: '/members',
    icon: UsersIcon,
    activeIcon: UsersIcon
  }
]

export default function Navigation() {
  return (
    <ul className='flex flex-col'>
      {routes.map(route => {
        const isActive = false
        const Icon = isActive ? route.activeIcon : route.icon
        return (
          <Link href={route.href} key={route.href}>
            <div className={cn(
              'flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500',
              isActive && 'bg-white shadow-sm hover:opacity-100 text-primary'
            )}>
              <Icon className='size-4 text-neutral-500' />
              {route.label}
            </div>
          </Link>
        )
      })}
    </ul>
  )
}
