"use client"

import 'react-big-calendar/lib/css/react-big-calendar.css'
import './data-calendar.css'

import { addMonths,format, getDay, parse, startOfWeek, subMonths } from 'date-fns'
import { zhCN } from "date-fns/locale"
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useState } from "react"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"

import { Button } from "@/components/ui/button"

import { type Task } from "../types"
import EventCard from "./event-card"

interface DataCalendarProps {
  data: Task[]
}

interface CustomToolbarProps {
  date: Date
  onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY') => void
}

const locales = {
  'zh-CN': zhCN,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const customToolbar = ({ date, onNavigate }: CustomToolbarProps) => (
  <div className="flex items-center justify-center w-full lg:w-auto gap-2 mb-4">
    <Button variant="outline" size="icon" onClick={() => onNavigate('PREV')}>
      <ChevronLeftIcon className="size-4" />
    </Button>
    <div className="w-full lg:w-auto flex items-center justify-center border border-input h-9 px-2 py-1 rounded-md">
      <CalendarIcon className="size-4 mr-2" />
      <p className="text-sm font-medium">{format(date, 'MMMM yyyy')}</p>
    </div>
    <Button variant="outline" size="icon" onClick={() => onNavigate('NEXT')}>
      <ChevronRightIcon className="size-4" />
    </Button>
  </div>
)

export default function DataCalendar({ data }: DataCalendarProps) {
  const [value, setValue] = useState<Date>(data.length > 0 ? new Date(data[0].dueDate) : new Date())

  const events = data.map((task) => ({
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    title: task.name,
    project: task.project,
    assignee: task.assignee,
    status: task.status,
    id: task.$id,
  }))

  const handleNavigate = (action: 'PREV' | 'NEXT' | 'TODAY') => {
    if (action === 'PREV') {
      setValue(subMonths(value, 1))
    } else if (action === 'NEXT') {
      setValue(addMonths(value, 1))
    } else {
      setValue(new Date())
    }
  }

  return (
    <Calendar
      localizer={localizer}
      date={value}
      events={events}
      views={["month"]}
      defaultView="month"
      toolbar
      showAllEvents
      className="h-full"
      max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
      formats={{
        weekdayFormat: (date, culture, localizer) => localizer?.format(date, 'EEE', culture) ?? "",
      }}
      components={{
        eventWrapper: ({ event}) => (
          <EventCard
            id={event.id}
            title={event.title}
            project={event.project}
            assignee={event.assignee}
            status={event.status}
          />
        ),
        toolbar: () => customToolbar({ date: value, onNavigate: handleNavigate }),
      }}
    />
  )
}
