'use client'

import { FaCaretDown, FaCaretUp } from 'react-icons/fa'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface AnalyticsCardProps {
  title: string
  value: number
  variant: 'up' | 'down'
  increaseValue: number
}

const AnalyticsContentMap = {
  'up': {
    icon: <FaCaretUp className='size-4 text-emerald-500' />,
    increaseValueColor: 'text-emerald-500'
  },
  'down': {
    icon: <FaCaretDown className='size-4 text-red-500' />,
    increaseValueColor: 'text-red-500'
  }
}

export default function AnalyticsCard({ title, value, variant, increaseValue }: AnalyticsCardProps) {
  const { icon, increaseValueColor } = AnalyticsContentMap[variant]

  return (
    <Card className='shadow-none border-none w-full'>
      <CardHeader>
        <div className='flex items-center gap-x-2'>
          <CardDescription className="flex items-center gap-x-2 font-medium overflow-hidden">
            <span className='truncate text-base'>{title}</span>
          </CardDescription>
          <div className='flex items-center gap-x-1'>
            {icon}
            <span className={cn(increaseValueColor, 'text-base font-medium truncate')}>
              {increaseValue}
            </span>
          </div>
        </div>
        <CardTitle className='text-3xl font-semibold'>{value}</CardTitle>
      </CardHeader>
    </Card>
  )
}
